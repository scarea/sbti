// Shared 3D helpers: pointer tilt with glare, scroll-in 3D reveal, draggable 3D cube.
(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  // Pointer tilt. Children with [data-depth] float at translateZ(depth px).
  function bindTilt(el, { max = 12, scale = 1.02 } = {}) {
    if (!el || el.dataset.tiltBound || reduceMotion) return;
    el.dataset.tiltBound = "1";
    let raf = null;
    let rx = 0;
    let ry = 0;
    let sx = 50;
    let sy = 50;
    function apply() {
      raf = null;
      el.style.setProperty("--rx", `${rx}deg`);
      el.style.setProperty("--ry", `${ry}deg`);
      el.style.setProperty("--gx", `${sx}%`);
      el.style.setProperty("--gy", `${sy}%`);
    }
    el.addEventListener("pointermove", (event) => {
      if (event.pointerType === "touch" && !el.dataset.tiltTouch) return;
      const rect = el.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      ry = (x - .5) * max * 2;
      rx = (.5 - y) * max * 2;
      sx = x * 100;
      sy = y * 100;
      el.classList.add("tilting");
      el.style.setProperty("--ts", scale);
      if (!raf) raf = requestAnimationFrame(apply);
    });
    el.addEventListener("pointerleave", () => {
      rx = 0; ry = 0; sx = 50; sy = 50;
      el.classList.remove("tilting");
      el.style.setProperty("--ts", 1);
      if (!raf) raf = requestAnimationFrame(apply);
    });
  }

  function bindTiltAll(root = document, selector = ".tilt") {
    root.querySelectorAll(selector).forEach((el) => bindTilt(el, {
      max: Number(el.dataset.tiltMax || 10),
      scale: Number(el.dataset.tiltScale || 1.02)
    }));
  }

  // Elements with .r3d flip up into place when they scroll into view.
  function bindReveal(root = document) {
    const items = root.querySelectorAll(".r3d:not(.r3d-in)");
    if (!("IntersectionObserver" in window) || reduceMotion) {
      items.forEach((el) => el.classList.add("r3d-in"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("r3d-in");
        io.unobserve(entry.target);
      });
    }, { threshold: .12, rootMargin: "0px 0px -6% 0px" });
    items.forEach((el, i) => {
      el.style.setProperty("--d", `${(i % 8) * 50}ms`);
      io.observe(el);
    });
  }

  // Draggable cube with inertia and idle auto-rotation.
  function createCube({ stage, cube, onFaceClick }) {
    let rx = -18;
    let ry = 30;
    let vx = 0;
    let vy = .18;
    let dragging = false;
    let moved = false;
    let lastX = 0;
    let lastY = 0;
    let visible = true;
    let raf = null;
    let idleAt = performance.now();

    function frame() {
      raf = null;
      if (!visible || document.hidden) return;
      if (!dragging) {
        ry += vy;
        rx += vx;
        vx *= .94;
        vy *= .96;
        const idle = performance.now() - idleAt > 1600;
        if (idle && !reduceMotion) {
          vy += (.22 - vy) * .02;          // drift back to gentle spin
          rx += (-18 - rx) * .02;          // level out
        }
      }
      rx = Math.max(-70, Math.min(70, rx));
      cube.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
      raf = requestAnimationFrame(frame);
    }
    function wake() { if (!raf) raf = requestAnimationFrame(frame); }

    stage.addEventListener("pointerdown", (event) => {
      dragging = true;
      moved = false;
      lastX = event.clientX;
      lastY = event.clientY;
      stage.setPointerCapture(event.pointerId);
      stage.classList.add("dragging");
    });
    stage.addEventListener("pointermove", (event) => {
      if (!dragging) return;
      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      if (Math.abs(dx) + Math.abs(dy) > 4) moved = true;
      ry += dx * .45;
      rx -= dy * .45;
      vy = dx * .45;
      vx = -dy * .45;
      lastX = event.clientX;
      lastY = event.clientY;
    });
    function end(event) {
      if (!dragging) return;
      dragging = false;
      idleAt = performance.now();
      stage.classList.remove("dragging");
      if (!moved && onFaceClick) {
        const el = document.elementFromPoint(event.clientX, event.clientY);
        const face = el && el.closest("[data-code]");
        if (face) onFaceClick(face.dataset.code);
      }
    }
    stage.addEventListener("pointerup", end);
    stage.addEventListener("pointercancel", end);
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) wake(); }).observe(stage);
    }
    document.addEventListener("visibilitychange", wake);
    cube.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
    wake();
  }

  window.SBIT_FX = { bindTilt, bindTiltAll, bindReveal, createCube, reduceMotion, finePointer };
})();
