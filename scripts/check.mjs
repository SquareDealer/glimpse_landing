import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const htmlPath = join(root, "dist", "index.html");
const html = readFileSync(htmlPath, "utf8");

const required = [
  "Glimpse — A glance is all it takes",
  'name="description"',
  'property="og:title"',
  "Request Mac beta",
  'id="download"',
  'id="how"',
  'id="pricing"',
];

for (const needle of required) {
  if (!html.includes(needle)) {
    throw new Error(`Missing required markup: ${needle}`);
  }
}

if (html.includes('href="#"')) {
  throw new Error('Found placeholder link href="#"');
}

if (html.includes("<button")) {
  throw new Error("Found inactive button markup; CTAs should be links");
}

const localRefs = [...html.matchAll(/\b(?:src|href)="([^":#?]+)(?:[?#][^"]*)?"/g)]
  .map((match) => match[1])
  .filter((ref) => !ref.startsWith("mailto:"));

for (const ref of localRefs) {
  if (!existsSync(join(root, "dist", ref))) {
    throw new Error(`Missing local asset: ${ref}`);
  }
}

console.log("Static checks passed");
