// Generate r/<code>.html: tiny static pages with per-type Open Graph tags that redirect to ../?r=<CODE>.
// Usage: node scripts/build-share-pages.mjs [siteUrl]   (default https://scarea.github.io/sbti/)
import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const site = (process.argv[2] || "https://scarea.github.io/sbti/").replace(/\/?$/, "/");
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, "data/types.js"), "utf8"), sandbox);
const types = sandbox.window.SBIT_TYPES;
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

fs.mkdirSync(path.join(root, "r"), { recursive: true });
types.forEach((type) => {
  const slug = type.code.toLowerCase();
  const title = `我是 ${type.code}「${type.name}」· SBIT 程序员馊味人格`;
  const desc = `${type.tagline}。你是哪种馊？12 道题测完看看我们合不合。`;
  const html = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(desc)}" />
  <meta property="og:image" content="${site}assets/og/${slug}.jpg" />
  <meta property="og:url" content="${site}r/${slug}.html" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta http-equiv="refresh" content="0; url=../?r=${type.code}" />
  <script>location.replace("../?r=${type.code}" + location.hash);</script>
  <style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0d0d0b;color:#d7ff36;font:900 20px system-ui,sans-serif}</style>
</head>
<body><a href="../?r=${type.code}" style="color:inherit">正在打开 ${type.code} 的馊味报告…</a></body>
</html>
`;
  fs.writeFileSync(path.join(root, "r", `${slug}.html`), html);
});
console.log(`wrote ${types.length} pages to r/ for ${site}`);
