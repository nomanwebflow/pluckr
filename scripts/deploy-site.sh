#!/bin/sh
# Publishes the marketing site (pluckr.webflow) to Cloudflare Pages.
# Only the pages the add-on needs go up; the Webflow template pages (styleguide, example-components, 401, search) stay out.
set -e
export PATH="$HOME/.nvm/versions/node/v22.23.1/bin:/usr/local/bin:/opt/homebrew/bin:$PATH"
cd "$(dirname "$0")/.."
OUT=site-dist
rm -rf "$OUT" && mkdir "$OUT"
for f in index.html privacy.html terms.html 404.html; do cp "pluckr.webflow/$f" "$OUT/$f"; done
for d in css js images; do cp -R "pluckr.webflow/$d" "$OUT/$d"; done
find "$OUT" -name .DS_Store -delete
npx -y wrangler pages deploy "$OUT" --project-name pluckr --branch main --commit-dirty=true
