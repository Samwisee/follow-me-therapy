"""Letter-tracing worksheets (A4), from design/letters.json.

    python3 tools/build_letter_sheets.py <canvas-root>

Writes the worksheet canvas's letter sheets (project/Letters-*.dc.html and
project/Ready-to-write.dc.html) under <canvas-root>, and prints their boards
for project/canvas.json. Each row: the model letter (solid, gold start dot,
numbered strokes, an arrow), then dashed copies to trace, then room to write
one on their own, on the same writing lines as the app (LetterTrace).
"""
import json, math, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
L = json.loads((ROOT / "design/letters.json").read_text())
LINES = L["lines"]
OUT = Path(sys.argv[1]) / "project"
ROW_UNITS = 560          # the row's width in letter units (the box is 100 high)

HEAD = """<!doctype html>
<html lang="en-AU">
<head>
<meta charset="utf-8">
<title>{title}</title>
<script src="./support.js"></script>
<link rel="stylesheet" href="ds/followmetherapy/tokens.css">
<link rel="stylesheet" href="ds/followmetherapy/components/bundle.css">
</head>
<body>
<x-dc>
<helmet>
<style>
@font-face {{ font-family: "Fredoka"; font-weight: 300 700; src: url("/_blob/852c735d60a871046077c9a55533f865") format("woff2"); }}
@font-face {{ font-family: "Quicksand"; font-weight: 500; src: url("/_blob/8ef5000c816116f00ab4a575bada1139") format("woff2"); }}
@font-face {{ font-family: "Quicksand"; font-weight: 600; src: url("/_blob/ee657bae73f133dfb1b9775a5b6b32ce") format("woff2"); }}
@font-face {{ font-family: "Quicksand"; font-weight: 700; src: url("/_blob/e203ab5b910581a78400d8b3c6ed6a3b") format("woff2"); }}
body {{ margin: 0; }}
</style>
</helmet>
<section class="fmt-sheet" style="width: 794px; height: 1123px;">
  <header class="fmt-head is-sun">
    <div>
      <h1>{h1}</h1>
      <span class="fmt-tag is-sun">Writing</span>
    </div>
    <p class="fmt-name">Name <span></span></p>
  </header>
"""
TAIL = """
  <p class="fmt-note is-centred is-sun">
    <i><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M12 11v5.5"></path><path d="M12 7.6v.1"></path></svg></i>
    <span><b style="color: var(--ink);">For grown-ups:</b> {tip}</span>
  </p>

  <footer class="fmt-foot">
    <img src="/_blob/b3b42cc60fb233a38ec201683244feeb" alt="Follow Me Therapy">
    <span>Simone · Paediatric OT · followmetherapy.com.au<br>© Follow Me Therapy 2026. For use by the family it was given to.</span>
  </footer>
</section>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{{"$preview":{{"width":794,"height":1123}}}}'>
class Component extends DCLogic {{
  renderVals() {{ return {{}}; }}
}}
</script>
</body>
</html>
"""


def pts(stroke, dx):
    return " ".join(f"{x + dx:g},{y:g}" for x, y in stroke)


def glyph_svg(g, dx, model):
    out = []
    for st in g["strokes"]:
        out.append(f'<polyline class="fmt-letter-stroke" points="{pts(st, dx)}"></polyline>')
    if model:
        for i, st in enumerate(g["strokes"]):
            k = min(8, len(st) - 2)
            (x0, y0), (x1, y1) = st[k], st[min(k + 3, len(st) - 1)]
            n = math.hypot(x1 - x0, y1 - y0) or 1
            ux, uy = (x1 - x0) / n, (y1 - y0) / n
            nx, ny = uy, -ux
            ax, ay = x0 + nx * 7 + dx, y0 + ny * 7
            out.append(f'<polyline class="fmt-letter-arrow" points="{ax - ux*3 + nx*2.5:.1f},{ay - uy*3 + ny*2.5:.1f} {ax:.1f},{ay:.1f} {ax - ux*3 - nx*2.5:.1f},{ay - uy*3 - ny*2.5:.1f}"></polyline>')
    for st in g["strokes"]:
        out.append(f'<circle class="fmt-letter-start" cx="{st[0][0] + dx:g}" cy="{st[0][1]:g}" r="3.5"></circle>')
    if model and len(g["strokes"]) > 1:
        for i, st in enumerate(g["strokes"]):
            same = sum(1 for o in g["strokes"][:i] if math.hypot(o[0][0] - st[0][0], o[0][1] - st[0][1]) < 6)
            out.append(f'<text class="fmt-letter-num" x="{st[0][0] - 9 + dx:g}" y="{st[0][1] - 4 - 9 * same:g}">{i + 1}</text>')
    return "".join(out)


