import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import ts from "typescript";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Execute the actual TypeScript modules with an isolated email transport.
// No network request or email is sent by these tests.
function loadSource(relativePath, replacements = {}, environment = {}) {
  const filename = path.resolve(__dirname, "..", relativePath);
  const source = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.CommonJS,
      esModuleInterop: true,
    },
  }).outputText;
  const nativeRequire = createRequire(filename);
  const mod = { exports: {} };
  const scope = {
    module: mod,
    exports: mod.exports,
    require: (name) =>
      Object.hasOwn(replacements, name)
        ? replacements[name]
        : nativeRequire(name),
    Request,
    Response,
    File,
    Buffer,
    process: {
      env: {
        RESEND_API_KEY: "test-only",
        MAIL_FROM: "test@example.invalid",
        MAIL_TO: "inbox@example.invalid",
        ...environment,
      },
    },
    console: { log() {}, error() {} },
  };
  vm.runInNewContext(source, scope, { filename });
  return mod.exports;
}
const idc = loadSource("src/lib/idc.ts");
const config = { ...idc.DEFAULT_IDC_CONFIGURATION };

test("rejects unsupported counts, invalid dimensions and incomplete custom connectors", () => {
  for (const change of [
    { pins: 11 },
    { length: 0 },
    { length: 1.5 },
    { length: Infinity },
    { quantity: 0 },
    { quantity: 1.5 },
    { color: "rainbow" },
    { endA: "custom", partA: "   " },
    { endB: "custom", partB: "" },
  ]) {
    assert.equal(
      idc.idcConfigurationSchema.safeParse({ ...config, ...change }).success,
      false,
      JSON.stringify(change),
    );
  }
  assert.equal(
    idc.idcConfigurationSchema.safeParse({
      ...config,
      length: 100000,
      quantity: 1000000,
    }).success,
    true,
  );
});

test("both language specifications preserve the requested parameters and measurement reference", () => {
  const request = idc.idcConfigurationSchema.parse({
    ...config,
    pins: 20,
    length: 675,
    quantity: 320,
    endA: "custom",
    partA: "  Maker PN-123  ",
    endB: "none",
    partB: "unused",
    orientation: "opposite",
    color: "black",
  });
  for (const language of ["pl", "en"]) {
    const text = idc.formatIdcSpecification(request, language);
    for (const value of [
      "20",
      "675 mm",
      "320",
      "Maker PN-123",
      "1.27 mm",
      "2.54 × 2.54 mm",
      "28 AWG",
    ])
      assert.ok(text.includes(value), value);
    assert.ok(!text.includes("unused"));
    assert.match(
      text,
      language === "pl" ? /między osiami złączy/ : /between connector axes/,
    );
    assert.match(text, language === "pl" ? /do uzgodnienia/ : /to be agreed/);
  }
});

const sent = [];
const api = loadSource("src/app/api/inquiry/route.ts", {
  "@/lib/idc": idc,
  "next/server": {
    NextResponse: { json: (data, options) => Response.json(data, options) },
  },
  resend: {
    Resend: class {
      emails = {
        send: async (payload) => {
          sent.push(payload);
          return { data: { id: "test-only" }, error: null };
        },
      };
    },
  },
});
function request(fields, file) {
  const form = new FormData();
  for (const [key, value] of Object.entries({
    type: "idc",
    name: "Test Person",
    email: "test@example.invalid",
    configuration: JSON.stringify(config),
    ...fields,
  }))
    form.set(key, String(value));
  if (file) form.set("file", file);
  return new Request("http://localhost/api/inquiry", {
    method: "POST",
    body: form,
  });
}
test("API rejects malformed configuration before calling the email transport", async () => {
  const before = sent.length;
  for (const change of [
    { configuration: "{broken" },
    { configuration: JSON.stringify({ ...config, endB: "custom", partB: "" }) },
    { email: "invalid" },
    { name: " " },
  ]) {
    const response = await api.POST(request(change));
    assert.equal(response.status, 400);
  }
  const response = await api.POST(
    request(
      {},
      new File([new Uint8Array(idc.IDC_FILE_LIMIT + 1)], "drawing.pdf"),
    ),
  );
  assert.equal(response.status, 400);
  assert.equal(sent.length, before);
});
test("API builds the email from validated configuration, escapes notes and attaches the drawing", async () => {
  const response = await api.POST(
    request(
      {
        configuration: JSON.stringify({
          ...config,
          pins: 26,
          length: 420,
          quantity: 75,
          endB: "custom",
          partB: "Manufacturer <PN-1>",
        }),
        partNumber: "forged",
        quantity: "9999",
        message: "Need <special> pinout",
        locale: "en",
      },
      new File(["test drawing"], "drawing.txt"),
    ),
  );
  assert.equal(response.status, 200);
  const email = sent.at(-1);
  assert.match(email.subject, /IDC Studio: IDC \/ 26 żył \/ 420 mm/);
  for (const text of [
    "75",
    "420 mm",
    "Manufacturer &lt;PN-1&gt;",
    "Need &lt;special&gt; pinout",
    "Customer notes",
  ])
    assert.ok(email.html.includes(text), text);
  assert.ok(!email.html.includes("forged"));
  assert.ok(!email.html.includes("9999"));
  assert.equal(email.replyTo, "test@example.invalid");
  assert.equal(email.attachments[0].content.toString(), "test drawing");
});
test("existing contact inquiries still use their original subject and content", async () => {
  const response = await api.POST(
    request({ type: "contact", message: "Existing contact form" }),
  );
  assert.equal(response.status, 200);
  assert.match(sent.at(-1).subject, /Zapytanie ze strony: Test Person/);
  assert.ok(sent.at(-1).html.includes("Existing contact form"));
});
