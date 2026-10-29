# Builds the inner landing pages (telehealth, NDIS, ESDM, North-Western Melbourne).
# Edit the content below, then run: python3 tools/build_pages.py
import json
import os
ROOT=os.path.join(os.path.dirname(os.path.abspath(__file__)), '..') + os.sep
REF='https://follow-me-therapy.splose.com/public-form/975d61d5-cd63-44e5-86e7-f9315fa6a5b0'
ENQ='https://follow-me-therapy.splose.com/public-form/e84c8756-615f-4404-a6f3-a90f3760223b'
SITE='https://followmetherapy.com.au/'
LINKS=[('telehealth-occupational-therapy.html','Telehealth OT'),('ndis-occupational-therapy.html','NDIS OT'),('esdm-melbourne.html','ESDM in Melbourne'),('occupational-therapy-north-western-melbourne.html','OT in North-Western Melbourne'),('privacy.html','Privacy policy')]

def page(slug,title,desc,crumb,h1,lead,chips,bands):
    foot=''.join(f'<li><a href="{h}">{t}</a></li>' for h,t in [('index.html','Home')]+LINKS if h!=slug)
    ld={"@context":"https://schema.org","@type":"WebPage","name":title,"description":desc,"url":SITE+slug,
        "isPartOf":{"@type":"WebSite","name":"Follow Me Therapy","url":SITE},
        "breadcrumb":{"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":SITE},{"@type":"ListItem","position":2,"name":crumb,"item":SITE+slug}]}}
    chips_html=''.join(f'<li>{c}</li>' for c in chips)
    body='\n'.join(bands)
    html=f'''<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title}</title>
    <meta name="description" content="{desc}" />
    <link rel="canonical" href="{SITE}{slug}" />
    <meta name="theme-color" content="#efe9ff" data-token="purple-tint" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Follow Me Therapy" />
    <meta property="og:title" content="{title}" />
    <meta property="og:description" content="{desc}" />
    <meta property="og:url" content="{SITE}{slug}" />
    <meta property="og:image" content="{SITE}img/share-2026-10-29.jpg" />
    <meta property="og:image:secure_url" content="{SITE}img/share-2026-10-29.jpg" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Follow Me Therapy: Simone, paediatric OT. Ages 0–18, telehealth Australia-wide, community sessions in North-Western Melbourne." />
    <meta name="twitter:image" content="{SITE}img/share-2026-10-29.jpg" />
    <meta property="og:locale" content="en_AU" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="icon" href="/favicon.ico" sizes="16x16 32x32 48x48" />
    <link rel="icon" href="img/favicon.svg" type="image/svg+xml" />
    <link rel="icon" href="img/icon-192.png" sizes="192x192" type="image/png" />
    <link rel="apple-touch-icon" href="img/icon-180.png" />
    <link rel="preload" href="fonts/fredoka-latin-variable.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="preload" href="fonts/quicksand-latin-500-normal.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="stylesheet" href="css/tokens.css" />
    <link rel="stylesheet" href="css/site.css" />
    <link rel="stylesheet" href="css/pages.css" />
    <script>
      (function () {{
        var d = document.documentElement;
        d.classList.add("js");
        var done = function () {{ d.classList.add("fonts-ready"); }};
        if (document.fonts && document.fonts.ready) {{
          Promise.race([document.fonts.ready, new Promise(function (r) {{ setTimeout(r, 700); }})]).then(done);
        }} else {{ done(); }}
        setTimeout(done, 1200);
      }})();
    </script>
    <script type="application/ld+json">{json.dumps(ld)}</script>
  </head>
  <body>
    <a class="skip-link" href="#main">Skip to content</a>
    <header class="site-head">
      <div class="wrap">
        <div class="head-left">
          <a class="back-btn" href="index.html" data-back aria-label="Back"
            ><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg><span>Back</span></a
          >
          <a class="brand" href="index.html"
            ><img src="img/brand/follow-me-therapy-mark.svg" alt="" width="226" height="250" /><span>Follow Me Therapy</span></a
          >
        </div>
      </div>
    </header>
    <main id="main">
      <section class="band tone-lilac hero">
        <div class="wrap">
          <p class="crumbs rise"><a href="index.html">Home</a> › {crumb}</p>
          <h1 class="rise">{h1}</h1>
          <p class="lead rise rise-2">{lead}</p>
          <ul class="chips rise rise-2">{chips_html}</ul>
          <div class="hero-actions rise rise-3">
            <a class="btn" href="{REF}" target="_blank" rel="noopener">Start a referral</a>
            <a class="btn btn-outline is-teal" href="{ENQ}" target="_blank" rel="noopener">Ask a question</a>
          </div>
        </div>
      </section>
{body}
      <section class="band tone-lilac cta" id="get-started">
        <div class="wrap">
          <h2>Ready to take the first step?</h2>
          <p>Start a referral and I’ll be in touch, or ask me anything. You can also call <a href="tel:+61435076683">0435 076 683</a>.</p>
          <div class="hero-actions">
            <a class="btn" href="{REF}" target="_blank" rel="noopener">Start a referral</a>
            <a class="btn btn-outline is-teal" href="{ENQ}" target="_blank" rel="noopener">Ask a question</a>
          </div>
        </div>
      </section>
    </main>
    <footer class="band tone-deep site-foot">
      <div class="wrap">
        <h2>Follow Me Therapy</h2>
        <ul class="foot-links">{foot}</ul>
        <p>Paediatric occupational therapy for children and young people aged 0–18. Telehealth Australia-wide and community sessions in North-Western Melbourne.</p>
        <p><a href="mailto:info@followmetherapy.com.au">info@followmetherapy.com.au</a> · <a href="tel:+61435076683">0435 076 683</a></p>
        <p class="foot-small">I acknowledge the Traditional Custodians of the lands across Australia, and the Wurundjeri people, on whose land I provide my services. I pay my respects to Elders past and present. All are welcome at Follow Me Therapy.</p>
      </div>
    </footer>
    <a href="#get-started" class="fab" id="contactUsButton" aria-label="Contact me" inert>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9l-4 3v-3H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linejoin="round"
        />
        <circle cx="8.5" cy="11" r="1.2" fill="currentColor" />
        <circle cx="12" cy="11" r="1.2" fill="currentColor" />
        <circle cx="15.5" cy="11" r="1.2" fill="currentColor" />
      </svg>
      <span class="fab-label">Contact me</span>
    </a>
    <div id="contactModal" class="modal contact-modal">
      <div
        class="modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contactModalTitle"
        tabindex="-1"
      >
        <button type="button" class="close" aria-label="Close">&times;</button>
        <h3 id="contactModalTitle">Let’s get started!</h3>
        <ul class="modal-chips">
          <li>Telehealth spots available now</li>
          <li>NDIS · Medicare · Private</li>
        </ul>
        <a href="https://follow-me-therapy.splose.com/public-form/975d61d5-cd63-44e5-86e7-f9315fa6a5b0" target="_blank" rel="noopener" class="modal-choice primary">
          <span class="mc-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M7 4h7l4 4v12H7z" /><path d="M14 4v4h4M10 13h5M10 16h5" /></svg>
          </span>
          <span class="mc-text"><b>Start a referral</b><small>New to Follow Me Therapy? Begin here.</small></span>
          <span class="mc-arrow" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" /></svg></span>
        </a>
        <a href="https://follow-me-therapy.splose.com/public-form/e84c8756-615f-4404-a6f3-a90f3760223b" target="_blank" rel="noopener" class="modal-choice">
          <span class="mc-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M4 5h16v11H9l-4 3v-3H4z" /><path d="M10 9.5a2 2 0 1 1 2.6 1.9c-.4.2-.6.5-.6.9M12 14h.01" /></svg>
          </span>
          <span class="mc-text"><b>Ask a question</b><small>Not sure yet? Send me a quick message.</small></span>
          <span class="mc-arrow" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" /></svg></span>
        </a>
        <p class="modal-note">
          Not about a client? Email
          <a href="mailto:info@followmetherapy.com.au">info@followmetherapy.com.au</a>
        </p>
      </div>
    </div>
    <div id="detailModal" class="modal">
      <div class="modal-content" role="dialog" aria-modal="true" aria-labelledby="detailTitle" tabindex="-1">
        <button type="button" class="close" aria-label="Close">&times;</button>
        <div id="detailBody"></div>
        <a class="btn" href="{REF}" target="_blank" rel="noopener">Start a referral</a>
      </div>
    </div>
    <script src="js/pages.js" defer></script>
    <script src="js/reflow.js" defer></script>
  </body>
</html>
'''
    open(ROOT+slug,'w').write(html)

