# Draws the cloud behind the home page's "Every session…" callout.
# The cloud is a smooth union of circles (each join rounded off, so there
# are no sharp notches or flat shelves), traced into an SVG path.
# Run: python3 tools/make_cloud.py   (writes img/cloud-wide.svg, img/cloud-tall.svg)
import os
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")

def smin(a, b, k):
    h = np.clip(0.5 + 0.5 * (b - a) / k, 0, 1)
    return b * (1 - h) + a * h - k * h * (1 - h)

def capsule(xs, ys, x0, x1, cy, r):
    """Distance to a flat-bottomed, round-ended base from x0 to x1."""
    px = np.clip(xs, x0, x1)
    return np.hypot(xs - px, ys - cy) - r

def cloud(w, h, base, circles, k, name):
    xs, ys = np.meshgrid(np.linspace(0, w, w + 1), np.linspace(0, h, h + 1))
    d = capsule(xs, ys, *base)
    for cx, cy, r in circles:
        d = smin(d, np.hypot(xs - cx, ys - cy) - r, k)
    cs = plt.contour(xs, ys, d, levels=[0])
    seg = max(cs.allsegs[0], key=len)
    pts = seg[:: max(1, len(seg) // 260)]
    path = "M" + " L".join(f"{x:.1f} {y:.1f}" for x, y in pts) + "Z"
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" '
           f'preserveAspectRatio="none"><path fill="#fff" d="{path}"/></svg>\n')
    with open(os.path.join(ROOT, "img", name), "w") as f:
        f.write(svg)
    plt.close("all")

# Wide (desktop): a long, flat, round-ended base with three big puffs on
# top and a small one at each shoulder. The joins are only lightly rounded
# (k), so it reads as puffs, not a wobbly blob.
cloud(1000, 330, (130, 870, 230, 86), [
    (128, 190, 84), (310, 150, 104), (515, 118, 118), (725, 148, 106), (872, 194, 82),
], 16, "cloud-wide.svg")

# Tall (phones): a cumulus, a flat round-ended base with five puffs in
# an arch over the top, the middle one tallest, for text wrapped over four
# or five lines.
cloud(600, 480, (125, 475, 372, 98), [
    (92, 300, 84), (192, 206, 100), (318, 150, 118), (448, 208, 100), (512, 300, 82),
], 16, "cloud-tall.svg")
print("ok")
