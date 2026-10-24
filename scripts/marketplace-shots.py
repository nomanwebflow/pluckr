#!/usr/bin/env python3
"""Turn raw screenshots into Marketplace-ready 1280x800 PNGs.

Usage: python3 scripts/marketplace-shots.py <folder-or-files...>
Each image is scaled to cover 1280x800 and centre-cropped (no padding, square corners), then written to
brand/marketplace/screenshots/. Warns when the source is not roughly 16:10, because the crop would cut content.
"""
import sys
from pathlib import Path
from PIL import Image

W, H = 1280, 800
OUT = Path(__file__).resolve().parent.parent / "brand" / "marketplace" / "screenshots"
OUT.mkdir(parents=True, exist_ok=True)

paths = []
for arg in sys.argv[1:]:
    p = Path(arg).expanduser()
    paths += sorted(p.glob("*")) if p.is_dir() else [p]
paths = [p for p in paths if p.suffix.lower() in {".png", ".jpg", ".jpeg", ".webp"}]
if not paths:
    sys.exit("No images found. Pass a folder or image files.")

for index, path in enumerate(paths, start=1):
    img = Image.open(path).convert("RGB")
    ratio = img.width / img.height
    if abs(ratio - W / H) > 0.04:
        print(f"! {path.name}: {img.width}x{img.height} is not 16:10, the crop will cut content.")
    scale = max(W / img.width, H / img.height)
    resized = img.resize((round(img.width * scale), round(img.height * scale)), Image.LANCZOS)
    left, top = (resized.width - W) // 2, (resized.height - H) // 2
    out = OUT / f"screenshot-{index}.png"
    resized.crop((left, top, left + W, top + H)).save(out, optimize=True)
    print(f"{path.name} -> {out.relative_to(OUT.parent.parent.parent)}  ({img.width}x{img.height})")
