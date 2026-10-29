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
// tappable card, chip or tile scrolls well into view, a part of it moves to
// say "tap me", each kind its own way. Buttons already look tappable, so they
// don't. Once per element, one after another in a row; nothing under
// prefers-reduced-motion.
(() => {
  if (!("IntersectionObserver" in window) || !("animate" in Element.prototype)) return;
  const touch = matchMedia("(hover: none)");
  const still = matchMedia("(prefers-reduced-motion: reduce)");
  const css = getComputedStyle(document.documentElement);
  const token = (n, f) => css.getPropertyValue(n).trim() || f;
  const ms = (v) => (v.endsWith("ms") ? parseFloat(v) : parseFloat(v) * 1000);
  const SLOW = ms(token("--dur-slower", "600ms"));
  const ENT = ms(token("--dur-entrance", "900ms"));
  const SPRING = token("--ease-spring", "ease-out");
  const SWAY = token("--ease-in-out", "ease-in-out");
  const S1 = token("--space-1", "4px");

  // Each kind of tappable thing and its hint.
  const HINTS = [
    // Service cards: the icon tile tilts and grows, as on hover, and the
    // "Learn more" chevron steps forward twice.
    [".service-item", (el, delay) => {
      el.querySelector(".svc-icon")?.animate(
        [{ rotate: "0deg", scale: "1" }, { rotate: "-8deg", scale: "1.08", offset: 0.4 }, { rotate: "0deg", scale: "1" }],
        { duration: SLOW, easing: SPRING, delay });
      el.querySelector(".more .chev")?.animate(
        [{ translate: "0 0" }, { translate: `${S1} 0` }, { translate: "0 0" }, { translate: `${S1} 0` }, { translate: "0 0" }],
        { duration: ENT, easing: SWAY, delay: delay + 150 });
    }],
    // Funding cards: the tile gives a springy press, like a key being pushed.
    [".funding-card", (el, delay) => {
      el.querySelector(".svc-icon")?.animate(
        [{ scale: "1" }, { scale: "0.9", offset: 0.3 }, { scale: "1.06", offset: 0.65 }, { scale: "1" }],
        { duration: SLOW, easing: SPRING, delay });
    }],
    // Hero chips: the outline brightens to the chip's own strong colour and
    // fades back, with a small swell.
    [".facts > li", (el, delay) => {
      const strong = el.classList.contains("fact-tele") ? token("--teal", "teal")
        : el.classList.contains("fact-place") ? token("--sun-deep", "orange") : token("--purple", "purple");
      const rest = getComputedStyle(el).borderColor;
      el.animate(
        [{ borderColor: rest, scale: "1" }, { borderColor: strong, scale: "1.04", offset: 0.4 }, { borderColor: rest, scale: "1" }],
        { duration: ENT, easing: SWAY, delay });
    }],
    // Phone and email: the phone rings (a quick shake); the envelope hops.
    [".contact-tile", (el, delay) => {
      const icon = el.querySelector(".ct-icon svg");
      if (!icon) return;
      const ring = el.getAttribute("href")?.startsWith("tel:");
      icon.animate(ring
        ? [{ rotate: "0deg" }, { rotate: "-14deg" }, { rotate: "12deg" }, { rotate: "-10deg" }, { rotate: "8deg" }, { rotate: "0deg" }]
        : [{ translate: "0 0" }, { translate: `0 calc(-1 * ${S1})`, offset: 0.35 }, { translate: "0 0", offset: 0.6 }, { translate: `0 calc(-0.5 * ${S1})`, offset: 0.8 }, { translate: "0 0" }],
        { duration: SLOW, easing: SWAY, delay });
    }],
    // The booking chip and the privacy note: the chevron nudges along.
    [".info-note:has(a[href]), .book-note", (el, delay) => {
      const icon = el.querySelector(".chev") || el.querySelector(".book-note svg");
      if (icon) {
        icon.animate(
          [{ translate: "0 0" }, { translate: `${S1} 0` }, { translate: "0 0" }, { translate: `${S1} 0` }, { translate: "0 0" }],
          { duration: ENT, easing: SWAY, delay });
        return;
      }
      // A research note ("Read the review"): its outline brightens and fades.
      const look = getComputedStyle(el);
      el.animate(
        [{ borderColor: look.borderColor }, { borderColor: look.getPropertyValue("--note-ink").trim() || look.borderColor, offset: 0.4 }, { borderColor: look.borderColor }],
        { duration: ENT, easing: SWAY, delay });
    }],
  ];
  const start = () => {
    if (!touch.matches || still.matches) return;
    const io = new IntersectionObserver((entries) => {
      entries.filter((e) => e.isIntersecting).forEach((e) => {
        const el = e.target;
        io.unobserve(el);
        const hint = HINTS.find(([sel]) => el.matches(sel));
        const group = [...el.parentElement.children].filter((c) => c.matches(hint[0]));
        hint[1](el, 450 + Math.max(0, group.indexOf(el)) * 120);
      });
    }, { threshold: 0.6 });
    HINTS.forEach(([sel]) => document.querySelectorAll(sel).forEach((el) => io.observe(el)));
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
