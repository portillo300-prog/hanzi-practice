// Run after editing content.js:   node scripts/build.mjs
// 1) fetches stroke-order data for every character used (simplified + traditional)
// 2) bakes it into strokes.js so the app never needs the internet
// 3) stamps a new version into sw.js so iPads pick up the update
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cacheDir = path.join(root, 'scripts', '.cache');
fs.mkdirSync(cacheDir, { recursive: true });

const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(root, 'content.js'), 'utf8'), sandbox);
const C = sandbox.window.CONTENT;

const SIMP = (c) => `https://cdn.jsdelivr.net/npm/hanzi-writer-data@2/${encodeURIComponent(c)}.json`;
const TRAD = (c) => `https://cdn.jsdelivr.net/npm/hanzi-writer-data-acjk@1.0.0/animCJK/ZhHant/${encodeURIComponent(c)}.json`;

const need = new Map(); // char -> 's' | 't'   (which dataset it must come from)
const problems = [];
function addPair(s, t, label, py) {
  const S = [...s], T = [...t];
  if (S.length !== T.length) problems.push(`${label}: simplified "${s}" and traditional "${t}" differ in length`);
  S.forEach((sc, i) => {
    need.set(sc, need.get(sc) || 's');
    const tc = T[i];
    if (tc && tc !== sc && !need.has(tc)) need.set(tc, 't');
  });
  if (py) {
    const n = py.trim().split(/\s+/).length;
    if (n !== S.length) console.warn(`  note: ${label} has ${S.length} characters but ${n} syllables (fine for things like 画画儿)`);
  }
}
for (const L of C.lessons) {
  addPair(L.title.s, L.title.t, `title of lesson ${L.number}`);
  for (const it of [...L.characters, ...L.words]) addPair(it.s, it.t, `${L.id} ${it.s}`, it.py);
  for (const c of L.characters) if ([...c.s].length !== 1) problems.push(`${L.id}: "${c.s}" is in characters but is not a single character`);
}
addPair(C.appTitle.s, C.appTitle.t, 'app title');
if (problems.length) { console.error('\nProblems:\n - ' + problems.join('\n - ')); process.exit(1); }

async function getData(ch, kind) {
  const f = path.join(cacheDir, `${kind}-${ch}.json`);
  if (fs.existsSync(f)) return JSON.parse(fs.readFileSync(f, 'utf8'));
  const res = await fetch(kind === 's' ? SIMP(ch) : TRAD(ch));
  if (!res.ok) throw new Error(`No ${kind === 's' ? 'simplified' : 'traditional'} stroke data for "${ch}" (HTTP ${res.status})`);
  const json = await res.json();
  fs.writeFileSync(f, JSON.stringify(json));
  return json;
}

const out = {};
for (const [ch, kind] of need) {
  const d = await getData(ch, kind);
  out[ch] = { strokes: d.strokes, medians: d.medians, ...(d.radStrokes ? { radStrokes: d.radStrokes } : {}) };
}
fs.writeFileSync(path.join(root, 'strokes.js'), 'window.STROKES = ' + JSON.stringify(out) + ';\n');
console.log(`strokes.js: ${Object.keys(out).length} characters (${[...need.values()].filter((k) => k === 't').length} traditional-only)`);

// stamp a version so devices refresh their offline copy
const audioFiles = fs.existsSync(path.join(root, 'audio')) ? fs.readdirSync(path.join(root, 'audio')).filter((f) => f.endsWith('.m4a')).sort().map((f) => 'audio/' + f) : [];
const core = ['index.html', 'styles.css', 'app.js', 'fx.js', 'garden.js', 'games.js', 'content.js', 'strokes.js', 'audio-manifest.js', 'manifest.webmanifest', 'vendor/hanzi-writer.min.js'];
const files = [...core, ...audioFiles];
const h = crypto.createHash('sha1');
for (const f of files) h.update(fs.readFileSync(path.join(root, f)));
const version = h.digest('hex').slice(0, 10);
const swPath = path.join(root, 'sw.js');
const assets = ['./', ...core.map((f) => './' + f), './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png', ...audioFiles.map((f) => './' + f)];
let sw = fs.readFileSync(swPath, 'utf8');
sw = sw.replace(/const VERSION = '[^']*';/, `const VERSION = '${version}';`);
sw = sw.replace(/const ASSETS = \[[\s\S]*?\];/, 'const ASSETS = [\n' + assets.map((a) => `  '${a}'`).join(',\n') + '\n];');
fs.writeFileSync(swPath, sw);
console.log(`offline cache: ${assets.length} files (${audioFiles.length} audio clips)`);
console.log('service worker version:', version);
