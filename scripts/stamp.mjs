// Run before every release: stamps content hashes onto CSS/JS/data URLs in index.html (cache busting,
// GitHub Pages caches files for 10 minutes) and writes the current persona / question counts into the
// static HTML so the page is correct even before JS runs.
// Usage: node scripts/stamp.mjs
import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const indexPath = path.join(root, "index.html");
let html = fs.readFileSync(indexPath, "utf8");

const hash = (file) => crypto.createHash("sha1").update(fs.readFileSync(path.join(root, file))).digest("hex").slice(0, 8);

let stamped = 0;
html = html.replace(/(src|href)="((?:css|js|data)\/[^"?]+)(?:\?v=[^"]*)?"/g, (_, attr, file) => {
  stamped += 1;
  return `${attr}="${file}?v=${hash(file)}"`;
});

const sandbox = { window: {} };
vm.runInNewContext(["data/types.js", "data/questions.js"].map((f) => fs.readFileSync(path.join(root, f), "utf8")).join("\n"), sandbox);
const typeCount = sandbox.window.SBIT_TYPES.length;
const bankCount = sandbox.window.SBIT_QUESTION_BANK.length;

html = html
  .replace(/(id="typeCount">)\d+/g, `$1${typeCount}`)
  .replace(/(class="typeCountText">)\d+/g, `$1${typeCount}`)
  .replace(/(id="bankCount">)\d+/g, `$1${bankCount}`)
  .replace(/\d+ 种程序员馊味人格/g, `${typeCount} 种程序员馊味人格`)
  .replace(/\d+ 种人格，看看你/g, `${typeCount} 种人格，看看你`);

fs.writeFileSync(indexPath, html);
console.log(`stamped ${stamped} asset URLs · ${typeCount} personas · ${bankCount} questions`);
