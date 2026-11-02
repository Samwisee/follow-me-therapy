"""Printable worksheets (A4 PDFs), from the worksheets canvas, for the app's
"Print the worksheet" buttons.

    python3 tools/build_worksheet_pdfs.py <canvas-root> <out-dir>

<canvas-root> is a saved copy of the worksheets canvas (its project/*.dc.html
artboards); <out-dir> is where the PDFs go, usually the app's
composeApp/src/wasmJsMain/resources/worksheets. Each artboard is rendered
with the website's own tokens.css and the Design System's bundle.css, fonts
and logo, so a PDF looks like the canvas. Run it again whenever a worksheet
or the design changes, and commit the PDFs with the app.
"""
import json
import re
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
src = Path(sys.argv[1]) / "project"
out = Path(sys.argv[2])
out.mkdir(parents=True, exist_ok=True)

# The canvas's uploaded files (/_blob/…) are these files of the website.
BLOBS = {
    "852c735d60a871046077c9a55533f865": "fonts/fredoka-latin-variable.woff2",
    "8ef5000c816116f00ab4a575bada1139": "fonts/quicksand-latin-500-normal.woff2",
    "ee657bae73f133dfb1b9775a5b6b32ce": "fonts/quicksand-latin-600-normal.woff2",
    "e203ab5b910581a78400d8b3c6ed6a3b": "fonts/quicksand-latin-700-normal.woff2",
    "b3b42cc60fb233a38ec201683244feeb": "img/brand/follow-me-therapy-lockup-horizontal.svg",
}
CSS = [ROOT / "css/tokens.css", ROOT / "design/design-system/project/components/bundle.css"]


def page_html(dc: str) -> str:
    """The artboard as a plain page: its styles and its sheet, templates filled in."""
    helmet = re.search(r"<helmet>(.*?)</helmet>", dc, re.S)
    body = re.search(r"<x-dc>(.*?)</x-dc>", dc, re.S).group(1)
    body = re.sub(r"<helmet>.*?</helmet>", "", body, flags=re.S)
    # The only templates the sheets use: sc-for over a renderVals() list.
    vals = re.search(r"renderVals\(\)\s*\{\s*return\s*(\{.*?\});", dc, re.S)
    data = {}
    if vals and vals.group(1).strip() != "{}":
        data = json.loads(re.sub(r"(\w+):", r'"\1":', vals.group(1)).replace("'", '"'))

    def expand(html: str, scope: dict) -> str:
        while True:
            m = re.search(r'<sc-for list="\{\{(\w+)\}\}" as="(\w+)"[^>]*>', html)
            if not m:
                break
            depth, i = 1, m.end()
            while depth:
                o = html.find("<sc-for", i)
                c = html.find("</sc-for>", i)
                if o != -1 and o < c:
                    depth += 1; i = o + 7
                else:
                    depth -= 1; i = c + 9
            inner = html[m.end():i - 9]
            rep = "".join(expand(inner.replace("{{" + m.group(2) + "}}", str(v)), scope) for v in scope[m.group(1)])
            html = html[:m.start()] + rep + html[i:]
        return html

    body = expand(body, data)
    for blob, path in BLOBS.items():
        body = body.replace(f"/_blob/{blob}", (ROOT / path).as_uri())
    style = (helmet.group(1) if helmet else "")
    for blob, path in BLOBS.items():
        style = style.replace(f"/_blob/{blob}", (ROOT / path).as_uri())
    links = "".join(f'<link rel="stylesheet" href="{c.as_uri()}">' for c in CSS)
    return f"""<!doctype html><html lang="en-AU"><head><meta charset="utf-8">{links}{style}
<style>@page {{ size: A4; margin: 0; }} html, body {{ margin: 0; }}</style></head><body>{body}</body></html>"""


made = []
with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 794, "height": 1123})
    for f in sorted(src.glob("*.dc.html")):
        dc = f.read_text()
        if 'class="fmt-sheet"' not in dc:
            continue
        tmp = out / ".page.html"
        tmp.write_text(page_html(dc))
        page.goto(tmp.as_uri())
        page.evaluate("document.fonts.ready")
        name = f.name.replace(".dc.html", "")
        page.pdf(path=str(out / f"{name}.pdf"), width="210mm", height="297mm", print_background=True,
                 margin={"top": "0", "right": "0", "bottom": "0", "left": "0"}, scale=1)
        title = re.search(r"<title>(.*?)</title>", dc).group(1)
        made.append({"file": f"{name}.pdf", "title": title})
        tmp.unlink()
    browser.close()
(out / "worksheets.json").write_text(json.dumps(made, indent=1, ensure_ascii=False) + "\n")
print(f"{len(made)} worksheets → {out}")
