"""Render the link-preview (share) image and point the site at it.

    python3 tools/make_og.py

Renders tools/og.html (built from the site's own CSS and tokens) at
1200x630, saves it as img/share-<hash>.jpg, and rewrites every
og:image / twitter:image / JSON-LD reference in index.html and
tools/build_pages.py to the new file, then rebuilds the landing pages.

The filename changes whenever the picture changes, because Messenger,
Facebook, LinkedIn and iMessage cache previews by image URL: a new URL is
what makes them show the new design. Old share-*.jpg files are removed.
"""
import hashlib
import io
import re
import subprocess
import sys
from pathlib import Path

from PIL import Image
from playwright.sync_api import sync_playwright

root = Path(__file__).resolve().parent.parent

with sync_playwright() as p:
    b = p.chromium.launch()
    page = b.new_page(viewport={"width": 1200, "height": 630})
    page.goto((root / "tools" / "og.html").as_uri())
    page.evaluate("document.fonts.ready")
    page.wait_for_timeout(400)
    png = page.screenshot()
    b.close()

buf = io.BytesIO()
Image.open(io.BytesIO(png)).convert("RGB").save(buf, "JPEG", quality=88, optimize=True, progressive=True)
data = buf.getvalue()
name = f"share-{hashlib.sha256(data).hexdigest()[:10]}.jpg"

for old in (root / "img").glob("share-*.jpg"):
    if old.name != name:
        old.unlink()
(root / "img" / name).write_bytes(data)

pattern = re.compile(r"img/share-[\w-]+\.jpg")
for rel in ("index.html", "tools/build_pages.py"):
    f = root / rel
    text = f.read_text()
    f.write_text(pattern.sub(f"img/{name}", text))

# Keep the design-system copy of the share card in step.
ds = root / "design/design-system/project/assets/Photos"
if ds.is_dir():
    (ds / "share-card.jpg").write_bytes(data)
    readme = ds / "README.md"
    if readme.exists():
        readme.write_text(pattern.sub(f"img/{name}", readme.read_text()))

subprocess.run([sys.executable, str(root / "tools" / "build_pages.py")], check=True)
print(f"wrote img/{name}")