def band(tone,h2,inner):
    return f'''      <section class="band {tone}">
        <div class="wrap">
          <h2>{h2}</h2>
{inner}
        </div>
      </section>'''
def ul(items): return '          <ul class="checklist pop">'+''.join(f'<li>{i}</li>' for i in items)+'</ul>'
def cards(items): return '          <div class="cards pop">'+''.join(f'<div class="card"><h3>{t}</h3><p>{d}</p></div>' for t,d in items)+'</div>'
def steps(items): return '          <ol class="steps-row pop">'+''.join(f'<li><span class="step-num">{i+1}</span><h3>{t}</h3><p>{d}</p></li>' for i,(t,d) in enumerate(items))+'</ol>'

SVC={'pediatric': '              <div class="service-item" data-service="pediatric" role="button" tabindex="0" aria-haspopup="dialog">\n                <span class="svc-icon svc-footprints"><svg viewBox="0 0 40 40" aria-hidden="true"><g transform="translate(6 7) rotate(-6 8 12) scale(.95)"><ellipse cx="11.5" cy="3.1" rx="2.05" ry="2.55"/><circle cx="8.15" cy="2.25" r="1.35"/><circle cx="5.85" cy="2.9" r="1.2"/><circle cx="3.95" cy="4.15" r="1.05"/><circle cx="2.55" cy="5.85" r="0.9"/><path d="M7.6 6.6C11.2 6.2 13.9 7.8 13.6 10.8 13.4 12.8 11.4 14 10.9 16.2 10.5 18 11.6 19.4 11.2 21.2 10.8 23.2 9.3 24 7.7 24 5.6 24 4.3 22.7 4.3 20.6 4.3 17.6 3 15.8 2.8 12.8 2.5 9.2 4.4 6.9 7.6 6.6Z"/></g><g transform="translate(19 4) rotate(6 8 12) scale(.95)"><g transform="translate(16 0) scale(-1 1)"><ellipse cx="11.5" cy="3.1" rx="2.05" ry="2.55"/><circle cx="8.15" cy="2.25" r="1.35"/><circle cx="5.85" cy="2.9" r="1.2"/><circle cx="3.95" cy="4.15" r="1.05"/><circle cx="2.55" cy="5.85" r="0.9"/><path d="M7.6 6.6C11.2 6.2 13.9 7.8 13.6 10.8 13.4 12.8 11.4 14 10.9 16.2 10.5 18 11.6 19.4 11.2 21.2 10.8 23.2 9.3 24 7.7 24 5.6 24 4.3 22.7 4.3 20.6 4.3 17.6 3 15.8 2.8 12.8 2.5 9.2 4.4 6.9 7.6 6.6Z"/></g></g></svg></span>\n                <h3>5 Steps Forward</h3>\n                <p>A focused 5-session program for specific goals.</p>\n                <span class="more">Learn more<svg class="chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg></span>\n              </div>\n', 'adult': '              <div class="service-item" data-service="adult" role="button" tabindex="0" aria-haspopup="dialog">\n                <span class="svc-icon svc-stairs"><svg viewBox="0 0 40 40" aria-hidden="true"><path d="M6 31h8v-7h7v-7h7v-7h6"/></svg></span>\n                <h3>Steady Steps</h3>\n                <p>A 12-session block of steady, ongoing support to build key skills.</p>\n                <span class="more">Learn more<svg class="chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg></span>\n              </div>\n', 'home': '              <div class="service-item" data-service="home" role="button" tabindex="0" aria-haspopup="dialog">\n                <span class="svc-icon svc-esdm"><svg viewBox="0 0 40 40" aria-hidden="true"><rect x="6" y="22" width="12" height="12" rx="2.5"/><rect x="22" y="22" width="12" height="12" rx="2.5"/><rect x="14" y="7" width="12" height="12" rx="2.5" transform="rotate(8 20 13)"/></svg></span>\n                <h3>Early Start Denver Model (ESDM)</h3>\n                <p>Play-based therapy for young children with autism or developmental delays.</p>\n                <span class="more">Learn more<svg class="chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg></span>\n              </div>\n', 'assessments': '              <div class="service-item" data-service="assessments" role="button" tabindex="0" aria-haspopup="dialog">\n                <span class="svc-icon svc-assessments"><svg viewBox="0 0 40 40" aria-hidden="true"><rect x="9" y="7" width="22" height="28" rx="4"/><rect x="15" y="4" width="10" height="6" rx="2"/><path d="M15 22l4 4 7-8"/></svg></span>\n                <h3>Assessments</h3>\n                <p>NDIS access, functional capacity, progress, sensory and assistive technology reports.</p>\n                <span class="more">Learn more<svg class="chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg></span>\n              </div>\n'}
def svcgrid(keys): return '          <div class="svc-grid pop">\n'+''.join(SVC[k] for k in keys)+'          </div>'
FUNDHTML='          <div class="fund-grid pop">\n            <div class="funding-card" data-funding="ndis" role="button" tabindex="0" aria-haspopup="dialog">\n              <span class="svc-icon svc-footprints fund-svg"><svg viewBox="0 0 40 40" aria-hidden="true"><path d="M6 20a14 14 0 0 1 28 0"/><path d="M6 20c2.3-2.2 4.7-2.2 7 0 2.3-2.2 4.7-2.2 7 0 2.3-2.2 4.7-2.2 7 0 2.3-2.2 4.7-2.2 7 0"/><path d="M20 20v10.5a3.5 3.5 0 0 1-7 0"/><path d="M20 6V4"/></svg></span>\n              <h3>NDIS</h3>\n            </div>\n            <div class="funding-card" data-funding="medicare" role="button" tabindex="0" aria-haspopup="dialog">\n              <span class="svc-icon svc-stairs fund-svg"><svg viewBox="0 0 40 40" aria-hidden="true"><rect x="7" y="7" width="26" height="26" rx="7"/><path d="M20 13v14M13 20h14"/></svg></span>\n              <h3>Medicare</h3>\n            </div>\n            <div class="funding-card" data-funding="private" role="button" tabindex="0" aria-haspopup="dialog">\n              <span class="svc-icon svc-esdm fund-svg"><svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 5l12 5v9c0 8-5 13-12 16C13 32 8 27 8 19v-9z"/><path d="M15 20l4 4 7-8"/></svg></span>\n              <h3>Private</h3>\n            </div>\n          </div>\n'

