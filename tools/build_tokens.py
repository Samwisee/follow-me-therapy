"""Build everything that depends on the design tokens.

design/tokens.json is THE single source (W3C/DTCG format, so Tokens Studio
for Figma can read and edit it). Run this after changing it:

    python3 tools/build_tokens.py

It writes / re-stamps:
  css/tokens.css                 CSS custom properties every page loads first, plus the
                                 paper and book scopes (.medium-paper / .fmt-sheet and
                                 .medium-book / .fmt-page) where semantic tokens take
                                 their print values (extensions.followmetherapy.media)
  design/tokens-by-medium.json   every semantic token's value on phone, tablet, laptop,
                                 paper and book (for apps: phone = compact, tablet = medium)
  the medium table in design/design-system/project/README.md
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


LAYOUT_NAMES = {"section": "section-space", "section-top": "section-top", "card": "card-pad", "grid": "grid-gap", "group": "group-gap"}


def css_name(path):
    group, name = path.split(".", 1)
    if group == "layout":
        return LAYOUT_NAMES.get(name, name)
    if group == "motion":
        return name if name.startswith("ease-") else f"dur-{name}"
    return {"color": name, "font": f"font-{name}", "space": f"space-{name}", "text": f"text-{name}",
            "leading": f"leading-{name}", "weight": f"weight-{name}", "tracking": f"tracking-{name}", "size": f"size-{name}",
            "radius": f"radius-{name}", "shadow": f"shadow-{name}", "border": f"border-{name}",
            "z": f"z-{name}", "breakpoint": f"bp-{name}", "print": name}.get(group)


# Fluid tokens grow linearly from FLUID_FROM to FLUID_TO viewport width.
FLUID_FROM, FLUID_TO = 360, 1440


def px(v):
    return float(str(v).removesuffix("px"))


def fmt(n):
    return f"{n:.4f}".rstrip("0").rstrip(".")


def css_value(tok):
    raw = tok["$value"]
    fl = tok.get("$extensions", {}).get("followmetherapy", {}).get("fluid")
    if fl:
        lo, hi = px(fl["min"]), px(fl["max"])
        if lo == hi:
            return f"{fmt(lo)}px"
        slope = (hi - lo) / (FLUID_TO - FLUID_FROM)
        base = lo - slope * FLUID_FROM
        return f"clamp({fmt(lo)}px, {fmt(base)}px + {fmt(slope * 100)}vw, {fmt(hi)}px)"
    if tok.get("$type") == "cubicBezier" and isinstance(raw, list):
        return "cubic-bezier(" + ", ".join(fmt(x) for x in raw) + ")"
    return raw


COLORS = {p.split(".", 1)[1]: resolve(v["$value"]) for p, v in TOK.items() if p.startswith("color.")}
# Tone and component colours too, so a data-URI icon can be tagged with the
# component part it plays (/* token:note-teal-icon */) and follow its rule.
for p, v in TOK.items():
    if p.startswith("tone."):
        _, tone, role = p.split(".")
        COLORS[f"tone-{tone}-{role}"] = resolve(v["$value"])
for p, v in TOK.items():
    if p.startswith("component."):
        _, comp, part = p.split(".")
        if v.get("$type") == "other":
            for tone in [k for k in T["tone"] if not k.startswith("$")]:
                COLORS[f"{comp}-{tone}-{part}"] = COLORS[f"tone-{tone}-{v['$value']}"]
        elif v.get("$type") == "color":
            COLORS[f"{comp}-{part}"] = resolve(v["$value"])

TONES = [k for k in T.get("tone", {}) if not k.startswith("$")]


def var_of(raw, tok):
    m = re.fullmatch(r"\{([^}]+)\}", raw) if isinstance(raw, str) else None
    return f"var(--{css_name(m.group(1))})" if m else css_value(tok)


def component_lines():
    """Tones and components: --tone-<tone>-<role>, then for each component part
    either --<component>-<tone>-<part> (a tone role, one per tone) or
    --<component>-<part> (a fixed colour or size)."""
    out = ["", "  /* Tones: the role each colour plays (design/tokens.json › tone). */"]
    for p, v in TOK.items():
        if p.startswith("tone."):
            _, tone, role = p.split(".")
            out.append(f"  --tone-{tone}-{role}: {var_of(v['$value'], v)};")
    out += ["", "  /* Components: which role or value each part takes (tokens.json › component, design/components.json). */"]
    for p, v in TOK.items():
        if not p.startswith("component."):
            continue
        _, comp, part = p.split(".")
        if v.get("$type") == "other":
            for tone in TONES:
                out.append(f"  --{comp}-{tone}-{part}: var(--tone-{tone}-{v['$value']});")
        else:
            out.append(f"  --{comp}-{part}: {var_of(v['$value'], v)};")
    return out


# 1. css/tokens.css
lines = ["/* Follow Me Therapy design tokens. GENERATED from design/tokens.json by",
         "   tools/build_tokens.py. Don't edit; change the tokens and rebuild. */", ":root {"]
for p, v in TOK.items():
    n = css_name(p)
    if not n:
        continue
    raw = v["$value"]
    m = re.fullmatch(r"\{([^}]+)\}", raw) if isinstance(raw, str) else None
    val = f"var(--{css_name(m.group(1))})" if m else css_value(v)
    lines.append(f"  --{n}: {val};")
lines += component_lines()
lines.append("}")

# Paper and book: the same names in print units. Aliases are declared again
# in each scope so they pick up the print value (a var() resolves where it's declared).
MEDIA = {"paper": ".medium-paper, .fmt-sheet", "book": ".medium-book, .fmt-page"}
def media_of(tok):
    return tok.get("$extensions", {}).get("followmetherapy", {}).get("media", {})
for medium, sel in MEDIA.items():
    lines.append("")
    lines.append(f"/* {'A4 handouts' if medium == 'paper' else 'A5 staple-book pages'}: semantic tokens in print units. */")
    lines.append(sel + " {")
    for p, v in TOK.items():
        n = css_name(p)
        if not n:
            continue
        mv = media_of(v).get(medium)
        raw = v["$value"]
        m = re.fullmatch(r"\{([^}]+)\}", raw) if isinstance(raw, str) else None
        if mv:
            lines.append(f"  --{n}: {mv};")
        elif m and any(media_of(TOK[r]) for r in [m.group(1)]):
            lines.append(f"  --{n}: var(--{css_name(m.group(1))});")
    lines.append("}")
(ROOT / "css/tokens.css").write_text("\n".join(lines) + "\n")

# The components carry the tokens (screen values plus the paper and book scopes),
# so they work and size themselves for print wherever they're used (the Design System page, a canvas, an app's web view).
bundle = ROOT / "design/design-system/project/components/bundle.css"
scopes = "\n".join(lines[2:]).strip()  # every token, then the paper and book scopes
block = "/* media:start — GENERATED by tools/build_tokens.py from design/tokens.json */\n" + scopes + "\n/* media:end */"
btxt = bundle.read_text()
if "/* media:start" in btxt:
    btxt = re.sub(r"/\* media:start.*?/\* media:end \*/", lambda m: block, btxt, flags=re.S)
else:
    btxt = btxt.replace("\n\n", "\n\n" + block + "\n\n", 1)
bundle.write_text(btxt)

# The medium table: what each semantic token is on every medium.
WIDTHS = {"phone": 390, "tablet": 834, "laptop": 1440}
def at_width(tok, w):
    fl = tok.get("$extensions", {}).get("followmetherapy", {}).get("fluid")
    if not fl:
        return str(resolve(tok["$value"]))
    lo, hi = px(fl["min"]), px(fl["max"])
    x = min(1, max(0, (w - FLUID_FROM) / (FLUID_TO - FLUID_FROM)))
    return f"{fmt(round((lo + (hi - lo) * x) * 2) / 2)}px"
by_medium = {}
for p, v in TOK.items():
    if not (p.startswith("text.") or p.startswith("layout.")) or not media_of(v):
        continue
    row = {m: at_width(v, w) for m, w in WIDTHS.items()}
    row.update(media_of(v))
    row["usage"] = v.get("$description", "")
    by_medium[css_name(p)] = row
(ROOT / "design/tokens-by-medium.json").write_text(json.dumps(by_medium, indent=1, ensure_ascii=False) + "\n")
readme = ROOT / "design/design-system/project/README.md"
if readme.exists():
    table = ["| Token | Phone | iPad | Laptop | A4 paper | A5 book |", "|---|---|---|---|---|---|"]
    for n, r in by_medium.items():
        table.append(f"| `{n}` | {r['phone']} | {r['tablet']} | {r['laptop']} | {r['paper']} | {r['book']} |")
    txt = readme.read_text()
    txt = re.sub(r"(<!-- media:start -->).*?(<!-- media:end -->)", lambda mm: mm.group(1) + "\n" + "\n".join(table) + "\n" + mm.group(2), txt, flags=re.S)
    readme.write_text(txt)

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
      "shadow": lst("shadow", "shadow-"), "border": lst("border", "border-"), "print": lst("print", ""),
      "layout": lst("layout", ""), "media": by_medium, "text": lst("text", "text-"), "size": lst("size", "size-"),
      "motion": lst("motion", ""), "z": lst("z", "z-"), "breakpoint": lst("breakpoint", "bp-")}
groups = {}
for k, v in TOK.items():
    if not k.startswith("typography."):
        continue
    name = k.split(".", 1)[1]
    val = v["$value"]
    fam = resolve(val["fontFamily"]) == TOK["font.display"]["$value"] and "display" or "body"
    g = "Print" if name.startswith("print") else ("Display" if fam == "display" else "Text")
    st = {"name": name, "fontSize": resolve(val["fontSize"]), "lineHeight": resolve(val["lineHeight"]), "fontWeight": resolve(val["fontWeight"]),
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

# 3. Each component's README in the Design System gets its rules, tokens and
#    implementations from design/components.json, so the docs can't drift.
MAN = json.loads((ROOT / "design/components.json").read_text())
COMPDIR = ROOT / "design/design-system/project/components"
def impl(v):
    if v is None:
        return "—"
    if isinstance(v, dict) and "none" in v:
        return "none: " + v["none"]
    if isinstance(v, dict):
        r = v["react"] if isinstance(v["react"], list) else [v["react"]]
        return f"`{v['css']}`, " + ", ".join(f"`<{x}>`" for x in r)
    return ", ".join(f"`{x}`" for x in (v if isinstance(v, list) else [v]))
# A folder can document more than one component (Worksheet shows Head and
# Page): each gets its own rules, under its name, in one generated block.
FOLDERS = {}
for name, c in MAN["components"].items():
    ds = c.get("designSystem")
    reacts = (ds["react"] if isinstance(ds["react"], list) else [ds["react"]]) if isinstance(ds, dict) and "react" in ds else []
    for folder in dict.fromkeys([name] + reacts):
        if (COMPDIR / folder / "preview.html").exists():
            FOLDERS.setdefault(folder, []).append((name, c))
for folder, comps in FOLDERS.items():
    d = COMPDIR / folder
    lines = ["<!-- rules:start — GENERATED by tools/build_tokens.py from design/components.json -->", "## Rules (every product)"]
    for name, c in comps:
        ds = c.get("designSystem")
        if len(comps) > 1:
            lines += ["", f"### {name}"]
        lines += [""] + ([f"- {r}" for r in c.get("rules", [])] or ["- " + c["description"]])
        if "tokens" in c:
            parts = [k for k in T["component"][c["tokens"]] if not k.startswith("$")]
            lines += ["", f"Tokens: `component.{c['tokens']}` ({', '.join(parts)}) in design/tokens.json."]
        lines += ["", "| Product | Implementation |", "|---|---|",
                  f"| Website | {impl(c.get('website'))} |", f"| Design System | {impl(ds)} |", f"| App | {impl(c.get('app'))} |"]
    lines.append("<!-- rules:end -->")
    block = "\n".join(lines)
    rd = d / "README.md"
    txt = rd.read_text() if rd.exists() else f"# {folder}\n\n{comps[0][1]['description']}\n"
    if "<!-- rules:start" in txt:
        txt = re.sub(r"<!-- rules:start.*?<!-- rules:end -->", lambda m: block, txt, flags=re.S)
    else:
        txt = txt.rstrip("\n") + "\n\n" + block + "\n"
    rd.write_text(txt)

