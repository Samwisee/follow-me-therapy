"""The letters to trace: a–z and A–Z, and the pre-writing shapes.

    python3 tools/build_letters.py        writes design/letters.json

One source for every product: the worksheets (letter-tracing sheets), the
Design System (LetterTrace) and the app (finger tracing) all draw these.

Style: Victorian foundation letters (as Victorian schools teach before
joining): simple, upright, round bowls, a small exit flick on letters that
finish at the baseline on the right (a d h i k l m n t u), and each letter
started at the point and drawn in the order taught. These are drawn to match
the style, not taken from an official font: Simone checks them.

Coordinates: each letter in a box 100 high. Lines: top 10 (capitals and
tall letters), waist 40 (small letters), base 70, descender 95. A stroke is
one pen-down movement, from its start point, as a list of points [x, y]
close enough together (about 1.5 apart) to draw as a smooth line and to
follow with a finger.
"""
import json, math
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TOP, WAIST, BASE, DESC = 10, 40, 70, 95
STEP = 1.5


class Pen:
    """Builds one stroke from lines, arcs and curves, sampled evenly."""
    def __init__(self, x, y):
        self.pts = [(x, y)]

    @property
    def at(self):
        return self.pts[-1]

    def _add(self, pts):
        for p in pts:
            if math.dist(p, self.pts[-1]) > 1e-6:
                self.pts.append(p)
        return self

    def line(self, x, y):
        x0, y0 = self.at
        n = max(1, round(math.dist((x0, y0), (x, y)) / STEP))
        return self._add([(x0 + (x - x0) * i / n, y0 + (y - y0) * i / n) for i in range(1, n + 1)])

    def arc(self, cx, cy, r, a0, a1, rx=None):
        """From angle a0 to a1 in degrees (screen: 0 right, 90 down; decreasing = anticlockwise)."""
        rx = rx or r
        n = max(2, round(abs(math.radians(a1 - a0)) * max(r, rx) / STEP))
        pts = [(cx + rx * math.cos(math.radians(a0 + (a1 - a0) * i / n)), cy + r * math.sin(math.radians(a0 + (a1 - a0) * i / n))) for i in range(n + 1)]
        if self.pts == [(0, 0)]:  # a stroke that starts with this arc (P(0, 0).arc…)
            self.pts = [pts[0]]
        elif math.dist(pts[0], self.at) > 0.6:
            self.line(*pts[0])
        return self._add(pts[1:])

    def curve(self, c1, c2, end):
        x0, y0 = self.at
        est = math.dist((x0, y0), c1) + math.dist(c1, c2) + math.dist(c2, end)
        n = max(4, round(est / STEP))
        pts = []
        for i in range(1, n + 1):
            t = i / n
            u = 1 - t
            pts.append((u**3 * x0 + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t**3 * end[0],
                        u**3 * y0 + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t**3 * end[1]))
        return self._add(pts)

    def flick(self, x):
        """Down to just above the baseline, then a small exit flick to the right."""
        self.line(x, BASE - 6)
        return self.curve((x, BASE - 2), (x + 2, BASE), (x + 7, BASE - 1))


def P(x, y):
    return Pen(x, y)


def dot(x, y):
    return P(x, y).line(x, y + 1.5)


BOWL = 14            # small letters' bowl radius
BY = (WAIST + BASE) / 2  # its centre line (55)


