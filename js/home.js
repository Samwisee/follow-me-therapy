// Follow Me Therapy: home page behaviour (pop-ups, cards, form, animations).
document.addEventListener("DOMContentLoaded", function () {
  const serviceDetails = {
    pediatric: {
      title: "5 Steps Forward",
      content:
        "<p>A short, focused program of 5 sessions with targeted support.</p><p>Ideal for returning families who need a boost, or families trying OT for the first time.</p>",
    },
    adult: {
      title: "Steady Steps",
      content:
        "<p>A 12-session block of structured, consistent support to work on big goals and build new skills.</p><p>There’s time to involve your child’s wider network and put together a full plan of action. Blocks can be stacked if more support is needed.</p>",
    },
    home: {
      title: "Early Start Denver Model (ESDM)",
      content:
        "<p>An evidence-based, play-based approach for children up to 5 with autism or other developmental delays, developed by the UC Davis MIND Institute.</p><p>It supports communication, social skills, play, daily living and thinking skills. Delivered by an ESDM-certified therapist, it includes:</p><ul class='checklist'><li>1:1 sessions at home or in the community</li><li>An individualised learning program</li><li>Coaching for the people who support your child every day</li></ul><p>We’ll check whether ESDM suits your child at the initial assessment.</p><p><a href='esdm-melbourne.html'>More about ESDM in Melbourne →</a></p>",
    },
    assessments: {
      title: "Assessments",
      content:
        "<ul class='checklist'><li>NDIS Access Report</li><li>Functional Capacity Assessment (FCA)</li><li>Progress Report</li><li>Sensory Processing Assessment</li><li>Assistive Technology (AT)</li></ul><p class='modal-note'>Whether AT goals are suitable is reviewed at the initial assessment.</p>",
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

  // Service cards open their details (click, Enter or Space).
  const serviceModal = document.getElementById("serviceModal");
  const serviceModalContent = document.getElementById("modalContent");
  document.querySelectorAll(".service-item").forEach((item) => {
    const open = () => {
      const d = serviceDetails[item.getAttribute("data-service")];
      serviceModalContent.innerHTML = `<h3 id="serviceModalTitle">${d.title}</h3><div class="modal-body">${d.content}</div>`;
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
      title: "NDIS",
      content:
        "<ul class='checklist'><li>We support self-managed and plan-managed NDIS participants.</li><li>Bring your plan goals to the initial assessment and we’ll build therapy around them.</li><li>We can write reports for plan reviews and NDIS access requests.</li></ul><p class='modal-note'>Is your plan NDIA-managed? Get in touch and we’ll talk through your options.</p><p><a href='ndis-occupational-therapy.html'>More about NDIS OT →</a></p>",
    },
    medicare: {
      title: "Medicare",
      content:
        "<ul class='checklist'><li><b>Chronic condition plan:</b> your GP can write a plan that gives Medicare rebates for up to 5 allied health sessions a year.</li><li><b>Neurodevelopmental plan:</b> children and young people under 25 with an eligible diagnosis, such as autism, may access up to 20 sessions through a referral from a paediatrician or psychiatrist.</li></ul><p class='modal-note'>Not sure if you’re eligible? Ask us or your doctor.</p>",
    },
    private: {
      title: "Private",
      content:
        "<ul class='checklist'><li>No plan or referral needed to get started.</li><li>Short programs or long-term support, whatever suits your family.</li><li>If your private health extras cover includes OT, you may be able to claim a rebate. Check with your fund.</li></ul>",
    },
  };
  document.querySelectorAll(".funding-card").forEach((card) => {
    const open = () => {
      const d = fundingDetails[card.getAttribute("data-funding")];
      serviceModalContent.innerHTML = `<h3 id="serviceModalTitle">${d.title}</h3><div class="modal-body">${d.content}</div>`;
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

  // Call-back form: sends a short email to the practice inbox.
  const cb = document.getElementById("callback");
  if (cb) {
    cb.addEventListener("submit", async (e) => {
      e.preventDefault();
      const status = cb.querySelector(".cb-status");
      const btn = cb.querySelector("button[type=submit]");
      const data = Object.fromEntries(new FormData(cb));
      if (data._honey) return;
      if (!data.name || !data.phone || !data.child_age) {
        status.textContent = "Please add your name, phone and your child’s age.";
        status.className = "cb-status err";
        return;
      }
      btn.disabled = true;
      btn.textContent = "Sending…";
      try {
        const res = await fetch("https://formsubmit.co/ajax/info@followmetherapy.com.au", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            _subject: "Call-back request from the website",
            _template: "table",
            _captcha: "false",
            Name: data.name,
            Phone: data.phone,
            "Child's age": data.child_age,
            "Best time": data.best_time,
          }),
        });
        if (!res.ok) throw new Error();
        cb.reset();
        status.textContent = "Thanks! We’ll give you a call soon.";
        status.className = "cb-status ok";
        btn.textContent = "Sent ✓";
      } catch (err) {
        status.textContent = "Sorry, that didn’t send. Please call 0435 076 683 or email info@followmetherapy.com.au.";
        status.className = "cb-status err";
        btn.disabled = false;
        btn.textContent = "Request a call";
      }
    });
  }

  // "Request a call back" in the contact pop-up jumps to the form.
  document.querySelectorAll("[data-callback]").forEach((el) =>
    el.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeModal(document.getElementById("contactModal"));
      const f = document.getElementById("callback");
      f.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => f.querySelector("input").focus({ preventScroll: true }), 600);
    })
  );

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
    document.querySelectorAll("header.fixed-header a[href^='#']").forEach((a) => {
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
  // Trails walk one after another: 1 → 2, pause, 2 → 3.
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
