import { cp, mkdir, readdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "dist");
const publicDirectories = new Set(["assets", "proyek"]);

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

const entries = await readdir(root, { withFileTypes: true });
let htmlCount = 0;
let copiedCount = 0;

for (const entry of entries) {
  const source = path.join(root, entry.name);
  const destination = path.join(output, entry.name);

  if (entry.isFile() && entry.name.endsWith(".html")) {
    await cp(source, destination);
    copiedCount++;
    if (entry.name.endsWith(".html")) htmlCount++;
    continue;
  }

  if (entry.isDirectory() && publicDirectories.has(entry.name)) {
    await cp(source, destination, { recursive: true });
    copiedCount++;
  }
}

if (!htmlCount || !entries.some((entry) => entry.isFile() && entry.name === "index.html")) {
  throw new Error("Static build requires root-level HTML pages including index.html.");
}

console.log(`Prepared ${htmlCount} HTML pages and static assets in dist/ (${copiedCount} entries).`);
