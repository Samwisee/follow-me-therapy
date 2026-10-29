# Tracker

A week of practice: a row per activity (written in by the grown-up), a star per day for the child to colour.

- Markup: `<table class="fmt-tracker">` with a header row (`My activity`, then the days) and one row per activity; each day cell holds the 24px `star` icon.
- The activity column is a write-on line (`rule`); stars are `purple`, outlined, so a child colours them in.
- Four or five rows on A4, three in the A5 book. Days are three letters, Monday first.
- On a screen, the same table becomes a weekly checklist: each star is a toggle button.
- In code: `<Tracker rows={5} />`.
