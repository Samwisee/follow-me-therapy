# Design tokens: the single source

`design/tokens.json` holds every colour, font, size, space, radius and shadow
used by the website, the share image, the logo files and the printed
resources. Change a value here and it flows everywhere.

## What depends on it

| Built by `python3 tools/build_tokens.py` | |
|---|---|
| `css/tokens.css` | CSS variables every page loads first; all other CSS uses `var(--name)` |
| Icons inside the CSS | Data-URI SVGs tagged `/* token:<name> */` are re-coloured |
| `<meta name="theme-color" data-token="…">` | The phone address-bar colour |
| `img/brand/*.svg` | The logo files (ink versions take `brand-ink`) |
| `design/design-system/tokens.json` | The same tokens in the Design System artifact's format |

`brand-ink` is the colour of the logo **and** the practice name. They can't drift apart.

After a token change: run `python3 tools/build_tokens.py`, then
`python3 tools/build_pages.py`, then `python3 tools/make_og.py` if the share
image should change (and give it a new file name, see the main README).
On the `preview` branch a GitHub Action runs the first two for you whenever
`design/tokens.json` changes.

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
