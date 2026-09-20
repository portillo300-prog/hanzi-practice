/* Effects: sounds (synthesized — no files), confetti, sparkles, and the shuffled cheer pools. */
(function () {
  'use strict';
  var FX = (window.FX = {});
  var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  FX.reduced = function () { return !!(mq && mq.matches); };

  var soundOn = true;
  FX.setSound = function (v) { soundOn = !!v; };
  FX.soundOn = function () { return soundOn; };

  /* ---------- audio engine (Web Audio; also plays the recorded voice clips) ---------- */
  var ctx = null, master = null;
  function ac() {
    if (!ctx) {
      var A = window.AudioContext || window.webkitAudioContext;
      if (!A) return null;
      try { ctx = new A(); } catch (e) { return null; }
      master = ctx.createGain();
      master.gain.value = 0.85;
      master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') { try { ctx.resume(); } catch (e) { /* ignore */ } }
    return ctx;
  }
  FX.unlock = ac;
  // iPad/iPhone only allow sound after a tap: wake the audio engine on the first touches
  ['pointerdown', 'touchend', 'click'].forEach(function (ev) {
    document.addEventListener(ev, function () { ac(); unlockPlayer(); }, { passive: true });
  });

  function bell(f, t, dur, vol) {
    var c = ctx, g = c.createGain(), g2 = c.createGain(), o1 = c.createOscillator(), o2 = c.createOscillator();
    o1.type = 'sine'; o1.frequency.value = f;
    o2.type = 'sine'; o2.frequency.value = f * 2.01;   // a little shimmer on top
    g2.gain.value = 0.22;
    o1.connect(g); o2.connect(g2); g2.connect(g); g.connect(master);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o1.start(t); o2.start(t); o1.stop(t + dur + 0.05); o2.stop(t + dur + 0.05);
  }
  function notes(list, step, dur, vol) {
    if (!soundOn) return;
    var c = ac(); if (!c) return;
    var t = c.currentTime + 0.02;
    list.forEach(function (f, i) { bell(f, t + i * step, dur, vol); });
  }
  var N = { C5: 523.25, E5: 659.25, G5: 783.99, A5: 880, B5: 987.77, C6: 1046.5, D6: 1174.7, E6: 1318.5, G6: 1568, C7: 2093 };

  FX.tink = function () { notes([N.E6], 0, 0.16, 0.035); };                              // each correct stroke (very soft)
  FX.pop = function () { notes([N.G5, N.C6], 0.06, 0.25, 0.14); };                         // small win / button on
  FX.ding = function () { notes([N.C6, N.E6, N.G6], 0.08, 0.5, 0.2); };                    // character done
  FX.word = function () { notes([N.C5, N.E5, N.G5, N.C6, N.E6], 0.08, 0.6, 0.2); };       // word done
  FX.oops = function () { notes([392, 349.2], 0.11, 0.32, 0.08); };                        // quiz: gentle "not quite"
  FX.fanfare = function () {                                                              // lesson / quiz complete
    if (!soundOn) return;
    var c = ac(); if (!c) return;
    var t = c.currentTime + 0.02;
    [[N.C5, 0], [N.C5, 0.13], [N.C5, 0.26], [N.G5, 0.4]].forEach(function (n) { bell(n[0], t + n[1], 0.3, 0.22); });
    [N.C5, N.E5, N.G5, N.C6].forEach(function (f) { bell(f, t + 0.7, 1.5, 0.15); });
    [N.E6, N.G6, N.C7, N.G6, N.C7].forEach(function (f, i) { bell(f, t + 1.0 + i * 0.09, 0.5, 0.09); });
  };

  /* recorded voice clips.
     Played through a normal audio player (an iPhone's silent switch does not mute it, and one tap "unlocks" it),
     with Web Audio as the backup. FX.info says what happened, for the Sound check screen. */
  var player = null, playerReady = false, silentURL = null;
  function silentWav() {
    if (silentURL) return silentURL;
    var n = 400, buf = new ArrayBuffer(44 + n), v = new DataView(buf);
    function w(o, str) { for (var i = 0; i < str.length; i++) v.setUint8(o + i, str.charCodeAt(i)); }
    w(0, 'RIFF'); v.setUint32(4, 36 + n, true); w(8, 'WAVE'); w(12, 'fmt '); v.setUint32(16, 16, true);
    v.setUint16(20, 1, true); v.setUint16(22, 1, true); v.setUint32(24, 8000, true); v.setUint32(28, 8000, true);
    v.setUint16(32, 1, true); v.setUint16(34, 8, true); w(36, 'data'); v.setUint32(40, n, true);
    for (var i = 0; i < n; i++) v.setUint8(44 + i, 128);
    silentURL = URL.createObjectURL(new Blob([buf], { type: 'audio/wav' }));
    return silentURL;
  }
  function unlockPlayer() {
    if (playerReady) return;
    try {
      if (!player) { player = new Audio(); player.preload = 'auto'; player.setAttribute('playsinline', ''); }
      player.src = silentWav();
      var p = player.play();
      if (p && p.then) p.then(function () { playerReady = true; }, function () { /* not allowed yet; try again on the next tap */ });
      else playerReady = true;
    } catch (e) { /* ignore */ }
  }
  var blobUrls = {}, buffers = {};
  FX.info = '';
  function blobFor(url) {
    if (blobUrls[url]) return Promise.resolve(blobUrls[url]);
    return fetch(url)
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.arrayBuffer(); })
      .then(function (ab) { blobUrls[url] = URL.createObjectURL(new Blob([ab], { type: 'audio/mp4' })); return blobUrls[url]; });
  }
  function viaPlayer(url) {
    return blobFor(url).then(function (bu) {
      unlockPlayer();
      player.src = bu;
      var p = player.play();
      return (p && p.then ? p : Promise.resolve()).then(function () { FX.info = 'played through the audio player'; return true; });
    });
  }
  function viaWebAudio(url) {
    var c = ac();
    if (!c) return Promise.reject(new Error('no Web Audio'));
    function go(buf) {
      var src = c.createBufferSource(), g = c.createGain();
      src.buffer = buf; g.gain.value = 1; src.connect(g); g.connect(master); src.start();
      FX.info = 'played through Web Audio';
      return true;
    }
    if (buffers[url]) return Promise.resolve(go(buffers[url]));
    return fetch(url)
      .then(function (r) { return r.arrayBuffer(); })
      .then(function (ab) { return new Promise(function (res, rej) { c.decodeAudioData(ab, res, rej); }); })
      .then(function (b) { buffers[url] = b; return go(b); });
  }
  FX.clip = function (url, force) {
    if (!soundOn && !force) return Promise.resolve(false);
    ac(); unlockPlayer();
    return viaPlayer(url).catch(function (e1) {
      return viaWebAudio(url).catch(function (e2) {
        FX.info = 'could not play (' + ((e1 && e1.name) || e1) + ' / ' + ((e2 && e2.name) || e2) + ')';
        return false;
      });
    });
  };

  /* Sound check: tries each step and reports what works on THIS device */
  FX.diagnose = function (url) {
    var lines = [];
    function add(ok, txt) { lines.push({ ok: ok, txt: txt }); }
    var c = ac();
    add(!!c && c.state === 'running', 'Sound engine: ' + (c ? c.state : 'not available'));
    var can = '';
    try { can = document.createElement('audio').canPlayType('audio/mp4; codecs="mp4a.40.2"'); } catch (e) { /* ignore */ }
    add(!!can, 'This device can play the voice files: ' + (can || 'no'));
    return fetch(url)
      .then(function (r) { add(r.ok, 'Voice file found: HTTP ' + r.status); return r.arrayBuffer(); })
      .then(function (ab) { add(ab.byteLength > 1000, 'Voice file size: ' + ab.byteLength + ' bytes'); })
      .then(function () { return viaPlayer(url).then(function () { add(true, 'Voice started in the audio player (you should hear it)'); }, function (e) { add(false, 'Audio player was blocked: ' + ((e && e.name) || e)); }); })
      .then(function () {
        var c2 = ac();
        if (!c2) { add(false, 'Web Audio is not available'); return; }
        return fetch(url).then(function (r) { return r.arrayBuffer(); })
          .then(function (ab) { return new Promise(function (res, rej) { c2.decodeAudioData(ab, res, rej); }); })
          .then(function (b) { add(true, 'Voice decodes fine: ' + b.duration.toFixed(2) + ' seconds'); }, function (e) { add(false, 'Voice could not be decoded: ' + ((e && e.message) || e)); });
      })
      .then(function () { var was = soundOn; soundOn = true; FX.ding(); soundOn = was; add(true, 'Chime sent (you should hear a little ding)'); return lines; })
      .catch(function (e) { add(false, 'Problem: ' + ((e && e.message) || e)); return lines; });
  };

  /* ---------- confetti ---------- */
  var PALETTES = {
    normal: ['#4fd1c5', '#ffd166', '#ff6b6b', '#5aa9ff', '#62d98b', '#c792ea', '#ffb347', '#ffffff'],
    elena: ['#ff6fa8', '#ffb38a', '#ffd166', '#ff8fb8', '#c9a7ff', '#7fd8b0', '#ff9a76', '#ffc2d9']
  };
  var COLORS = PALETTES.normal;
  FX.setTheme = function (t) { COLORS = PALETTES[t] || PALETTES.normal; };
  FX.confetti = function (o) {
    o = o || {};
    if (FX.reduced()) return;
    var cv = document.createElement('canvas');
    cv.className = 'confetti';
    document.body.appendChild(cv);
    var dpr = window.devicePixelRatio || 1, W = window.innerWidth, H = window.innerHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    var g = cv.getContext('2d'); g.scale(dpr, dpr);
    var sc = Math.min(W, H) / 700, ps = [];
    function add(n, x, y, angle, spread, speed) {
      for (var i = 0; i < n; i++) {
        var a = angle + (Math.random() - 0.5) * spread, v = speed * sc * (0.45 + Math.random() * 0.75);
        ps.push({ x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, w: 7 + Math.random() * 8, h: 5 + Math.random() * 6,
          r: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.45, c: COLORS[i % COLORS.length], round: Math.random() < 0.28, t: 0 });
      }
    }
    if (o.kind === 'big') {
      add(80, 0, H * 0.98, -Math.PI / 3.1, 0.8, 24);
      add(80, W, H * 0.98, -Math.PI + Math.PI / 3.1, 0.8, 24);
      add(70, W / 2, H * 0.55, -Math.PI / 2, 1.6, 20);
      for (var k = 0; k < 70; k++) add(1, Math.random() * W, -20 - Math.random() * H * 0.5, Math.PI / 2, 0.6, 3);
    } else {
      add(o.n || 50, (o.x == null ? 0.5 : o.x) * W, (o.y == null ? 0.45 : o.y) * H, -Math.PI / 2, Math.PI * 1.15, 14);
    }
    var t0 = performance.now();
    (function frame(now) {
      g.clearRect(0, 0, W, H);
      var alive = 0;
      for (var i = 0; i < ps.length; i++) {
        var p = ps[i]; p.t++;
        p.vy += 0.36 * sc; p.vx *= 0.992; p.vy *= 0.992;
        p.x += p.vx; p.y += p.vy; p.r += p.vr;
        if (p.y > H + 30 || p.t > 260) continue;
        alive++;
        g.save(); g.translate(p.x, p.y); g.rotate(p.r);
        g.globalAlpha = p.t > 200 ? Math.max(0, 1 - (p.t - 200) / 60) : 1;
        g.fillStyle = p.c;
        if (p.round) { g.beginPath(); g.arc(0, 0, p.h * 0.6, 0, 6.29); g.fill(); } else g.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.r * 1.7)) + 1);
        g.restore();
      }
      if (alive && now - t0 < 5000) requestAnimationFrame(frame);
      else if (cv.parentNode) cv.parentNode.removeChild(cv);
    })(t0);
  };

  /* little sparkles where a stroke was just drawn */
  FX.sparkles = function (box, x, y) {
    if (FX.reduced() || !box) return;
    for (var i = 0; i < 7; i++) {
      var s = document.createElement('i');
      s.className = 'spark';
      var a = Math.random() * 6.28, d = 28 + Math.random() * 34;
      s.style.left = x + 'px'; s.style.top = y + 'px';
      s.style.setProperty('--dx', Math.cos(a) * d + 'px');
      s.style.setProperty('--dy', Math.sin(a) * d + 'px');
      s.style.background = COLORS[i % COLORS.length];
      box.appendChild(s);
      (function (el) { setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 700); })(s);
    }
  };

  /* ---------- cheer pools: a shuffled deck, so nothing repeats until everything has been seen ---------- */
  function bag(list) {
    var pool = [], last = null;
    return function () {
      if (!pool.length) {
        pool = list.slice();
        for (var i = pool.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = pool[i]; pool[i] = pool[j]; pool[j] = t; }
        if (pool.length > 1 && pool[pool.length - 1] === last) { var s = pool.pop(); pool.unshift(s); }
      }
      last = pool.pop();
      return last;
    };
  }
  FX.praise = bag([
    { zh: '你真棒!', py: 'ni3 zhen1 bang4', en: "You're awesome!", emoji: '👍', anim: 'thumb' },
    { zh: '太棒了!', py: 'tai4 bang4 le5', en: 'Fantastic!', emoji: '🌟', anim: 'spin' },
    { zh: '真厉害!', py: 'zhen1 li4 hai5', en: 'So impressive!', emoji: '👏', anim: 'clap' },
    { zh: '好极了!', py: 'hao3 ji2 le5', en: 'Excellent!', emoji: '🎉', anim: 'pop' },
    { en: 'Well done!', emoji: '⭐', anim: 'spin' },
    { en: 'Great job!', emoji: '👍', anim: 'thumb' },
    { en: "You're becoming a pro!", emoji: '🚀', anim: 'rocket' },
    { en: 'Look at you go!', emoji: '✨', anim: 'pop' },
    { en: 'Awesome writing!', emoji: '✏️', anim: 'wiggle' },
    { en: 'You did it!', emoji: '🎊', anim: 'pop' }
  ]);
  FX.mini = bag([
    { en: 'Nice!', emoji: '✓' }, { en: 'Yes!', emoji: '✓' }, { en: 'Good one!', emoji: '✓' },
    { en: 'Way to go!', emoji: '✓' }, { en: 'Keep it up!', emoji: '✓' }
  ]);
  FX.nudge = bag([
    { en: 'Almost! Try that stroke again.' },
    { en: 'So close! You can do it.' },
    { zh: '加油!', py: 'jia1 you2', en: 'Keep going!' },
    { en: 'Nice try! Follow the glowing stroke.' },
    { en: "You've got this!" }
  ]);
  FX.cheerWin = bag([
    { zh: '太棒了!', py: 'tai4 bang4 le5', en: 'Fantastic!' },
    { zh: '你真棒!', py: 'ni3 zhen1 bang4', en: "You're awesome!" },
    { zh: '真厉害!', py: 'zhen1 li4 hai5', en: 'So impressive!' }
  ]);
})();
