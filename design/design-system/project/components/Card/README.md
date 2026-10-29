# Card

A white card with an icon tile, a title, one or two sentences and a "Learn more ›" line. Used for services and funding options.

- **Wrapped in its colour:** a `border-outline` outline in the card's colour (`tone`: purple, teal, sun or pink, matching its icon tile). No coloured strip along the top.
- **Concentric corners:** the icon tile sits in the top corner, so the card's radius = `radius-tile` + `card-pad` + `border-outline`.
- Markup: `<div class="fmt-card is-teal">` holding a `fmt-tile`, an `<h3>`, a `<p>` and an optional `<span class="fmt-more">` with a chevron.
- On the website, a **service card** sets its title beside the tile, with the sentence and "Learn more ›" beneath. A **funding card** is only the tile and the name (NDIS, Medicare, Private), centred, three in a row even on a phone; its corners nest round the tile with `space-3` padding.
- Lifts and tilts on hover (`shadow-raised`, `ease-spring`). Cards in a row share one height; keep the copy to one or two sentences so they stay even.
- On print the outline carries the shape; drop the shadow.
- Links use a chevron (›), never an arrow.
- In code: `<Card icon="stairs" tone="teal" title="Steady Steps" href="…">…</Card>`.
