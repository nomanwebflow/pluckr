#!/usr/bin/env python3
"""Builds the generic sample Doc used for the Marketplace screenshots (a blog draft an SEO team might review).
Needs python-docx. Images: Unsplash photos and the infographics in brand/marketplace/assets (no client content).
Output: brand/marketplace/assets/sample-blog-draft.docx. Upload it to Google Docs and use File > Save as Google Docs.
"""
from pathlib import Path
from docx import Document
from docx.shared import Inches, Pt

ROOT = Path(__file__).resolve().parent.parent / "brand" / "marketplace" / "assets"
PHOTO = ROOT / "unsplash"
INFO = ROOT / "infographics"

doc = Document()
doc.styles["Normal"].font.name = "Arial"
doc.styles["Normal"].font.size = Pt(11)

doc.add_heading("5 Ways to Speed Up Your Site With Better Images", level=1)
doc.add_paragraph("Draft for review. Target keyword: image optimization for SEO.")

doc.add_paragraph(
    "Images are usually the heaviest part of a page. A slow hero image pushes back your Largest Contentful Paint, "
    "and Google measures it. The fix is rarely a redesign: it is smaller files, honest names and a sentence of alt text."
)
doc.add_picture(str(PHOTO / "analytics-laptop.jpg"), width=Inches(6.0))
doc.add_paragraph("Check load time and bounce rate together before you change anything.")

doc.add_heading("1. Convert before you upload", level=2)
doc.add_paragraph(
    "A PNG straight from a design tool can weigh several megabytes. The same picture as WebP or AVIF looks identical "
    "at a fraction of the size."
)
doc.add_picture(str(INFO / "weight.png"), width=Inches(6.0))

doc.add_heading("2. Name and describe every image", level=2)
table = doc.add_table(rows=1, cols=2)
left, right = table.rows[0].cells
left.paragraphs[0].add_run("Quick wins for the content team").bold = True
for line in (
    "Rename files to the topic, not the camera: team-reporting-call.webp.",
    "Write alt text for people who cannot see the image.",
    "Keep one keyword per image, and never repeat it.",
):
    left.add_paragraph(line, style="List Bullet")
right.paragraphs[0].add_run().add_picture(str(PHOTO / "coffee-laptop.jpg"), width=Inches(2.9))

doc.add_heading("3. Run the checklist on every post", level=2)
doc.add_picture(str(INFO / "checklist.png"), width=Inches(6.0))
doc.add_paragraph("Next steps: send the converted set to the developer and publish on Thursday.")

out = ROOT / "sample-blog-draft.docx"
doc.save(out)
print("saved", out)
