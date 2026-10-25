#!/usr/bin/env python3
"""Blur the Google account photo (top-right of Docs) in the Marketplace screenshots."""
from pathlib import Path
from PIL import Image, ImageFilter, ImageDraw

DIR = Path(__file__).resolve().parent.parent / "brand" / "marketplace" / "screenshots"
BOX = (1218, 8, 1272, 54)  # around the avatar at 1280x800

import sys
# Optional file names limit which shots are blurred (the Slides shot is cropped so its avatar is already out of frame).
only = set(sys.argv[1:])
for path in sorted(DIR.glob("screenshot-*.png")):
    if only and path.name not in only:
        continue
    img = Image.open(path).convert("RGB")
    region = img.crop(BOX).filter(ImageFilter.GaussianBlur(9))
    mask = Image.new("L", region.size, 0)
    ImageDraw.Draw(mask).ellipse((2, 2, region.width - 3, region.height - 3), fill=255)  # keep the blur round, no hard box
    img.paste(region, BOX[:2], mask)
    img.save(path, optimize=True)
    print("blurred avatar in", path.name)
