"""Build the logo lockups (name outlined in Fredoka, so no font is needed to print) from the traced mark.
The name is drawn at the `weight.brand` token from design/tokens.json, the same weight as the
practice name on the website, so the logo files follow the design system.
Writes img/brand/follow-me-therapy-*.svg in ink and white. Needs fonttools + brotli."""
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
import re, json
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
INK="#2b2540"
mark=open(ROOT / 'img/brand/follow-me-therapy-mark.svg').read()
md=re.search(r' d="([^"]+)"',mark).group(1)
MW,MH=271,300
BRAND_WEIGHT=json.load(open(ROOT / 'design/tokens.json'))['weight']['brand']['$value']
def text_path(txt, font_file, size):
    f=TTFont(font_file)
    if 'fvar' in f: f=instancer.instantiateVariableFont(f, {"wght": BRAND_WEIGHT})
    gs=f.getGlyphSet(); cmap=f.getBestCmap(); upm=f['head'].unitsPerEm
    hmtx=f['hmtx']; s=size/upm; x=0; pen=SVGPathPen(gs)
    kern={}
    for ch in txt:
        g=cmap[ord(ch)]
        tp=TransformPen(pen,(s,0,0,-s,x,0)); gs[g].draw(tp); x+=hmtx[g][0]*s
    asc=f['hhea'].ascent*s; cap=f['OS/2'].sCapHeight*s
    return pen.getCommands(), x, cap
F=str(ROOT / 'fonts')+'/fredoka-latin-variable.woff2'
FS=str(ROOT / 'fonts')+'/quicksand-latin-600-normal.woff2'
def svg(w,h,body,title="Follow Me Therapy"):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:.1f} {h:.1f}" width="{w:.0f}" height="{h:.0f}"><title>{title}</title>{body}</svg>\n'
def build(color, suffix):
    p=lambda d,tr="",rule="evenodd": f'<path fill="{color}" fill-rule="{rule}"{tr} d="{d}"/>'
    open(ROOT / f'img/brand/follow-me-therapy-mark{suffix}.svg','w').write(svg(MW,MH,p(md)))
    # stacked: mark centred above the name
    td,tw,cap=text_path("Follow Me Therapy",F,120)
    gap=40; mh=330; ms=mh/MH; mw=MW*ms
    W=max(tw,mw)+40; H=mh+gap+cap+40
    body=p(md,f' transform="translate({(W-mw)/2:.2f} 20) scale({ms:.4f})"')+p(td,f' transform="translate({(W-tw)/2:.2f} {20+mh+gap+cap:.2f})"',"nonzero")
    open(ROOT / f'img/brand/follow-me-therapy-lockup-stacked{suffix}.svg','w').write(svg(W,H,body))
    # horizontal: mark left, name + descriptor right
    td2,tw2,cap2=text_path("Follow Me Therapy",F,96)
    sd,sw,scap=text_path("Paediatric Occupational Therapy",FS,38)
    mh=200; ms=mh/MH; mw=MW*ms; gx=40
    W=20+mw+gx+max(tw2,sw)+20; H=mh+40
    ty=20+mh/2-6; 
    body=p(md,f' transform="translate(20 20) scale({ms:.4f})"')+p(td2,f' transform="translate({20+mw+gx:.2f} {ty:.2f})"',"nonzero")+p(sd,f' transform="translate({20+mw+gx+3:.2f} {ty+28+scap:.2f})"',"nonzero")
    open(ROOT / f'img/brand/follow-me-therapy-lockup-horizontal{suffix}.svg','w').write(svg(W,H,body))
build(INK,"")
build("#ffffff","-white")
