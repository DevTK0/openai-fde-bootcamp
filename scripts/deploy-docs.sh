#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."
pnpm --filter @workspace/docs build

# Each deployment gets an isolated release. Switch only after copying all files.
root=/var/www/openai-fde-docs
sudo install -d -m 755 "$root/releases"
release=$(sudo mktemp -d "$root/releases/release.XXXXXXXX")
sudo cp -R apps/docs/dist/. "$release/"
sudo chmod -R a+rX "$release"
sudo ln -s "$release" "$release.link"
sudo mv -Tf "$release.link" "$root/current"
printf 'Published docs to %s\n' "$release"
