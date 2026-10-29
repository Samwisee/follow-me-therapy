# BookPage

One A5 page of the staple book. Pages pair into spreads: a left page (`is-left`, wider margin on the right, at the fold) and a right page.

- Markup: `<section class="fmt-page">` (148 × 210 mm). Inner margin 15 mm from the fold, outer 12 mm, so text survives the staples and creep.
- A spread does one job: the left page shows or tells, the right page is the child's turn.
- Number pages with `fmt-folio` on the outer corner. The cover is page 1 and isn't numbered.
- A full-colour page ground (like the teal-tint above) must run 3 mm past the trim (`bleed`). Build the print PDF with that bleed added on all three outer edges.
- See the Print section for page counts and imposition.
