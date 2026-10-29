# Worksheet

An A4 handout for home: a tinted header with a tag and title, the activity, a parent tip, and a footer with the logo and web address.

- Markup: `<section class="fmt-sheet">` (210 × 297 mm, 10 mm padding) holding, in order: `fmt-head` (tag, `h1`, optional `fmt-name` write-on line), the activity, an optional `fmt-note` for grown-ups, and `fmt-foot`.
- The consumer supplies the title, the activity content (tick list, picture boxes, `fmt-write` lines) and the parent tip.
- Words a child reads use `fmt-kid` (16pt). Parent instructions stay at `print-body` (11pt). Nothing under 8.5pt.
- Put one `fmt-swash` under the key word of the title.
- Picture boxes are tinted `fmt-tile` squares. Drop in the photo or drawing, or leave blank for the child to draw.
- Everything must still read in black and white. Many families print at home on mono printers, so never rely on colour alone to tell steps apart.
- Render to PDF with Chromium (`page.pdf({format: 'A4', printBackground: true})`). Never ship the HTML to print from a browser.