def p(t): return f'          <p>{t}</p>'

FUND=FUNDHTML

page('telehealth-occupational-therapy.html',
 'Rural &amp; Remote Telehealth OT for Children | Follow Me Therapy',
 'Paediatric occupational therapy by video for children aged 0–18 in rural, regional and remote Australia. No travel, spots available now. NDIS, Medicare and private.',
 'Telehealth OT','Telehealth occupational therapy for children in rural, regional and remote Australia',
 'Paediatric OT by video or phone, with no travel. Therapy fits around your family, wherever you live, from country towns to remote communities.',
 ['Ages 0–18','Australia-wide, spots available now','Microsoft Teams'],
 [band('tone-white','For rural, regional and remote families', p('If the nearest children’s OT is hours away, or the local waitlist is long, telehealth brings therapy to you. I work with families across every state and territory, from regional towns to remote properties and communities.')+'\n'+ul([
   'No travel: sessions happen at home, at the kitchen table or in the backyard','Times that suit your time zone, including Western Australia and the Northern Territory','Coaching for the people around your child: parents, grandparents, teachers, distance-education supervisors and support workers','Reports and therapy plans for NDIS, Medicare and school, written for your child’s goals','A slower connection is fine: sessions can switch to phone or use activities planned ahead'])),
  band('tone-cream','Who telehealth suits', p('Telehealth works for many families, including:')+'\n'+ul([
   'Families in rural and regional areas','Busy families who want to skip the travel','Children who feel more settled at home','Families waiting for face-to-face services'])),
  band('tone-white','What a session looks like', steps([
   ('Join from home','Connect on Microsoft Teams from a laptop, tablet or phone.'),
   ('Work on real goals','Your therapist works with you and your child using everyday activities and things you already have at home.'),
   ('Keep it going','You get practical strategies to use between sessions, so progress continues all week.')])),
  band('tone-mint','Telehealth goes beyond the home', ul([
   'Coaching calls with grandparents or carers','Skill-building programs for support workers','Working with your child’s teacher','Support while you wait for face-to-face services'])+'\n'+
   '          <p class="note info-note"><span>Research backs it up: a 2025 review of 18 studies found early therapy by telehealth, OT included, helped young children about as well as in person, and families were happy with it. <a href="https://www.jmir.org/2025/1/e66442" target="_blank" rel="noopener">Read the review</a></span></p>'),
  band('tone-cream','What you’ll need', ul(['A device with a camera and microphone','A reliable internet connection','A quiet space with room to move','Microsoft Teams (free to use)'])),
  band('tone-white','Funding for telehealth', p('Telehealth sessions can be funded the same way as in-person sessions.')+'\n'+FUND)])

