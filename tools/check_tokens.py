"""Check that the website takes all of its design from design/tokens.json.

    python3 tools/check_tokens.py

Reads every stylesheet, every page's <style> blocks and style="" attributes,
the scripts' inline styles and the Design System's component CSS, and reports
any value the tokens should own but that is written out by hand:

  colour        hex, rgb(), hsl()                     → var(--purple) …
  font          a family name                         → var(--font-display|body)
  font size     px, rem, vw                           → var(--text-*)
  line height   a number other than 1                 → var(--leading-*)
  letter space  a length                              → var(--tracking-*)
  spacing       margin, padding, gap, inset, top/right/bottom/left in px or rem
                (2px and under is allowed: hairline nudges) → var(--space-*) or a layout token
  radius        px                                    → var(--radius-*) (50% and 0 are fine)
  outline       2px solid …-line                      → var(--border-outline)
  shadow        anything but none or a token          → var(--shadow-*)
  layer         z-index other than 0, -1, auto        → var(--z-*)
  motion        (1ms, the reduced-motion off switch, is fine)
                a transition or a short animation (under 1s) with a hand-written
                duration or easing                    → var(--dur-*), var(--ease-*)
                (ambient artwork loops of 1s or more keep their own timings)
  breakpoint    an @media width/height that isn't a breakpoint token

Allowed on purpose (not reported):
  css/tokens.css                       generated from the tokens
  colours tagged /* token:<name> */    re-stamped by build_tokens.py
  <meta ... data-token="...">          re-stamped by build_tokens.py
  inline SVG illustrations             their own artwork palette (unDraw)
  @font-face blocks                    font loading, metric fallbacks
  @keyframes bodies                    movement inside an animation
  print sizes in mm/pt                 the print tokens own those
Exits non-zero when something is found.
"""
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
T = json.loads((ROOT / "design/tokens.json").read_text())
BREAKPOINTS = {int(float(v["$value"].removesuffix("px"))) for k, v in T["breakpoint"].items() if not k.startswith("$")}

COLOR = re.compile(r"(?<![%\w-])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b|\brgba?\(\s*\d|\bhsla?\(\s*\d")
FONT = re.compile(r"(Fredoka|Quicksand)")
LEN = re.compile(r"(?<![\w.-])(-?\d*\.?\d+)(px|rem|vw|vh)\b")
DUR = re.compile(r"(?<![\w.-])(\d*\.?\d+)(ms|s)\b")
EASE = re.compile(r"cubic-bezier\(|\b(ease|ease-in|ease-out|ease-in-out|linear)\b(?![-\w])")
SPACING = re.compile(r"^(margin|padding)(-(top|right|bottom|left|block|inline)(-(start|end))?)?$|^(gap|row-gap|column-gap|inset|inset-(block|inline)(-(start|end))?|top|right|bottom|left)$")


def strip(text, kind):
    if kind == "css":
        text = re.sub(r"/\*(?! token:).*?\*/", lambda m: "\n" * m.group(0).count("\n"), text, flags=re.S)
    text = re.sub(r"/\* token:[a-z0-9-]+ \*/\s*url\(\"[^\"]*\"\)", "url()", text)
    text = re.sub(r"url\(\"data:[^\"]*\"\)", "url()", text)
    text = re.sub(r"@font-face\s*{[^}]*}", lambda m: "\n" * m.group(0).count("\n"), text)
    if kind == "html":
        text = re.sub(r"<svg\b[^>]*class=\"illus-svg[\s\S]*?</svg>", lambda m: "\n" * m.group(0).count("\n"), text)
        text = re.sub(r'<meta[^>]*data-token="[^"]*"[^>]*>', "", text)
    return text


def blank_keyframes(text):
    """Empty the inside of @keyframes blocks (keeping line numbers)."""
    out, i = [], 0
    for m in re.finditer(r"@keyframes[^{]*{", text):
        if m.start() < i:
            continue
        depth, j = 1, m.end()
        while depth and j < len(text):
            depth += {"{": 1, "}": -1}.get(text[j], 0)
            j += 1
        out.append(text[i:m.end()])
        out.append(re.sub(r"[^\n]", " ", text[m.end():j - 1]) + "}")
        i = j
    out.append(text[i:])
    return "".join(out)


