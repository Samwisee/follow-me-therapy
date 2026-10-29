// Shared behaviour for Follow Me Therapy's inner pages:
// clickable service and funding cards, the details pop-up,
// footstep trails between steps, and entrance animations.
document.documentElement.classList.add("js");
// Back: return to the page you came from on this site; otherwise home.
document.addEventListener("click", function (e) {
  var back = e.target.closest && e.target.closest("[data-back]");
  if (!back) return;
  var fromHere = document.referrer && document.referrer.indexOf(location.origin) === 0;
  if (fromHere && history.length > 1) {
    e.preventDefault();
    history.back();
  }
});
document.addEventListener("DOMContentLoaded", function () {
  // Links that open a new tab say so to screen readers.
  const markNewTab = (root) =>
    root.querySelectorAll('a[target="_blank"]:not([data-newtab])').forEach((a) => {
      a.setAttribute("data-newtab", "");
      a.insertAdjacentHTML("beforeend", '<span class="sr-only"> (opens in a new tab)</span>');
    });
  markNewTab(document);
  new MutationObserver(() => markNewTab(document)).observe(document.body, { childList: true, subtree: true });
        const serviceDetails = {
          pediatric: {
            title: "5 Steps Forward", tag: "5 sessions",
            content:
              "<p class='modal-lead'>A short, focused program of 5 sessions with targeted support.</p><p class='list-label'>Ideal for:</p><ul class='checklist'><li>Returning families who need a boost</li><li>Families trying OT for the first time</li></ul><div class='modal-links'><a class='modal-link' href='telehealth-occupational-therapy.html'><span>Telehealth OT</span><svg viewBox='0 0 24 24' aria-hidden='true'><path d='M9 5l7 7-7 7'/></svg></a><a class='modal-link' href='occupational-therapy-north-western-melbourne.html'><span>OT in North-Western Melbourne</span><svg viewBox='0 0 24 24' aria-hidden='true'><path d='M9 5l7 7-7 7'/></svg></a></div>",
          },
          adult: {
            title: "Steady Steps", tag: "12 sessions",
            content:
              "<p class='modal-lead'>A 12-session block of structured, consistent support to work on big goals and build new skills.</p><ul class='checklist'><li>Time to involve your child’s wider network</li><li>A full plan of action, put together with you</li><li>Blocks can be stacked if more support is needed</li></ul><div class='modal-links'><a class='modal-link' href='telehealth-occupational-therapy.html'><span>Telehealth OT</span><svg viewBox='0 0 24 24' aria-hidden='true'><path d='M9 5l7 7-7 7'/></svg></a><a class='modal-link' href='occupational-therapy-north-western-melbourne.html'><span>OT in North-Western Melbourne</span><svg viewBox='0 0 24 24' aria-hidden='true'><path d='M9 5l7 7-7 7'/></svg></a></div>",
          },
          home: {
            title: "Early Start Denver Model (ESDM)", tag: "Up to age 5",
            content:
              "<p>An evidence-based, play-based approach for children up to 5 with autism or other developmental delays, developed by the UC Davis MIND Institute.</p><p>It supports communication, social skills, play, daily living and thinking skills. Delivered by an ESDM-certified therapist, it includes:</p><ul class='checklist'><li>1:1 sessions at home or in the community</li><li>An individualised learning program</li><li>Coaching for the people who support your child every day</li></ul><p class='modal-note'>I’ll check whether ESDM suits your child at the initial assessment.</p><div class='modal-links'><a class='modal-link' href='esdm-melbourne.html'><span>ESDM in Melbourne</span><svg viewBox='0 0 24 24' aria-hidden='true'><path d='M9 5l7 7-7 7'/></svg></a></div>",
          },
          assessments: {
            title: "Assessments", tag: "Reports",
            content:
              "<ul class='checklist'><li>NDIS Access Report</li><li>Functional Capacity Assessment (FCA)</li><li>Progress Report</li><li>Sensory Processing Assessment</li><li>Assistive Technology (AT)</li></ul><p class='modal-note'>Whether AT goals are suitable is reviewed at the initial assessment.</p><div class='modal-links'><a class='modal-link' href='ndis-occupational-therapy.html'><span>NDIS OT</span><svg viewBox='0 0 24 24' aria-hidden='true'><path d='M9 5l7 7-7 7'/></svg></a><a class='modal-link is-external' href='https://www.ndis.gov.au/participants/home-equipment-and-supports/assistive-technology-explained' target='_blank' rel='noopener'><span>NDIS: assistive technology explained</span><svg viewBox='0 0 24 24' aria-hidden='true'><path d='M14 4h6v6'/><path d='M20 4l-9 9'/><path d='M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4'/></svg></a></div>",
          },
        };
        const fundingDetails = {
          ndis: {
            title: "NDIS", tag: "Self or plan-managed",
            content:
              "<ul class='checklist'><li>I support self-managed and plan-managed NDIS participants.</li><li>Bring your plan goals to the initial assessment and I’ll build therapy around them.</li><li>I can write reports for plan reviews and NDIS access requests.</li></ul><p class='modal-note'>I’m not NDIS-registered, so I can’t claim from NDIA-managed plans. If yours is, you can ask the NDIA to switch to plan management, and I’m happy to talk you through it.</p><div class='modal-links'><a class='modal-link' href='ndis-occupational-therapy.html'><span>NDIS OT</span><svg viewBox='0 0 24 24' aria-hidden='true'><path d='M9 5l7 7-7 7'/></svg></a><a class='modal-link is-external' href='https://www.ndis.gov.au/how-apply-ndis/what-access-request-form' target='_blank' rel='noopener'><span>NDIS: applying for the NDIS</span><svg viewBox='0 0 24 24' aria-hidden='true'><path d='M14 4h6v6'/><path d='M20 4l-9 9'/><path d='M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4'/></svg></a></div>",
          },
          medicare: {
            title: "Medicare", tag: "With a GP plan",
            content:
              "<ul class='checklist'><li><b>Chronic condition plan:</b> your GP can write a plan that gives Medicare rebates for up to 5 allied health sessions a year.</li><li><b>Neurodevelopmental plan:</b> children and young people under 25 with an eligible diagnosis, such as autism, may access up to 20 sessions through a referral from a paediatrician or psychiatrist.</li></ul><p class='modal-note'>Not sure if you’re eligible? Ask me or your doctor.</p><div class='modal-links'><a class='modal-link' href='https://follow-me-therapy.splose.com/public-form/e84c8756-615f-4404-a6f3-a90f3760223b' target='_blank' rel='noopener'><span>Ask me about eligibility</span><svg viewBox='0 0 24 24' aria-hidden='true'><path d='M9 5l7 7-7 7'/></svg></a><a class='modal-link is-external' href='https://www.servicesaustralia.gov.au/services-available-under-gp-chronic-condition-management-plan' target='_blank' rel='noopener'><span>Services Australia: GP chronic condition plans</span><svg viewBox='0 0 24 24' aria-hidden='true'><path d='M14 4h6v6'/><path d='M20 4l-9 9'/><path d='M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4'/></svg></a></div>",
          },
          private: {
            title: "Private", tag: "No referral needed",
            content:
              "<ul class='checklist'><li>No plan or referral needed to get started.</li><li>Short programs or long-term support, whatever suits your family.</li><li>If your private health extras cover includes OT, you may be able to claim a rebate. Check with your fund.</li></ul>",
          },
        };

  const modal = document.getElementById("detailModal");
  const body = document.getElementById("detailBody");
  let lastFocus = null;
  // A pop-up's header: the card's own icon on a tint of its colour, a
  // short tag and the title. The pop-up takes the card's colour too.
  const open = (d, card) => {
    lastFocus = document.activeElement;
    const icon = card && card.querySelector(".svc-icon");
    const c = icon ? icon.className : "";
    modal.dataset.tone = /svc-stairs/.test(c) ? "teal" : /svc-esdm/.test(c) ? "sun" : /svc-assessments/.test(c) ? "pink" : "purple";
    const fill = icon && icon.classList.contains("svc-footprints") && !icon.classList.contains("fund-svg");
    const art = icon ? `<span class="modal-icon${fill ? " is-fill" : ""}">${icon.innerHTML}</span>` : "";
    const tag = d.tag ? `<span class="modal-tag">${d.tag}</span>` : "";
    body.innerHTML = `<div class="modal-hero">${art}${tag}<h3 id="detailTitle">${d.title}</h3></div><div class="modal-body">${d.content}</div>`;
    // No link to the page you're already on.
    const here = location.pathname.split("/").pop() || "index.html";
    body.querySelectorAll(".modal-link").forEach((l) => {
      if (l.getAttribute("href") === here) l.remove();
    });
    body.querySelectorAll(".modal-links").forEach((g) => { if (!g.children.length) g.remove(); });
    modal.classList.add("show");
    document.body.style.overflow = "hidden";
    modal.querySelector(".modal-content").focus({ preventScroll: true });
  };
  const close = () => {
    modal.classList.remove("show");
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  };
  if (modal) {
    modal.querySelector(".close").addEventListener("click", close);
    modal.addEventListener("click", (e) => { if (e.target === modal) close(); });
  }
  document.addEventListener("keydown", (e) => {
    if (!modal || !modal.classList.contains("show")) return;
    if (e.key === "Escape") close();
    if (e.key === "Tab") {
      const items = modal.querySelectorAll("button, a[href]");
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  const wire = (sel, attr, data) =>
    document.querySelectorAll(sel).forEach((card) => {
      const go = () => open(data[card.getAttribute(attr)], card);
      card.addEventListener("click", go);
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); }
      });
    });
  wire(".service-item", "data-service", serviceDetails);
  wire(".funding-card", "data-funding", fundingDetails);

  // Footstep trails between steps.
  document.querySelectorAll(".steps-row li:not(:last-child)").forEach((li) => {
    const t = document.createElement("span");
    t.className = "step-trail";
    t.setAttribute("aria-hidden", "true");
    t.innerHTML = "<i></i><i></i><i></i><i></i>";
    li.appendChild(t);
  });
  document.querySelectorAll(".steps-row").forEach((ol) => {
    const trails = ol.querySelectorAll(".step-trail");
    ol.classList.add("trails-" + trails.length);
    trails.forEach((t, k) => {
      t.style.setProperty("--k", k);
      t.querySelectorAll("i").forEach((f, n) => f.style.setProperty("--f", n));
    });
  });

  // Sections animate in as they scroll into view.
  const bands = document.querySelectorAll(".band");
  if (!("IntersectionObserver" in window)) { bands.forEach((b) => b.classList.add("in")); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  bands.forEach((b) => io.observe(b));
});

