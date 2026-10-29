"""Render tools/og.html to img/og.jpg (1200x630 link-preview image)."""
from pathlib import Path
from playwright.sync_api import sync_playwright
from PIL import Image

root = Path(__file__).resolve().parent.parent
png = root / "tools" / "_og.png"
with sync_playwright() as p:
    b = p.chromium.launch()
    page = b.new_page(viewport={"width": 1200, "height": 630})
    page.goto((root / "tools" / "og.html").as_uri())
    page.evaluate("document.fonts.ready")
    page.wait_for_timeout(300)
    page.screenshot(path=str(png))
    b.close()
Image.open(png).convert("RGB").save(root / "img" / "og.jpg", quality=88, optimize=True, progressive=True)
png.unlink()
print("wrote img/og.jpg")
