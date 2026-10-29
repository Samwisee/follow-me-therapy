"""Trace img/logo.png into a vector mark (needs: pip install potracer). Then run tools/make_lockups.py."""
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
import numpy as np, potrace, sys
from PIL import Image, ImageFilter
SC=8
im=Image.open(ROOT / 'img/logo.png').convert('RGBA')
a=np.array(im)
# ink coverage = alpha * darkness
cov=(a[...,3]/255.0)*(1-a[...,:3].mean(axis=2)/255.0)
g=Image.fromarray((cov*255).astype('uint8')).resize((im.width*SC,im.height*SC),Image.BICUBIC).filter(ImageFilter.GaussianBlur(SC*0.6))
bm=potrace.Bitmap(np.array(g)<=127)
path=bm.trace(turdsize=SC*SC*4, alphamax=1.0, opticurve=True, opttolerance=0.4)
f=lambda p:f"{p.x/SC:.2f} {p.y/SC:.2f}"
d=[]
for c in path:
    d.append("M"+f(c.start_point))
    for s in c.segments:
        d.append(("L"+f(s.c)+" L"+f(s.end_point)) if s.is_corner else ("C"+f(s.c1)+" "+f(s.c2)+" "+f(s.end_point)))
    d.append("Z")
D="".join(d)
W,H=im.size
open(ROOT / 'img/brand/follow-me-therapy-mark.svg','w').write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}"><title>Follow Me Therapy</title><path fill="#2b2540" fill-rule="evenodd" d="{D}"/></svg>\n')
print(len(path), len(D))
