# 写汉字 Hanzi Practice (home app)

Offline iPad web app (PWA) for practicing Chinese characters: stroke-order tracing, pinyin with tone colors, meaning,
simplified/traditional toggle, and read-only flashcards. No accounts, no tracking — progress stays on the device.

## Change the vocabulary
1. Edit `content.js` (the only file with words in it — see the comment at the top for the format).
2. Run `node scripts/build.mjs` — fetches stroke data for any new characters, bakes it into `strokes.js`, stamps a new version.
3. Publish the folder (push to GitHub Pages). iPads pick up the change the next time they open the app online.

## Swap the icon
`bash scripts/set-icon.sh path/to/icon-1024.png`, then `node scripts/build.mjs`.
(`python3 scripts/make-icons.py` regenerates the placeholder 字 icon.)

## Files
- `index.html`, `styles.css`, `app.js` — the app (3 screens: home → lesson → practice/read)
- `content.js` — lessons, characters, words
- `strokes.js` — GENERATED stroke data (don't edit)
- `sw.js` — offline engine; `manifest.webmanifest` — makes it installable
- `vendor/hanzi-writer.min.js` — Hanzi Writer 3.7.3, bundled locally so it works offline

## Install on an iPad
Open the app's link in **Safari** → Share → **Add to Home Screen**. Open it once with internet; after that it works offline.

## Not built yet (ideas)
Audio button per card (an add-on: pre-recorded mp3s per character/word + a 🔊 button next to the pinyin), radical browser (Pleco-style: characters by radical, radical → characters).
