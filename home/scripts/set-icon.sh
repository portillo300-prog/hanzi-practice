#!/bin/bash
# Swap in the real icon:   bash scripts/set-icon.sh path/to/icon-1024.png
# Give it a square PNG (1024x1024 is ideal, no transparency). iPad rounds the corners itself.
set -e
SRC="$1"
[ -f "$SRC" ] || { echo "Usage: bash scripts/set-icon.sh path/to/icon.png"; exit 1; }
DIR="$(cd "$(dirname "$0")/.." && pwd)/icons"
TMP="$(mktemp -d)"
cp "$SRC" "$TMP/src.png"
sips -z 512 512 "$TMP/src.png" --out "$DIR/icon-512.png" >/dev/null
sips -z 192 192 "$TMP/src.png" --out "$DIR/icon-192.png" >/dev/null
sips -z 180 180 "$TMP/src.png" --out "$DIR/apple-touch-icon.png" >/dev/null
rm -rf "$TMP"
echo "Icons updated. Now run: node scripts/build.mjs   (so iPads pick up the change)"
