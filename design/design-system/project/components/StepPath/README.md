# StepPath

Numbered steps joined by a pair of footprints: a process for parents ("How it works") or a routine for a child, in the practice's own "follow me" language.

- Markup: `<ol class="fmt-steps">` of `<li><span class="fmt-step">Label</span></li>`. The numbers come from the list, so screen readers hear an ordered list.
- `is-down` stacks the steps vertically with the label beside the number; use it for routines and for narrow pages.
- `li.is-done` fills the number in `teal`. Add hidden words for screen readers (`<span class="fmt-sr">(done)</span>`), since the fill alone isn't announced.
- Labels: two to four words, sentence case. Three to six steps; longer sequences split over two rows or pages.
- On print, `is-down` works as a tick-off routine strip: leave the numbers unfilled and let the child colour them in.
