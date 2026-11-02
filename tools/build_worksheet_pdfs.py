"""Printable worksheets for the app, from the worksheets canvas.

    python3 tools/build_worksheet_pdfs.py <canvas-root> <out-dir>

<canvas-root> is a saved copy of the worksheets canvas (its project/*.dc.html
artboards); <out-dir> is the app's composeApp/src/wasmJsMain/resources/worksheets.
It writes:
  sheets/<Name>.html  each worksheet, just its A4 sheet (templates filled in)
  print.css           the website's tokens.css and the Design System's bundle.css,
                      the fonts, and the print rules (A4, a sheet a page)
  assets/             the fonts and the logo
  print.html          the page the app opens (in its own window): print.html?s=Main,Calm-plan
                      shows those sheets; Print opens the print dialog (one job for all)
  worksheets.json     every sheet: {name, title}
Vector, so it prints sharp, and small. Run it again whenever a worksheet or
the design changes, and commit the result in the app (its CI checks it).
"""
import json
import re
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
src = Path(sys.argv[1]) / "project"
out = Path(sys.argv[2])

# The canvas's uploaded files (/_blob/…) are these files of the website.
BLOBS = {
    "852c735d60a871046077c9a55533f865": "fonts/fredoka-latin-variable.woff2",
    "8ef5000c816116f00ab4a575bada1139": "fonts/quicksand-latin-500-normal.woff2",
    "ee657bae73f133dfb1b9775a5b6b32ce": "fonts/quicksand-latin-600-normal.woff2",
    "e203ab5b910581a78400d8b3c6ed6a3b": "fonts/quicksand-latin-700-normal.woff2",
    "b3b42cc60fb233a38ec201683244feeb": "img/brand/follow-me-therapy-lockup-horizontal.svg",
    "9aa42ecabbb509ba515995b4bb0f3122": "img/brand/follow-me-therapy-lockup-horizontal.svg",
}


def local(text: str) -> str:
    """Canvas file links → the copies in assets/ (relative to print.html)."""
    for blob, path in BLOBS.items():
        text = text.replace(f"/_blob/{blob}", "assets/" + Path(path).name)
    return text


def sheet_of(dc: str) -> str:
    """The artboard's A4 sheet, its templates filled in."""
    body = re.search(r"<x-dc>(.*?)</x-dc>", dc, re.S).group(1)
    body = re.sub(r"<helmet>.*?</helmet>", "", body, flags=re.S).strip()
    vals = re.search(r"renderVals\(\)\s*\{\s*return\s*(\{.*?\});", dc, re.S)
    data = {}
    if vals and vals.group(1).strip() != "{}":
        data = json.loads(re.sub(r"(\w+):", r'"\1":', vals.group(1)).replace("'", '"'))

    def expand(html: str) -> str:  # the only template the sheets use: sc-for over a list
        while True:
            m = re.search(r'<sc-for list="\{\{(\w+)\}\}" as="(\w+)"[^>]*>', html)
            if not m:
                return html
            depth, i = 1, m.end()
            while depth:
                o, c = html.find("<sc-for", i), html.find("</sc-for>", i)
                if o != -1 and o < c:
                    depth += 1; i = o + 7
                else:
                    depth -= 1; i = c + 9
            inner = html[m.end():i - 9]
            html = html[:m.start()] + "".join(expand(inner.replace("{{" + m.group(2) + "}}", str(v))) for v in data[m.group(1)]) + html[i:]

    return local(expand(body))


PRINT_CSS = """
/* Printing: an A4 page a sheet, nothing else. */
@page { size: A4; margin: 0; }
html, body { margin: 0; background: var(--purple-tint); }
.bar { position: sticky; top: 0; z-index: var(--z-sticky); display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-3); padding: var(--space-3) var(--gutter); background: var(--bar-fill); border-bottom: var(--border-outline) solid var(--bar-line); font-family: var(--font-body); color: var(--ink); }
.bar p { flex: 1 1 12em; margin: 0; font-size: var(--text-base); }
.bar #tip { flex-basis: 100%; order: 3; font-size: var(--text-sm); }
.bar [hidden] { display: none; }
.pages { display: grid; justify-items: center; gap: var(--space-6); padding: var(--space-6) 0 var(--space-12); }
html, body { overflow-x: hidden; }
/* On screen a sheet is shrunk to the page's width (the sheet sits out of the flow, so a
   794px sheet never widens the page on a phone); printed, it's its full A4 size. */
.page { position: relative; width: min(794px, calc(100vw - 2 * var(--space-4))); aspect-ratio: 794 / 1123; overflow: hidden; background: var(--paper); box-shadow: var(--shadow-soft); }
.page > .fmt-sheet { position: absolute; top: 0; left: 0; transform-origin: top left; }
/* Loading: a spinner until every sheet, font and picture is in. */
.loading { display: grid; justify-items: center; gap: var(--space-4); padding: var(--space-12) var(--gutter); font-family: var(--font-body); color: var(--ink); }
.loading i { width: var(--size-target); height: var(--size-target); border: var(--border-focus) solid var(--purple-line); border-top-color: var(--purple); border-radius: 50%; animation: spin var(--dur-slower) linear infinite; }
.loading[hidden] { display: none; }
@keyframes spin { to { transform: rotate(1turn); } }
@media (prefers-reduced-motion: reduce) { .loading i { animation-duration: calc(var(--dur-slower) * 4); } }
@media print {
  html, body { background: var(--paper); overflow: visible; }
  .bar, .loading { display: none; }
  .pages { display: block; padding: 0; }
  /* A sheet a page, a little smaller than A4 so it fits inside any printer's or
     browser's margins (a full-size sheet spills over and leaves a blank page). */
  .page { position: static; display: flex; justify-content: center; width: auto; aspect-ratio: auto; overflow: hidden; box-shadow: none; break-inside: avoid; }
  .page + .page { break-before: page; }
  .page > .fmt-sheet { position: static; transform: none !important; zoom: 0.9; }
}
"""

