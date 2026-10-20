/* Hanzi Fusion: mix two character parts to discover a new character (like Little Alchemy). Recipes come from fusion-data.js,
   which scripts/make-fusion.py builds AND checks against a public character-decomposition dataset. Save key: hanzi.fusion. Classes: fu-. */
(window.HANZI_MODS = window.HANZI_MODS || []).push(function (A) {
  'use strict';
  var D = window.FUSION; if (!D) return;
  var FX = A.FX, app = A.app, store = A.store, esc = A.esc;
  var S = store.get('fusion', null) || { found: {}, done: {} };
  function save() { store.set('fusion', S); }
  function isT() { return A.script() === 't'; }

  // one recipe in the script she is using now (null = this recipe is hidden in traditional)
  function active(r) {
    if (isT()) {
      if (r.t === false) return null;
      if (r.t) return { key: r.r, r: r.t[0], a: r.t[1], b: r.t[2], py: r.py, en: r.en };
    }
    return { key: r.r, r: r.r, a: r.a, b: r.b, py: r.py, en: r.en };
  }
  function recipesOf(room) { return room.recipes.map(active).filter(Boolean); }
  function foundCount(room) { return recipesOf(room).filter(function (r) { return S.found[r.key]; }).length; }
  function allResults() { var o = {}; D.rooms.forEach(function (rm) { rm.recipes.forEach(function (r) { o[r.r] = 1; }); }); return o; }

  A.registerGame({ id: 'fusion', name: 'Hanzi Fusion', icon: '🧪', tag: 'Mix parts to make new characters!', order: 35, earnText: 'earn ⭐ 4 per discovery + 35 per room' }, function (p) {
    if (p[0] === 'room') return renderRoom(p[1]);
    renderHub();
  });

  /* ---------------- room list ---------------- */
  function renderHub() {
    var total = 0, got = 0;
    var cards = D.rooms.map(function (rm, i) {
      var n = recipesOf(rm).length, f = foundCount(rm); total += n; got += f;
      return '<button class="fu-room' + (f >= n && n ? ' done' : '') + '" style="animation-delay:' + (i * 0.04) + 's" data-go="#/g/fusion/room/' + rm.id + '">' +
        '<span class="fu-ri">' + rm.icon + '</span><span class="fu-rn"><b>' + esc(rm.name) + '</b><small>' + esc(rm.tag) + '</small></span>' +
        '<span class="fu-rp">' + (f >= n && n ? '✅' : f + '/' + n) + '</span></button>';
    }).join('');
    app.innerHTML =
      '<div class="screen">' +
      '<div class="topbar"><button class="btn" data-go="#/games">‹ Games</button><span class="tools">' + A.scriptToggle() + '</span>' + A.walletPill() + '</div>' +
      '<div class="hero small"><div class="bigemoji">🧪</div><h1 class="gh">Hanzi Fusion</h1>' +
      '<p class="shophint">Characters are built from smaller parts! Mix two parts to make a new character. Find them all! <b>' + got + ' / ' + total + '</b></p></div>' +
      '<div class="fu-rooms">' + cards + '</div></div>';
    A.bindTop(renderHub);
  }

  /* ---------------- one room ---------------- */
  var R = null, fails = 0, locked = false;
  function buildRoom(room) {
    var recs = recipesOf(room), made = {};
    recs.forEach(function (r) { made[r.r] = 1; });
    var need = {};
    recs.forEach(function (r) {
      var c = {}; c[r.a] = (c[r.a] || 0) + 1; c[r.b] = (c[r.b] || 0) + 1;
      Object.keys(c).forEach(function (ch) { if (!made[ch]) need[ch] = Math.max(need[ch] || 0, c[ch]); });
    });
    var tiles = [];
    Object.keys(need).forEach(function (ch) { for (var k = 0; k < need[ch]; k++) tiles.push({ ch: ch, base: true }); });
    A.shuffle(tiles);
    // results she has already found that are also parts of other recipes come back as tiles
    recs.forEach(function (r) { if (S.found[r.key] && recs.some(function (x) { return x.a === r.r || x.b === r.r; })) tiles.push({ ch: r.r }); });
    tiles.forEach(function (t, i) { t.id = i; });
    return { room: room, recs: recs, tiles: tiles, slots: [null, null] };
  }
  function labelOf(ch) { return (D.parts[ch] || ''); }
  function recipeEn(ch, recs) { var r = recs.filter(function (x) { return x.r === ch; })[0]; return r ? r.en : labelOf(ch); }
  function tileHTML(t) {
    var inSlot = R.slots.indexOf(t.id) >= 0;
    var lab = t.base ? labelOf(t.ch) : recipeEn(t.ch, R.recs);
    return '<button class="fu-tile' + (inSlot ? ' used' : '') + (t.base ? '' : ' made') + '" data-t="' + t.id + '" aria-label="' + esc(t.ch) + '"><span class="fu-ch">' + esc(t.ch) + '</span><small>' + esc(lab) + '</small></button>';
  }
  function remaining() { return R.recs.filter(function (r) { return !S.found[r.key]; }); }
  function clueHTML() {
    var rem = remaining();
    if (!rem.length) return '<span class="fu-clue ok">🎉 You found them all!</span>';
    var show = rem.slice(0, 3).map(function (r) { return '<span class="fu-clue">? ' + esc(r.en) + '</span>'; }).join('');
    return '<span class="fu-find">Find:</span>' + show + (rem.length > 3 ? '<span class="fu-more">+' + (rem.length - 3) + ' more</span>' : '');
  }
  function slotHTML(i) {
    var id = R.slots[i], t = id == null ? null : R.tiles[id];
    return '<button class="fu-slot' + (t ? ' on' : '') + '" data-s="' + i + '" aria-label="' + (t ? 'Remove ' + esc(t.ch) : 'Empty') + '">' + (t ? '<span class="fu-ch">' + esc(t.ch) + '</span>' : '<span class="fu-q">?</span>') + '</button>';
  }
  function foundShelf() {
    var f = R.recs.filter(function (r) { return S.found[r.key]; });
    if (!f.length) return '<div class="fu-shelf empty">Your discoveries will show up here ✨</div>';
    return '<div class="fu-shelf">' + f.map(function (r) { return '<button class="fu-fc" data-f="' + esc(r.key) + '" aria-label="' + esc(r.r) + '"><span class="fu-ch">' + esc(r.r) + '</span><small>' + esc(r.en) + '</small></button>'; }).join('') + '</div>';
  }
  function renderRoom(id) {
    var room = D.rooms.filter(function (r) { return r.id === id; })[0];
    if (!room) return A.go('#/g/fusion');
    R = buildRoom(room); fails = 0; locked = false;
    draw();
  }
  function draw(keepHint) {
    app.innerHTML =
      '<div class="screen fu-screen">' +
      '<div class="topbar"><button class="btn" data-go="#/g/fusion">‹ Rooms</button><span class="title"><span class="fu-t">' + R.room.icon + ' ' + esc(R.room.name) + '</span></span><span class="tools">' + A.scriptToggle() + '</span></div>' +
      '<div class="fu-clues" id="fuclues">' + clueHTML() + '</div>' +
      '<div class="fu-mix" id="fumix">' + slotHTML(0) + '<span class="fu-op">+</span>' + slotHTML(1) + '<span class="fu-op">=</span><span class="fu-slot out" id="fuout"><span class="fu-q">?</span></span></div>' +
      '<div class="fu-tip" id="futip">Tap two parts to mix them.</div>' +
      '<div class="fu-tiles" id="futiles">' + R.tiles.map(tileHTML).join('') + '</div>' +
      '<div class="fu-bar"><button class="btn" id="fuhint">💡 Hint</button></div>' +
      '<div class="section-title">Found</div><div id="fushelf">' + foundShelf() + '</div></div>';
    A.bindTop(function () { renderRoom(R.room.id); });
    document.getElementById('futiles').onclick = function (e) { var b = e.target.closest('[data-t]'); if (b) pickTile(parseInt(b.getAttribute('data-t'), 10)); };
    document.getElementById('fumix').onclick = function (e) { var b = e.target.closest('[data-s]'); if (b && !locked) { R.slots[parseInt(b.getAttribute('data-s'), 10)] = null; refresh(); } };
    document.getElementById('fuhint').onclick = hint;
    document.getElementById('fushelf').onclick = function (e) { var b = e.target.closest('[data-f]'); if (b) A.say({ s: b.getAttribute('data-f') }, true); };
  }
  function refresh() {
    document.getElementById('futiles').innerHTML = R.tiles.map(tileHTML).join('');
    document.getElementById('fumix').innerHTML = slotHTML(0) + '<span class="fu-op">+</span>' + slotHTML(1) + '<span class="fu-op">=</span><span class="fu-slot out" id="fuout"><span class="fu-q">?</span></span>';
    document.getElementById('fushelf').innerHTML = foundShelf();
    document.getElementById('fuclues').innerHTML = clueHTML();
  }
  function tip(html) { var t = document.getElementById('futip'); if (t) t.innerHTML = html; }

  function pickTile(id) {
    if (locked) return;
    var at = R.slots.indexOf(id);
    if (at >= 0) { R.slots[at] = null; refresh(); return; }
    var free = R.slots.indexOf(null);
    if (free < 0) return;
    R.slots[free] = id; FX.tink(); refresh();
    if (R.slots[0] != null && R.slots[1] != null) { locked = true; setTimeout(combine, 350); }
  }
  function combine() {
    var a = R.tiles[R.slots[0]].ch, b = R.tiles[R.slots[1]].ch;
    var hit = R.recs.filter(function (r) { return (r.a === a && r.b === b) || (r.a === b && r.b === a); })[0];
    if (!hit) return fail();
    fails = 0;
    var first = !S.found[hit.key];
    S.found[hit.key] = 1;
    if (first) {
      A.earn(4);
      if (R.recs.some(function (x) { return x.a === hit.r || x.b === hit.r; })) R.tiles.push({ id: R.tiles.length, ch: hit.r });
    }
    save();
    var out = document.getElementById('fuout');
    if (out) { out.classList.add('pop'); out.innerHTML = '<span class="fu-ch">' + esc(hit.r) + '</span>'; }
    FX.word(); FX.confetti({ x: 0.5, y: 0.3, n: 60 });
    setTimeout(function () { reveal(hit, first); }, 650);
  }
  function fail() {
    fails++; FX.oops();
    var m = document.getElementById('fumix'); if (m) { m.classList.add('shake'); }
    tip('Hmm, those two do not fit together. Try a different pair! ' + (fails >= 3 ? '💡 Tap Hint for help.' : ''));
    if (fails >= 3) { var h = document.getElementById('fuhint'); if (h) h.classList.add('pulse'); }
    setTimeout(function () { R.slots = [null, null]; locked = false; refresh(); }, 700);
  }
  function hint() {
    var rem = remaining(); if (!rem.length) return;
    var r = rem[0];
    var el = app.querySelector('.fu-tile:not(.used)[aria-label="' + r.a + '"]') || app.querySelector('.fu-tile:not(.used)[aria-label="' + r.b + '"]');
    tip('Look for a character that means <b>' + esc(r.en) + '</b>. Start with the glowing part! 🔦');
    if (el) { el.classList.add('glow'); setTimeout(function () { el.classList.remove('glow'); }, 2600); }
    var h = document.getElementById('fuhint'); if (h) h.classList.remove('pulse');
  }
  function eq(r) {
    function one(ch) { return '<span class="fu-eqp"><b>' + esc(ch) + '</b><small>' + esc(labelOf(ch) || recipeEn(ch, R.recs)) + '</small></span>'; }
    return one(r.a) + '<span class="fu-op">+</span>' + one(r.b) + '<span class="fu-op">=</span><span class="fu-eqp res"><b>' + esc(r.r) + '</b><small>' + esc(r.en) + '</small></span>';
  }
  function reveal(r, first) {
    var el = document.createElement('div'); el.className = 'win';
    el.style.setProperty('--acc', A.cssVar('--accent'));
    el.innerHTML = '<div class="wincard fu-card"><div class="fu-new">' + (first ? '✨ New discovery! ✨' : 'You made it again!') + '</div>' +
      '<div class="fu-big">' + A.row(r.r) + '</div>' + '<div class="fu-py">' + A.pinyinHTML(r.py, null, 'sm') + '</div><div class="fu-en">' + esc(r.en) + '</div>' +
      '<div class="fu-eq">' + eq(r) + '</div>' +
      (first ? '<div class="win-line">+3 ⭐</div>' : '') +
      '<div class="win-btns"><button class="btn" id="fuhear">🔊 Hear it</button><button class="btn primary" id="fugo">Keep going!</button></div></div>';
    document.body.appendChild(el);
    var closed = false;
    document.getElementById('fuhear').onclick = function () { A.say({ s: r.key }, true); };
    document.getElementById('fugo').onclick = function () {
      if (closed) return; closed = true; el.remove(); R.slots = [null, null]; locked = false; draw();
      if (foundCount(R.room) >= recipesOf(R.room).length && !S.done[R.room.id]) { S.done[R.room.id] = 1; save(); roomDone(); }
    };
    A.say({ s: r.key }, false, true);
  }
  function roomDone() {
    A.earn(35);
    A.showWin({
      emoji: R.room.icon, title: 'Room complete!', accent: A.cssVar('--accent'), stars: 3,
      lines: ['You found every character in ' + R.room.name + '!', '+35 ⭐'],
      primary: { label: 'More rooms', fn: function () { A.go('#/g/fusion'); } },
      secondary: { label: 'Stay here', fn: function () { } }
    });
  }
});
