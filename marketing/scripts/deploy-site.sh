#!/bin/sh
# Builds and deploys the new Next.js site (site/) to Cloudflare Pages.
set -e
export PATH="$HOME/.nvm/versions/node/v22.23.4/bin:$HOME/.nvm/versions/node/v22.23.1/bin:/usr/local/bin:/opt/homebrew/bin:$PATH"
export CLOUDFLARE_ACCOUNT_ID=a908137b5171e3088e020396b40c4037

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"

echo "Building site..."
cd "$REPO_ROOT/site"
npm run build

echo "Deploying to Cloudflare Pages (project: pluckr)..."
cd "$REPO_ROOT"
find site/out -name .DS_Store -delete
wrangler pages deploy site/out --project-name pluckr --branch main --commit-dirty=true