PRINT_HTML = """<!doctype html>
<html lang="en-AU">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Print · Follow Me Therapy</title>
<link rel="icon" type="image/svg+xml" href="assets/favicon.svg">
<link rel="stylesheet" href="print.css">
</head>
<body>
<div class="bar">
  <a class="fmt-btn is-outline" id="back" href="../">‹ Back</a>
  <p id="status" role="status">Getting your worksheets ready…</p>
  <p id="tip" hidden>In the print window, untick <b>Print headers and footers</b> so the page doesn't show the web address.</p>
  <button class="fmt-btn" id="print" type="button" disabled>Print</button>
</div>
<div class="loading" id="loading" aria-hidden="true"><i></i></div>
<main class="pages" id="pages" aria-busy="true"></main>
<script>
// GENERATED by follow-me-therapy/tools/build_worksheet_pdfs.py. print.html?s=Main,Calm-plan
// Back: to where they were in the app (it opened this page in the same window).
document.getElementById("back").onclick = function (e) {
  if (history.length > 1 && document.referrer.indexOf(location.origin) === 0) { e.preventDefault(); history.back(); }
};
(async function () {
  var status = document.getElementById("status"), button = document.getElementById("print"), pages = document.getElementById("pages");
  var all = await fetch("worksheets.json").then(function (r) { return r.json(); });
  var asked = (new URLSearchParams(location.search).get("s") || "").split(",");
  var chosen = asked.map(function (n) { return all.filter(function (w) { return w.name === n; })[0]; }).filter(Boolean);
  if (!chosen.length) { document.getElementById("loading").hidden = true; status.textContent = "No worksheets chosen. Go back and pick some."; return; }
  // All the sheets at once, then shown in the order asked.
  var htmls = await Promise.all(chosen.map(function (w) { return fetch("sheets/" + w.name + ".html").then(function (r) { return r.text(); }); }));
  pages.hidden = true;
  htmls.forEach(function (html) {
    var page = document.createElement("div");
    page.className = "page";
    page.innerHTML = html;
    pages.appendChild(page);
  });
  // On screen each sheet is shrunk to its page's width (set by the CSS); printed, it's full A4.
  function fit() {
    pages.querySelectorAll(".page").forEach(function (p) {
      p.firstElementChild.style.transform = "scale(" + p.clientWidth / 794 + ")";
    });
  }
  await document.fonts.ready;
  await Promise.all([].map.call(document.images, function (im) { return im.complete ? 0 : new Promise(function (d) { im.onload = im.onerror = d; }); }));
  document.getElementById("loading").hidden = true;
  pages.hidden = false;
  pages.removeAttribute("aria-busy");
  fit();
  window.addEventListener("resize", fit);
  var n = chosen.length;
  status.textContent = (n === 1 ? chosen[0].title : n + " worksheets") + ": ready to print on A4.";
  button.disabled = false;
  // Only ever from a tap on Print (never on its own), so the browser lets it through.
  button.addEventListener("click", function () { window.print(); });
  // Safari on a Mac adds the web address and date unless that's unticked (phones don't).
  if (/Macintosh/.test(navigator.userAgent) && /Safari/.test(navigator.userAgent) && !/Chrome|Chromium|Edg|Firefox/.test(navigator.userAgent) && navigator.maxTouchPoints < 2) document.getElementById("tip").hidden = false;
  document.body.dataset.ready = String(n);
  if (performance.mark) performance.mark("ready");
})();
</script>
</body>
</html>
"""

if out.exists():
    for old in out.glob("*.pdf"):
        old.unlink()
    shutil.rmtree(out / "sheets", ignore_errors=True)
(out / "sheets").mkdir(parents=True, exist_ok=True)
(out / "assets").mkdir(exist_ok=True)
for path in list(BLOBS.values()) + ["img/favicon.svg"]:
    shutil.copy(ROOT / path, out / "assets" / Path(path).name)

made, faces = [], set()
for f in sorted(src.glob("*.dc.html")):
    dc = f.read_text()
    if 'class="fmt-sheet"' not in dc:
        continue
    faces.update(re.findall(r"@font-face \{[^}]*\}", dc))
    name = f.name.replace(".dc.html", "")
    (out / "sheets" / f"{name}.html").write_text(sheet_of(dc) + "\n")
    made.append({"name": name, "title": re.search(r"<title>(.*?)</title>", dc).group(1)})

css = "/* GENERATED by follow-me-therapy/tools/build_worksheet_pdfs.py from the website's tokens.css and the Design System's bundle.css. */\n"
css += local("\n".join(sorted(faces))) + "\n"
css += (ROOT / "css/tokens.css").read_text() + "\n"
css += (ROOT / "design/design-system/project/components/bundle.css").read_text() + "\n" + PRINT_CSS
(out / "print.css").write_text(css)
(out / "print.html").write_text(PRINT_HTML)
(out / "worksheets.json").write_text(json.dumps(made, indent=1, ensure_ascii=False) + "\n")
print(f"{len(made)} worksheets → {out}")
