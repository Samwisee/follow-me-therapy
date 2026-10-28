// Follow Me Therapy: home page behaviour (pop-ups, cards, form, animations).
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

  // ── Modals ─────────────────────────────────
  let lastFocus = null;
  const openModal = (modal) => {
    lastFocus = document.activeElement;
    modal.classList.add("show");
    document.body.style.overflow = "hidden";
    modal.querySelector(".modal-content").focus({ preventScroll: true });
  };
  const closeModal = (modal) => {
    modal.classList.remove("show");
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  };
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.querySelector(".close").addEventListener("click", () => closeModal(modal));
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal(modal);
    });
  });
  document.addEventListener("keydown", (e) => {
    const open = document.querySelector(".modal.show");
    if (!open) return;
    if (e.key === "Escape") closeModal(open);
    // Keep Tab inside the open modal.
    if (e.key === "Tab") {
      const items = open.querySelectorAll("button, a[href]");
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    }
  });

  // A pop-up's header: the card's own icon on a tint of its colour, a
  // short tag and the title. The pop-up takes the card's colour too.
  const toneOf = (card) => {
    const icon = card.querySelector(".svc-icon");
    const c = icon ? icon.className : "";
    return /svc-stairs/.test(c) ? "teal" : /svc-esdm/.test(c) ? "sun" : /svc-assessments/.test(c) ? "pink" : "purple";
  };
  const detailHTML = (card, d) => {
    const icon = card.querySelector(".svc-icon");
    const fill = icon && icon.classList.contains("svc-footprints") && !icon.classList.contains("fund-svg");
    const art = icon ? `<span class="modal-icon${fill ? " is-fill" : ""}">${icon.innerHTML}</span>` : "";
    const tag = d.tag ? `<span class="modal-tag">${d.tag}</span>` : "";
    return `<div class="modal-hero">${art}${tag}<h3 id="serviceModalTitle">${d.title}</h3></div><div class="modal-body">${d.content}</div>`;
  };
  // The telehealth drawing is exactly as tall as the words beside it, so
  // its top and bottom line up with theirs. (Stacked on phones, it just
  // takes its own size.)
  const tablet = document.querySelector(".illus-tablet");
  if (tablet && tablet.nextElementSibling && "ResizeObserver" in window) {
    const words = tablet.nextElementSibling;
    const fit = () => {
      const side = getComputedStyle(tablet.parentElement).flexDirection !== "column" && innerWidth > 650;
      // From the top of the first line to the bottom of the last one
      // (margins don't count).
      const lines = [...words.querySelectorAll("p, li, h3")];
      const top = Math.min(...lines.map((l) => l.getBoundingClientRect().top));
      const bottom = Math.max(...lines.map((l) => l.getBoundingClientRect().bottom));
      tablet.style.height = side ? bottom - top + "px" : "";
      tablet.style.width = side ? "auto" : "";
    };
    new ResizeObserver(fit).observe(words);
    addEventListener("resize", fit);
    fit();
  }

  // Service cards open their details (click, Enter or Space).
  const serviceModal = document.getElementById("serviceModal");
  const serviceModalContent = document.getElementById("modalContent");
  document.querySelectorAll(".service-item").forEach((item) => {
    const open = () => {
      const d = serviceDetails[item.getAttribute("data-service")];
      serviceModalContent.innerHTML = detailHTML(item, d);
      serviceModal.dataset.tone = toneOf(item);
      openModal(serviceModal);
    };
    item.addEventListener("click", open);
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open();
      }
    });
  });

  // Images fade in once decoded, instead of appearing in chunks.
  document.querySelectorAll("img").forEach((img) => {
    const show = () => img.classList.add("loaded");
    const ready = () => (img.decode ? img.decode().then(show, show) : show());
    if (img.complete && img.naturalWidth) ready();
    else {
      img.addEventListener("load", ready, { once: true });
      img.addEventListener("error", show, { once: true });
    }
  });

  // Funding cards open their details.
  const fundingDetails = {
    ndis: {
      title: "NDIS", tag: "Self or plan-managed",
      content:
        "<ul class='checklist'><li>I support self-managed and plan-managed NDIS participants.</li><li>Bring your plan goals to the initial assessment and I’ll build therapy around them.</li><li>I can write reports for plan reviews and NDIS access requests.</li></ul><p class='modal-note'>Is your plan NDIA-managed? Get in touch and I’ll talk through your options.</p><div class='modal-links'><a class='modal-link' href='ndis-occupational-therapy.html'><span>NDIS OT</span><svg viewBox='0 0 24 24' aria-hidden='true'><path d='M9 5l7 7-7 7'/></svg></a><a class='modal-link is-external' href='https://www.ndis.gov.au/how-apply-ndis/what-access-request-form' target='_blank' rel='noopener'><span>NDIS: applying for the NDIS</span><svg viewBox='0 0 24 24' aria-hidden='true'><path d='M14 4h6v6'/><path d='M20 4l-9 9'/><path d='M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4'/></svg></a></div>",
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
  document.querySelectorAll(".funding-card").forEach((card) => {
    const open = () => {
      const d = fundingDetails[card.getAttribute("data-funding")];
      serviceModalContent.innerHTML = detailHTML(card, d);
      serviceModal.dataset.tone = toneOf(card);
      openModal(serviceModal);
    };
    card.addEventListener("click", open);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open();
      }
    });
  });

  // Contact Us button.
  const contactModal = document.getElementById("contactModal");
  document.querySelectorAll("#contactUsButton, [data-open-contact]").forEach((btn) =>
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openModal(contactModal);
    })
  );

  // Floating Contact button: pops in, shrinks to a circle once you
  // scroll, and steps aside while the contact section is on screen.
  const fab = document.getElementById("contactUsButton");
  setTimeout(() => fab.classList.add("show"), 900);
  const onScroll = () => fab.classList.toggle("compact", window.scrollY > 240);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(
      ([e]) => fab.classList.toggle("tucked", e.isIntersecting),
      { threshold: 0.25 }
    ).observe(document.getElementById("contact"));
  }

  // Highlight the menu link for the section on screen.
  if ("IntersectionObserver" in window) {
    const links = {};
    document.querySelectorAll(".fixed-header a[href^='#']").forEach((a) => {
      links[a.getAttribute("href").slice(1)] = a;
    });
    const map = { "ot-services": "services", how: "about-simone" };
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const id = map[e.target.id] || e.target.id;
          Object.values(links).forEach((a) => a.classList.remove("active"));
          if (links[id] && id !== "about") links[id].classList.add("active");
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    document.querySelectorAll("main section[id]").forEach((sec) => spy.observe(sec));
  }

  // Footstep trails between the How it works steps.
  document.querySelectorAll(".steps li:not(:last-child)").forEach((li) => {
    const t = document.createElement("span");
    t.className = "step-trail";
    t.setAttribute("aria-hidden", "true");
    t.innerHTML = "<i></i><i></i><i></i><i></i>";
    li.appendChild(t);
  });
  // Trails walk one after another: 1 to 2, pause, 2 to 3.
  document.querySelectorAll(".steps").forEach((ol) => {
    const trails = ol.querySelectorAll(".step-trail");
    ol.classList.add("trails-" + trails.length);
    trails.forEach((t, k) => {
      t.style.setProperty("--k", k);
      t.querySelectorAll("i").forEach((f, n) => f.style.setProperty("--f", n));
    });
  });


  // ── Content fades in as it scrolls into view ──
  const faders = document.querySelectorAll(".fade-in-content");
  if (!("IntersectionObserver" in window)) {
    faders.forEach((f) => f.classList.add("is-visible"));
    return;
  }
  const appearOnScroll = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0, rootMargin: "0px 0px 10% 0px" }
  );
  faders.forEach((f) => appearOnScroll.observe(f));
});