page('ndis-occupational-therapy.html',
 'NDIS Occupational Therapy for Children | Follow Me Therapy',
 'Paediatric OT for self-managed and plan-managed NDIS participants aged 0–18. Therapy blocks, NDIS access reports, FCAs and progress reports.',
 'NDIS OT','NDIS Occupational Therapy for children and young people',
 'Therapy built around your NDIS plan goals, for self-managed and plan-managed participants aged 0–18.',
 ['Self-managed','Plan-managed','Telehealth Australia-wide','North-Western Melbourne'],
 [band('tone-cream','Therapy that fits your plan', '          <p class="tap-hint">Tap a service to find out more.</p>'+'\n'+svcgrid(['pediatric','adult','home','assessments'])),
  band('tone-white','Assessments and reports', ul(['NDIS Access Report','Functional Capacity Assessment (FCA)','Progress Report','Sensory Processing Assessment','Assistive Technology (AT), with suitability reviewed at the initial assessment'])),
  band('tone-mint','How it works', steps([
   ('Start a referral','Complete the referral form and include your plan details.'),
   ('Initial assessment','I get to know your child and family, and set goals that link to your plan.'),
   ('Therapy','Telehealth or community sessions, tailored to those goals.'),
   ('Reports','Progress reports help at plan reviews.')])+'\n          <p class="note info-note"><span>I’m not NDIS-registered, so I can’t claim from NDIA-managed plans. If yours is, you can ask the NDIA to switch to plan management. <a href="'+ENQ+'" target="_blank" rel="noopener">Get in touch</a> and I’ll talk you through it.</span></p>')])