def L():
    """Lowercase, each a list of strokes (Pens), in the order they're drawn."""
    g = {}
    # a: start near the top of the bowl, round anticlockwise, up the stem, down, flick.
    g["a"] = [P(0, 0).arc(27, BY, BOWL, -40, -380).line(41, WAIST).flick(41)]
    g["b"] = [P(12, TOP).line(12, BASE).line(12, BY).arc(26, BY, BOWL, 180, 540)]
    g["c"] = [P(0, 0).arc(27, BY, BOWL, -40, -320)]
    g["d"] = [P(0, 0).arc(27, BY, BOWL, -40, -380).line(41, TOP).flick(41)]
    g["e"] = [P(13, BY).line(41, BY).arc(27, BY, BOWL, 0, -320)]
    g["f"] = [P(0, 0).arc(32, 21, 10, -30, -180).line(22, BASE), P(12, WAIST).line(34, WAIST)]
    g["g"] = [P(0, 0).arc(27, BY, BOWL, -40, -380).line(41, WAIST).line(41, 85).arc(29, 85, 12, 0, 150)]
    g["h"] = [P(12, TOP).line(12, BASE).line(12, 53).arc(26, 53, BOWL, 180, 360).flick(40)]
    g["i"] = [P(14, WAIST).flick(14), dot(14, 25)]
    g["j"] = [P(26, WAIST).line(26, 85).arc(16, 85, 10, 0, 150), dot(26, 25)]
    g["k"] = [P(12, TOP).line(12, BASE), P(36, WAIST).line(13, 57).line(38, BASE)]
    g["l"] = [P(16, TOP).flick(16)]
    g["m"] = [P(12, WAIST).line(12, BASE).line(12, 50).arc(22, 50, 10, 180, 360).line(32, BASE).line(32, 50).arc(42, 50, 10, 180, 360).flick(52)]
    g["n"] = [P(12, WAIST).line(12, BASE).line(12, 53).arc(26, 53, BOWL, 180, 360).flick(40)]
    g["o"] = [P(0, 0).arc(27, BY, BOWL, -90, -455)]
    g["p"] = [P(12, WAIST).line(12, DESC).line(12, BY).arc(26, BY, BOWL, 180, 540)]
    g["q"] = [P(0, 0).arc(27, BY, BOWL, -40, -380).line(41, WAIST).line(41, DESC).curve((41, DESC + 1), (43, DESC + 2), (47, DESC + 1))]
    g["r"] = [P(12, WAIST).line(12, BASE).line(12, 53).arc(24, 53, 12, 180, 300)]
    g["s"] = [P(37, 45).curve((33, 39), (15, 39), (16, 48)).curve((17, 56), (38, 52), (38, 62)).curve((38, 72), (18, 73), (13, 65))]
    g["t"] = [P(22, 22).flick(22), P(12, WAIST).line(34, WAIST)]
    g["u"] = [P(12, WAIST).line(12, 56).arc(26, 56, BOWL, 180, 0).line(40, WAIST).flick(40)]
    g["v"] = [P(12, WAIST).line(26, BASE).line(40, WAIST)]
    g["w"] = [P(10, WAIST).line(20, BASE).line(30, 46).line(40, BASE).line(50, WAIST)]
    g["x"] = [P(12, WAIST).line(38, BASE), P(38, WAIST).line(12, BASE)]
    g["y"] = [P(12, WAIST).line(12, 56).arc(26, 56, BOWL, 180, 0).line(40, WAIST).line(40, 85).arc(28, 85, 12, 0, 150)]
    g["z"] = [P(12, WAIST).line(38, WAIST).line(12, BASE).line(40, BASE)]
    return g


