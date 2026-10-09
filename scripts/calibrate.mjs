// Calibrate per-type bias so the result distribution under random answering matches each type's `target` (%).
// Usage: node scripts/calibrate.mjs          -> print current distribution
//        node scripts/calibrate.mjs --write  -> tune biases and write them back into data/types.js
import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const engine = require(path.join(root, "js/engine.js"));

function load(file) {
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(root, file), "utf8"), sandbox);
  return sandbox.window;
}

const bank = load("data/questions.js").SBIT_QUESTION_BANK;
const types = load("data/types.js").SBIT_TYPES;
const write = process.argv.includes("--write");

function report(dist) {
  let error = 0;
  types.forEach((t) => {
    error += Math.abs(dist[t.code] - t.target);
    console.log(`${t.code}  target ${String(t.target).padStart(4)}%  actual ${dist[t.code].toFixed(2).padStart(6)}%  bias ${t.bias.toFixed(4)}`);
  });
  console.log(`total abs error: ${error.toFixed(2)}%  (bank=${bank.length})`);
}

if (write) {
  const runs = 30000;
  for (let iter = 0; iter < 80; iter += 1) {
    const dist = engine.simulate(bank, types, { runs, seed: 1000 + iter });
    const rate = iter < 40 ? 0.04 : 0.015;
    types.forEach((t) => {
      t.bias += rate * Math.log((t.target + 0.05) / (dist[t.code] + 0.05));
      t._profile = undefined;
    });
    const mean = types.reduce((a, t) => a + t.bias, 0) / types.length;
    types.forEach((t) => { t.bias = Number((t.bias - mean).toFixed(4)); });
  }
  let source = fs.readFileSync(path.join(root, "data/types.js"), "utf8");
  types.forEach((t) => {
    const re = new RegExp(`(^\\s*code:\\s*"${t.code}"[\\s\\S]*?bias:\\s*)-?[\\d.]+`, "m");
    source = source.replace(re, `$1${t.bias}`);
  });
  fs.writeFileSync(path.join(root, "data/types.js"), source);
  console.log("biases written to data/types.js\n");
}

report(engine.simulate(bank, types, { runs: 40000 }));
