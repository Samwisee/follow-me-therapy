# Card

A white rounded card with an icon tile, a title, one or two sentences and a "Learn more ›" line. Used for services and funding options.

- Markup: `<div class="fmt-card">` holding a `fmt-tile`, an `<h3>`, a `<p>` and an optional `<span class="fmt-more">` with a chevron.
- Put cards on a tinted ground (`purple-tint`, `butter`). A white card on paper needs `shadow-soft` to show, and on print use a `purple-line` border instead, since shadows don't print well.
- Cards in a row share one height. Keep the copy to one or two sentences so they stay even.
- Links use a chevron (›), never an arrow.
- In code: `<Card icon="stairs" tone="teal" title="Steady Steps" href="…">…</Card>`.
