"""Build everything that depends on the design tokens.

design/tokens.json is THE single source (W3C/DTCG format, so Tokens Studio
for Figma can read and edit it). Run this after changing it:

    python3 tools/build_tokens.py

It writes / re-stamps:
  css/tokens.css                 CSS custom properties every page loads first
  CSS data-URI icons             any url("data:image/svg+xml,…") preceded by
                                 /* token:<name> */ gets that token's colour
  <meta … data-token="<name>">   HTML attributes that can't use CSS (theme-color)
  img/brand/*.svg                the logo, filled with `brand-ink` (white files stay white)
  design/design-system/tokens.json   the tokens in the Design System artifact's format
"""
import json, re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
T = json.loads((ROOT / "design/tokens.json").read_text())


def flat(node, path=()):
    for k, v in node.items():
        if k.startswith("$"):
            continue
        if isinstance(v, dict) and "$value" in v:
            yield path + (k,), v
        elif isinstance(v, dict):
            yield from flat(v, path + (k,))


TOK = {".".join(p): v for p, v in flat(T)}


def resolve(val, seen=()):
    if isinstance(val, str):
        m = re.fullmatch(r"\{([^}]+)\}", val)
        if m:
            ref = m.group(1)
            assert ref not in seen, f"alias loop at {ref}"
            return resolve(TOK[ref]["$value"], seen + (ref,))
    return val


def css_name(path):
    group, name = path.split(".", 1)
    return {"color": name, "font": f"font-{name}", "space": f"space-{name}",
            "radius": f"radius-{name}", "shadow": f"shadow-{name}", "print": name}.get(group)


COLORS = {p.split(".", 1)[1]: resolve(v["$value"]) for p, v in TOK.items() if p.startswith("color.")}

# 1. css/tokens.css
lines = ["/* Follow Me Therapy design tokens. GENERATED from design/tokens.json by",
         "   tools/build_tokens.py. Don't edit; change the tokens and rebuild. */", ":root {"]
for p, v in TOK.items():
    n = css_name(p)
    if not n:
        continue
    raw = v["$value"]
    m = re.fullmatch(r"\{([^}]+)\}", raw) if isinstance(raw, str) else None
    val = f"var(--{css_name(m.group(1))})" if m else resolve(raw)
    lines.append(f"  --{n}: {val};")
lines.append("}")
(ROOT / "css/tokens.css").write_text("\n".join(lines) + "\n")

# 2. Re-stamp token-tagged colours that CSS variables can't reach
def stamp_css(text):
    def fix(m):
        name = m.group(1)
        hexv = COLORS[name].lstrip("#")
        return re.sub(r"%23[0-9a-fA-F]{3,8}", "%23" + hexv, m.group(0), count=1)
    return re.sub(r"/\* token:([a-z0-9-]+) \*/\s*url\(\"data:image/svg\+xml,[^\"]*\"\)", fix, text)

def stamp_html(text):
    return re.sub(r'(<meta name="theme-color" content=")[^"]*(" data-token="([a-z0-9-]+)")',
                  lambda m: m.group(1) + COLORS[m.group(3)] + m.group(2), text)

for f in list((ROOT / "css").glob("*.css")) + list((ROOT / "design/design-system/project/components").glob("*.css")):
    if f.name != "tokens.css":
        f.write_text(stamp_css(f.read_text()))
for f in list(ROOT.glob("*.html")) + [ROOT / "tools/build_pages.py"]:
    f.write_text(stamp_html(f.read_text()))

# 3. Logo files: the ink versions take brand-ink
for f in (ROOT / "img/brand").glob("*.svg"):
    if "white" in f.name:
        continue
    s = f.read_text()
    f.write_text(re.sub(r'fill="#[0-9a-fA-F]{3,8}"', f'fill="{COLORS["brand-ink"]}"', s))

# 4. The Design System artifact's token format (lists, not maps)
def lst(group, prefix):
    return {"tokens": [{"name": f"{prefix}{k.split('.',1)[1]}", "value": resolve(v["$value"]),
                        "usage": v.get("$description", "")} for k, v in TOK.items() if k.startswith(group + ".")]}

ds = {"name": "Follow Me Therapy", "version": 1,
      "meta": {"source": "github", "repo": "Samwisee/follow-me-therapy", "paths": {"tokens": ["design/tokens.json"], "fonts": ["fonts/"], "assets": ["img/brand/", "img/"]}},
      "color": {"themes": [{"id": "light", "name": "Light"}],
                "tokens": [{"name": k.split(".", 1)[1],
                            "value": {"light": (("{" + v["$value"][7:]) if str(v["$value"]).startswith("{color.") else v["$value"])},
                            "usage": v.get("$description", "")} for k, v in TOK.items() if k.startswith("color.")]},
      "type": {"fonts": [{"family": fam, "file": f"fonts/{fam.lower()}-latin-{w}-normal.woff2", "weight": str(w), "style": "normal"}
                         for fam, ws in (("Fredoka", (500, 600, 700)), ("Quicksand", (400, 500, 600, 700))) for w in ws],
               "families": {"display": TOK["font.display"]["$value"], "body": TOK["font.body"]["$value"]},
               "groups": []},
      "spacing": lst("space", "space-"), "radius": lst("radius", "radius-"),
      "shadow": lst("shadow", "shadow-"), "print": lst("print", "")}
groups = {}
for k, v in TOK.items():
    if not k.startswith("typography."):
        continue
    name = k.split(".", 1)[1]
    val = v["$value"]
    fam = resolve(val["fontFamily"]) == TOK["font.display"]["$value"] and "display" or "body"
    g = "Print" if name.startswith("print") else ("Display" if fam == "display" else "Text")
    st = {"name": name, "fontSize": val["fontSize"], "lineHeight": val["lineHeight"], "fontWeight": val["fontWeight"],
          "family": fam, "usage": v.get("$description", "")}
    sample = v.get("$extensions", {}).get("followmetherapy", {}).get("sample")
    if sample:
        st["sample"] = sample
    if "letterSpacing" in val:
        st["letterSpacing"] = val["letterSpacing"]
    groups.setdefault(g, {"name": g, "family": fam, "styles": []})["styles"].append(st)
ds["type"]["groups"] = [groups[g] for g in ("Display", "Text", "Print") if g in groups]
out = ROOT / "design/design-system/project"
out.mkdir(parents=True, exist_ok=True)
(out / "tokens.json").write_text(json.dumps(ds, indent=1, ensure_ascii=False) + "\n")
print(f"tokens: {len(TOK)} ({len(COLORS)} colours) → css/tokens.css, stamps, logos, design-system/tokens.json")
