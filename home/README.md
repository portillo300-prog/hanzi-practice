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

## Voice clips
`FFMPEG=/path/to/ffmpeg node scripts/audio.mjs probe` (coverage report), then `... fetch` (slow, polite downloads from Wikimedia Commons;
trims, normalizes, converts to m4a, writes `audio-manifest.js` with speaker credits shown on the About screen). Then `node scripts/build.mjs`.
Items with no recording simply get no 🔊 button (currently: 歌 欢 在学校 写字 画画儿 儿歌 放学 放心 — a family member can record these).
Clips are matched by Commons file label, not verified by ear.

## What's in it
Celebrations (shuffled cheers, confetti, sounds with a mute button), stickers + badges per lesson, Mini Quiz (8 questions incl. write-from-memory),
Read flashcards, About & credits page.

## Not built yet (ideas)
Radical browser (Pleco-style: characters by radical, radical to characters), a mascot, more lessons (send photos of the book pages).