def check_decl(prop, val):
    prop = prop.strip().lower()
    val = val.strip()
    low = val.lower()
    hits = [f"colour {m.group(0)}" for m in COLOR.finditer(val)]
    if prop.startswith("--"):
        return hits
    if prop == "font-family" or prop == "font":
        hits += [f"font {m.group(1)} → var(--font-*)" for m in FONT.finditer(val) if "var(" not in val]
    if prop == "font-size" and LEN.search(val):
        hits.append(f"font-size {val} → var(--text-*)")
    if prop == "line-height" and re.fullmatch(r"\d*\.?\d+(\s*!important)?", val) and float(val.split()[0]) != 1:
        hits.append(f"line-height {val} → var(--leading-*)")
    if prop == "letter-spacing" and LEN.search(val.replace("em", "px")):
        hits.append(f"letter-spacing {val} → var(--tracking-*)")
    if SPACING.match(prop):
        for m in LEN.finditer(val):
            if abs(float(m.group(1))) > 2 or m.group(2) != "px":
                hits.append(f"{prop} {m.group(0)} → var(--space-*)")
    if prop.startswith("border") and "radius" in prop:
        for m in LEN.finditer(val):
            if abs(float(m.group(1))) > 2:
                hits.append(f"radius {m.group(0)} → var(--radius-*)")
    if re.match(r"border(-(top|right|bottom|left))?$", prop) and re.search(r"\b2px\b", val):
        hits.append("outline width 2px → var(--border-outline)")
    if prop == "box-shadow" and low not in ("none", "none !important") and not re.fullmatch(r"(var\(--shadow-[a-z-]+\)(,\s*)?)+(\s*!important)?", low):
        hits.append(f"box-shadow {val[:40]} → var(--shadow-*)")
    if prop == "z-index" and not re.fullmatch(r"(var\(--z-[a-z]+\)|0|-1|auto)(\s*!important)?", low):
        hits.append(f"z-index {val} → var(--z-*)")
    if prop.startswith("transition") or prop in ("animation", "animation-duration", "animation-timing-function"):
        durs = [float(m.group(1)) * (1 if m.group(2) == "ms" else 1000) for m in DUR.finditer(val)]
        long_loop = prop.startswith("animation") and durs and durs[0] >= 1000
        if durs and max(durs) <= 1:  # the reduced-motion off switch
            return hits
        if not long_loop:
            if prop != "animation-timing-function" and durs and not (prop.startswith("transition") and low in ("none", "none !important")):
                hits.append(f"{prop} duration {val[:40]} → var(--dur-*)")
            if EASE.search(re.sub(r"var\([^)]*\)", "", low)):
                hits.append(f"{prop} easing {val[:40]} → var(--ease-*)")
    return hits


problems = 0
files = [p for p in (ROOT / "css").glob("*.css") if p.name != "tokens.css"]
files += list(ROOT.glob("*.html")) + list((ROOT / "js").glob("*.js")) + [ROOT / "design/design-system/project/components/bundle.css"]
for f in sorted(files):
    kind = "css" if f.suffix == ".css" else "html" if f.suffix == ".html" else "js"
    raw = f.read_text()
    # The tokens block build_tokens.py writes into the component CSS is the tokens themselves.
    raw = re.sub(r"/\* media:start[\s\S]*?/\* media:end \*/", lambda m: re.sub(r"[^\n]", " ", m.group(0)), raw)
    text = strip(raw, kind)
    if kind != "css":  # only <style> blocks and style="" attributes matter in HTML/JS
        keep = [(m.start(), m.group(0)) for m in re.finditer(r"<style[\s\S]*?</style>|style=\"[^\"]*\"", text)]
        lines = text.split("\n")
        blank = [re.sub(r"[^\n]", " ", t) for t in lines]
        text2 = list("\n".join(blank))
        for pos, chunk in keep:
            text2[pos:pos + len(chunk)] = chunk
        text = "".join(text2)
        text = re.sub(r"style=\"([^\"]*)\"", lambda m: m.group(1) + ";", text)
    text = blank_keyframes(text)
    for m in re.finditer(r"@media[^{]+", text):
        for n in re.findall(r"(?:min|max)-(?:width|height)\s*:\s*(\d+)px", m.group(0)):
            if int(n) not in BREAKPOINTS:
                line = text.count("\n", 0, m.start()) + 1
                problems += 1
                print(f"{f.relative_to(ROOT)}:{line}: breakpoint {n}px isn't one of {sorted(BREAKPOINTS)}")
    for m in re.finditer(r"([a-zA-Z-]+)\s*:\s*([^;{}]+?)\s*(?=;|})", text):
        prefix = text[max(0, m.start() - 1):m.start()]
        if prefix and (prefix.isalnum() or prefix in "-."):
            continue
        if re.match(r"(https?|data|url)$", m.group(1)):
            continue
        for h in check_decl(m.group(1), m.group(2)):
            problems += 1
            print(f"{f.relative_to(ROOT)}:{text.count(chr(10), 0, m.start()) + 1}: {h}")
print(f"{problems} hard-coded value(s)" if problems else "Everything reads from the design tokens.")
sys.exit(1 if problems else 0)
