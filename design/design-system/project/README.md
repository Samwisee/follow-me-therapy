Follow Me Therapy is Simone's paediatric occupational therapy practice: telehealth Australia-wide and community sessions in North-Western Melbourne, for children aged 0–18 and their families. This system is the shared look for the website, printed handouts for families, and the staple books sold to them. Build every piece from these tokens and components so they read as one practice.

## Where the design lives

- The tokens on this page are a copy. The single source is `design/tokens.json` in the website repo (Samwisee/follow-me-therapy). The website, the share image, the logo files and these tokens are all built from it by `tools/build_tokens.py`.
- To change a colour, font or size, change it there, in code or in Figma through the Tokens Studio plugin, which syncs that file on the `preview` branch. Then re-sync this page. An edit made only on this page doesn't reach the website and is overwritten at the next sync.
- `brand-ink` colours the logo **and** the practice name together, everywhere. Never colour one without the other.
- The website takes everything from the tokens: colours, fonts, font sizes, line heights, spacing, radii, outlines, shadows, layers, durations, easings and breakpoints. `tools/check_tokens.py` in the repo checks every page and stylesheet (and this system's component CSS) for hard-coded values, and runs automatically on each change.

## Using the components

The components are a small React library (`window.FollowMeTherapy`) built from `components/src/index.tsx` in the repo, styled by `components/bundle.css` and coloured by the tokens. Every card on this page is a live render. In code: `h(FollowMeTherapy.Chip, {tone: 'teal', icon: 'video'}, 'Telehealth')`. For a plain HTML page or a print template, the same class names work without React (see each component's guidelines).

## Voice and content

- **Write as Simone, in the first person.** "I'll check whether ESDM suits your child at the initial assessment." Speak to parents and carers as "you" and "your child".
- Exceptions: a "Meet Simone" bio is third person; quotes are verbatim; legal and privacy text uses the company voice ("Follow Me Therapy").
- On pages a child reads, talk to the child: "Your turn!", "Tick each step when it's done." Short words, short sentences, one instruction per line.
- Warm, plain and practical. Skip clinical jargon unless it's the name of something families need to recognise (NDIS, ESDM, Functional Capacity Assessment).
- Sentence case for every title and button ("Start a referral", "My morning routine").
- No emoji. Icons come from the Icons group.
- Links and "next" cues use a chevron (›), never an arrow.
- **NDIS wording:** Simone is not NDIS-registered. She sees self-managed and plan-managed participants only. Never say or imply she can claim from NDIA-managed plans.
- Credentials, when shown: Master of Occupational Therapy (La Trobe), AHPRA registered, Occupational Therapy Australia member, Working with Children Check. Show nothing else until it's confirmed.
- Sign-off on printed pieces: "Simone · Paediatric OT · followmetherapy.com.au".

## Colour

- **Grounds:** `paper` for pages and cards; `purple-tint` (lilac) for heroes and headers; `butter` and `teal-tint` (mint) for alternating sections; `deep` for the footer band.
- **Brand pair:** `purple` leads (buttons, links, highlights); `teal` follows (ticks, telehealth, steps). `sun` is the warm accent: the swash under a key word, the disc behind Simone's photo, stars and rewards.
- **Text:** headings in `ink`, body in `ink-soft`. Both pass on every light ground. Inside a tinted chip, use that tint's ink (`purple-ink`, `teal-ink`, `sun-ink`).
- `sun` takes `ink` text, never white. `sun-deep` and `pink` are icon colours only; `pink-deep` takes white text.
- Fixed colour meanings: purple = who it's for (ages), teal = telehealth, sun = in person. Services: 5 Steps Forward purple, Steady Steps teal, ESDM sun, Assessments pink.
- Use one tinted ground per section, never a gradient.

## Type

- Two faces, both self-hosted and open-licensed (OFL, in `fonts/`): **Fredoka** for headings, buttons and the menu, and **Quicksand** for everything else.
- **One size scale** (`text-*`), used by every page. The bigger sizes are fluid: they grow smoothly from a phone (360px wide) to a desktop (1440px), so nothing jumps as the window changes.

| Token | Phone → desktop | Use |
|---|---|---|
| `text-xs` | 14px | Fine print: footer details, tags, pop-up notes |
| `text-sm` | 15px | Chips, credentials, menu labels on small screens |
| `text-base` | 16.5 → 17.5px | Running text |
| `text-md` | 17 → 18.5px | Buttons, menu, contact details |
| `text-lg` | 18.5 → 21px | Card titles; leads under a page title; the promise note |
| `text-xl` | 21 → 25px | The hero's lead line, pop-up titles, Simone's name |
| `text-2xl` | 24 → 30px | The OT quote; the practice name in the inner pages' top bar |
| `text-3xl` | 30 → 40px | Section titles |
| `text-4xl` | 32 → 50px | Page titles (h1) |
| `text-display` | 38 → 72px | The practice name in the home hero |

- Line heights: `leading-tight` 1.1 (display), `leading-snug` 1.25 (headings), `leading-normal` 1.5 (UI, lists, notes), `leading-relaxed` 1.7 (running text). Tracking: `tracking-tight` on headings, `tracking-caps` on uppercase eyebrows.
- Print: `print-title` 28pt, `print-kid` 16pt (anything a child reads, never under 14pt), `print-body` 11pt for adults, `print-small` 8.5pt minimum.
- Highlight one or two words per title with `fmt-swash`: the same squiggle as the section titles, in `sun`, repeated along the words. One swash per page. A quote closes with the same squiggle as its section title, same colour, same spacing.

## Section titles

Every section opens the same way (`SectionTitle`): the title centred in `text-3xl`, a short hand-drawn squiggle `space-4` under it in the band's accent (purple on lilac and white, `sun-deep` on butter, teal on mint), and an optional one-line subtitle. Page titles in an inner page's hero stay left-aligned without the squiggle.

## Shape and space

- **Nest rule: corners are concentric.** A container's corner radius = the radius of whatever sits in its corner + the padding between them + the container's outline, so the two curves run parallel. Never pick a radius by eye.
  - Service and funding cards: icon tile `radius-tile` + `card-pad` + `border-outline`.
  - Contact cards and pop-ups: the full-width button at the foot is a pill, so radius = `size-button` / 2 + `card-pad` + `border-outline`.
  - Info notes: the icon tile (`size-tile-md`, `radius-tile`) sits in the top corner, so radius = `radius-tile` + `card-pad` + `border-outline`. Sets of containers share one padding, one gap and one radius. Get in touch: the two choices, phone and email, and the privacy note all use `card-pad` inside, `grid-gap` between, and hold a button-height square in the corner (the full-width button, or an icon tile `size-button` across), all with `radius-tile` corners, so every container's corner is `radius-tile` + `card-pad` + `border-outline`, with straight sides between the curves. Buttons inside such a set take `radius-tile` instead of a pill so they nest.
  - Simone's card: photo `radius-md` + `card-pad`. The side menu: the 44px pill's radius + `space-2` + `border-outline`. The top bar: the logo circle sits `space-1` inside a pill.
  - In components, `.fmt-nest` does the sum (`--nest-inner`, `--nest-gap`, `--nest-border`).
- **Wrapped in colour:** cards, contact cards, the Get started choices and pop-ups wear a `border-outline` outline in their own colour: purple, teal, sun or pink. Purple is *Start a referral*; teal is *Ask a question*, everywhere. Icon tiles, chips, notes and step discs wear the same width in their *line* colour (`purple-line`, `teal-line`, `sun-line`, `pink-line`).
- Buttons are pills, `size-button` (52px) tall. Chips that are links are 44px tall.
- **Spacing** is one scale, `space-1` (4px) to `space-30` (120px), plus fluid layout tokens that grow with the window:

| Token | Phone → desktop | Use |
|---|---|---|
| `gutter` | 16 → 32px | Page edge to content |
| `section-space` | 72 → 112px | Top and bottom of every section band |
| `section-top` | 48 → 72px | Above a section's title (the wave already adds air) |
| `stack` | 28 → 40px | Under a section title's squiggle |
| `card-pad` | 20 → 24px | Inside cards, notes and pop-ups |
| `grid-gap` | 20 → 28px | Between cards |
| `content` / `measure` | 760px / 680px | Widest a section / a paragraph gets |

- Shadows by elevation: `shadow-rest` (cards at rest), `shadow-soft` (floating menu), `shadow-raised` (lifted on hover), `shadow-panel` (big white panels), `shadow-overlay` (pop-ups), `shadow-glow` (solid coloured things; set `--glow`). Screen only: on print, separate with tint or an outline.
- Section edges on the website are gentle waves (`wave`, 40px). On print, use straight edges and tinted panels.

## Layout and breakpoints

- Between breakpoints everything is fluid (type, spacing, gutters), and grids reflow on their own (`auto-fit`), so resizing a window is smooth. The layout only changes at the `bp-*` tokens:
  - `bp-xs` 480px: the top menu stretches edge to edge.
  - `bp-sm` 640px: one column; Simone's photo sits above her bio; the trail between steps walks down.
  - `bp-md` 960px: the menu moves from a floating bar along the top to a rail down the left (148px wide). The content glides over to make room, and the new menu slides in from its own edge. Nothing flies across the page.
  - `bp-short` 820px and `bp-shorter` 700px (window height): pop-ups tighten so they always fit.
- `tools/check_tokens.py` rejects any other media-query size.

## Motion

- Durations: `dur-fast` 150ms (colours), `dur-base` 250ms (hover lifts), `dur-slow` 400ms (cards, pills), `dur-slower` 600ms (sections and pop-ups arriving, the menu morph), `dur-entrance` 900ms (one-off entrances).
- Easings: `ease-standard` for most movement, `ease-out` for arrivals, `ease-spring` (a small overshoot) for playful hovers and pops, `ease-in-out` for loops.
- Moving between pages cross-fades, with the logo and the practice name gliding to their new places.
- Everything stops under `prefers-reduced-motion`. Ambient artwork loops (the illustrations, the walking footprints) keep their own longer timings.

## Imagery

- The website's link-preview image (`share-card.jpg`) follows the same rules: logo centred over the name, the stacked chips, and Simone in her frame. When it changes, give it a new file name: chat apps such as WhatsApp keep the old picture for an address they've already seen.
- Simone's photo is a cut-out on `teal-tint` inside a white `radius-frame` card, with a `sun` disc behind her. Use the cut-out from the Photos group; never crop her into a circle or place her on a busy background.
- Illustrations are flat, friendly and in the palette (the site uses recoloured unDraw art). No stock photos of children.
- No photos of real clients' children, ever.

## Accessibility: WCAG 2.2 AAA

Simone works in accessibility, so the system targets **AAA**, the highest WCAG level, not the usual AA. The website passes an automated AAA audit (axe-core, all pages, desktop and phone, pop-ups open), and every token below was chosen to keep it that way.

- **Text contrast 7:1 or better** (AAA 1.4.6) for every text colour on every ground it's used on: `ink-soft` 7.1:1 on its palest ground, `ink` 12:1+, chip inks 7.1:1, white on `purple` 7.1:1, on `teal` 7.1:1, on `pink-deep` 8.4:1, `ink` on `sun` 7.1:1. A new colour pair needs the same check before use; `tools/check_a11y.mjs` in the repo runs the audit.
- **Non-text contrast 3:1 or better** for icons, focus rings and control edges. Decorative shapes (tints, trails, chip borders) carry no meaning on their own.
- **Never colour alone** (1.4.1): chips say what they mean in words; done steps carry hidden "(done)" text; links in running text are underlined (`fmt-prose`).
- **Focus** (2.4.13 Focus Appearance, AAA): a `border-focus` (3px) ring in `focus` (ink), offset by the same amount, on everything interactive, on every ground.
- **Target size 44×44 or larger** (2.5.5, AAA): buttons are 52px tall (`size-button`), menu links and link chips 44px (`size-target`); tappable cards are larger still.
- **Motion** (2.3.3, AAA): decoration may move once on arrival, never loops, and stops under `prefers-reduced-motion`.
- **Reading** (1.4.8, AAA): left-align anything longer than two lines, never justify, keep lines under 80 characters, line height at least 1.5, paragraph spacing larger than line spacing. No text under 15px on screen or 8.5pt in print (14pt for anything a child reads).
- **Plain language** (3.1.5, AAA): write parent copy for a lower-secondary reading level; short sentences; explain any clinical term the first time.
- **Images of text** (1.4.9, AAA): none, except the logo. Headings, chips and buttons are real text.
- **Images:** the logo's text alternative is "Follow Me Therapy"; illustrations get a one-line description; decorative motifs (trails, swashes) are hidden from screen readers.
- **Windows high contrast:** shapes drawn with fills get a system-colour border so they don't disappear.

## Signature elements

These are what make a page recognisably Follow Me Therapy. Use at least one, and no more than two, on every piece.

- **The footprints:** anatomical left and right prints (`FootstepTrail`, `StepPath`, the 5 Steps Forward icon). The practice's name as a path.
- **The swash:** the hand-drawn `sun` underline under one key word.
- **Bordered pastel chips:** tint fill, line-colour border, bold label.
- **Simone in her frame:** the cut-out on mint with the sun disc, in a white rounded card.

## Iconography

- Line icons: round caps and joins, no fill. 40×40 for icon tiles (stroke 2.6), 24×24 inline in chips and notes (stroke 2.2). The footprints mark is the one filled icon.
- Inline icons as `<svg>` so they take `currentColor`. The Icons group files are drawn in `ink` for use as plain images.
- Icons sit in an `IconTile` (tint ground, matching colour) or lead a chip. Don't float them alone as decoration.

## Motif: following

The practice name is the idea: a child following a grown-up's lead. Show it with the logo (adult and child holding hands), the anatomical footprints (`FootstepTrail`), and numbered sequences joined by footprints (`StepPath`). One motif per page.

## The logo

- The mark is a line drawing of an adult and child holding hands, with the name set below or beside it in Fredoka 700.
- Vector files are in the Logos group, each in `ink` and in white:
  - `mark`: the figures alone. Use it for favicons, footers, stamps, and anywhere the name is already on the page.
  - `lockup-stacked`: the mark centred over the name. Use it for covers, title pages and square spaces.
  - `lockup-horizontal`: the mark beside the name and "Paediatric Occupational Therapy". Use it for letterheads, handout headers and wide spaces.
- The lettering in the lockups is outlined, so they print correctly without the fonts installed.
- The ink files are filled with `brand-ink`, the same token as the practice name, so the logo and the name always match. Use them on light grounds (`paper`, `purple-tint`, `butter`, `teal-tint`); use the white files on `deep`, `purple` or `teal`. No other colours.
- Clear space: the height of the child's head on every side. Smallest size: mark 8 mm tall, horizontal lockup 30 mm wide.
- Don't stretch, rotate, outline or add effects. Don't redraw the figures or reset the name in another font.
- The mark is traced from the original PNG. If an original vector from whoever designed it turns up, replace these files with it.
