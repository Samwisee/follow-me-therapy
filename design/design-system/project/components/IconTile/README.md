# IconTile

A rounded square in a tint, outlined in its line colour, with a 40×40 line icon in the matching colour. It marks a service, a funding type or an activity.

- Markup: `<span class="fmt-tile is-purple|is-teal|is-sun|is-pink">` around an inline `<svg viewBox="0 0 40 40">` (stroke 2.6, round caps). Add `is-small` for the 60px size. Filled icons (the footprints) take `class="is-filled"` on the svg.
- Paste the icon's paths inline so it takes the tile colour. The uploaded SVGs in the Icons group are drawn in `ink` for use as plain images.
- Colour per service, as on the site: 5 Steps Forward purple, Steady Steps teal, ESDM sun, Assessments pink. Funding: NDIS purple, Medicare teal, Private sun.
- Every icon colour is 4.4:1 or better on its tile, well over the 3:1 needed for icons: `purple`, `teal`, `sun-deep` and `pink` were checked (sun-deep and pink were darkened in October 2026 to get there).
- In code: `<IconTile icon="blocks" tone="sun" label="ESDM" />`.
