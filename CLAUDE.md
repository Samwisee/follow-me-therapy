# Working on the Follow Me Therapy site

Sam maintains this site for Simone (Sim), a paediatric OT who runs Follow Me
Therapy on her own. See README.md for the file layout.

## Workflow (always)

- Work on the `preview` branch. Never push to `main` unless Sam says "deploy".
- After each change, commit, push `preview`, and give Sam the preview link with
  the full commit hash:
  `https://raw.githack.com/Samwisee/follow-me-therapy/<full-hash>/index.html`
- Deploy = fast-forward main to preview: `git push origin origin/preview:main`,
  then wait for the "pages build and deployment" run (`gh run list -L 1`) to succeed.
- Landing pages are generated: edit `tools/build_pages.py`, run
  `python3 tools/build_pages.py`. Pop-up text lives in `js/home.js` and is
  mirrored in `js/pages.js`; change both.
- Check visually before reporting: serve locally (`python3 -m http.server 8765`)
  and screenshot with Playwright at 1400px and 390px wide. The side rail menu
  only appears at 1300px and up.
- Commit author: `git -c user.name=Claude -c user.email=noreply@anthropic.com`.

## Voice and content rules

- The site speaks as Simone in first person ("I"). Exceptions: the "Meet
  Simone" bio (third person), quotes, and the privacy policy (company voice).
- She is not NDIS-registered: she sees self-managed and plan-managed
  participants only. Never imply she can claim from NDIA-managed plans.
- Credentials shown: Master of OT (La Trobe), AHPRA registered, OT Australia
  member, Working with Children Check. Only add what Sam confirms she holds.
- ABN 84 679 395 414. Sessions run on Microsoft Teams.
- Her email is on Microsoft 365 via GoDaddy: never change MX records or accept
  "Gmail setup" prompts.
- Use chevrons (›), not arrows, for links. Keep accessibility clean (axe).

## Status

- Live at followmetherapy.com.au (GitHub Pages from `main`).
- Search Console verified (domain property) and Google Business Profile set up.
- Splose enquiry forms tested and working.
