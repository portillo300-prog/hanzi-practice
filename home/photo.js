/* Photo Match: read a short Chinese sentence, then tap the real photo it describes. 8 rounds, 4 photos each. Photos live in photos/ (real Pexels photos,
   free license) and are saved on the device, so the game works offline. Data: photos-data.js (made by scripts/make-photos.py). Classes: ph-. */
(window.HANZI_MODS = window.HANZI_MODS || []).push(function (A) {
  'use strict';
  var P = window.PHOTOS; if (!P || P.length < 8) return;
  var FX = A.FX, app = A.app, store = A.store, esc = A.esc, $ = A.$;
  var showPy = store.get('photopy', true);
  var ROUNDS = 8;

  A.registerGame({ id: 'photo', name: 'Photo Match', icon: '📸', tag: 'Read it, then tap the real photo!', order: 36 }, function (p) {
    if (p[0] === 'play') return play();
    intro();
  });

  function intro() {
    app.innerHTML =
      '<div class="screen">' +
      '<div class="topbar"><button class="btn" data-go="#/games">‹ Games</button><span class="tools">' + A.scriptToggle() + '</span>' + A.walletPill() + '</div>' +
      '<div class="hero small"><div class="bigemoji">📸</div><h1 class="gh">Photo Match</h1>' +
      '<p class="shophint">Read the sentence. Then tap the <b>real photo</b> that matches it! There are ' + P.length + ' photos to discover.</p></div>' +
      '<div class="chips"><button class="chip' + (showPy ? ' on' : '') + '" id="phpy">Show pinyin</button></div>' +
      '<div class="startrow"><button class="btn primary big" id="phstart">▶ Start</button></div></div>';
    A.bindTop(intro);
    $('phpy').onclick = function () { showPy = !showPy; store.set('photopy', showPy); $('phpy').classList.toggle('on', showPy); };
    $('phstart').onclick = function () { FX.pop(); A.go('#/g/photo/play'); };
  }

  var S = null;
  function pickOptions(t) {
    var others = A.shuffle(P.filter(function (x) { return x !== t && x.g !== t.g; }));
    var opts = [t];
    others.forEach(function (x) { if (opts.length < 4 && !opts.some(function (o) { return o.g === x.g && o.g !== 'animal'; })) opts.push(x); });   // different kinds of pictures, so only one can be right
    while (opts.length < 4) opts.push(others[opts.length]);
    return A.shuffle(opts);
  }
  function zh(it) { return A.script() === 't' ? it.zht : it.zh; }

  function play() {
    var order = A.shuffle(P.slice()).slice(0, ROUNDS);
    S = { order: order, i: 0, firsts: 0, miss: 0, locked: false };
    draw();
  }
  function draw() {
    var t = S.order[S.i]; S.miss = 0; S.locked = false;
    var opts = pickOptions(t);
    var dots = '<span class="qdots">' + S.order.map(function (x, k) { return '<i class="' + (k < S.i ? 'ok' : (k === S.i ? 'now' : '')) + '"></i>'; }).join('') + '</span>';
    var words = t.words && t.words.length ? '<div class="ph-words">' + t.words.map(function (w) { return '<span><b>' + esc(A.script() === 't' ? w.t : w.s) + '</b> ' + A.pinyinHTML(w.py, null, 'sm') + ' <i>' + esc(w.en) + '</i></span>'; }).join('') + '</div>' : '';
    app.innerHTML =
      '<div class="practice ph-game">' +
      '<div class="topbar"><button class="btn" id="phquit">✕ Quit</button><span class="title">' + dots + '</span>' + A.soundBtn() + '</div>' +
      '<div class="ph-card"><div class="ph-zh">' + esc(zh(t)) + '</div>' + (showPy ? '<div class="ph-py">' + esc(t.py) + '</div>' : '') + words + '<div class="ph-cap" id="phcap">Which photo matches?</div><div class="hint" id="hint"></div></div>' +
      '<div class="ph-grid" id="phgrid">' + opts.map(function (o) {
        return '<button class="ph-opt" data-ok="' + (o === t ? 1 : 0) + '"><img src="' + o.f + '" alt="' + esc(o.alt) + '" draggable="false"></button>';
      }).join('') + '</div></div>';
    A.bindTop(function () { draw(); });
    $('phquit').onclick = function () { S = null; A.go('#/g/photo'); };
    Array.prototype.forEach.call(app.querySelectorAll('.ph-opt'), function (b) { b.onclick = function () { answer(b, t); }; });
  }
  function answer(btn, t) {
    if (!S || S.locked || btn.disabled) return;
    if (btn.getAttribute('data-ok') === '1') {
      S.locked = true; btn.classList.add('right'); FX.ding(); A.showPraise(FX.mini(), true);
      var cap = $('phcap'); if (cap) { cap.textContent = t.en; cap.classList.add('on'); }
      Array.prototype.forEach.call(app.querySelectorAll('.ph-opt'), function (b) { if (b !== btn) b.classList.add('dim'); });
      if (S.miss === 0) S.firsts++;
      var me = S;
      A.later(function () {
        if (S !== me) return;
        S.i++;
        if (S.i >= S.order.length) end(); else draw();
      }, 1700);
    } else {
      S.miss++; btn.classList.add('nope'); btn.disabled = true; FX.oops();
      A.hint('Not quite. Read the sentence again, then try another photo!');
    }
  }
  function end() {
    var n = S.order.length, first = S.firsts, stars = A.starsFor ? A.starsFor(first, n) : (first >= 7 ? 3 : first >= 5 ? 2 : 1);
    S = null;
    A.earn(2 + stars * 2);
    A.showWin({
      emoji: stars === 3 ? '🏆' : '📸', title: 'Great reading!', accent: A.cssVar('--accent'), stars: stars,
      lines: ['You matched ' + first + ' of ' + n + ' photos on the first try.'],
      primary: { label: '▶ Play again', fn: function () { play(); } },
      secondary: { label: 'Back to games', fn: function () { A.go('#/games'); } }
    });
  }
});
