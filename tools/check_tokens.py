"""Check that the website takes its design from design/tokens.json.

    python3 tools/check_tokens.py

Reports, per file, any value the tokens should own but that is hard-coded:
colours (hex, rgb/rgba, hsl), font families, radii that equal a radius
token, and outline widths. Exits non-zero when something is found.

Allowed on purpose (not reported):
  css/tokens.css                  generated from the tokens
  colours tagged /* token:<name> */  re-stamped by build_tokens.py
  <meta ... data-token="...">     re-stamped by build_tokens.py
  inline SVG illustrations         their own artwork palette (unDraw)
  @font-face blocks and --display  font loading, metric fallbacks
  #000 / #0000 inside mask-image gradients (alpha masks, not colour)
"""
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
T = json.loads((ROOT / "design/tokens.json").read_text())
RADII = {v["$value"]: f"radius-{k}" for k, v in T["radius"].items()}
COLOR = re.compile(r"(?<![%\w-])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b|\brgba?\(\s*\d|\bhsla?\(\s*\d")
FONT = re.compile(r"font-family\s*:\s*(?!var\()[^;]*?(Fredoka|Quicksand)")
RADIUS = re.compile(r"border-radius\s*:\s*(\d+px)\s*(?:!important)?\s*;")
OUTLINE = re.compile(r"\bborder(?:-(?:top|right|bottom|left))?\s*:\s*2px solid var\(--[a-z-]*line")

def strip(text, kind):
    text = re.sub(r"/\*.*?\*/", lambda m: "\n" * m.group(0).count("\n"), text, flags=re.S) if kind == "css" else text
    text = re.sub(r"/\* token:[a-z0-9-]+ \*/\s*url\(\"[^\"]*\"\)", "", text)
    text = re.sub(r"url\(\"data:[^\"]*\"\)", "url()", text)
    text = re.sub(r"@font-face\s*{[^}]*}", lambda m: "\n" * m.group(0).count("\n"), text)
    text = re.sub(r"--display\s*:[^;]*;", "", text)
    text = re.sub(r"--_g\s*:[^;]*;", "", text)  # mask gradient
    if kind == "html":
        text = re.sub(r"<svg\b[^>]*class=\"illus-svg[\s\S]*?</svg>", lambda m: "\n" * m.group(0).count("\n"), text)
        text = re.sub(r'<meta[^>]*data-token="[^"]*"[^>]*>', "", text)
    return text

problems = 0
files = [p for p in (ROOT / "css").glob("*.css") if p.name != "tokens.css"]
files += list(ROOT.glob("*.html")) + list((ROOT / "js").glob("*.js")) + [ROOT / "design/design-system/project/components/bundle.css"]
for f in sorted(files):
    kind = "css" if f.suffix == ".css" else "html" if f.suffix == ".html" else "js"
    text = strip(f.read_text(), kind)
    if kind != "css":  # only <style> blocks and style= attributes matter in HTML/JS
        text = "\n".join(m.group(0) for m in re.finditer(r"<style[\s\S]*?</style>|style=\"[^\"]*\"|style\.\w+\s*=\s*[^;]+", text))
    for n, line in enumerate(text.splitlines(), 1):
        hits = []
        hits += [f"colour {m.group(0)}" for m in COLOR.finditer(line)]
        hits += [f"font {m.group(1)}" for m in FONT.finditer(line)]
        hits += [f"radius {m.group(1)} = var(--{RADII[m.group(1)]})" for m in RADIUS.finditer(line) if m.group(1) in RADII]
        hits += ["outline width 2px = var(--border-outline)" for _ in OUTLINE.finditer(line)]
        for h in hits:
            problems += 1
            print(f"{f.relative_to(ROOT)}:{n}: {h}")
print(f"{problems} hard-coded value(s)" if problems else "Everything reads from the design tokens.")
sys.exit(1 if problems else 0)
