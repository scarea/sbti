(function () {
  const $ = (selector, root = document) => root.querySelector(selector);
  const engine = window.SBIT_ENGINE;
  const bank = window.SBIT_QUESTION_BANK || [];
  const types = window.SBIT_TYPES || [];
  const signatures = window.SBIT_SIGNATURES || {};
  const pairs = window.SBIT_PAIRS || {};
  const SAMPLE_SIZE = 12;
  const DIM_LABELS = { M: "摸鱼", L: "劳模", Z: "装忙", S: "清醒", D: "躲避", J: "假卷", F: "反骨", R: "认命" };
  const typeByCode = Object.fromEntries(types.map((type) => [type.code, type]));
  const root = document.documentElement;

  // ---------- helpers ----------
  const randomFrom = (list) => list[Math.floor(Math.random() * list.length)];
  const artPath = (type) => `assets/types/${type.code.toLowerCase()}.webp`;
  const escapeHtml = (text) => String(text).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
  const storage = {
    get(key) { try { return localStorage.getItem(key); } catch (e) { return null; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch (e) {} }
  };

  let toastTimer = null;
  function toast(message) {
    const el = $("#toast");
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 1900);
  }

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    const area = document.createElement("textarea");
    area.value = text;
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    if (!ok) throw new Error("copy failed");
  }

  function lockScroll() {
    document.body.classList.toggle("locked", !$("#quiz").hidden || !$("#modal").hidden || !$("#build").hidden);
  }

  function burst(container, glyphs, count = 36) {
    if (!container) return;
    const layer = document.createElement("div");
    layer.className = "burst";
    for (let i = 0; i < count; i += 1) {
      const piece = document.createElement("i");
      piece.textContent = randomFrom(glyphs);
      piece.style.left = `${40 + Math.random() * 20}%`;
      piece.style.top = `${40 + Math.random() * 20}%`;
      piece.style.setProperty("--dx", `${Math.round((Math.random() - .5) * 420)}px`);
      piece.style.setProperty("--dy", `${Math.round((Math.random() - .5) * 320)}px`);
      piece.style.setProperty("--rot", `${Math.round((Math.random() - .5) * 540)}deg`);
      piece.style.animationDelay = `${Math.random() * .15}s`;
      layer.appendChild(piece);
    }
    container.appendChild(layer);
    setTimeout(() => layer.remove(), 1300);
  }

  function glitch(el, text) {
    el.textContent = text;
    el.dataset.text = text;
    el.classList.remove("glitching");
    void el.offsetWidth;
    el.classList.add("glitching");
    setTimeout(() => el.classList.remove("glitching"), 900);
  }

  // ---------- rarity (seeded simulation, stable across loads) ----------
  const rarity = engine.simulate(bank, types, { runs: 6000, seed: 7 });
  const rarityText = (type) => {
    const value = rarity[type.code];
    return value === undefined ? "--" : `${value.toFixed(1)}%`;
  };

  // ---------- signatures ----------
  function signaturePool(type) {
    return [...(signatures[type.code] || []), ...(signatures[type.code] || []), ...(signatures.GLOBAL || [])];
  }
  function pickSignature(type, avoid) {
    const pool = signaturePool(type);
    if (!pool.length) return "今天的我，暂无签名，只有馊味。";
    let text = randomFrom(pool);
    for (let i = 0; i < 4 && text === avoid; i += 1) text = randomFrom(pool);
    return text;
  }
  const totalSignatures = Object.values(signatures).reduce((sum, list) => sum + list.length, 0);

  let typingTimer = null;
  function typeWrite(el, text) {
    clearInterval(typingTimer);
    el.textContent = "";
    el.classList.add("sig-typing");
    const chars = [...text];
    let i = 0;
    typingTimer = setInterval(() => {
      el.textContent += chars[i] || "";
      i += 1;
      if (i >= chars.length) {
        clearInterval(typingTimer);
        setTimeout(() => el.classList.remove("sig-typing"), 1200);
      }
    }, 34);
  }

  // ---------- theme ----------
  $("#themeToggle").addEventListener("click", () => {
    const light = root.dataset.theme !== "light";
    if (light) root.dataset.theme = "light"; else delete root.dataset.theme;
    storage.set("sbit-theme", light ? "light" : "dark");
    toast(light ? "已切到 light()：馊味更显眼了" : "已切回 dark()：适合夜里加班");
  });

  // ---------- scroll progress ----------
  let scrollQueued = false;
  window.addEventListener("scroll", () => {
    if (scrollQueued) return;
    scrollQueued = true;
    requestAnimationFrame(() => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      $("#scrollBar").style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
      scrollQueued = false;
    });
  }, { passive: true });

  // ---------- code rain (throttled, pauses when hidden) ----------
  (function codeRain() {
    const canvas = $("#codeRain");
    if (!canvas.getContext || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    const tokens = ["TODO", "JIRA", "404", "NULL", "wontfix", "git push -f", "prod", "P0", "moyu", "OKOK", "LGTM", "CRUD", "npm i", "咖啡", "开会", "摸鱼", "带薪", "需求变更", "rollback", "on-call", "对齐", "闭环"];
    let columns = [];
    let last = 0;
    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      columns = Array.from({ length: Math.ceil(window.innerWidth / 70) }, (_, i) => ({
        x: i * 70 + Math.random() * 20,
        y: Math.random() * -window.innerHeight,
        speed: .6 + Math.random() * 1.4,
        token: randomFrom(tokens),
        alpha: .2 + Math.random() * .4
      }));
    }
    function draw(now) {
      requestAnimationFrame(draw);
      if (document.hidden || now - last < 40) return;
      last = now;
      const light = root.dataset.theme === "light";
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.font = "800 12px ui-monospace, Menlo, monospace";
      columns.forEach((col) => {
        ctx.fillStyle = light ? `rgba(40,50,20,${col.alpha})` : `rgba(215,255,54,${col.alpha})`;
        ctx.fillText(col.token, col.x, col.y);
        col.y += col.speed * 2.4;
        if (col.y > window.innerHeight + 30) {
          col.y = -30 - Math.random() * 300;
          col.token = randomFrom(tokens);
        }
      });
    }
    resize();
    window.addEventListener("resize", resize, { passive: true });
    requestAnimationFrame(draw);
  })();

  // ---------- hero ----------
  (function hero() {
    $("#bankCount").textContent = bank.length;
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    const eyebrow = $("#heroEyebrow");
    if (day === 5 && hour >= 14) eyebrow.textContent = "🚨 检测到周五下午：禁止发版，适合测馊味";
    else if (hour >= 23 || hour < 5) eyebrow.textContent = "🌙 这个点还在线？你的馊味已经很浓了";
    else if (day === 1 && hour < 12) eyebrow.textContent = "☕ 周一上午，灵魂还在加载中";
    else if (day === 0 || day === 6) eyebrow.textContent = "🛋️ 周末还想着上班，这本身就是一种症状";

    const fan = $("#heroFan");
    const order = [...types].sort(() => Math.random() - .5);
    fan.innerHTML = order.slice(0, 5).map((type, i) => `<div class="fan-card" data-pos="${i}"><img src="${artPath(type)}" alt="" /></div>`).join("");
    let cursor = 5;
    setInterval(() => {
      if (document.hidden) return;
      const cards = [...fan.children];
      cards.forEach((card) => { card.dataset.pos = String((Number(card.dataset.pos) + 4) % 5); });
      const back = cards.find((card) => card.dataset.pos === "4");
      if (back) back.querySelector("img").src = artPath(order[cursor % order.length]);
      cursor += 1;
    }, 2600);

    const last = storage.get("sbit-last");
    const lastType = last && typeByCode[last];
    if (lastType) {
      const box = $("#lastResult");
      box.hidden = false;
      box.innerHTML = `上次诊断：<b>${lastType.code}</b> ${escapeHtml(lastType.name)} <button class="chip-btn" type="button">查看</button>`;
      box.querySelector("button").addEventListener("click", () => openTypeModal(lastType));
    }
  })();

  // ---------- marquee ----------
  (function marquee() {
    const all = Object.values(signatures).flat();
    const picks = [...all].sort(() => Math.random() - .5).slice(0, 18);
    const html = picks.map((text) => `<span>${escapeHtml(text)}</span>`).join("");
    $("#marquee").innerHTML = html + html;
  })();

  // ---------- radar ----------
  function radarSvg(values, compareValues) {
    const dims = engine.DIMS;
    const r = 88;
    const point = (i, v) => {
      const a = -Math.PI / 2 + i * 2 * Math.PI / dims.length;
      return [Math.cos(a) * r * v, Math.sin(a) * r * v];
    };
    const poly = (vals) => vals.map((v, i) => point(i, v).map((n) => n.toFixed(1)).join(",")).join(" ");
    let svg = "";
    [1, .66, .33].forEach((k) => { svg += `<polygon class="grid" points="${poly(dims.map(() => k))}" />`; });
    dims.forEach((_, i) => { const [x, y] = point(i, 1); svg += `<line class="axis" x1="0" y1="0" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" />`; });
    if (compareValues) svg += `<polygon class="shape-b" points="${poly(compareValues)}" />`;
    svg += `<polygon class="shape" points="${poly(values)}" />`;
    dims.forEach((key, i) => {
      const [x, y] = point(i, 1.22);
      svg += `<text x="${x.toFixed(1)}" y="${(y + 4).toFixed(1)}" text-anchor="middle">${DIM_LABELS[key]}</text>`;
    });
    return svg;
  }
  const zToRadar = (z) => engine.DIMS.map((key) => Math.max(.08, Math.min(1, .5 + z[key] / 5)));
  const weightsToRadar = (type) => engine.DIMS.map((key) => Math.max(.08, type.weights[key] / 9));

  // ---------- detail blocks (shared by result + modal) ----------
  function relHtml(rel, label) {
    const other = rel && typeByCode[rel.code];
    if (!other) return "";
    return `<div class="detail"><h4>${label}</h4><div class="rel" data-code="${other.code}"><img src="${artPath(other)}" alt="" /><div><b>${other.code} · ${escapeHtml(other.name)}</b><small>${escapeHtml(rel.why)}</small></div></div></div>`;
  }
  function detailsHtml(type) {
    const list = (items) => `<ul>${(items || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
    return [
      `<div class="detail"><h4>🩺 临床症状</h4>${list(type.symptoms)}</div>`,
      `<div class="detail"><h4>🧯 生存指南</h4>${list(type.tips)}</div>`,
      `<div class="detail"><h4>✨ 隐藏天赋</h4><p>${escapeHtml((type.strengths || "").replace(/^隐藏天赋：/, ""))}</p></div>`,
      `<div class="detail"><h4>💥 致命 bug</h4><p>${escapeHtml((type.weakness || "").replace(/^致命 ?bug：/, ""))}</p></div>`,
      `<div class="detail"><h4>💼 适合岗位</h4><p>${(type.jobs || []).map(escapeHtml).join(" / ")}</p></div>`,
      `<div class="detail"><h4>📝 本命 commit</h4><code>$ git commit -m "${escapeHtml(type.commit || "")}"</code></div>`,
      relHtml(type.mate, "🤝 最佳搭档"),
      relHtml(type.nemesis, "⚔️ 天敌")
    ].join("");
  }
  document.addEventListener("click", (event) => {
    const rel = event.target.closest(".rel[data-code]");
    if (rel) openTypeModal(typeByCode[rel.dataset.code]);
  });

  // ---------- modal ----------
  const modal = $("#modal");
  function openModal(html, color) {
    $("#modalBody").innerHTML = html;
    $("#modalPanel").style.setProperty("--type", color || "#d7ff36");
    modal.hidden = false;
    $("#modalPanel").scrollTop = 0;
    lockScroll();
  }
  function closeModal() {
    modal.hidden = true;
    lockScroll();
  }
  $("#modalClose").addEventListener("click", closeModal);
  modal.addEventListener("click", (event) => { if (event.target === modal) closeModal(); });

  function openTypeModal(type) {
    if (!type) return;
    openModal(`
      <div class="detail-modal">
        <div class="dm-art"><img src="${artPath(type)}" alt="${type.code} ${escapeHtml(type.name)}" /></div>
        <div class="dm-copy">
          <div class="badge-row"><span class="badge">出现率 ${rarityText(type)}</span></div>
          <h2 class="glitch-code">${type.code}</h2>
          <h3>${escapeHtml(type.name)}</h3>
          <p class="result-tagline">${escapeHtml(type.tagline || "")}</p>
          <p>${escapeHtml(type.desc)}</p>
          <div class="quote-chips">${(type.catchphrases || []).map((q) => `<span>${escapeHtml(q)}</span>`).join("")}</div>
          <div class="sig-box"><div class="sig-label">随机签名</div><p class="sig-text">${escapeHtml(pickSignature(type))}</p></div>
        </div>
      </div>
      <div class="detail-grid" style="margin-top:18px">${detailsHtml(type)}</div>
    `, type.color);
  }

  // ---------- type grid ----------
  function renderTypeGrid(mine) {
    $("#typeGrid").innerHTML = types.map((type) => `
      <button class="type-card ${type.code === mine ? "mine" : ""}" type="button" data-code="${type.code}" style="--c:${type.color}">
        <div class="thumb"><img src="${artPath(type)}" alt="${type.code} ${escapeHtml(type.name)}" loading="lazy" /><span class="tag">${type.code}</span><span class="rar">${rarityText(type)}</span></div>
        <h3>${escapeHtml(type.name)}</h3>
        <p>${escapeHtml(type.tagline || "")}</p>
      </button>`).join("");
  }
  $("#typeGrid").addEventListener("click", (event) => {
    const card = event.target.closest(".type-card");
    if (card) openTypeModal(typeByCode[card.dataset.code]);
  });
  renderTypeGrid(storage.get("sbit-last"));

  // ---------- shared link ----------
  function readSharedCode() {
    const params = new URLSearchParams(location.search);
    const hash = location.hash.match(/result=([A-Z]+)/i);
    const code = (params.get("r") || params.get("result") || params.get("sbit") || (hash && hash[1]) || "").toUpperCase();
    return typeByCode[code] || null;
  }
  const sharedType = readSharedCode();
  if (sharedType) {
    const view = $("#sharedView");
    view.hidden = false;
    view.style.setProperty("--type", sharedType.color);
    $("main").prepend(view);
    $("#sharedArt").innerHTML = `<img src="${artPath(sharedType)}" alt="${sharedType.code}" />`;
    glitch($("#sharedCode"), sharedType.code);
    $("#sharedName").textContent = `${sharedType.name} · 出现率 ${rarityText(sharedType)}`;
    $("#sharedDesc").textContent = sharedType.desc;
    $("#sharedDetailBtn").addEventListener("click", () => openTypeModal(sharedType));
    document.querySelector(".hero").hidden = true;
  }

  function shareUrl(type) {
    if (!/^https?:$/.test(location.protocol)) return "";
    const base = location.href.replace(/[?#].*$/, "").replace(/index\.html$/, "");
    return `${base}r/${type.code.toLowerCase()}.html`;
  }

  // ---------- quiz ----------
  const quiz = {
    questions: [],
    order: [],     // shuffled choice indexes per question
    answers: [],   // original choice index per question
    times: [],
    index: 0,
    shownAt: 0,
    locked: false
  };

  function startQuiz() {
    const incomplete = quiz.questions.length && quiz.answers.some((a) => a === null) && quiz.answers.some((a) => a !== null);
    if (!incomplete) {
      quiz.questions = engine.sampleIndexes(bank.length, SAMPLE_SIZE, Math.random).map((i) => bank[i]);
      quiz.order = quiz.questions.map((q) => engine.sampleIndexes(q.choices.length, q.choices.length, Math.random));
      quiz.answers = quiz.questions.map(() => null);
      quiz.times = quiz.questions.map(() => null);
      quiz.index = 0;
    } else {
      toast("接着上次的馊味继续采");
    }
    closeModal();
    $("#quiz").hidden = false;
    lockScroll();
    renderQuestion();
  }
  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-start]")) startQuiz();
  });

  function renderQuestion() {
    const q = quiz.questions[quiz.index];
    const total = quiz.questions.length;
    const answered = quiz.answers.filter((a) => a !== null).length;
    $("#qIndex").textContent = String(quiz.index + 1).padStart(2, "0");
    $("#qTotal").textContent = total;
    $("#qBar").style.width = `${answered / total * 100}%`;
    $("#qTag").textContent = `sample#${String(quiz.index + 1).padStart(2, "0")} · ${["气味采集中", "正在闻你的工位", "嗅探灵魂残留", "读取摸鱼日志", "分析带薪时长"][quiz.index % 5]}`;
    const text = $("#qText");
    text.textContent = q.text;
    text.style.animation = "none";
    void text.offsetWidth;
    text.style.animation = "";
    const keys = ["A", "B", "C", "D"];
    $("#qChoices").innerHTML = quiz.order[quiz.index].map((choiceIndex, pos) => {
      const c = q.choices[choiceIndex];
      return `<button class="choice ${quiz.answers[quiz.index] === choiceIndex ? "selected" : ""}" type="button" data-choice="${choiceIndex}"><kbd>${keys[pos]}</kbd><b>${escapeHtml(c.title)}</b><small>${escapeHtml(c.note)}</small></button>`;
    }).join("");
    $("#qQuip").classList.remove("show");
    $("#quizBack").disabled = quiz.index === 0;
    const { z } = engine.scoreVector(quiz.questions, quiz.answers);
    const magnitude = Math.sqrt(engine.DIMS.reduce((sum, key) => sum + z[key] * z[key], 0));
    $("#qSmell").style.width = `${Math.min(100, answered ? 18 + magnitude * 14 : 0)}%`;
    quiz.shownAt = performance.now();
    quiz.locked = false;
  }

  function choose(choiceIndex) {
    if (quiz.locked) return;
    quiz.locked = true;
    const q = quiz.questions[quiz.index];
    quiz.answers[quiz.index] = choiceIndex;
    quiz.times[quiz.index] = performance.now() - quiz.shownAt;
    const button = $(`#qChoices [data-choice="${choiceIndex}"]`);
    $("#qChoices").querySelectorAll(".choice").forEach((el) => el.classList.remove("selected"));
    if (button) button.classList.add("selected", "picked");
    const quip = $("#qQuip");
    quip.textContent = q.choices[choiceIndex].quip || q.choices[choiceIndex].note;
    quip.classList.add("show");
    const answered = quiz.answers.filter((a) => a !== null).length;
    $("#qBar").style.width = `${answered / quiz.questions.length * 100}%`;
    setTimeout(() => {
      const next = quiz.answers.findIndex((a, i) => a === null && i > quiz.index);
      const firstEmpty = quiz.answers.indexOf(null);
      if (next !== -1) quiz.index = next;
      else if (firstEmpty !== -1) quiz.index = firstEmpty;
      else return finishQuiz();
      renderQuestion();
    }, 720);
  }

  $("#qChoices").addEventListener("click", (event) => {
    const button = event.target.closest(".choice");
    if (button) choose(Number(button.dataset.choice));
  });
  $("#quizBack").addEventListener("click", () => {
    if (quiz.index > 0) { quiz.index -= 1; renderQuestion(); }
  });
  $("#quizClose").addEventListener("click", () => {
    $("#quiz").hidden = true;
    lockScroll();
    if (quiz.answers.some((a) => a !== null)) toast("进度已暂存，随时回来继续发馊");
  });

  // ---------- finish + build animation ----------
  function finishQuiz() {
    $("#quiz").hidden = true;
    const { z } = engine.scoreVector(quiz.questions, quiz.answers);
    const ranked = engine.rank(types, z);
    let type = ranked[0].type;
    let egg = "";
    const avg = quiz.times.reduce((a, b) => a + (b || 0), 0) / quiz.times.length;
    const positions = quiz.answers.map((answer, i) => quiz.order[i].indexOf(answer));
    if (avg < 1000) {
      egg = `⚡ 隐藏判定：平均 ${(avg / 1000).toFixed(1)} 秒一题，你根本没看题。系统强制把你判为 PUSH：先提交，再说。`;
      type = typeByCode.PUSH || type;
    } else if (positions.every((p) => p === positions[0])) {
      egg = `🎯 彩蛋：你 12 题全选了 ${"ABCD"[positions[0]]}。选项顺序是随机打乱的，所以你是真·随缘型选手。`;
    }
    runBuild(type, () => showResult({ type, ranked, z, egg }));
  }

  function runBuild(type, done) {
    const build = $("#build");
    const log = $("#buildLog");
    build.hidden = false;
    lockScroll();
    const lines = [
      "<em>$</em> npm run diagnose --sample=12",
      "  ✓ 读取 12 条工位气味样本",
      "  ✓ 归一化 8 维馊味向量",
      `  ✓ 与 16 种人格做余弦匹配`,
      "  ⚠ warning: 检测到大量摸鱼残留",
      `  ✓ 最高相似度命中 <b>${type.code}</b>`,
      "<em>build passed</em> · 正在打印诊断书…"
    ];
    log.innerHTML = "";
    let i = 0;
    const timer = setInterval(() => {
      log.innerHTML += `${lines[i]}\n`;
      i += 1;
      if (i >= lines.length) {
        clearInterval(timer);
        setTimeout(() => {
          build.hidden = true;
          lockScroll();
          done();
        }, 420);
      }
    }, 230);
  }

  // ---------- result ----------
  let currentResult = null;
  function showResult({ type, ranked, z, egg }) {
    currentResult = { type, z, signature: pickSignature(type) };
    const section = $("#result");
    section.hidden = false;
    section.style.setProperty("--type", type.color);
    $("#resultEgg").hidden = !egg;
    $("#resultEgg").textContent = egg;
    $("#resultArt").innerHTML = `<img src="${artPath(type)}" alt="${type.code} ${escapeHtml(type.name)}" />`;
    $("#resultRarity").textContent = `出现率 ${rarityText(type)}`;
    $("#resultName").textContent = type.name;
    $("#resultTagline").textContent = type.tagline || "";
    $("#resultDesc").textContent = type.desc;
    $("#resultQuotes").innerHTML = (type.catchphrases || []).map((q) => `<span>${escapeHtml(q)}</span>`).join("");
    $("#resultDetails").innerHTML = detailsHtml(type);
    $("#resultSig").textContent = currentResult.signature;

    const matches = engine.matchPercents(ranked, 3);
    if (matches[0].type !== type) matches.unshift({ type, pct: 100 });
    $("#matchBars").innerHTML = matches.slice(0, 3).map((m) => `
      <div class="match-row" data-code="${m.type.code}" style="--c:${m.type.color}"><b>${m.type.code}</b><i style="--p:0%"></i><span>${m.pct}%</span></div>`).join("");
    requestAnimationFrame(() => requestAnimationFrame(() => {
      section.querySelectorAll(".match-row").forEach((row, i) => row.querySelector("i").style.setProperty("--p", `${matches[i].pct}%`));
    }));
    $("#radar").innerHTML = radarSvg(zToRadar(z), sharedType ? weightsToRadar(sharedType) : null);

    renderCompare(type);
    renderTypeGrid(type.code);
    storage.set("sbit-last", type.code);

    section.scrollIntoView({ behavior: "auto", block: "start" });
    glitch($("#resultCode"), type.code);
    burst($("#resultHolo"), [...type.code, "{", "}", "=>", "NULL", "TODO", "💀", "404", "P0"], 48);
  }

  $("#matchBars").addEventListener("click", (event) => {
    const row = event.target.closest(".match-row");
    if (row) openTypeModal(typeByCode[row.dataset.code]);
  });

  // Holo tilt on the result card
  const holo = $("#resultHolo");
  holo.addEventListener("pointermove", (event) => {
    const rect = holo.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    holo.style.setProperty("--ry", `${(x - .5) * 14}deg`);
    holo.style.setProperty("--rx", `${(.5 - y) * 12}deg`);
    holo.style.setProperty("--sx", `${x * 100}%`);
    holo.style.setProperty("--sy", `${y * 100}%`);
  });
  holo.addEventListener("pointerleave", () => {
    holo.style.setProperty("--rx", "0deg");
    holo.style.setProperty("--ry", "0deg");
  });
  holo.addEventListener("click", () => openTypeModal(currentResult && currentResult.type));

  $("#resultSigReroll").addEventListener("click", () => {
    if (!currentResult) return;
    currentResult.signature = pickSignature(currentResult.type, currentResult.signature);
    typeWrite($("#resultSig"), currentResult.signature);
  });
  $("#resultSigCopy").addEventListener("click", () => {
    if (currentResult) copyText(currentResult.signature).then(() => toast("签名已复制，去换个状态吧"), () => toast("复制失败，但馊味保留"));
  });

  // ---------- compare with friend ----------
  function compatibility(a, b) {
    if (a.code === b.code) return 88;
    if (a.mate && a.mate.code === b.code) return 96;
    if (b.mate && b.mate.code === a.code) return 93;
    if (a.nemesis && a.nemesis.code === b.code) return 9;
    if (b.nemesis && b.nemesis.code === a.code) return 14;
    const pa = engine.DIMS.map((k) => a.weights[k]);
    const pb = engine.DIMS.map((k) => b.weights[k]);
    const dot = pa.reduce((s, v, i) => s + v * pb[i], 0);
    const cos = dot / (Math.hypot(...pa) * Math.hypot(...pb));
    return Math.round(Math.max(20, Math.min(90, (cos - .45) / .5 * 70 + 20)));
  }
  function compatibilityText(a, b, score) {
    const key = [a.code, b.code].sort().join("+");
    if (pairs[key]) return pairs[key];
    if (a.code === b.code) return "同一种馊味相遇，工位气压瞬间翻倍。你们会互相理解，也会互相拖延。";
    if (a.mate && a.mate.code === b.code) return a.mate.why;
    if (b.mate && b.mate.code === a.code) return b.mate.why;
    if (a.nemesis && a.nemesis.code === b.code) return a.nemesis.why;
    if (b.nemesis && b.nemesis.code === a.code) return b.nemesis.why;
    if (score >= 70) return "气味高度兼容：一个甩锅一个接，配合得像写好的脚本。";
    if (score >= 45) return "勉强能合作，前提是 Code Review 不要互相开。";
    return "建议物理隔离：一起开会时请提前准备灭火器和会议纪要。";
  }
  function renderCompare(mine) {
    const box = $("#compare");
    if (!sharedType) { box.hidden = true; return; }
    const score = compatibility(mine, sharedType);
    box.hidden = false;
    box.innerHTML = `
      <div class="compare-head"><h3>你和朋友的馊味兼容度</h3><div class="compare-score">${score}%</div></div>
      <div class="compare-body">
        <div class="compare-side"><img src="${artPath(mine)}" alt="" /><b style="color:${mine.color}">${mine.code}</b><small>你 · ${escapeHtml(mine.name)}</small></div>
        <div class="compare-vs">VS</div>
        <div class="compare-side"><img src="${artPath(sharedType)}" alt="" /><b style="color:${sharedType.color}">${sharedType.code}</b><small>TA · ${escapeHtml(sharedType.name)}</small></div>
      </div>
      <p class="compare-text">${escapeHtml(compatibilityText(mine, sharedType, score))}</p>`;
  }

  // ---------- share + poster ----------
  $("#shareBtn").addEventListener("click", async () => {
    if (!currentResult) return;
    const { type } = currentResult;
    const url = shareUrl(type);
    const text = `我的程序员馊味人格是 ${type.code}「${type.name}」，出现率 ${rarityText(type)}。${type.tagline || ""}\n你是哪种馊？测完看看我们合不合：`;
    if (!url) {
      await copyText(`${text}\n（本地预览没有公网链接，部署后再分享）`).catch(() => {});
      toast("本地预览无法生成公网链接，已复制文案");
      return;
    }
    if (navigator.share && matchMedia("(pointer: coarse)").matches) {
      try { await navigator.share({ title: "SBIT 程序员馊味人格", text, url }); return; } catch (e) { if (e && e.name === "AbortError") return; }
    }
    copyText(`${text}\n${url}`).then(() => toast("挑战链接已复制，朋友打开能直接和你对比"), () => toast("复制失败，但馊味保留"));
  });

  $("#posterBtn").addEventListener("click", async () => {
    if (!currentResult) return;
    const { type, z, signature } = currentResult;
    const button = $("#posterBtn");
    button.disabled = true;
    button.textContent = "海报渲染中…";
    try {
      const url = shareUrl(type) || "scarea.github.io/sbti";
      const dataUrl = await window.SBIT_POSTER.drawPoster({
        type,
        rarity: rarityText(type),
        signature,
        radarValues: zToRadar(z),
        radarLabels: engine.DIMS.map((key) => DIM_LABELS[key]),
        url,
        artSrc: artPath(type)
      });
      openModal(`
        <div class="poster-modal">
          <img src="${dataUrl}" alt="${type.code} 分享海报" />
          <p>手机长按图片保存，电脑点下面下载。发群里看看谁跟你一个味。</p>
          <a class="cta" href="${dataUrl}" download="sbit-${type.code.toLowerCase()}.png">下载海报</a>
        </div>`, type.color);
    } catch (error) {
      toast(location.protocol === "file:" ? "file:// 下浏览器禁止导出图片，请用 start.command 启动本地服务" : "海报生成失败，再试一次");
    } finally {
      button.disabled = false;
      button.textContent = "生成分享海报";
    }
  });

  // ---------- mood ring ----------
  const moodLab = $(".mood-lab");
  let moodType = types[0];
  let moodSignature = "";
  function setMood(type, { lottery = false } = {}) {
    moodType = type;
    moodLab.style.setProperty("--type", type.color);
    $("#sigCode").textContent = type.code;
    $("#sigName").textContent = type.name;
    $("#sigRarity").textContent = `出现率 ${rarityText(type)}`;
    moodSignature = pickSignature(type, moodSignature);
    typeWrite($("#sigText"), moodSignature);
    $("#sigMeta").textContent = `${(signatures[type.code] || []).length} 条专属 + ${(signatures.GLOBAL || []).length} 条通用 · 共 ${totalSignatures} 条手写丧话`;
    if (lottery) toast(`今日人格：${type.code} ${type.name}`);
  }

  const ring = window.SBIT_RING.createRing({
    stage: $("#ringStage"),
    world: $("#ringWorld"),
    ring: $("#ring"),
    types,
    artPath,
    onChange(type) {
      const holoLabel = $("#ringHolo");
      holoLabel.querySelector("b").textContent = type.code;
      holoLabel.querySelector("span").textContent = type.name;
      $("#ringStage").style.setProperty("--type", type.color);
    },
    onSettle(type, index, card, lottery) {
      if (type !== moodType || lottery) setMood(type, { lottery });
      if (lottery) {
        $("#spinBtn").disabled = false;
        $("#spinBtn").textContent = "🎲 再抽一次";
        card.classList.remove("pop");
        void card.offsetWidth;
        card.classList.add("pop");
        const holoLabel = $("#ringHolo");
        holoLabel.classList.remove("flash");
        void holoLabel.offsetWidth;
        holoLabel.classList.add("flash");
        burst($("#ringStage"), [...type.code, "★", "✦", "💀", "{ }", "OK"], 44);
      }
    }
  });
  setMood(types[0]);
  $("#ringPrev").addEventListener("click", ring.prev);
  $("#ringNext").addEventListener("click", ring.next);
  $("#spinBtn").addEventListener("click", () => {
    if (ring.isSpinning()) return;
    $("#spinBtn").disabled = true;
    $("#spinBtn").textContent = "🎰 命运转动中…";
    ring.spin();
  });
  $("#sigReroll").addEventListener("click", () => {
    moodSignature = pickSignature(moodType, moodSignature);
    typeWrite($("#sigText"), moodSignature);
  });
  $("#sigCopy").addEventListener("click", () => copyText(moodSignature).then(() => toast("签名已复制"), () => toast("复制失败")));
  $("#sigDetail").addEventListener("click", () => openTypeModal(moodType));

  // ---------- easter eggs ----------
  let logoClicks = 0;
  function openEgg() {
    openModal(`<div class="egg-term">
      $ sudo rm -rf /okr /pua /meaningless-meetings<br/>
      rm: cannot remove '/okr': 社保仍在挂载中<br/>
      $ sudo kill -9 $(pgrep 加班)<br/>
      kill: 进程受 KPI 保护<br/>
      <br/>🏆 achievement unlocked: <b style="color:var(--acid)">摸鱼架构师</b><br/>
      你在一个人格测试网站上找彩蛋，这本身就说明了一切。</div>`);
  }
  $("#logo").addEventListener("click", (event) => {
    event.preventDefault();
    logoClicks += 1;
    if (logoClicks >= 5) { logoClicks = 0; openEgg(); } else toast(`彩蛋进度 ${logoClicks}/5`);
  });

  // ---------- keyboard ----------
  let typed = "";
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (!modal.hidden) return closeModal();
      if (!$("#quiz").hidden) return $("#quizClose").click();
    }
    if (!$("#quiz").hidden && modal.hidden) {
      const map = { 1: 0, 2: 1, 3: 2, 4: 3, a: 0, b: 1, c: 2, d: 3 };
      const pos = map[event.key.toLowerCase()];
      if (pos !== undefined && !event.metaKey && !event.ctrlKey) {
        const choiceIndex = quiz.order[quiz.index][pos];
        if (choiceIndex !== undefined) choose(choiceIndex);
      }
      if (event.key === "ArrowLeft") $("#quizBack").click();
      return;
    }
    if (event.key.length === 1) {
      typed = (typed + event.key.toLowerCase()).slice(-4);
      if (typed === "sudo") { typed = ""; openEgg(); }
    }
  });

  if (sharedType) toast("朋友给你发来了一份馊味报告");
})();
