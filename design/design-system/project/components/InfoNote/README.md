# InfoNote

A tinted strip with a round coloured badge: a side note, a caveat, a piece of evidence, or the practice's promise.

- Markup: `<p class="fmt-note"><i><svg>…</svg></i><span>words</span></p>`. The badge icon is a 24×24 line icon (Icons group: `info`, `book`, `heart`) drawn in `paper`.
- Purple (default) for information and caveats; `is-teal` for research and evidence; `is-promise` (paper, heading face, heart) for the one line about how Simone works. Use the promise at most once per piece.
- No card shadow and no left border. The tint alone sets it apart.
- On print, notes are where parent tips go ("Try this at bath time").
- In code: `<InfoNote kind="evidence">…</InfoNote>` (kinds: info, evidence, promise).
