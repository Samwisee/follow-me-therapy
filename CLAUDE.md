# Working on the Follow Me Therapy site

Sam maintains this site for Simone (Sim), a paediatric OT who runs Follow Me
Therapy on her own. See README.md for the file layout.

## Workflow (always)

- Work on the `preview` branch. Never push to `main` unless Sam says "deploy",
  with one standing exception: fixes for design consistency between products
  (the website, Design System, worksheets and app drifting apart) are deployed
  as part of the fix, without asking. Tell Sam about any drift you notice.
- After each change, commit, push `preview`, and give Sam the preview link with
  the full commit hash:
  `https://raw.githack.com/Samwisee/follow-me-therapy/<full-hash>/index.html`
- Deploy = fast-forward main to preview: `git push origin origin/preview:main`,
  then wait for the "pages build and deployment" run (`gh run list -L 1`) to succeed.
- Colours, fonts, sizes, logo colour: edit `design/tokens.json` (the single
  source; see design/README.md), run `python3 tools/build_tokens.py`. Never
  hardcode a colour, font, font size, line height, spacing, radius, outline,
  shadow, z-index, duration/easing or breakpoint in CSS or HTML: use
  `var(--token)` (media queries use the `breakpoint` numbers). Corners nest:
  container radius = inner radius + padding + outline. `python3 tools/check_tokens.py` must say "Everything reads
  from the design tokens." (it also runs on every push to preview). A colour inside a
  data-URI SVG gets a `/* token:<name> */` tag before `url(` instead.
- One design system for every product (see design/README.md): `design/tokens.json`
  (incl. tones and component tokens), `design/components.json` (every shared
  component, its rules, where each product implements it) and `design/icons.json`.
  The app (Samwisee/follow-me-therapy-app) syncs them every build and hourly.
  A shared component takes colours from its component tokens (`var(--chip-teal-fill)`),
  never a colour directly; `check_tokens.py` enforces this, plus AAA contrast
  and that every product has every component. A design change goes into all
  products in the same piece of work: website CSS, Design System, app.
- Design-system components: edit `design/design-system/project/components/src/index.tsx`
  or `bundle.css`, run `npm run design-system`, then publish that folder to the
  Design System artifact.
  Then refresh the worksheets canvas's `ds/followmetherapy` copy, and record both
  with `python3 tools/check_published.py --record design-system` / `worksheets`.
  `python3 tools/check_published.py` lists anything still to publish (CI warns too).
- Landing pages are generated: edit `tools/build_pages.py`, run
  `python3 tools/build_pages.py`. Pop-up text lives in `js/home.js` and is
  mirrored in `js/pages.js`; change both.
- One system for every medium: semantic tokens (text-*, card-pad, grid-gap,
  stack, group-gap, gutter) are fluid on screens and take print values inside
  `.fmt-sheet`/`.medium-paper` (A4) and `.fmt-page`/`.medium-book` (A5), set in
  tokens.json `extensions.followmetherapy.media`. Components never carry print
  sizes of their own. Worksheets: footprints off for now (`StepPath plain`).
- Link-preview (share) image: `tools/og.html` is built from the site's CSS,
  so it follows design changes. `python3 tools/make_og.py` renders it to a new
  `img/share-<hash>.jpg` (chat apps cache by URL) and updates every og:image
  reference. CI re-runs it on preview when tokens, CSS, logo or fonts change.
- Check visually before reporting: serve locally (`python3 -m http.server 8765`)
  and screenshot with Playwright at 1400px and 390px wide. The side rail menu
  appears at 960px (token `breakpoint.md`) and up; below that it's the top bar.
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
- Use chevrons (›), not arrows, for links.
- Accessibility target is WCAG 2.2 **AAA** (Simone works in accessibility):
  text 7:1, focus ring, 44px targets, no colour-only meaning. Run
  `npm run a11y` (with the local server up) before reporting; it must say
  "no violations".

## Status

- Live at followmetherapy.com.au (GitHub Pages from `main`).
- Search Console verified (domain property) and Google Business Profile set up.
- Splose enquiry forms tested and working.
