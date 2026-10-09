// Draws a 1080x1920 share poster on canvas and returns a PNG data URL.
(function () {
  const W = 1080;
  const H = 1920;
  const FONT = '"PingFang SC", "HarmonyOS Sans SC", "Microsoft YaHei", system-ui, sans-serif';
  const MONO = 'ui-monospace, "SF Mono", Menlo, Consolas, monospace';

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  // Wrap Chinese text by character width.
  function wrap(ctx, text, maxWidth, maxLines) {
    const lines = [];
    let line = "";
    for (const ch of text) {
      if (ctx.measureText(line + ch).width > maxWidth && line) {
        lines.push(line);
        line = ch;
        if (lines.length === maxLines) break;
      } else {
        line += ch;
      }
    }
    if (lines.length < maxLines && line) lines.push(line);
    if (lines.length === maxLines && lines.join("").length < [...text].length) {
      lines[maxLines - 1] = lines[maxLines - 1].slice(0, -1) + "…";
    }
    return lines;
  }

  function drawRadar(ctx, cx, cy, r, dims, values, color) {
    const n = dims.length;
    ctx.save();
    ctx.strokeStyle = "rgba(245,240,216,.16)";
    ctx.lineWidth = 2;
    [1, .66, .33].forEach((k) => {
      ctx.beginPath();
      for (let i = 0; i <= n; i += 1) {
        const a = -Math.PI / 2 + i * 2 * Math.PI / n;
        const x = cx + Math.cos(a) * r * k;
        const y = cy + Math.sin(a) * r * k;
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.stroke();
    });
    ctx.beginPath();
    values.forEach((v, i) => {
      const a = -Math.PI / 2 + i * 2 * Math.PI / n;
      const x = cx + Math.cos(a) * r * v;
      const y = cy + Math.sin(a) * r * v;
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    });
    ctx.closePath();
    ctx.fillStyle = color + "55";
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "rgba(245,240,216,.75)";
    ctx.font = `800 26px ${FONT}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    dims.forEach((label, i) => {
      const a = -Math.PI / 2 + i * 2 * Math.PI / n;
      ctx.fillText(label, cx + Math.cos(a) * (r + 34), cy + Math.sin(a) * (r + 30));
    });
    ctx.restore();
  }

  async function drawPoster({ type, rarity, signature, radarValues, radarLabels, url, artSrc }) {
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    const color = type.color || "#d7ff36";

    // Background
    ctx.fillStyle = "#0d0d0b";
    ctx.fillRect(0, 0, W, H);
    let g = ctx.createRadialGradient(200, 160, 0, 200, 160, 800);
    g.addColorStop(0, color + "40");
    g.addColorStop(1, "transparent");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    g = ctx.createRadialGradient(W, H, 0, W, H, 900);
    g.addColorStop(0, "rgba(255,79,154,.22)");
    g.addColorStop(1, "transparent");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "rgba(245,240,216,.05)";
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    // Header
    ctx.fillStyle = "#d7ff36";
    roundRect(ctx, 60, 60, 72, 72, 20);
    ctx.fill();
    ctx.fillStyle = "#111";
    ctx.font = `900 44px ${FONT}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("臭", 96, 98);
    ctx.textAlign = "left";
    ctx.fillStyle = "#f5f0d8";
    ctx.font = `900 40px ${FONT}`;
    ctx.fillText("SBIT 程序员馊味人格测试", 152, 84);
    ctx.fillStyle = "rgba(245,240,216,.55)";
    ctx.font = `700 26px ${MONO}`;
    ctx.fillText("$ npm run diagnose --me", 152, 122);

    // Art
    const art = await loadImage(artSrc);
    const ax = 60;
    const ay = 170;
    const aw = W - 120;
    const ah = Math.round(aw * 392 / 418);
    ctx.save();
    ctx.shadowColor = color;
    ctx.shadowBlur = 60;
    roundRect(ctx, ax, ay, aw, ah, 40);
    ctx.fillStyle = "#000";
    ctx.fill();
    ctx.restore();
    ctx.save();
    roundRect(ctx, ax, ay, aw, ah, 40);
    ctx.clip();
    ctx.drawImage(art, ax, ay, aw, ah);
    ctx.restore();
    ctx.strokeStyle = color;
    ctx.lineWidth = 5;
    roundRect(ctx, ax, ay, aw, ah, 40);
    ctx.stroke();

    // Rarity sticker
    ctx.save();
    ctx.translate(W - 360, ay + ah - 40);
    ctx.rotate(-.08);
    ctx.fillStyle = "#ff4f9a";
    roundRect(ctx, 0, 0, 320, 76, 38);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = `900 30px ${FONT}`;
    ctx.textAlign = "center";
    ctx.fillText(rarity, 160, 40);
    ctx.restore();

    // Code + name
    let y = ay + ah + 70;
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.font = `1000 190px ${MONO}`;
    ctx.fillStyle = "rgba(255,79,154,.85)";
    ctx.fillText(type.code, 68, y + 150);
    ctx.fillStyle = color;
    ctx.fillText(type.code, 60, y + 150);
    ctx.fillStyle = "#f5f0d8";
    ctx.font = `900 64px ${FONT}`;
    ctx.fillText(type.name, 64, y + 236);
    ctx.fillStyle = color;
    ctx.font = `800 34px ${FONT}`;
    ctx.fillText(type.tagline || "", 64, y + 292);

    // Radar on the right
    drawRadar(ctx, W - 230, y + 160, 120, radarLabels, radarValues, color);

    // Signature
    y += 340;
    ctx.fillStyle = "rgba(245,240,216,.06)";
    roundRect(ctx, 60, y, W - 120, 200, 30);
    ctx.fill();
    ctx.fillStyle = "rgba(245,240,216,.5)";
    ctx.font = `800 24px ${MONO}`;
    ctx.fillText("// 今日个性签名", 96, y + 50);
    ctx.fillStyle = "#f5f0d8";
    ctx.font = `900 40px ${FONT}`;
    wrap(ctx, signature, W - 200, 2).forEach((line, i) => ctx.fillText(line, 96, y + 112 + i * 56));

    // Footer
    ctx.fillStyle = "#d7ff36";
    roundRect(ctx, 60, H - 150, W - 120, 96, 48);
    ctx.fill();
    ctx.fillStyle = "#111";
    ctx.font = `900 34px ${FONT}`;
    ctx.fillText("你是哪种馊？来测 →", 104, H - 92);
    ctx.font = `800 24px ${MONO}`;
    ctx.textAlign = "right";
    ctx.fillText(url.replace(/^https?:\/\//, "").slice(0, 38), W - 100, H - 92);

    return canvas.toDataURL("image/png");
  }

  window.SBIT_POSTER = { drawPoster };
})();
