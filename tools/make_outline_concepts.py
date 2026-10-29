"""Outline-pictogram logo concepts drawn from scratch, close to the current mark.
Shapes are bands: a thick white shape minus a thinner black copy in a mask,
so every limb reads as a double line, like the current mark."""
import pathlib
INK = "#2b2540"
OUT = pathlib.Path("design/logo-concepts/outline-redraw")
T = 5.5  # outline thickness

def band(d, w):  # (outer, inner) stroke widths along a path
    return (f'<path d="{d}" stroke="#fff" stroke-width="{w}"/>',
            f'<path d="{d}" stroke="#000" stroke-width="{max(w-2*T,0.01)}"/>')
def ring(cx, cy, r):
    return (f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="#fff" stroke="none"/>',
            f'<circle cx="{cx}" cy="{cy}" r="{r-T}" fill="#000" stroke="none"/>')
def box(x, y, w, h, rx):
    return (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="#fff" stroke="none"/>',
            f'<rect x="{x+T}" y="{y+T}" width="{w-2*T}" height="{h-2*T}" rx="{max(rx-T,1)}" fill="#000" stroke="none"/>')

def svg(parts, name):
    outer = "".join(p[0] for p in parts); inner = "".join(p[1] for p in parts)
    s = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><title>Follow Me Therapy</title>'
         f'<defs><mask id="m" maskUnits="userSpaceOnUse" x="0" y="0" width="120" height="120">'
         f'<g fill="none" stroke-linecap="round" stroke-linejoin="round">{outer}{inner}</g></mask></defs>'
         f'<rect width="120" height="120" fill="{INK}" mask="url(#m)"/></svg>')
    (OUT / f"{name}.svg").write_text(s)
    return s

def line(d, w=T):  # single solid line
    return (f'<path d="{d}" stroke="#fff" stroke-width="{w}"/>', "")

# Adult on the left, child on the right holding hands, as in the current mark:
# outlined adult, single-line child arms running from the joined hands.
def adult(legs):
    return [ring(37, 15, 12), box(22, 31, 33, 35, 9),
            band("M19 42 V68", 13),                  # near arm hangs at the side
            band("M48 41 L67 67", 15),                 # arm down to the child's hand
            *[band(l, 14.5) for l in legs]]
def child(legs, arms):
    return [ring(87, 59, 9.5), box(77, 73, 20, 23, 5),
            line(arms), *[line(l) for l in legs]]

STILL_A = ["M31 73 V112", "M46.5 73 V112"]
STILL_C = ["M83 97 V114", "M91 97 V114"]
WALK_A = ["M32.5 73 L26 112", "M45 73 L52 112"]
WALK_C = ["M84 97 L80 114", "M90 97 L94 114"]
WAVE = "M67 68 Q78 79 92 77 Q104 74 110 63"
POINT = "M67 68 Q78 79 92 77 L114 75"

concepts = {
  "o1-redrawn": adult(STILL_A) + child(STILL_C, WAVE),
  "o2-walking": adult(WALK_A) + child(WALK_C, WAVE),
  "o3-follow-me": adult(WALK_A) + child(WALK_C, POINT),
}
for k, v in concepts.items(): svg(v, k)
print("wrote", ", ".join(concepts))