page('esdm-melbourne.html',
 'Early Start Denver Model (ESDM) in Melbourne | Follow Me Therapy',
 'ESDM for young children with autism or developmental delays, delivered by an ESDM-certified occupational therapist in North-Western Melbourne.',
 'ESDM','Early Start Denver Model (ESDM) in Melbourne',
 'Evidence-based, play-based therapy for young children with autism and other developmental delays, up to 5 years of age.',
 ['Up to 5 years','Play-based','ESDM-certified therapist','Home or community'],
 [band('tone-cream','What is ESDM?', p('The Early Start Denver Model was developed by the UC Davis MIND Institute. It weaves learning into play and everyday routines, using developmental and behavioural techniques.')+'\n'+p('It supports:')+'\n'+ul(['Communication','Social skills','Play','Daily living skills','Thinking and learning skills'])),
  band('tone-white','What ESDM with me includes', cards([
   ('1:1 sessions','At home or in the community, in places that are part of your child’s day.'),
   ('A learning program','Goals and activities individualised for your child.'),
   ('Coaching','Support for the people who are with your child every day.')])),
  band('tone-mint','Is ESDM right for my child?', p('I’ll check whether ESDM suits your child at the initial assessment. If another approach fits better, I’ll talk you through it.')+'\n'+FUND)])

page('occupational-therapy-north-western-melbourne.html',
 'Paediatric Occupational Therapy, North-Western Melbourne | Follow Me Therapy',
 'Mobile paediatric OT for children aged 0–18 in North-Western Melbourne, with community-based sessions, ESDM, assessments and NDIS support.',
 'North-Western Melbourne','Paediatric Occupational Therapy in North-Western Melbourne',
 'A mobile OT service that comes to you, with community-based sessions across North-Western Melbourne.',
 ['Ages 0–18','I come to you','NDIS, Medicare & private'],
 [band('tone-cream','OT where your child’s life happens', p('Therapy works best in real places. Community-based sessions take place in settings that are part of your child’s everyday life.')+'\n'+ul([
   'Improve fine and gross motor skills','Understand sensory systems','Develop play and engagement skills','Support emotional regulation','Build self-care and independence','Get ready for school','Enjoy mealtimes and manage fussy eating'])),
  band('tone-white','Services', '          <p class="tap-hint">Tap a service to find out more.</p>'+'\n'+svcgrid(['pediatric','adult','home','assessments'])),
  band('tone-mint','Not in North-Western Melbourne?', p('I also offer <a href="telehealth-occupational-therapy.html">telehealth OT</a> anywhere in Australia.')+'\n'+FUND)])
print('ok')
