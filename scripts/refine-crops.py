"""Refine homepage crop coordinates by sampling strips and tighter boxes."""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "design-references" / "PARTY WAGON FIGMA FILES" / "HomePage.png"
OUT = ROOT / "public" / "assets"
DEBUG = ROOT / "design-references" / "_crop-debug"
DEBUG.mkdir(parents=True, exist_ok=True)

img = Image.open(SRC).convert("RGB")
w, h = img.size
print(f"{w}x{h}")

# Save horizontal strips to locate sections
for i, y in enumerate(range(0, h, 200)):
    strip = img.crop((0, y, w, min(y + 200, h)))
    strip.save(DEBUG / f"strip_{i:02d}_y{y}.jpg", quality=80)

# Tighter crops based on Figma composition at 1440x4495
crops = {
    # Hero photo only (right side under nav, before ticker)
    "banners/hero-party.jpg": (520, 430, 1380, 1180),
    # About photo inside decorative frame
    "banners/about-friends.jpg": (70, 2550, 620, 3180),
    # Planner photo
    "banners/planner-party.jpg": (760, 3350, 1370, 3920),
    # Product images — card image areas only (exclude titles/prices where possible)
    "products/heineken.jpg": (80, 1680, 340, 1980),
    "products/smirnoff.jpg": (400, 1680, 660, 1980),
    "products/dom-perignon.jpg": (720, 1680, 980, 1980),
    "products/sex-on-the-beach.jpg": (1040, 1680, 1300, 1980),
    "products/coca-cola.jpg": (80, 2140, 340, 2440),
    "products/sprite.jpg": (400, 2140, 660, 2440),
    "products/absolut-vodka.jpg": (720, 2140, 980, 2440),
    "products/jack-daniels.jpg": (1040, 2140, 1300, 2440),
    # Avatars
    "testimonials/samuel-oduro.jpg": (95, 4055, 175, 4135),
    "testimonials/james-dwomoh.jpg": (525, 4055, 605, 4135),
    "testimonials/elizabeth-oduro.jpg": (955, 4055, 1035, 4135),
}

for rel, box in crops.items():
    cropped = img.crop(box)
    dest = OUT / rel
    cropped.save(dest, quality=92)
    print(rel, cropped.size, box)
