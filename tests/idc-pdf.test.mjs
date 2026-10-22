import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import ts from "typescript";
import * as pdfLib from "pdf-lib";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
function loadSource(relativePath, replacements = {}, globals = {}) {
  const filename = path.join(repo, relativePath);
  const source = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.CommonJS,
      esModuleInterop: true,
    },
  }).outputText;
  const nativeRequire = createRequire(filename);
  const mod = { exports: {} };
  // Use the current realm: pdf-lib deliberately checks Array/Uint8Array identity.
  const execute = vm.runInThisContext(
    `(function(require,module,exports,fetch){${source}\n})`,
    { filename },
  );
  execute(
    (name) =>
      Object.hasOwn(replacements, name)
        ? replacements[name]
        : nativeRequire(name),
    mod,
    mod.exports,
    globals.fetch ??
      (() => {
        throw new Error("Unexpected network request in PDF test");
      }),
  );
  return mod.exports;
}
const idc = loadSource("src/lib/idc.ts");
const assets = {
  regularFont: new Uint8Array(
    fs.readFileSync(path.join(repo, "public/fonts/noto-sans-regular.ttf")),
  ),
  boldFont: new Uint8Array(
    fs.readFileSync(path.join(repo, "public/fonts/noto-sans-bold.ttf")),
  ),
  logo: new Uint8Array(
    fs.readFileSync(path.join(repo, "public/images/logo.png")),
  ),
};
const png =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";
const preview = { dataUrl: png, width: 1, height: 1 };
const generatedAt = new Date("2026-10-22T09:00:00Z");

// Record real PDF draw operations while keeping the actual renderer, fonts and images.
// This verifies long identifiers survive wrapping and every drawn text line fits the page.
function pdfModule() {
  const draws = [];
  const sourceExports = loadSource("src/lib/idc-pdf.ts", {
    "@/lib/idc": idc,
    "pdf-lib": {
      ...pdfLib,
      PDFDocument: {
        create: async () => {
          const document = await pdfLib.PDFDocument.create();
          const addPage = document.addPage.bind(document);
          document.addPage = (...args) => {
            const page = addPage(...args);
            const drawText = page.drawText.bind(page);
            page.drawText = (text, options) => {
              draws.push({
                text,
                ...options,
                pageWidth: page.getWidth(),
                pageHeight: page.getHeight(),
              });
              return drawText(text, options);
            };
            return page;
          };
          return document;
        },
      },
    },
  });
  return { ...sourceExports, draws };
}
function assertTextFits(draws) {
  for (const draw of draws) {
    assert.ok(draw.x >= 39.9, `Left margin: ${draw.text}`);
    assert.ok(
      draw.x + draw.font.widthOfTextAtSize(draw.text, draw.size) <=
        draw.pageWidth - 39.9,
      `Right margin: ${draw.text}`,
    );
    assert.ok(draw.y >= 24, `Bottom margin: ${draw.text}`);
    assert.ok(
      draw.y + draw.size <= draw.pageHeight - 35,
      `Top margin: ${draw.text}`,
    );
  }
}

test("PDF exports the selected parameters, PNG preview and Polish characters on one A4 page", async () => {
  const { createIdcPdf, draws } = pdfModule();
  const bytes = await createIdcPdf({
    configuration: {
      ...idc.DEFAULT_IDC_CONFIGURATION,
      pins: 26,
      length: 420,
      quantity: 75,
    },
    locale: "pl",
    preview,
    assets,
    generatedAt,
  });
  assert.ok(bytes instanceof Uint8Array);
  const document = await pdfLib.PDFDocument.load(bytes);
  assert.equal(document.getPageCount(), 1);
  assert.match(document.getTitle(), /26 \/ 420 mm/);
  const text = draws.map(({ text }) => text).join("\n");
  for (const value of [
    "Liczba żył",
    "26",
    "420 mm",
    "75 szt.",
    "1.27 mm",
    "2.54 × 2.54 mm",
    "28 AWG / PVC",
    "Szary / czerwony znacznik żyły 1",
    "Zakończenie A",
    "Zakończenie B",
    "IDC żeńskie, 26 styków",
    "Sposób pomiaru L",
    "Nie jest zamówieniem",
  ])
    assert.ok(text.includes(value), value);
  const images = document
    .getPage(0)
    .node.Resources()
    .lookup(pdfLib.PDFName.of("XObject"), pdfLib.PDFDict);
  assert.equal(
    images.keys().length,
    2,
    "Logo and cable preview must both be embedded",
  );
  assertTextFits(draws);
});

test("English PDF records missing-preview fallback and omits unused connector orientation", async () => {
  const { createIdcPdf, draws } = pdfModule();
  const bytes = await createIdcPdf({
    configuration: {
      ...idc.DEFAULT_IDC_CONFIGURATION,
      endB: "none",
      orientation: "opposite",
      color: "black",
    },
    locale: "en",
    preview: null,
    assets,
    generatedAt,
  });
  const document = await pdfLib.PDFDocument.load(bytes);
  assert.equal(document.getPageCount(), 1);
  const text = draws.map(({ text }) => text).join("\n");
  for (const value of [
    "3D preview is unavailable.",
    "No connector",
    "To be agreed from end types / drawing",
    "Black / red conductor 1 marker",
    "Length L reference",
    "not an order",
  ])
    assert.ok(text.includes(value), value);
  assert.ok(!text.includes("connector B reversed"));
  assertTextFits(draws);
});

test("long unbroken custom part numbers are preserved and paginate within two pages", async () => {
  const { createIdcPdf, draws } = pdfModule();
  const partA = "ŻÓŁĆ-PART-A-" + "M".repeat(148);
  const partB = "PART-B-" + "W".repeat(153);
  const bytes = await createIdcPdf({
    configuration: {
      ...idc.DEFAULT_IDC_CONFIGURATION,
      pins: 64,
      length: 100000,
      quantity: 1000000,
      endA: "custom",
      endB: "custom",
      partA,
      partB,
    },
    locale: "pl",
    preview,
    assets,
    generatedAt,
  });
  const document = await pdfLib.PDFDocument.load(bytes);
  assert.ok(document.getPageCount() >= 1 && document.getPageCount() <= 2);
  const joined = draws.map(({ text }) => text).join("");
  assert.ok(joined.includes(partA));
  assert.ok(joined.includes(partB));
  assert.ok(joined.includes("100000 mm"));
  assert.ok(joined.includes("1000000 szt."));
  assertTextFits(draws);
});

test("PDF rejects invalid configuration and malformed image data without a network request", async () => {
  const { createIdcPdf } = pdfModule();
  for (const change of [
    { pins: 11 },
    { length: 0 },
    { quantity: 0 },
    { endB: "custom", partB: "" },
  ]) {
    await assert.rejects(
      createIdcPdf({
        configuration: { ...idc.DEFAULT_IDC_CONFIGURATION, ...change },
        locale: "pl",
        preview: null,
      }),
    );
  }
  await assert.rejects(
    createIdcPdf({
      configuration: idc.DEFAULT_IDC_CONFIGURATION,
      locale: "pl",
      preview: { ...preview, dataUrl: "data:text/plain;base64,YWJj" },
      assets,
      generatedAt,
    }),
    /Invalid IDC preview image/,
  );
});
