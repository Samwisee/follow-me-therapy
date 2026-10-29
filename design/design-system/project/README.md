Follow Me Therapy is Simone's paediatric occupational therapy practice: telehealth Australia-wide and community sessions in North-Western Melbourne, for children aged 0–18 and their families. This system is the shared look for the website, printed handouts for families, and the staple books sold to them. Build every piece from these tokens and components so they read as one practice.

## Where the design lives

- The tokens on this page are a copy. The single source is `design/tokens.json` in the website repo (Samwisee/follow-me-therapy). The website, the share image, the logo files and these tokens are all built from it by `tools/build_tokens.py`.
- To change a colour, font or size, change it there, in code or in Figma through the Tokens Studio plugin, which syncs that file on the `preview` branch. Then re-sync this page. An edit made only on this page doesn't reach the website and is overwritten at the next sync.
- `brand-ink` colours the logo **and** the practice name together, everywhere. Never colour one without the other.

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

- Two faces, both self-hosted and open-licensed (OFL, in `fonts/`): **Fredoka** for headings and buttons, and **Quicksand** for everything else.
- Headings: `title`, `heading`, `subheading` (Fredoka 600/500, tight leading, −0.01em). The `wordmark` style (Fredoka 700) is for the name under the logo only.
- Text: `lead` (19px, 600, `ink`) for the one intro line; `body` (17px, 500, line height 1.7, `ink-soft`); `chip` (700) for chip and tag labels; `small` for notes.
- Print: `print-title` 28pt, `print-kid` 16pt (anything a child reads, never under 14pt), `print-body` 11pt for adults, `print-small` 8.5pt minimum.
- Highlight one or two words per title with `fmt-swash` (a hand-drawn `sun` underline). One swash per page.

## Shape and space

- **Nested corners are concentric.** When a rounded thing sits inside another, the outer radius = the inner radius + the gap between them (+ the outer border). Simone's card: photo `radius-md` (16px) + 24px gap = 40px. The side menu: 22px pill + 8px gap + 2px border = 32px. Use `.fmt-nest` (set `--nest-inner` and `--nest-gap`) rather than picking a number by eye.
- Everything is soft and round: chips and buttons are pills (`radius-pill`); cards `radius-card` (24px); photo frames `radius-frame` (28px); notes `radius-note` (22px); icon tiles `radius-tile`/`radius-card`.
- Spacing steps run `space-1` (4px) to `space-14` (56px). Use `space-8` between cards and `space-14` between sections.
- Shadows (`shadow-soft`, `shadow-raised`, `shadow-button`) are screen-only. On print, separate with tint or a `purple-line` border.
- Section edges on the website are gentle waves. On print, use straight edges and tinted panels.

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
- **Focus** (2.4.13 Focus Appearance, AAA): a 3px `focus` (ink) ring with a 2px `paper` gap, on everything interactive, on every ground.
- **Target size 44×44 or larger** (2.5.5, AAA): buttons are 48px tall; tappable cards are larger still.
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
