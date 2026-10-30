#!/usr/bin/env python3
"""Puts the hero flip loop (brand/hero-flip.mp4) on a 4:5 Instagram canvas: brand/social/hero-flip-instagram-4x5.mp4.

Usage: python3 scripts/export-hero-instagram.py
Needs ffmpeg and Pillow. Black canvas, logo row, a two-line headline and one line of copy in PP Neue Montreal (the site font),
the loop below them. It also writes a still of the canvas (hero-flip-instagram-4x5.png) to check the layout.
"""
import subprocess
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
FONT = ROOT / "pluckr.webflow" / "fonts" / "PPNeueMontreal-Medium.ttf"
SRC = ROOT / "brand" / "hero-flip.mp4"
LOGO = ROOT / "brand" / "pluckr-logo-120.png"
OUT = ROOT / "brand" / "social"
W, H = 1080, 1350
MARGIN = 80
VIDEO_W = W - 2 * MARGIN                      # 920
VIDEO_H = round(VIDEO_W * 860 / 900 / 2) * 2  # the window is 900 x 860
VIDEO_Y = H - VIDEO_H - 48

img = Image.new("RGB", (W, H), (0, 0, 0))
draw = ImageDraw.Draw(img)
font = lambda size: ImageFont.truetype(str(FONT), size)

# Logo row: mark and wordmark on the left, the address on the right, sharing one centre line.
row_y = 64
logo = Image.open(LOGO).convert("RGBA").resize((44, 44), Image.LANCZOS)
img.paste(logo, (MARGIN, row_y - 22), logo)
draw.text((MARGIN + 60, row_y), "PLUCKR", font=font(30), fill=(255, 255, 255), anchor="lm")
draw.text((W - MARGIN, row_y), "docpluckr.com", font=font(28), fill=(150, 150, 150), anchor="rm")

# Two-line headline, left aligned to the same margin as the window.
size = 84
lines = ["EVERY IMAGE OUT", "OF YOUR GOOGLE DOC"]
while max(draw.textlength(l, font=font(size)) for l in lines) > W - 2 * MARGIN:
    size -= 2
y = 132
for l in lines:
    draw.text((MARGIN, y), l, font=font(size), fill=(255, 255, 255), anchor="la")
    y += round(size * 1.04)
sub_y = y + 20
draw.text((MARGIN, sub_y), "Preview, rename, convert and download. One-time $5.", font=font(32), fill=(165, 165, 165), anchor="la")
print(f"headline {size}px, copy ends near y={sub_y + 36}, video starts at y={VIDEO_Y}")
assert sub_y + 36 < VIDEO_Y - 24, "the copy runs into the video"

OUT.mkdir(parents=True, exist_ok=True)
bg = OUT / "hero-flip-instagram-4x5.png"
img.save(bg)

out = OUT / "hero-flip-instagram-4x5.mp4"
subprocess.run([
    "ffmpeg", "-y", "-loglevel", "error", "-loop", "1", "-i", str(bg), "-i", str(SRC),
    "-filter_complex", f"[1:v]scale={VIDEO_W}:{VIDEO_H}:flags=lanczos[v];[0:v][v]overlay={MARGIN}:{VIDEO_Y}:shortest=1,fps=30,format=yuv420p",
    "-c:v", "libx264", "-crf", "17", "-preset", "slow", "-movflags", "+faststart", "-an", str(out),
], check=True)
print("wrote", out)
