# Choices

Tiles to choose from: a child circles them on paper, or taps them on a screen. The same tile, corner and colours on every medium.

- Markup: `<ul class="fmt-choices">` of `<li>` each holding one `.fmt-choice` (`is-teal`, `is-sun`, `is-pink`; purple by default) with a small `IconTile` and the label.
- On paper the tile is a `<div>`. On a screen it's a `<button type="button" aria-pressed>`: pressed tiles fill with the tint and take a double outline in the tone (not colour alone), and every tile is 44px or taller.
- Columns: three on A4 and A5 (`--cols`), and on a screen as many as fit up to three, never fewer than two on a phone.
- Labels are what the child reads (`text-kid`): two to five words, sentence case, a verb first ("Squeeze a cushion").
- Corners nest: the icon tile's `radius-tile` + `card-pad` + `border-outline`.
- In code: `<Choices tone="teal" items={[{label:'Take 5 slow breaths', icon:'breathe'}]} />`; add `selected` and `onToggle` on a screen.
