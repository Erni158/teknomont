import { readdir, readFile } from "node:fs/promises";
import { join, relative, resolve } from "node:path";

const outputDirectory = resolve(process.argv[2] || ".next/server/app");
const catalogs = await Promise.all(
  ["pl", "en"].map(async (locale) =>
    JSON.parse(
      await readFile(new URL(`../messages/${locale}.json`, import.meta.url), "utf8"),
    ),
  ),
);
const namespaces = [...new Set(catalogs.flatMap(Object.keys))];
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const untranslatedKey = new RegExp(
  `\\b(?:${namespaces.map(escapeRegex).join("|")})\\.[A-Za-z0-9_.-]+\\b`,
  "g",
);

async function htmlFiles(directory) {
  const files = await Promise.all(
    (await readdir(directory, { withFileTypes: true })).map(async (entry) => {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) return htmlFiles(path);
      return entry.isFile() && entry.name.endsWith(".html") ? [path] : [];
    }),
  );
  return files.flat();
}

const files = await htmlFiles(outputDirectory);
if (files.length === 0) {
  throw new Error(`No rendered HTML pages found in ${outputDirectory}`);
}

let failures = 0;
for (const file of files) {
  const html = await readFile(file, "utf8");
  // Ignore serialized messages and scripts; check the text rendered for visitors.
  const text = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<[^>]*>/g, " ");
  const missing = [...new Set(text.match(untranslatedKey) || [])];
  if (missing.length > 0) {
    failures += 1;
    console.error(`${relative(outputDirectory, file)}: ${missing.join(", ")}`);
  }
}

if (failures > 0) {
  console.error(`Translation check failed: ${failures} page(s) show message keys.`);
  process.exitCode = 1;
} else {
  console.log(`Translation check passed: ${files.length} rendered pages.`);
}
