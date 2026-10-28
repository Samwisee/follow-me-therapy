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
        const serviceDetails = {
          pediatric: {
            title: "5 Steps Forward", tag: "5 sessions",
            content:
              "<p class='modal-lead'>A short, focused program of 5 sessions with targeted support.</p><p class='list-label'>Ideal for:</p><ul class='checklist'><li>Returning families who need a boost</li><li>Families trying OT for the first time</li></ul>",
          },
          adult: {
            title: "Steady Steps", tag: "12 sessions",
            content:
              "<p class='modal-lead'>A 12-session block of structured, consistent support to work on big goals and build new skills.</p><ul class='checklist'><li>Time to involve your child’s wider network</li><li>A full plan of action, put together with you</li><li>Blocks can be stacked if more support is needed</li></ul>",
          },
          home: {
            title: "Early Start Denver Model (ESDM)", tag: "Up to age 5",
            content:
              "<p>An evidence-based, play-based approach for children up to 5 with autism or other developmental delays, developed by the UC Davis MIND Institute.</p><p>It supports communication, social skills, play, daily living and thinking skills. Delivered by an ESDM-certified therapist, it includes:</p><ul class='checklist'><li>1:1 sessions at home or in the community</li><li>An individualised learning program</li><li>Coaching for the people who support your child every day</li></ul><p>We’ll check whether ESDM suits your child at the initial assessment.</p><p><a href='esdm-melbourne.html'>More about ESDM in Melbourne →</a></p>",
          },
          assessments: {
            title: "Assessments", tag: "Reports",
            content:
              "<ul class='checklist'><li>NDIS Access Report</li><li>Functional Capacity Assessment (FCA)</li><li>Progress Report</li><li>Sensory Processing Assessment</li><li>Assistive Technology (AT)</li></ul><p class='modal-note'>Whether AT goals are suitable is reviewed at the initial assessment.</p>",
          },
        };
        const fundingDetails = {
          ndis: {
            title: "NDIS", tag: "Self or plan-managed",
            content:
              "<ul class='checklist'><li>We support self-managed and plan-managed NDIS participants.</li><li>Bring your plan goals to the initial assessment and we’ll build therapy around them.</li><li>We can write reports for plan reviews and NDIS access requests.</li></ul><p class='modal-note'>Is your plan NDIA-managed? Get in touch and we’ll talk through your options.</p><p><a href='ndis-occupational-therapy.html'>More about NDIS OT →</a></p>",
          },
          medicare: {
            title: "Medicare", tag: "With a GP plan",
            content:
              "<ul class='checklist'><li><b>Chronic condition plan:</b> your GP can write a plan that gives Medicare rebates for up to 5 allied health sessions a year.</li><li><b>Neurodevelopmental plan:</b> children and young people under 25 with an eligible diagnosis, such as autism, may access up to 20 sessions through a referral from a paediatrician or psychiatrist.</li></ul><p class='modal-note'>Not sure if you’re eligible? Ask us or your doctor.</p>",
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
    modal.classList.add("show");
    document.body.style.overflow = "hidden";
    modal.querySelector(".modal-content").focus({ preventScroll: true });
  };
  const close = () => {
    modal.classList.remove("show");
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  };
  modal.querySelector(".close").addEventListener("click", close);
  modal.addEventListener("click", (e) => { if (e.target === modal) close(); });
  document.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("show")) return;
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
