// 3D blind-box: a foil pack that bursts into 5 face-down cards; flip each one. Odds follow simulated rarity.
(function () {
  const PACK_SIZE = 5;

  function createGacha({ stage, pack, cardsEl, types, weights, tierOf, artPath, onFlip, onDone }) {
    let busy = false;
    let flipped = 0;
    let drawn = [];

    function weightedPick(pool) {
      const total = pool.reduce((sum, type) => sum + weights[type.code], 0);
      let r = Math.random() * total;
      for (const type of pool) {
        r -= weights[type.code];
        if (r <= 0) return type;
      }
      return pool[pool.length - 1];
    }

    function draw() {
      const result = [];
      for (let i = 0; i < PACK_SIZE; i += 1) result.push(weightedPick(types));
      // Pity: if nothing above R, upgrade the last card to an SR-or-better type.
      if (!result.some((type) => ["SR", "SSR", "UR"].includes(tierOf(type).key))) {
        const rare = types.filter((type) => ["SR", "SSR", "UR"].includes(tierOf(type).key));
        if (rare.length) result[PACK_SIZE - 1] = weightedPick(rare);
      }
      return result;
    }

    function slots(count) {
      const width = stage.clientWidth;
      const narrow = width < 620;
      const cw = narrow ? Math.min(118, width / 3.4) : Math.min(170, width / 6.2);
      stage.style.setProperty("--gcw", `${Math.round(cw)}px`);
      return Array.from({ length: count }, (_, i) => {
        if (narrow) {
          const row = i < 3 ? 0 : 1;
          const col = row === 0 ? i - 1 : (i - 3) - .5;
          return { x: col * cw * 1.08, y: (row - .5) * cw * 1.2, z: 0, ry: col * -6, rz: col * 2 };
        }
        const c = i - (count - 1) / 2;
        return { x: c * cw * 1.08, y: Math.abs(c) * 14, z: -Math.abs(c) * 40, ry: c * -10, rz: c * 3 };
      });
    }

    function render() {
      const pos = slots(drawn.length);
      cardsEl.innerHTML = drawn.map((type, i) => {
        const tier = tierOf(type);
        return `
        <button class="gcard tier-${tier.key}" type="button" data-i="${i}" style="--c:${type.color};--tc:${tier.color};--x:${pos[i].x}px;--y:${pos[i].y}px;--z:${pos[i].z}px;--gry:${pos[i].ry}deg;--grz:${pos[i].rz}deg;--delay:${i * 90}ms" aria-label="翻开第 ${i + 1} 张">
          <span class="gcard-inner">
            <span class="gcard-back"><b>SBIT</b><i>?</i></span>
            <span class="gcard-front">
              <img src="${artPath(type)}" alt="${type.code} ${type.name}" draggable="false" />
              <span class="gcard-tier">${tier.key}</span>
              <span class="gcard-code">${type.code}</span>
            </span>
          </span>
        </button>`;
      }).join("");
      requestAnimationFrame(() => requestAnimationFrame(() => {
        cardsEl.querySelectorAll(".gcard").forEach((card) => card.classList.add("dealt"));
      }));
    }

    function flip(card) {
      if (!card || card.classList.contains("flipped") || !card.classList.contains("dealt")) return;
      const type = drawn[Number(card.dataset.i)];
      const tier = tierOf(type);
      card.classList.add("flipping");
      // Rarer cards make you wait a little longer.
      const suspense = { N: 0, R: 120, SR: 380, SSR: 700, UR: 1000 }[tier.key] || 0;
      setTimeout(() => {
        card.classList.remove("flipping");
        card.classList.add("flipped");
        flipped += 1;
        onFlip && onFlip(type, tier, card);
        if (flipped === drawn.length) {
          busy = false;
          stage.classList.remove("opened-busy");
          onDone && onDone(drawn);
        }
      }, suspense);
    }

    cardsEl.addEventListener("click", (event) => flip(event.target.closest(".gcard")));

    function open() {
      if (busy) return false;
      busy = true;
      flipped = 0;
      drawn = draw();
      cardsEl.innerHTML = "";
      stage.classList.remove("opened");
      pack.classList.remove("burst");
      void pack.offsetWidth;
      pack.classList.add("shake");
      stage.classList.add("opened-busy");
      setTimeout(() => {
        pack.classList.remove("shake");
        pack.classList.add("burst");
        stage.classList.add("opened");
        render();
      }, 700);
      return true;
    }

    function flipAll() {
      cardsEl.querySelectorAll(".gcard:not(.flipped)").forEach((card, i) => setTimeout(() => flip(card), i * 160));
    }

    function reset() {
      if (busy && flipped < drawn.length) return;
      busy = false;
      stage.classList.remove("opened");
      pack.classList.remove("burst");
      cardsEl.innerHTML = "";
    }

    window.addEventListener("resize", () => {
      if (!drawn.length || !cardsEl.children.length) return;
      const pos = slots(drawn.length);
      [...cardsEl.children].forEach((card, i) => {
        card.style.setProperty("--x", `${pos[i].x}px`);
        card.style.setProperty("--y", `${pos[i].y}px`);
        card.style.setProperty("--z", `${pos[i].z}px`);
      });
    }, { passive: true });

    return { open, flipAll, reset, isBusy: () => busy };
  }

  window.SBIT_GACHA = { createGacha };
})();
