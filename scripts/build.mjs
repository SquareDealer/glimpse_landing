import { copyFileSync, cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const dist = join(root, "dist");

rmSync(dist, { recursive: true, force: true });
mkdirSync(join(dist, "assets"), { recursive: true });

for (const file of ["index.html", "robots.txt", "sitemap.xml"]) {
  copyFileSync(join(root, file), join(dist, file));
}

cpSync(join(root, "assets"), join(dist, "assets"), { recursive: true });

if (!existsSync(join(dist, "index.html"))) {
  throw new Error("Build failed: dist/index.html was not created");
}

console.log("Built static landing page in dist/");