def U():
    """Capitals: start at the top, down first, then across."""
    g = {}
    g["A"] = [P(26, TOP).line(10, BASE), P(26, TOP).line(42, BASE), P(16, 50).line(36, 50)]
    g["B"] = [P(12, TOP).line(12, BASE), P(12, TOP).line(27, TOP).arc(27, 24, 14, -90, 90).line(12, 38), P(12, 38).line(29, 38).arc(29, 54, 16, -90, 90).line(12, BASE)]
    g["C"] = [P(0, 0).arc(34, 40, 28, -45, -315, rx=26)]
    g["D"] = [P(12, TOP).line(12, BASE), P(12, TOP).line(20, TOP).arc(20, 40, 30, -90, 90, rx=26).line(12, BASE)]
    g["E"] = [P(12, TOP).line(12, BASE), P(12, TOP).line(40, TOP), P(12, 40).line(34, 40), P(12, BASE).line(40, BASE)]
    g["F"] = [P(12, TOP).line(12, BASE), P(12, TOP).line(40, TOP), P(12, 40).line(34, 40)]
    g["G"] = [P(0, 0).arc(34, 40, 28, -45, -340, rx=26).line(59, 44).line(42, 44)]
    g["H"] = [P(12, TOP).line(12, BASE), P(44, TOP).line(44, BASE), P(12, 40).line(44, 40)]
    g["I"] = [P(16, TOP).line(16, BASE)]
    g["J"] = [P(40, TOP).line(40, 54).arc(26, 54, 14, 0, 180)]
    g["K"] = [P(12, TOP).line(12, BASE), P(42, TOP).line(13, 44).line(44, BASE)]
    g["L"] = [P(12, TOP).line(12, BASE).line(40, BASE)]
    g["M"] = [P(10, TOP).line(10, BASE), P(10, TOP).line(30, 52).line(50, TOP).line(50, BASE)]
    g["N"] = [P(12, TOP).line(12, BASE), P(12, TOP).line(44, BASE).line(44, TOP)]
    g["O"] = [P(0, 0).arc(34, 40, 30, -90, -455, rx=26)]
    g["P"] = [P(12, TOP).line(12, BASE), P(12, TOP).line(28, TOP).arc(28, 25, 15, -90, 90).line(12, 40)]
    g["Q"] = [P(0, 0).arc(34, 40, 30, -90, -455, rx=26), P(38, 56).line(56, 76)]
    g["R"] = [P(12, TOP).line(12, BASE), P(12, TOP).line(28, TOP).arc(28, 25, 15, -90, 90).line(12, 40), P(26, 40).line(44, BASE)]
    g["S"] = [P(45, 18).curve((40, 7), (14, 7), (14, 24)).curve((14, 38), (46, 37), (46, 54)).curve((46, 73), (16, 75), (10, 62))]
    g["T"] = [P(28, TOP).line(28, BASE), P(8, TOP).line(48, TOP)]
    g["U"] = [P(12, TOP).line(12, 52).arc(28, 52, 16, 180, 0).line(44, TOP)]
    g["V"] = [P(10, TOP).line(28, BASE).line(46, TOP)]
    g["W"] = [P(8, TOP).line(20, BASE).line(32, 26).line(44, BASE).line(56, TOP)]
    g["X"] = [P(10, TOP).line(44, BASE), P(44, TOP).line(10, BASE)]
    g["Y"] = [P(10, TOP).line(27, 40), P(44, TOP).line(27, 40).line(27, BASE)]
    g["Z"] = [P(10, TOP).line(44, TOP).line(10, BASE).line(46, BASE)]
    return g


def SHAPES():
    """Pre-writing shapes (Ready to write), in the same box."""
    g = {}
    g["down"] = [P(20, TOP).line(20, BASE)]
    g["across"] = [P(8, 40).line(60, 40)]
    g["circle"] = [P(0, 0).arc(34, 40, 26, -90, -450)]
    g["cross"] = [P(30, 14).line(30, 66), P(4, 40).line(56, 40)]
    g["mountains"] = [P(6, BASE).line(20, 20).line(34, BASE).line(48, 20).line(62, BASE)]
    g["loops"] = [P(6, 62).curve((30, 62), (40, 18), (26, 18)).curve((12, 18), (24, 62), (46, 62)).curve((70, 62), (80, 18), (66, 18)).curve((52, 18), (64, 62), (86, 62))]
    return g


def pack(strokes):
    out = [[[round(x, 1), round(y, 1)] for x, y in s.pts] for s in strokes]
    xs = [p[0] for s in out for p in s]
    return {"width": round(max(xs) + 10), "strokes": out}


data = {
    "$description": "The letters to trace (Victorian foundation style) and the pre-writing shapes, GENERATED by tools/build_letters.py. Box 100 high; strokes in drawing order, each from its start point, as points about 1.5 apart.",
    "lines": {"top": TOP, "waist": WAIST, "base": BASE, "descender": DESC},
    "lowercase": {k: pack(v) for k, v in L().items()},
    "capitals": {k: pack(v) for k, v in U().items()},
    "shapes": {k: pack(v) for k, v in SHAPES().items()},
}
out = ROOT / "design/letters.json"
out.write_text(json.dumps(data, separators=(",", ":")) + "\n")
print(f"letters: {len(data['lowercase'])} lowercase, {len(data['capitals'])} capitals, {len(data['shapes'])} shapes → {out.relative_to(ROOT)} ({out.stat().st_size // 1024} KB)")
