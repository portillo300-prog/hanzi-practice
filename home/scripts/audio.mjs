// Finds real native-speaker recordings on Wikimedia Commons for every character/word in content.js,
// downloads them politely (slowly), trims + normalizes + converts to m4a (plays on iPad/iPhone),
// and writes audio/ + audio-manifest.js (with speaker credits for the About screen).
//
//   node scripts/audio.mjs probe    -> coverage report only, downloads nothing
//   node scripts/audio.mjs fetch    -> download + convert + write manifest (skips clips already done)
//
// Needs ffmpeg: set FFMPEG=/path/to/ffmpeg, or have `ffmpeg` on PATH.
// Sources: Commons tone-marked set (Zh-zài.ogg) for single characters (unambiguous tone),
//          Lingua Libre (LL-Q9192 (cmn)) for words. Both are Creative Commons.
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const mode = process.argv[2] || 'probe';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cacheDir = path.join(root, 'scripts', '.cache', 'audio');
const outDir = path.join(root, 'audio');
fs.mkdirSync(cacheDir, { recursive: true });
fs.mkdirSync(outDir, { recursive: true });
const FFMPEG = process.env.FFMPEG || 'ffmpeg';
const UA = 'HanziHomeApp/1.0 (personal family learning app; portillo300@gmail.com)';
const API = 'https://commons.wikimedia.org/w/api.php';
const SPEAKERS = ['Luilui6666', 'Assassas77', 'Levi Highway (列维劳德)', 'Jouketou', 'Bakerkobe', 'Vickylin77amis', '雲角'];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(root, 'content.js'), 'utf8'), sandbox);
const C = sandbox.window.CONTENT;

/* pinyin with tone numbers -> tone-marked syllable (matches app.js) */
const MARKS = { a: 'āáǎà', e: 'ēéěè', i: 'īíǐì', o: 'ōóǒò', u: 'ūúǔù', 'ü': 'ǖǘǚǜ' };
function mark(py) {
  const tone = parseInt(py.slice(-1), 10);
  let base = py.replace(/[1-5]$/, '').replace(/v/g, 'ü');
  if (!(tone >= 1 && tone <= 4)) return base;
  let i = base.indexOf('a');
  if (i < 0) i = base.indexOf('e');
  if (i < 0) i = base.indexOf('ou');
  if (i < 0) for (let k = base.length - 1; k >= 0; k--) if ('iouü'.includes(base[k])) { i = k; break; }
  if (i >= 0) base = base.slice(0, i) + MARKS[base[i]][tone - 1] + base.slice(i + 1);
  return base.normalize('NFC');
}

async function api(params) {
  const url = API + '?' + new URLSearchParams({ format: 'json', ...params });
  for (let a = 0; a < 5; a++) {
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (res.ok) return res.json();
    await sleep(3000 * (a + 1));
  }
  throw new Error('API failed: ' + url);
}

