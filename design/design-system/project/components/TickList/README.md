# TickList

Plain lines with a teal tick circle: what's included, what to bring, steps done.

- Markup: `<ul class="fmt-ticks">` with plain `<li>` lines. `<b>` for a lead-in phrase in `ink`.
- No card or border around each line. (The site dropped the boxed version in October 2026 to save space.)
- `is-blank` swaps the tick for an empty teal-edged box, for checklists a child or parent ticks by hand on paper.
- Three to six lines. Longer lists split under sub-headings.
- In code: `<TickList items={['Shoes on','Hat on']} blank />`.
