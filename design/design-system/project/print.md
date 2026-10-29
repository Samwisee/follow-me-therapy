# Print and the staple book

Printed pieces use the same tokens and components as the site, with print sizes from the `print` token family and the `Worksheet` and `BookPage` components.

## Handouts (A4, printed at home or in clinic)

- Page `page-a4`. Keep text and icons inside `safe-margin` (10 mm). Home printers can't print to the edge, so don't run colour off the page.
- They must work in black and white. Check every handout printed in greyscale. Steps differ by number, word or icon, never by colour alone.
- Use tints sparingly (header, one note). Large solid fills waste ink at home.
- Ship as PDF only, rendered by Chromium from the HTML source with `printBackground: true`.

## The staple book (A5, saddle-stitched)

- Finished size A5 (`page-a5`): A4 sheets folded in half and stapled on the fold.
- **The page count must be a multiple of 4**, cover included (each sheet makes 4 pages). Plan 12, 16, 20 or 24 pages, then add notes pages or a "my progress" page to reach the next multiple.
- Margins: `gutter-book` (15 mm) on the fold side, `safe-margin-book` (12 mm) on the other three. Inner pages creep outward as the stack gets thicker, so nothing important goes near the outer edge.
- **Bleed:** any colour or image touching a trimmed edge extends 3 mm past it (`bleed`). Each print page is then 154 × 216 mm.
- Cover on heavier stock (250–300 gsm silk); inner pages 120–150 gsm so a child can draw on them and they stand up to crayons.
- Give the printer a single-page PDF in reading order, with bleed and crop marks. Let them do the imposition (pairing pages for printing) unless they ask otherwise.
- Colour: we design in screen colours (sRGB). Before the first print run, order one proof copy and compare `purple` and `teal` against the site. Purples often print duller, so adjust the print file if needed and record the change here.
- The back cover carries the logo, the web address, the ABN (84 679 395 414) and the © line.

## Selling

- An ISBN is optional for a book sold direct. Get one (Thorpe-Bowker in Australia) only if it will go through bookshops or libraries.
- A copyright line on every piece: "© Follow Me Therapy 2026. For use by the family it was given to."
