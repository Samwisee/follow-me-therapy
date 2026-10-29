// Smooth reflow: when the window is resized and a chip, card, button, menu
// link or a word of a heading jumps to a new row, it glides there instead
// of snapping (a FLIP animation, using the motion tokens). Small, steady
// shifts while dragging the window just happen; only jumps animate.
// Nothing moves under prefers-reduced-motion. Shared by every page.
(() => {
  if (!("animate" in Element.prototype)) return;
  const still = matchMedia("(prefers-reduced-motion: reduce)");
  const css = getComputedStyle(document.documentElement);
  const token = (n, f) => css.getPropertyValue(n).trim() || f;
  const ms = (v) => (v.endsWith("ms") ? parseFloat(v) : parseFloat(v) * 1000);
  const DUR = ms(token("--dur-slow", "400ms"));
  const EASE = token("--ease-out", "ease-out");
  const JUMP = 10; // px: anything smaller is ordinary resizing

  // Things that sit in rows and can wrap.
  const BLOCKS = [
    ".facts > li", ".chips > li", ".modal-chips > li", ".flags > img", ".hero-actions > *",
    ".title-container > *", ".services-grid > *", ".svc-grid > *", ".funding-grid > *", ".fund-grid > *",
    ".cards > *", ".contact-actions > *", ".contact-direct > *", ".steps > li", ".steps-row > li",
    ".foot-explore > li", ".foot-links > li", ".creds > li", ".fixed-header > a", ".head-left > *",
    ".th-title > *", ".flex-container > *",
  ].join(",");
  // Short display text whose words can move between lines.
  const WORDS = [".site-title", ".content-section h2", ".band > .wrap > h2", ".hero h1", ".about-content .lead",
    ".large-italic-centered", ".cta-text", ".tap-hint", ".contact-lead", ".brand span"].join(",");

  // Wrap each word of the display text in its own inline-block span (the
  // spaces stay as text, so line breaking is unchanged).
  const splitWords = (el) => {
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3 && n.textContent.trim()) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) frag.append(part);
            else {
              const w = document.createElement("span");
              w.className = "rw";
              w.textContent = part;
              frag.append(w);
            }
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && !n.matches("svg, .sr-only, .rw")) walk(n);
      });
    };
    walk(el);
  };

  // Where each sits relative to its parent (so scrolling and whole-section
  // moves don't count), minus any glide still running.
  let items = [];
  const collect = () => {
    document.querySelectorAll(WORDS).forEach((el) => {
      if (!el.dataset.rw) { el.dataset.rw = "1"; splitWords(el); }
    });
    items = [...document.querySelectorAll(BLOCKS + ", .rw")].map((el) => ({ el, x: null, y: null, anim: null }));
  };
  const shift = (el) => {
    const tr = getComputedStyle(el).translate;
    if (!tr || tr === "none") return [0, 0];
    const [x, y = "0px"] = tr.split(" ");
    return [parseFloat(x) || 0, parseFloat(y) || 0];
  };
  const where = (el) => {
    const a = el.getBoundingClientRect();
    const b = el.parentElement.getBoundingClientRect();
    const [dx, dy] = shift(el);
    return { x: a.left - b.left - dx, y: a.top - b.top - dy };
  };
  const measure = () => items.forEach((it) => { const w = where(it.el); it.x = w.x; it.y = w.y; });

  const settle = () => {
    items.forEach((it) => {
      if (!it.el.isConnected) return;
      const now = where(it.el);
      const dx = it.x - now.x, dy = it.y - now.y;
      it.x = now.x; it.y = now.y;
      if (still.matches || (Math.abs(dx) < JUMP && Math.abs(dy) < JUMP)) return;
      // Carry on from wherever a running glide had got to.
      let fromX = dx, fromY = dy;
      const run = it.el.getAnimations().find((x) => x.id === "reflow");
      if (run) {
        const [cx, cy] = shift(it.el);
        fromX += cx; fromY += cy;
        run.cancel();
      }
      const a = it.el.animate([{ translate: `${fromX}px ${fromY}px` }, { translate: "0 0" }], { duration: DUR, easing: EASE });
      a.id = "reflow";
    });
  };

  let queued = false;
  const onResize = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; settle(); });
  };
  const start = () => {
    collect();
    measure();
    addEventListener("resize", onResize);
  };
  const ready = document.fonts ? document.fonts.ready : Promise.resolve();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => ready.then(start));
  else ready.then(start);
})();

// Tap hints on touch screens: phones can't hover, so the first time a
// tappable card, chip or button scrolls well into view it gives a small
// lift and tilt (the same move as its hover), one after another in a group.
// Once per element; nothing under prefers-reduced-motion.
(() => {
  if (!("IntersectionObserver" in window) || !("animate" in Element.prototype)) return;
  const touch = matchMedia("(hover: none)");
  const still = matchMedia("(prefers-reduced-motion: reduce)");
  const css = getComputedStyle(document.documentElement);
  const token = (n, f) => css.getPropertyValue(n).trim() || f;
  const ms = (v) => (v.endsWith("ms") ? parseFloat(v) : parseFloat(v) * 1000);
  const DUR = ms(token("--dur-slower", "600ms"));
  const EASE = token("--ease-spring", "ease-out");
  const LIFT = token("--space-2", "8px");
  const TARGETS = ".service-item, .funding-card, .facts > li, .contact-tile, .book-note, .info-note:has(a[href]), .contact-card > a, .section-cta > a, .book-row > a, .hero-actions > a";
  const start = () => {
    if (!touch.matches || still.matches) return;
    const io = new IntersectionObserver((entries) => {
      entries.filter((e) => e.isIntersecting).forEach((e) => {
        const el = e.target;
        io.unobserve(el);
        const group = [...el.parentElement.children].filter((c) => c.matches(TARGETS));
        const i = Math.max(0, group.indexOf(el));
        el.animate(
          [
            { translate: "0 0", rotate: "0deg" },
            { translate: `0 calc(-1 * ${LIFT})`, rotate: i % 2 ? "1.5deg" : "-1.5deg", offset: 0.45 },
            { translate: "0 0", rotate: "0deg" },
          ],
          { duration: DUR, easing: EASE, delay: 450 + i * 110 }
        );
      });
    }, { threshold: 0.6 });
    document.querySelectorAll(TARGETS).forEach((el) => io.observe(el));
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
