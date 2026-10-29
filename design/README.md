# The design system: one source for every product

Three files here are the whole design system. Every product (the website, the
share image, the Design System page, the worksheets and books, and the app in
Samwisee/follow-me-therapy-app) reads them; none keeps its own copy of a rule.

| File | What it holds |
|---|---|
| `design/tokens.json` | Every colour, font, size, space, radius, shadow and motion value; **tones** (the role each colour plays in purple, teal, sun and pink: tint, ink, line, solid, strong, ground, icon, on-solid); and **component tokens** (which role or value each part of a shared component takes: `component.chip.fill` = the tone's tint, `component.chip.fill-on-ground` = paper …) |
| `design/components.json` | Every shared component: what it is, its rules, its tokens, and where the website, the Design System and the app implement it (or why one doesn't) |
| `design/icons.json` | Every line icon |

## How a change flows, and how it's enforced

1. Change a value or rule in `tokens.json` (or a component in `components.json`, or an icon).
2. `python3 tools/build_tokens.py` writes `css/tokens.css` (`--tone-teal-tint`,
   `--chip-teal-fill`, `--bar-wave` …), the Design System's tokens and component
   READMEs (their Rules block comes from components.json); `npm run design-system`
   rebuilds the component library and its icons. On `preview` the Rebuild action
   does this for you, and re-renders the share image.
3. The app takes the same files on every build and hourly (its Design sync
   workflow), regenerates its Kotlin (`FmtChipTokens`, `FmtIcons` …) and deploys.
4. `python3 tools/check_tokens.py` (every push to preview) and the app's CI fail when:
   - a value is written out by hand instead of a token;
   - a product is missing a component listed in components.json (or doesn't say why);
   - a shared component takes a colour directly (`var(--purple-tint)`,
     `FmtColors.purpleTint`) instead of its component token, so a rule can't be
     changed in one product only;
   - any component's words fall under 7:1 on their fill (icons and state outlines
     under 3:1) in a tone it's used in (WCAG 2.2 AAA).

A new shared component: add it to components.json, then build it in each product
(the checks fail until every product has it). Visual changes are checked by
screenshotting every page and component before and after.

## What depends on it

| Built by `python3 tools/build_tokens.py` | |
|---|---|
| `css/tokens.css` | CSS variables every page loads first; all other CSS uses `var(--name)` |
| Icons inside the CSS | Data-URI SVGs tagged `/* token:<name> */` are re-coloured |
| `<meta name="theme-color" data-token="…">` | The phone address-bar colour |
| `img/brand/*.svg` | The logo files (ink versions take `brand-ink`) |
| `design/design-system/project/tokens.json` | The same tokens in the Design System artifact's format |

`brand-ink` is the colour of the logo **and** the practice name. They can't drift apart.

After a token change: run `python3 tools/build_tokens.py`, then
`python3 tools/build_pages.py`, then `python3 tools/make_og.py` if the share
image should change (and give it a new file name, see the main README).
On the `preview` branch a GitHub Action runs the first two for you whenever
`design/tokens.json` changes.

## The design system page

`design/design-system/project/` holds everything the Design System artifact
shows: the brand book (`README.md`, `print.md`), component guidelines and
previews, `components/bundle.css` (the component styles, also used by printed
resources) and the live component library: `components/src/index.tsx`, built
by `npm run design-system` into `components/bundle.js` with the logo embedded
from `img/brand/`. It's published to the artifact from here, so this folder, not the
page, is what to edit.

## Viewing and editing in Figma

Figma can't read this repo on its own. The link is the **Tokens Studio for Figma** plugin, which reads and writes this exact file:

1. In Figma, install the Tokens Studio for Figma plugin and open it in the design file.
2. Settings › Token format: **W3C DTCG** (`$value`).
3. Settings › Sync providers › Add new › **GitHub**:
   - Personal access token: a fine-grained GitHub token with *Contents: read and write* on `Samwisee/follow-me-therapy` only.
   - Repository `Samwisee/follow-me-therapy`, branch **`preview`**, file path `design/tokens.json`.
4. Pull. The tokens appear in the plugin. From there you can apply them to layers and create Figma styles or variables from them.
5. Edit a value in the plugin and **Push**. That commits to `preview`, the Action rebuilds the CSS and logo, and the preview link shows the change. Deploy as usual when happy.

Always sync with `preview`, never `main`, so a Figma edit can't go live without a check.

The logo SVGs in `img/brand/` can be dragged straight into Figma as vectors.
Components (cards, chips, worksheet pages) are HTML here; they aren't
generated in Figma.
