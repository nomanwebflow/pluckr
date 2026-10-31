#!/bin/sh
# Publishes the marketing site (webflow) to Cloudflare Pages.
# Only the pages the add-on needs go up; the Webflow template pages (styleguide, example-components, 401, search) stay out.
set -e
export PATH="$HOME/.nvm/versions/node/v22.23.1/bin:/usr/local/bin:/opt/homebrew/bin:$PATH"
cd "$(dirname "$0")/.."
OUT=site-dist
rm -rf "$OUT" && mkdir "$OUT"
for f in index.html hero-flip.html privacy.html terms.html 404.html sitemap.xml robots.txt extract-images-from-google-docs.html convert-google-docs-images-to-webp.html; do cp "webflow/$f" "$OUT/$f"; done
mkdir "$OUT/guides" && cp webflow/guides/*.html "$OUT/guides/"
for d in css js images fonts; do cp -R "webflow/$d" "$OUT/$d"; done
find "$OUT" -name .DS_Store -delete
npx -y wrangler pages deploy "$OUT" --project-name pluckr --branch main --commit-dirty=true
