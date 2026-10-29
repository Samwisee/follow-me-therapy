# InfoNote

A tinted strip, outlined in its line colour, with an icon tile in its top corner: a side note, a caveat, a piece of evidence, or the practice's promise.

- Markup: `<p class="fmt-note"><i><svg>…</svg></i><span>words</span></p>`. The tile holds a line icon (Icons group: `info`, `book`, `heart`) in the note's colour on `paper`.
- **Concentric corners:** the tile (`size-tile-md`, `radius-tile`, with a `size-icon-lg` icon) sits in the top corner, so the note's radius = `radius-tile` + `card-pad` + `border-outline`. The first line of words sits level with the middle of the tile.
- Purple (default) for information and caveats; `is-teal` for research and evidence; `is-promise` (paper, heading face, heart) for the one line about how Simone works. Use the promise at most once per piece.
- **A note with a link is one target** on the website: the whole strip is clickable, lifts on hover, and takes the focus ring.
- On print, notes are where parent tips go ("Try this at bath time").
- In code: `<InfoNote kind="evidence">…</InfoNote>` (kinds: info, evidence, promise).