// The floating Contact me button, as on the home page: it appears once the
// opening section has scrolled away, says "Contact me", shrinks to a circle
// after 3 seconds, steps aside while the Get started section is on screen,
// and opens the Get started pop-up. While hidden it can't be focused (inert).
(() => {
  const fab = document.getElementById("contactUsButton");
  const modal = document.getElementById("contactModal");
  const hero = document.querySelector(".hero-actions");
  const cta = document.getElementById("get-started");
  if (!fab || !modal) return;
  let collapse = null, past = !hero, atCta = false;
  const update = () => {
    const on = past && !atCta;
    if (on === fab.classList.contains("show")) return;
    fab.classList.toggle("show", on);
    fab.inert = !on;
    clearTimeout(collapse);
    if (on) { fab.classList.remove("compact"); collapse = setTimeout(() => fab.classList.add("compact"), 3000); }
  };
  if ("IntersectionObserver" in window) {
    if (hero) new IntersectionObserver(([e]) => { past = !e.isIntersecting && e.boundingClientRect.top < 0; update(); }).observe(hero);
    if (cta) new IntersectionObserver(([e]) => { atCta = e.isIntersecting; update(); }, { threshold: 0.25 }).observe(cta);
  } else { past = true; }
  update();

  let last = null;
  const open = () => {
    last = document.activeElement;
    modal.classList.add("show");
    document.body.style.overflow = "hidden";
    modal.querySelector(".modal-content").focus({ preventScroll: true });
  };
  const close = () => {
    modal.classList.remove("show");
    document.body.style.overflow = "";
    if (last) last.focus({ preventScroll: true });
  };
  fab.addEventListener("click", (e) => { e.preventDefault(); open(); });
  modal.querySelector(".close").addEventListener("click", close);
  modal.addEventListener("click", (e) => { if (e.target === modal) close(); });
  document.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("show")) return;
    if (e.key === "Escape") close();
    if (e.key === "Tab") {
      const items = modal.querySelectorAll("button, a[href]");
      const first = items[0], lastItem = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); lastItem.focus(); }
      else if (!e.shiftKey && document.activeElement === lastItem) { e.preventDefault(); first.focus(); }
    }
  });
})();