def row(name, g, label, units=ROW_UNITS):
    """The model, dashed copies, then room to write: one SVG on writing lines."""
    w = g["width"]
    copies = max(1, min(6, int((units * 0.78 - w) // (w + 6))))
    lines = "".join(f'<line class="{c}" x1="0" x2="{units}" y1="{y}" y2="{y}"></line>' for c, y in
                    [("fmt-letter-guide", LINES["top"]), ("fmt-letter-guide is-waist", LINES["waist"]), ("fmt-letter-base", LINES["base"]), ("fmt-letter-guide", LINES["descender"])])
    model = f'<g>{glyph_svg(g, 0, True)}</g>'
    traces = "".join(f'<g class="is-trace">{glyph_svg(g, (w + 6) * (i + 1), False)}</g>' for i in range(copies))
    return (f'    <svg class="fmt-letter fmt-letter-row" viewBox="0 0 {units} 100" role="img" aria-label="{label}: trace it {copies} times, then write your own.">{lines}{model}{traces}</svg>')




def sheet(file, title, h1, kid, names, set_, words, tip, units=ROW_UNITS):
    body = [HEAD.format(title=title, h1=h1), f'  <p class="fmt-kid">{kid}</p>\n', '  <div class="fmt-group is-spread">\n']
    for n in names:
        body.append(row(n, L[set_][n], words(n), units) + "\n")
    if len(names) < 4:
        # Room left: write their name on the same lines.
        lines = "".join(f'<line class="{c}" x1="0" x2="{units}" y1="{y}" y2="{y}"></line>' for c, y in
                        [("fmt-letter-guide", LINES["top"]), ("fmt-letter-guide is-waist", LINES["waist"]), ("fmt-letter-base", LINES["base"]), ("fmt-letter-guide", LINES["descender"])])
        body.append('    <div class="fmt-group">\n      <h2>Now write your name</h2>\n')
        for _ in range(4 - len(names)):
            body.append(f'      <svg class="fmt-letter fmt-letter-row" viewBox="0 0 {units} 100" aria-hidden="true">{lines}</svg>\n')
        body.append("    </div>\n")
    body.append("  </div>\n")
    body.append(TAIL.format(tip=tip))
    (OUT / file).write_text("".join(body))
    return file, title


LOWER_TIP = "these are the letter shapes Victorian schools teach. Show where the gold dot is and follow the arrow together first. Sit at a table, feet flat, and let your child trace slowly; then they write one on their own in the space at the end. A few letters a day is plenty."
CAP_TIP = "capitals start at the top and go down first. Show where the gold dot is and follow the numbers together first. Sit at a table, feet flat, and let your child trace slowly; then they write one on their own in the space at the end. A few letters a day is plenty."
groups = lambda keys, n: [keys[i:i + n] for i in range(0, len(keys), n)]
made = []
for g in groups(list(L["lowercase"]), 4):
    made.append(sheet(f"Letters-{g[0]}-{g[-1]}.dc.html", f"Letters {g[0]}–{g[-1]}", f'Letters <span class="fmt-swash">{" ".join(g)}</span>',
                      "Start at the gold dot and follow the arrow. Trace the grey letters, then write your own.", g, "lowercase", lambda n: f"Letter {n}", LOWER_TIP))
for g in groups(list(L["capitals"]), 4):
    made.append(sheet(f"Capitals-{g[0]}-{g[-1]}.dc.html", f"Capitals {g[0]}–{g[-1]}", f'Capitals <span class="fmt-swash">{" ".join(g)}</span>',
                      "Start at the gold dot and go in number order. Trace the grey letters, then write your own.", g, "capitals", lambda n: f"Capital {n}", CAP_TIP))
SHAPE_WORDS = {"down": "Down", "across": "Across", "circle": "Circle", "cross": "Cross", "mountains": "Mountains", "loops": "Loops"}
made.insert(0, sheet("Ready-to-write.dc.html", "Ready to write", 'Ready to <span class="fmt-swash">write</span>',
                     "Start at the gold dot and follow the arrow. Trace the grey shapes, then draw your own.", list(L["shapes"]), "shapes",
                     lambda n: f"{SHAPE_WORDS[n]} shape",
                     "these are the shapes letters are made of. Sit at a table with feet flat on the floor, and let your child trace with a finger first, then a crayon or pencil. Five minutes is plenty; praise the effort, not the neatness.", units=900))
print(json.dumps([{"file": f, "title": t} for f, t in made]))
