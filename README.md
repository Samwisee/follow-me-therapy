# Follow Me Therapy website

Static site for [followmetherapy.com.au](https://followmetherapy.com.au), hosted on GitHub Pages from `main`.

## Structure

| Path | What it is |
|---|---|
| `index.html` | Home page (content, pop-up markup, the two animated illustrations inline) |
| `css/home.css`, `js/home.js` | Home page styles and behaviour |
| `*-occupational-therapy.html`, `esdm-melbourne.html`, `occupational-therapy-north-western-melbourne.html` | Landing pages, **generated** by `tools/build_pages.py` |
| `css/pages.css`, `js/pages.js` | Shared styles and behaviour for the landing pages and 404 |
| `privacy.html`, `404.html` | Privacy policy and not-found page |
| `fonts/` | Self-hosted Fredoka and Quicksand (OFL) |
| `img/` | Logo, icons, flags, Simone's cut-out, share image (`og.jpg`) |
| `sitemap.xml`, `robots.txt`, `CNAME` | Search and domain config |

## Editing

- **Home page copy:** edit `index.html`. Service and funding pop-up text lives in `js/home.js` (`serviceDetails`, `fundingDetails`) and is mirrored in `js/pages.js`.
- **Landing pages:** edit the content in `tools/build_pages.py`, then run `python3 tools/build_pages.py`. Don't edit the generated HTML by hand.
- **Illustrations:** from unDraw's MIT-licensed set, recoloured and inlined in `index.html`. Animated parts are tagged with `a-*` classes.

## Workflow

Changes go to the `preview` branch first so they can be checked before going live:

```
https://raw.githack.com/Samwisee/follow-me-therapy/<commit-hash>/index.html
```

Use a commit hash, not the branch name, as raw.githack caches branch links. Merge `preview` into `main` to publish.

## Forms

- Referral and enquiry forms are hosted by Splose.