// ── Page transitions ──
// The logo and the practice name that are on screen glide to their places
// on the next page (cross-document view transitions; see site.css).
(() => {
  const vis = (el) => {
    if (!el) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.bottom > 0 && r.top < innerHeight;
  };
  const name = () => {
    const logos = [".logo-image", ".brand img", ".nav-logo img"].map((q) => document.querySelector(q));
    const words = [".site-title", ".brand span"].map((q) => document.querySelector(q));
    [...logos, ...words].forEach((el) => el && (el.style.viewTransitionName = ""));
    const logo = logos.find(vis), word = words.find(vis);
    if (logo) logo.style.viewTransitionName = "brand-mark";
    if (word) word.style.viewTransitionName = "brand-name";
  };
  addEventListener("pageswap", name);
  addEventListener("pagereveal", name);
})();

// ── In-page links don't pile up history ──
// Jumping to a section (the menu, chips, the skip link) replaces the current
// history entry instead of adding one, so the browser's Back button leaves
// the page rather than stepping back through every section you tapped.
// The address still shows the section, and the jump behaves as normal.
document.addEventListener("click", (e) => {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const a = e.target.closest && e.target.closest('a[href^="#"]');
  if (!a || a.getAttribute("href").length < 2) return;
  if (!document.getElementById(decodeURIComponent(a.getAttribute("href").slice(1)))) return;
  e.preventDefault();
  location.replace(a.getAttribute("href"));
});
