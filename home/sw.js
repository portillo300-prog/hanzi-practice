// Offline engine: saves the whole app on first open, then serves it from the device.
// When online, it quietly refreshes the saved copy so new words show up on the next open.
const VERSION = '503d18ea45';
const CACHE = 'hanzi-' + VERSION;
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './fx.js',
  './content.js',
  './strokes.js',
  './audio-manifest.js',
  './manifest.webmanifest',
  './vendor/hanzi-writer.min.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
  './audio/u4e0a_5348.m4a',
  './audio/u4e0b_5348.m4a',
  './audio/u4e2d_5348.m4a',
  './audio/u4e2d_6587.m4a',
  './audio/u4eca.m4a',
  './audio/u4eca_5929.m4a',
  './audio/u5199.m4a',
  './audio/u5348.m4a',
  './audio/u53cb.m4a',
  './audio/u542c.m4a',
  './audio/u544a.m4a',
  './audio/u544a_8bc9.m4a',
  './audio/u559c.m4a',
  './audio/u559c_6b22.m4a',
  './audio/u5728.m4a',
  './audio/u5728_5bb6.m4a',
  './audio/u5b57.m4a',
  './audio/u5fc3.m4a',
  './audio/u653e.m4a',
  './audio/u6559.m4a',
  './audio/u661f.m4a',
  './audio/u661f_671f_4e00.m4a',
  './audio/u670b.m4a',
  './audio/u670b_53cb.m4a',
  './audio/u671f.m4a',
  './audio/u6b4c.m4a',
  './audio/u6c49.m4a',
  './audio/u6c49_5b57.m4a',
  './audio/u6c49_8bed.m4a',
  './audio/u753b.m4a',
  './audio/u8bc9.m4a',
  './audio/u8bed.m4a',
  './audio/u8bfb.m4a',
  './audio/u8c01.m4a',
  './audio/u95ee.m4a'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('hanzi-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then((hit) => {
      const refresh = fetch(req)
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => hit);
      return hit || refresh;
    })
  );
});
