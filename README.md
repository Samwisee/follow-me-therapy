# Follow Me Therapy website

Static site for [followmetherapy.com.au](https://followmetherapy.com.au), hosted on GitHub Pages from `main`.

## Structure

| Path | What it is |
|---|---|
| `index.html` | Home page (content, pop-up markup, the two animated illustrations inline) |
| `design/tokens.json` | **The design tokens: the single source for every colour, font and size.** `tools/build_tokens.py` turns them into `css/tokens.css`, re-colours the logo and stamps the few places CSS variables can't reach. See `design/README.md`, which also covers Figma |
| `css/tokens.css` | Generated CSS variables, loaded first on every page. Don't edit |
| `css/site.css` | Everything every page shares: base, layout, section titles, buttons, chips, cards, notes, steps, pop-ups, the Contact me button, motion and page transitions |
| `css/home.css`, `js/home.js` | Home page only: the menu (top bar / side rail and the morph between them), hero, sections, footer |
| `*-occupational-therapy.html`, `esdm-melbourne.html`, `occupational-therapy-north-western-melbourne.html` | Landing pages, **generated** by `tools/build_pages.py` |
| `css/pages.css`, `js/pages.js` | Shared styles and behaviour for the landing pages and 404 |
| `privacy.html`, `404.html` | Privacy policy and not-found page |
| `fonts/` | Self-hosted Fredoka and Quicksand (OFL) |
| `img/brand/` | Vector logo: the mark and two lockups, ink and white. The mark is traced from `img/logo.png` by `tools/trace_logo.py`; the lockups are built by `tools/make_lockups.py` (name outlined in Fredoka, so they print without the font) |
| `img/` | Logo, icons, flags, Simone's cut-out, share image (`share-<hash>.jpg`, rendered from `tools/og.html` by `python3 tools/make_og.py`, which also names it by content and updates every og:image tag, since chat apps cache images by URL; CI re-renders it when the design changes) |
| `sitemap.xml`, `robots.txt`, `CNAME` | Search and domain config |

## Editing

- **Home page copy:** edit `index.html`. Service and funding pop-up text lives in `js/home.js` (`serviceDetails`, `fundingDetails`) and is mirrored in `js/pages.js`.
- **Landing pages:** edit the content in `tools/build_pages.py`, then run `python3 tools/build_pages.py`. Don't edit the generated HTML by hand.
- **Callout:** the “Every session…” card wears a small cloud (`img/cloud-wide.svg`, drawn by `python3 tools/make_cloud.py`).
- **Illustrations:** from unDraw's MIT-licensed set, recoloured and inlined in `index.html`. Animated parts are tagged with `a-*` classes.

## Workflow

Changes go to the `preview` branch first so they can be checked before going live:

```
https://raw.githack.com/Samwisee/follow-me-therapy/<commit-hash>/index.html
```

Use a commit hash, not the branch name, as raw.githack caches branch links. Merge `preview` into `main` to publish.

## Forms

- Referral and enquiry forms are hosted by Splose.
