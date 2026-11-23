"""One-off helper: crop approved homepage imagery from the Figma export."""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "design-references" / "PARTY WAGON FIGMA FILES" / "HomePage.png"
OUT = ROOT / "public" / "assets"

dirs = [
    OUT / "brand",
    OUT / "banners",
    OUT / "categories",
    OUT / "products",
    OUT / "decorations",
    OUT / "testimonials",
]
for d in dirs:
    d.mkdir(parents=True, exist_ok=True)

img = Image.open(SRC).convert("RGB")
w, h = img.size
print(f"source={w}x{h}")

# Crop helpers use fractional boxes (left, top, right, bottom)
crops = {
    # Hero lifestyle photo (right of yellow headline)
    "banners/hero-party.jpg": (0.42, 0.105, 0.93, 0.265),
    # About section cloud photo
    "banners/about-friends.jpg": (0.06, 0.575, 0.42, 0.72),
    # Party planner banner photo
    "banners/planner-party.jpg": (0.52, 0.74, 0.94, 0.88),
    # Best seller product tiles — approximate grid from Figma
    "products/heineken.jpg": (0.055, 0.355, 0.245, 0.445),
    "products/smirnoff.jpg": (0.275, 0.355, 0.465, 0.445),
    "products/dom-perignon.jpg": (0.495, 0.355, 0.685, 0.445),
    "products/sex-on-the-beach.jpg": (0.715, 0.355, 0.905, 0.445),
    "products/coca-cola.jpg": (0.055, 0.46, 0.245, 0.55),
    "products/sprite.jpg": (0.275, 0.46, 0.465, 0.55),
    "products/absolut-vodka.jpg": (0.495, 0.46, 0.685, 0.55),
    "products/jack-daniels.jpg": (0.715, 0.46, 0.905, 0.55),
    # Testimonial avatars
    "testimonials/samuel-oduro.jpg": (0.075, 0.905, 0.12, 0.935),
    "testimonials/james-dwomoh.jpg": (0.375, 0.905, 0.42, 0.935),
    "testimonials/elizabeth-oduro.jpg": (0.675, 0.905, 0.72, 0.935),
}

for rel, (l, t, r, b) in crops.items():
    box = (int(l * w), int(t * h), int(r * w), int(b * h))
    cropped = img.crop(box)
    dest = OUT / rel
    cropped.save(dest, quality=92)
    print(f"saved {rel} {cropped.size}")

# Also save a mid-res preview strip for manual verification later
preview = img.copy()
preview.thumbnail((900, 9000))
preview.save(ROOT / "design-references" / "_homepage_preview.png")
print("preview saved", preview.size)
