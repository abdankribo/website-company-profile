import { cp, mkdir, readdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "dist");
const excluded = new Set([
  ".git",
  ".github",
  ".next",
  "app",
  "dist",
  "node_modules",
  "scripts",
]);

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

const entries = await readdir(root, { withFileTypes: true });
let htmlCount = 0;
let copiedCount = 0;

for (const entry of entries) {
  if (excluded.has(entry.name) || entry.name === "next.config.ts" || entry.name === "tsconfig.json") continue;
  const source = path.join(root, entry.name);
  const destination = path.join(output, entry.name);

  if (entry.isFile() && (entry.name.endsWith(".html") || entry.name === "language.js")) {
    await cp(source, destination);
    copiedCount++;
    if (entry.name.endsWith(".html")) htmlCount++;
    continue;
  }

  // Keep public root assets (images, stylesheets, scripts, fonts, etc.) if added later.
  if (entry.isDirectory() && !excluded.has(entry.name)) {
    await cp(source, destination, { recursive: true });
    copiedCount++;
  }
}

if (!htmlCount || !entries.some((entry) => entry.isFile() && entry.name === "index.html")) {
  throw new Error("Static build requires root-level HTML pages including index.html.");
}

console.log(`Prepared ${htmlCount} HTML pages and static assets in dist/ (${copiedCount} entries).`);
