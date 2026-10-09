// SBIT scoring engine. Shared by the page (window.SBIT_ENGINE) and scripts/calibrate.mjs (module.exports).
(function (root) {
  const DIMS = ["M", "L", "Z", "S", "D", "J", "F", "R", "A"]; // A = AI 依赖

  // Seeded PRNG so rarity numbers are stable across page loads.
  function mulberry32(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function emptyVector() {
    return Object.fromEntries(DIMS.map((key) => [key, 0]));
  }

  // Expected value and variance of each dimension for one question if answered at random.
  function questionStats(question) {
    const mean = emptyVector();
    const variance = emptyVector();
    DIMS.forEach((key) => {
      const values = question.choices.map((choice) => choice.score[key] || 0);
      const m = values.reduce((a, b) => a + b, 0) / values.length;
      mean[key] = m;
      variance[key] = values.reduce((a, b) => a + (b - m) ** 2, 0) / values.length;
    });
    return { mean, variance };
  }

  // Turn raw answers into a z-score-like vector: how far each dimension sits from random answering.
  function scoreVector(questions, answers) {
    const raw = emptyVector();
    const mean = emptyVector();
    const variance = emptyVector();
    questions.forEach((question, index) => {
      const answer = answers[index];
      if (answer === null || answer === undefined) return;
      const stats = question._stats || (question._stats = questionStats(question));
      const score = question.choices[answer].score;
      DIMS.forEach((key) => {
        raw[key] += score[key] || 0;
        mean[key] += stats.mean[key];
        variance[key] += stats.variance[key];
      });
    });
    const z = emptyVector();
    DIMS.forEach((key) => { z[key] = variance[key] > 0 ? (raw[key] - mean[key]) / Math.sqrt(variance[key]) : 0; });
    return { raw, z };
  }

  function profileVector(type) {
    const values = DIMS.map((key) => type.weights[key] || 0);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const centered = values.map((v) => v - avg);
    const norm = Math.sqrt(centered.reduce((a, b) => a + b * b, 0)) || 1;
    return centered.map((v) => v / norm);
  }

  function rank(types, z) {
    const vec = DIMS.map((key) => z[key]);
    const norm = Math.sqrt(vec.reduce((a, b) => a + b * b, 0)) || 1;
    return types.map((type) => {
      const profile = type._profile || (type._profile = profileVector(type));
      const cos = profile.reduce((sum, p, i) => sum + p * vec[i], 0) / norm;
      return { type, cos, score: cos + (type.bias || 0) };
    }).sort((a, b) => b.score - a.score);
  }

  // Softmax-ish match percentages for the top N, for display.
  function matchPercents(ranked, top = 3) {
    const slice = ranked.slice(0, top);
    const exps = slice.map((item) => Math.exp(item.score * 6));
    const total = exps.reduce((a, b) => a + b, 0) || 1;
    return slice.map((item, i) => ({ type: item.type, pct: Math.round(exps[i] / total * 100) }));
  }

  function sampleIndexes(length, count, rand) {
    const idx = Array.from({ length }, (_, i) => i);
    for (let i = idx.length - 1; i > 0; i -= 1) {
      const j = Math.floor(rand() * (i + 1));
      [idx[i], idx[j]] = [idx[j], idx[i]];
    }
    return idx.slice(0, Math.min(count, length));
  }

  // Monte-Carlo distribution of results under random answering.
  function simulate(bank, types, { runs = 20000, sample = 12, seed = 20261009 } = {}) {
    const rand = mulberry32(seed);
    const counts = Object.fromEntries(types.map((t) => [t.code, 0]));
    for (let n = 0; n < runs; n += 1) {
      const qs = sampleIndexes(bank.length, sample, rand).map((i) => bank[i]);
      const answers = qs.map((q) => Math.floor(rand() * q.choices.length));
      const { z } = scoreVector(qs, answers);
      counts[rank(types, z)[0].type.code] += 1;
    }
    return Object.fromEntries(types.map((t) => [t.code, counts[t.code] / runs * 100]));
  }

  const api = { DIMS, mulberry32, scoreVector, rank, matchPercents, simulate, sampleIndexes };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.SBIT_ENGINE = api;
})(typeof window !== "undefined" ? window : globalThis);
