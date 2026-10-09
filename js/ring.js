// 3D mood ring: drag with inertia, snap to nearest card, idle drift, random "lottery" spin.
(function () {
  function createRing({ stage, world, ring, types, artPath, onChange, onSettle }) {
    const count = types.length;
    const step = 360 / count;
    let angle = 0;
    let velocity = 0;
    let target = null;        // absolute angle we are easing to (snap / lottery)
    let dragging = false;
    let lastX = 0;
    let lastT = 0;
    let downX = 0;
    let moved = false;
    let activeIndex = -1;
    let spinning = false;
    let spinAnim = null;
    let visible = true;
    let raf = null;
    let cards = [];

    ring.innerHTML = types.map((type, index) => `
      <div class="ring-card" data-index="${index}" style="--c:${type.color}">
        <div class="ring-face"><img src="${artPath(type)}" alt="${type.code} ${type.name}" draggable="false" loading="lazy" /><span>${type.code}</span></div>
        <div class="ring-back">SBIT</div>
      </div>`).join("");
    cards = [...ring.querySelectorAll(".ring-card")];

    function measure() {
      const width = stage.clientWidth;
      const cw = Math.round(Math.max(92, Math.min(170, width * .17)));
      const ch = Math.round(cw * 392 / 418);
      const radius = Math.round(Math.max(cw * 2.75, Math.min(width * .5, cw * 3.3)));
      stage.style.setProperty("--cw", `${cw}px`);
      stage.style.setProperty("--ch", `${ch}px`);
      stage.style.setProperty("--fr", `${radius + cw * .7}px`);
      cards.forEach((card, index) => {
        card.style.transform = `rotateY(${index * step}deg) translateZ(${radius}px)`;
      });
      world.style.transform = `rotateX(var(--tilt)) rotateZ(var(--roll, 0deg)) translateZ(${-radius * .35}px)`;
    }

    const frontIndex = () => ((Math.round(-angle / step) % count) + count) % count;

    function render() {
      ring.style.transform = `rotateY(${angle}deg)`;
      const index = frontIndex();
      if (index !== activeIndex) {
        if (cards[activeIndex]) cards[activeIndex].classList.remove("active");
        activeIndex = index;
        cards[index].classList.add("active");
        onChange && onChange(types[index], index);
      }
      // Holographic sheen shifts as each card swings past the viewer.
      const sheen = ((angle % 360) + 360) % 360 / 3.6;
      ring.style.setProperty("--sheen", `${sheen}%`);
      stage.style.setProperty("--roll", `${Math.max(-4, Math.min(4, velocity * .9))}deg`);
    }

    function snapTarget() {
      return -Math.round(-angle / step) * step;
    }

    function tick() {
      raf = null;
      if (!visible) return;
      if (spinAnim) {
        const t = Math.min(1, (performance.now() - spinAnim.start) / spinAnim.duration);
        const eased = 1 - Math.pow(1 - t, 4);
        const next = spinAnim.from + (spinAnim.to - spinAnim.from) * eased;
        velocity = next - angle;
        angle = next;
        if (t >= 1) {
          spinAnim = null;
          spinning = false;
          velocity = 0;
          render();
          onSettle && onSettle(types[frontIndex()], frontIndex(), cards[frontIndex()], true);
          return;
        }
      } else if (!dragging) {
        if (target === null && Math.abs(velocity) < .35) target = snapTarget();
        if (target !== null) {
          const diff = target - angle;
          velocity += diff * .05;
          velocity *= .8;
          if (Math.abs(diff) < .05 && Math.abs(velocity) < .02) {
            angle = target;
            velocity = 0;
            target = null;
            render();
            onSettle && onSettle(types[frontIndex()], frontIndex(), cards[frontIndex()], false);
            return; // settled: stop the loop until the next interaction
          }
        } else {
          velocity *= .95; // coasting after a flick
        }
        angle += velocity;
      }
      render();
      raf = requestAnimationFrame(tick);
    }

    function wake() {
      if (!raf && visible) raf = requestAnimationFrame(tick);
    }

    function goTo(index, { spin = false } = {}) {
      const base = -index * step;
      const diff = ((base - angle) % 360 + 540) % 360 - 180;
      if (spin) {
        const dir = Math.random() > .5 ? 1 : -1;
        const laps = 3 + Math.floor(Math.random() * 3);
        target = null;
        spinAnim = { from: angle, to: angle + diff + dir * laps * 360, start: performance.now(), duration: 4200 + laps * 150 };
        spinning = true;
      } else {
        target = angle + diff;
      }
      wake();
    }

    stage.addEventListener("pointerdown", (event) => {
      if (event.target.closest(".ring-nav") || spinning) return;
      dragging = true;
      moved = false;
      target = null;
      downX = lastX = event.clientX;
      lastT = performance.now();
      velocity = 0;
      stage.classList.add("dragging");
      stage.setPointerCapture(event.pointerId);
      wake();
    });
    stage.addEventListener("pointermove", (event) => {
      if (!dragging) return;
      const now = performance.now();
      const dx = event.clientX - lastX;
      if (Math.abs(event.clientX - downX) > 6) moved = true;
      const delta = dx * (360 / (stage.clientWidth * 1.6));
      angle += delta;
      velocity = delta / Math.max(1, now - lastT) * 16;
      lastX = event.clientX;
      lastT = now;
    });
    function endDrag(event) {
      if (!dragging) return;
      dragging = false;
      stage.classList.remove("dragging");
      velocity = Math.max(-14, Math.min(14, velocity));
      if (!moved) {
        // Treat as a click: pick the card under the pointer.
        const el = document.elementFromPoint(event.clientX, event.clientY);
        const card = el && el.closest(".ring-card");
        if (card) goTo(Number(card.dataset.index));
      }
    }
    stage.addEventListener("pointerup", endDrag);
    stage.addEventListener("pointercancel", endDrag);
    stage.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") { event.preventDefault(); goTo((activeIndex - 1 + count) % count); }
      if (event.key === "ArrowRight") { event.preventDefault(); goTo((activeIndex + 1) % count); }
    });

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible) wake();
      }).observe(stage);
    }
    window.addEventListener("resize", measure, { passive: true });

    measure();
    render();
    wake();

    return {
      next: () => goTo((activeIndex + 1) % count),
      prev: () => goTo((activeIndex - 1 + count) % count),
      goTo,
      spin: () => goTo(Math.floor(Math.random() * count), { spin: true }),
      isSpinning: () => spinning
    };
  }

  window.SBIT_RING = { createRing };
})();