async function fileInfo(title) {
  const d = await api({ action: 'query', titles: title, prop: 'imageinfo', iiprop: 'url|extmetadata|mime|size' });
  const page = Object.values(d.query.pages)[0];
  if (!page || page.missing !== undefined || !page.imageinfo) return null;
  const ii = page.imageinfo[0];
  const md = ii.extmetadata || {};
  const strip = (s) => (s || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  return {
    title: page.title, url: ii.url, mime: ii.mime,
    license: strip(md.LicenseShortName && md.LicenseShortName.value) || 'CC',
    artist: strip(md.Artist && md.Artist.value),
    page: ii.descriptionurl
  };
}

async function findLinguaLibre(word) {
  for (const sp of SPEAKERS) {
    const prefix = `LL-Q9192 (cmn)-${sp}-${word}`;
    const d = await api({ action: 'query', list: 'allpages', apnamespace: '6', apprefix: prefix, aplimit: '5' });
    const hit = d.query.allpages.find((p) => p.title === `File:${prefix}.wav`);
    if (hit) { const info = await fileInfo(hit.title); if (info) return { ...info, speaker: sp, source: 'Lingua Libre' }; }
    await sleep(250);
  }
  // any other speaker: search, keep only exact single-word recordings
  const d = await api({ action: 'query', list: 'search', srnamespace: '6', srlimit: '50', srsearch: `intitle:"LL-Q9192 (cmn)" ${word}` });
  const hit = d.query.search.find((r) => r.title.startsWith('File:LL-Q9192 (cmn)-') && r.title.endsWith(`-${word}.wav`));
  if (hit) {
    const info = await fileInfo(hit.title);
    if (info) return { ...info, speaker: hit.title.slice('File:LL-Q9192 (cmn)-'.length, -`-${word}.wav`.length), source: 'Lingua Libre' };
  }
  return null;
}

async function findToneMarked(py) {
  for (const cand of [`File:Zh-${mark(py)}.ogg`]) {
    const info = await fileInfo(cand);
    if (info) return { ...info, speaker: info.artist || 'Wikimedia Commons contributor', source: 'Wikimedia Commons' };
    await sleep(250);
  }
  return null;
}

async function findToneMarkedWord(pySyllables) {
  const joined = pySyllables.trim().split(/\s+/).map(mark).join('');
  for (const cand of [`File:Zh-${joined}.ogg`, `File:Zh-${joined.charAt(0).toUpperCase() + joined.slice(1)}.ogg`]) {
    const info = await fileInfo(cand);
    if (info) return { ...info, speaker: info.artist || 'Wikimedia Commons contributor', source: 'Wikimedia Commons' };
    await sleep(250);
  }
  return null;
}

/* items to cover */
const items = new Map(); // key -> { key, kind, py, alt }
for (const L of C.lessons) {
  for (const c of L.characters) items.set(c.s, { key: c.s, kind: 'c', py: c.py, alt: c.alt });
  for (const w of L.words) if (!items.has(w.s)) items.set(w.s, { key: w.s, kind: 'w', py: w.py });
}

const hex = (s) => 'u' + Array.from(s).map((ch) => ch.codePointAt(0).toString(16)).join('_');
const manifestFile = path.join(cacheDir, 'manifest.json');
const manifest = fs.existsSync(manifestFile) ? JSON.parse(fs.readFileSync(manifestFile, 'utf8')) : {};

const report = { found: [], missing: [] };
for (const it of items.values()) {
  if (manifest[it.key] && fs.existsSync(path.join(root, manifest[it.key].f))) { report.found.push(`${it.key} (already done)`); continue; }
  let hit = null;
  if (it.kind === 'c') {
    hit = await findToneMarked(it.py);
    if (!hit && it.alt) hit = await findToneMarked(it.alt);
    if (!hit) hit = await findLinguaLibre(it.key);
  } else {
    hit = await findLinguaLibre(it.key);
    if (!hit) hit = await findToneMarkedWord(it.py);
  }
  if (!hit) { report.missing.push(it.key); console.log('MISSING ', it.key); continue; }
  report.found.push(`${it.key} <- ${hit.source}: ${hit.title}`);
  console.log('found   ', it.key, '<-', hit.title);
  it._hit = hit;
}
console.log(`\ncoverage: ${report.found.length}/${items.size}   missing: ${report.missing.join(' ') || 'none'}`);
if (mode !== 'fetch') process.exit(0);

/* ---- fetch + convert ---- */
async function download(url, dest) {
  for (let a = 0; a < 8; a++) {
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (res.ok) { fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer())); return; }
    if (res.status === 429) { const wait = 150 + a * 60; console.log(`  429 rate-limited, waiting ${wait}s…`); await sleep(wait * 1000); continue; }
    throw new Error(`HTTP ${res.status} for ${url}`);
  }
  throw new Error('gave up (rate limited): ' + url);
}
function ff(args) { return spawnSync(FFMPEG, ['-hide_banner', ...args], { encoding: 'utf8' }); }
function convert(src, dest) {
  // trim silence at both ends, peak-normalize to about -1 dB, mono AAC in m4a
  const trim = 'silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.04,areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.04,areverse';
  const probe = ff(['-i', src, '-af', trim + ',volumedetect', '-f', 'null', '-']);
  const m = /max_volume: (-?[\d.]+) dB/.exec(probe.stderr || '');
  const gain = m ? Math.min(20, -1 - parseFloat(m[1])) : 0;
  const r = ff(['-y', '-loglevel', 'error', '-i', src, '-af', `${trim},volume=${gain.toFixed(1)}dB,apad=pad_dur=0.05`, '-ac', '1', '-ar', '44100', '-c:a', 'aac', '-b:a', '64k', dest]);
  if (r.status !== 0) throw new Error('ffmpeg failed: ' + r.stderr);
}
function duration(file) {
  const m = /Duration: (\d+):(\d+):([\d.]+)/.exec(ff(['-i', file]).stderr || '');
  return m ? (+m[1]) * 3600 + (+m[2]) * 60 + parseFloat(m[3]) : 0;
}

let first = true;
for (const it of items.values()) {
  if (!it._hit) continue;
  if (!first) await sleep(9000 + Math.random() * 5000); // be gentle with the Wikimedia file servers
  first = false;
  const h = it._hit;
  const ext = path.extname(new URL(h.url).pathname) || '.bin';
  const raw = path.join(cacheDir, hex(it.key) + ext);
  if (!fs.existsSync(raw)) { console.log('download', it.key, h.title); await download(h.url, raw); }
  const rel = `audio/${hex(it.key)}.m4a`;
  convert(raw, path.join(root, rel));
  const dur = duration(path.join(root, rel));
  manifest[it.key] = { f: rel, who: h.speaker, lic: h.license, src: h.page, from: h.source, secs: Math.round(dur * 100) / 100 };
  fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 1));
  console.log(`  ok ${it.key}  ${dur.toFixed(2)}s`);
}

/* write the manifest the app loads */
const live = {};
for (const [k, v] of Object.entries(manifest)) if (items.has(k) && fs.existsSync(path.join(root, v.f))) live[k] = v;
fs.writeFileSync(path.join(root, 'audio-manifest.js'), 'window.AUDIO = ' + JSON.stringify(live) + ';\n');
console.log(`audio-manifest.js: ${Object.keys(live).length} clips`);
