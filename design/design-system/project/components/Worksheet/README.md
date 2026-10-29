# Worksheet

An A4 handout for home (`fmt-sheet`, 210 × 297 mm). Inside it the semantic tokens take their paper values (`.medium-paper`), so every component sizes itself for print.

- Order, top to bottom, `stack` apart: the header (`fmt-head`: the `h1` with one `fmt-swash` and the Name line share the top row, Name on the title's baseline; the tag sits under the title), the activity in Groups, one `fmt-note is-centred` "For grown-ups:" tip, and `fmt-foot`.
- Tone (`tone`): purple, teal, sun or pink, matching the skill area. It sets the header tint, the tag and the note; write-on lines stay `rule`.
- Header: outlined in the tone's line colour (`purple-line`, `teal-line`, `sun-line`, `pink-line`), corner `radius-tile` + `card-pad` + `border-outline`. Note corner: `radius-tile` + `card-pad` + `border-outline`. Boxes and choices nest the same way.
- Fill the page: give one Group `is-fill` (or `is-spread`) so spare height goes to the activity, not a gap above the footer. The footer always shows the logo, the sign-off and the copyright line; if it doesn't fit, cut content, never the footer.
- Words a child reads: `text-kid` (16pt). Parent text: `text-base` (11pt). Nothing under 8.5pt.
- Must work in black and white: steps differ by number and word, lines are `rule`.
- The same content on a screen: swap `fmt-sheet` for `fmt-screen` (choices become buttons).
- Render to PDF with Chromium (`page.pdf({format: 'A4', printBackground: true})`).
- In code: `<Worksheet tag="Feelings" tone="teal" title={…} tip="…"><Group …/></Worksheet>`.
