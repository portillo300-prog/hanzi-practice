/* Word Lab: discover words by putting characters together. */
(window.HANZI_MODS = window.HANZI_MODS || []).push(function (A) {
  'use strict';
  var FX = A.FX, $ = A.$, app = A.app, store = A.store, AUDIO = A.AUDIO, C = window.CONTENT;

  var found = store.get('found', {});           // { "学生": true }
  function saveFound() { store.set('found', found); }

  /* ---- every word she can find: the Word Lab list + the words from her lessons ---- */
  var ALL = [], seen = {};
  ((C.lab && C.lab.words) || []).forEach(function (w) { if (!seen[w.s]) { seen[w.s] = 1; ALL.push(Object.assign({}, w)); } });
  A.lessons.forEach(function (L) {
    L.words.forEach(function (w) { if (!seen[w.s]) { seen[w.s] = 1; ALL.push(Object.assign({ group: 'lesson', lessonId: L.id }, w)); } });
  });
  var BY = {}, PRE = {};
  ALL.forEach(function (w) {
    BY[w.s] = w;
    var ch = Array.from(w.s);
    for (var k = 1; k < ch.length; k++) PRE[ch.slice(0, k).join('')] = true;
  });

  /* ---- the character tiles: her own characters first, then helpers that appear in the words ---- */
  var TILE = {}, ORDER = [];
  function addTile(s, t) { if (!TILE[s]) { TILE[s] = t || s; ORDER.push(s); } }
  A.lessons.forEach(function (L) { L.characters.forEach(function (c) { addTile(c.s, c.t); }); });
  ALL.forEach(function (w) {
    var S = Array.from(w.s), T = Array.from(w.t || w.s);
    S.forEach(function (c, i) { addTile(c, T[i]); });
  });
  function shown(c) { return A.script() === 't' ? TILE[c] : c; }
  function tileHTML(c, extra) { return '<button class="wtile' + (extra || '') + '" data-c="' + c + '" aria-label="' + c + '">' + A.glyph(shown(c)) + '</button>'; }

  function foundCount() { return ALL.filter(function (w) { return found[w.s]; }).length; }
  function reward(w) { return 2 + (w.group === 'stretch' ? 1 : 0); }
  function practiceHref(w) {
    var L = w.lessonId ? A.lessons.filter(function (l) { return l.id === w.lessonId; })[0] : A.labLesson;
    if (!L) return '#/words';
    for (var i = 0; i < L.items.length; i++) if (L.items[i].s === w.s) return '#/w/' + L.id + '/' + i;
    return '#/words';
  }

  A.tabs.push({ id: 'words', icon: '🧩', label: 'Words', href: '#/words', order: 30 });
  A.routes.words = function (p) {
    if (p[0] === 'maker') return maker();
    if (p[0] === 'puzzles') return puzzleRound();
    if (p[0] === 'find') return puzzleOne(parseInt(p[1], 10));
    hub();
  };

  /* ---- the card shown when a word is found (or tapped in the collection) ---- */
  function showCard(w, isNew, after) {
    var canHear = !!AUDIO[w.s];
    var m = A.modal(
      (isNew ? '<div class="wc-new">New word found!</div>' : '') +
      '<div class="wc-word">' + A.row(A.textOf(w)) + '</div>' + A.pinyinHTML(w.py, null, 'md') +
      '<div class="mn wc-en">' + A.esc(w.en) + '</div>' +
      (w.how ? '<div class="mm">' + A.esc(w.how) + '</div>' : '') +
      (isNew ? '<div class="mp">+ ⭐ ' + reward(w) + '</div>' : '') +
      '<div class="mb">' + (canHear ? '<button class="btn" id="wc-hear">🔊 Hear it</button>' : '') +
      '<button class="btn" id="wc-write">✏️ Write it</button><button class="btn primary" id="wc-ok">' + (isNew ? 'Keep playing' : 'OK') + '</button></div>');
    if (canHear) $('wc-hear').onclick = function () { A.say(w, true); };
    $('wc-write').onclick = function () { m.close(); A.go(practiceHref(w)); };
    $('wc-ok').onclick = function () { m.close(); if (after) after(); };
    if (isNew && canHear) A.later(function () { A.say(w, false); }, 500);
  }

  function discover(w) {          // returns true if it was new
    if (found[w.s]) return false;
    found[w.s] = true; saveFound();
    A.earn(reward(w));
    return true;
  }

  /* ---------------- hub (the Words tab) ---------------- */
  function hub() {
    var n = foundCount(), total = ALL.length;
    var groups = [
      { id: 'starter', name: 'Starter words', hint: 'made only from characters in your book' },
      { id: 'stretch', name: 'Stretch words', hint: 'these bring new characters to learn' },
      { id: 'lesson', name: 'From your lessons', hint: 'the words you practice in Lessons' }
    ];
    function card(w) {
      var i = ALL.indexOf(w);
      if (found[w.s]) return '<button class="wcard found" data-i="' + i + '"><span class="wcw">' + A.row(A.textOf(w)) + '</span>' + A.pinyinHTML(w.py, null, 'sm') + '</button>';
      return '<button class="wcard locked" data-i="' + i + '"><span class="wcq">' + Array.from(w.s).map(function () { return '<i>?</i>'; }).join('') + '</span><span class="wcm">' + A.esc(w.en) + '</span></button>';
    }
    app.innerHTML =
      '<div class="screen has-tabs wl">' +
      '<div class="topbar"><span class="title gtitle">🧩 Word Lab</span>' + A.walletPill() + '</div>' +
      '<div class="wl-prog"><div class="wl-bar"><i style="width:' + Math.round(n / total * 100) + '%"></i></div><div class="wl-count">Found <b>' + n + '</b> of ' + total + ' words</div></div>' +
      '<div class="wl-modes"><button class="modecard" data-go="#/words/maker"><span class="mi">🧩</span><span class="mt"><b>Word Maker</b><small>Put characters together and see what you get!</small></span></button>' +
      '<button class="modecard" data-go="#/words/puzzles"><span class="mi">🎯</span><span class="mt"><b>Word Puzzles</b><small>8 quick words to build</small></span></button></div>' +
      groups.map(function (g) {
        var list = ALL.filter(function (w) { return (w.group || 'lesson') === g.id; });
        if (!list.length) return '';
        var fc = list.filter(function (w) { return found[w.s]; }).length;
        return '<div class="section-title">' + g.name + ' <small class="wl-sub">' + fc + '/' + list.length + '</small></div><div class="wl-hint">' + g.hint + '</div><div class="wgrid">' + list.map(card).join('') + '</div>';
      }).join('') + A.tabbar('words') + '</div>';
    Array.prototype.forEach.call(app.querySelectorAll('.wcard'), function (b) {
      b.onclick = function () {
        var w = ALL[parseInt(b.getAttribute('data-i'), 10)];
        if (found[w.s]) showCard(w, false); else A.go('#/words/find/' + b.getAttribute('data-i'));
      };
    });
  }

  /* ---------------- Word Maker (free play) ---------------- */
  function maker() {
    var seq = [], busy = false;
    var tiles = ORDER.map(function (c) { return tileHTML(c); }).join('');
    app.innerHTML =
      '<div class="screen has-tabs wl">' +
      '<div class="topbar"><button class="btn" data-go="#/words">‹ Words</button>' + A.walletPill() + '</div>' +
      '<h2 class="wl-h">Word Maker</h2><p class="shophint">Tap two or three characters. Can you make a real word?</p>' +
      '<div class="pzbox" id="bw"><div class="slots" id="slots"></div><div class="wl-msg" id="wlmsg">&nbsp;</div></div>' +
      '<div class="wl-actions"><button class="btn" id="clr">↺ Clear</button></div>' +
      '<div class="tilegrid" id="tiles">' + tiles + '</div>' + A.tabbar('words') + '</div>';
    function drawSlots() {
      $('slots').innerHTML = [0, 1, 2].map(function (i) { return '<button class="slotbox' + (seq[i] ? ' full' : '') + '" data-i="' + i + '">' + (seq[i] ? A.glyph(shown(seq[i])) : '') + '</button>'; }).join('');
      Array.prototype.forEach.call($('slots').querySelectorAll('.slotbox.full'), function (b) { b.onclick = function () { if (!busy) { seq.pop(); msg(''); drawSlots(); } }; });
    }
    function msg(t, cls) { var m = $('wlmsg'); if (m) { m.innerHTML = t || '&nbsp;'; m.className = 'wl-msg ' + (cls || ''); } }
    function reset() { seq = []; busy = false; drawSlots(); }
    drawSlots();
    $('clr').onclick = function () { if (!busy) { msg(''); reset(); } };
    Array.prototype.forEach.call($('tiles').querySelectorAll('.wtile'), function (b) {
      b.onclick = function () {
        if (busy || seq.length >= 3) return;
        seq.push(b.getAttribute('data-c')); FX.tink(); drawSlots();
        var key = seq.join(''), w = BY[key];
        if (w) {
          busy = true;
          var isNew = discover(w);
          FX.word(); FX.confetti({ x: 0.5, y: 0.3, n: isNew ? 80 : 40 });
          msg(isNew ? '🎉 You found <b>' + A.esc(w.s) + '</b>!' : '✨ You found <b>' + A.esc(w.s) + '</b> again!', 'good');
          A.later(function () { showCard(w, isNew, function () { msg(''); reset(); }); }, 700);
        } else if (PRE[key]) {
          msg('Keep going… there is more!', 'soft');
        } else if (seq.length >= 2) {
          busy = true; FX.oops();
          msg('Hmm, not a word yet. Try another!', 'try');
          var s = $('slots'); if (s) s.classList.add('wob');
          A.later(function () { if (s) s.classList.remove('wob'); msg(''); reset(); }, 1100);
        }
      };
    });
  }

  /* ---------------- Word Puzzles ---------------- */
  function puzzleOne(i) {
    var w = ALL[i];
    if (!w) return A.go('#/words');
    puzzleRun([w], 'find', '#/words');
  }
  function puzzleRound() {
    var unfound = A.shuffle(ALL.filter(function (w) { return !found[w.s]; })), rest = A.shuffle(ALL.filter(function (w) { return found[w.s]; }));
    var list = unfound.concat(rest).slice(0, 8);
    puzzleRun(list, 'round', '#/words');
  }

  function puzzleRun(list, mode, backHref) {
    var idx = 0, w, seq, locked, misses, helped, solved = 0, clean = 0, alive = true;
    A.onLeave(function () { alive = false; });
    function draw() {
      w = list[idx]; seq = []; locked = false; misses = 0; helped = false;
      var need = Array.from(w.s), n = need.length;
      var uniq = need.filter(function (c, i) { return need.indexOf(c) === i; });
      var extras = A.shuffle(ORDER.filter(function (c) { return uniq.indexOf(c) < 0; })).slice(0, (n > 2 ? 8 : 6) - uniq.length);
      var pool = A.shuffle(uniq.concat(extras));
      app.innerHTML =
        '<div class="screen has-tabs wl">' +
        '<div class="topbar"><button class="btn" data-go="' + backHref + '">‹ Words</button><span class="title">' + (mode === 'round' ? (idx + 1) + ' / ' + list.length : 'Word Puzzle') + '</span>' + A.walletPill() + '</div>' +
        '<div class="pz-clue"><div class="gq">Build the word for</div><div class="gmean">' + A.esc(w.en) + '</div>' +
        '<div class="pz-tools">' + (AUDIO[w.s] ? '<button class="btn" id="pz-hear">🔊 Listen</button>' : '') + '<button class="btn" id="pz-hint">💡 Hint</button></div><div class="pz-py" id="pzpy"></div></div>' +
        '<div class="pzbox" id="bw"><div class="slots" id="slots"></div><div class="wl-msg" id="wlmsg">&nbsp;</div></div>' +
        '<div class="tilegrid small" id="tiles">' + pool.map(function (c) { return tileHTML(c); }).join('') + '</div>' + A.tabbar('words') + '</div>';
      drawSlots(n);
      if ($('pz-hear')) $('pz-hear').onclick = function () { A.say(w, true); };
      $('pz-hint').onclick = function () { helped = true; $('pzpy').innerHTML = A.pinyinHTML(w.py, null, 'md'); };
      Array.prototype.forEach.call($('tiles').querySelectorAll('.wtile'), function (b) {
        b.onclick = function () {
          if (locked || seq.length >= n) return;
          seq.push(b.getAttribute('data-c')); FX.tink(); drawSlots(n);
          if (seq.length === n) check();
        };
      });
    }
    function drawSlots(n) {
      $('slots').innerHTML = Array.apply(null, Array(n)).map(function (_, i) { return '<button class="slotbox' + (seq[i] ? ' full' : '') + '">' + (seq[i] ? A.glyph(shown(seq[i])) : '') + '</button>'; }).join('');
      Array.prototype.forEach.call($('slots').querySelectorAll('.slotbox.full'), function (b) { b.onclick = function () { if (!locked) { seq.pop(); drawSlots(n); } }; });
    }
    function msg(t, cls) { var m = $('wlmsg'); if (m) { m.innerHTML = t || '&nbsp;'; m.className = 'wl-msg ' + (cls || ''); } }
    function check() {
      var key = seq.join(''), n = Array.from(w.s).length;
      if (key === w.s) {
        locked = true; solved++; if (!helped && misses === 0) clean++;
        var isNew = discover(w);
        FX.word(); FX.confetti({ x: 0.5, y: 0.35, n: 70 }); A.showPraise(FX.mini(), true);
        msg('🎉 ' + A.esc(w.s) + ' = ' + A.esc(w.en), 'good');
        A.later(function () {
          if (!alive) return;
          if (mode === 'find') return showCard(w, isNew, function () { A.go('#/words'); });
          idx++; if (idx >= list.length) finishRound(); else draw();
        }, mode === 'find' ? 700 : 1500);
      } else if (BY[key]) {                 // a different real word: that's a find too!
        locked = true;
        var o = BY[key], isNew2 = discover(o); FX.ding();
        msg('✨ That is a word too: <b>' + A.esc(o.s) + '</b> (' + A.esc(o.en) + ')' + (isNew2 ? ' +⭐ ' + reward(o) : '') + '. But we want “' + A.esc(w.en) + '”.', 'soft');
        A.later(function () { if (!alive) return; seq = []; locked = false; drawSlots(n); msg(''); }, 2400);
      } else {
        locked = true; misses++; FX.oops();
        msg('Not quite. Try again!', 'try');
        var s = $('slots'); if (s) s.classList.add('wob');
        A.later(function () { if (!alive) return; if (s) s.classList.remove('wob'); seq = []; locked = false; drawSlots(n); msg(''); }, 1000);
      }
    }
    function finishRound() {
      var stars = clean >= 7 ? 3 : clean >= 5 ? 2 : 1, bonus = 2 + stars * 2;
      A.earn(bonus);
      A.showWin({
        emoji: stars === 3 ? '🏆' : '🎉', title: 'Words built!', accent: '#c792ea', stars: stars,
        lines: ['You built ' + solved + ' words. You earned ⭐ ' + bonus + ' extra!'],
        primary: { label: 'Play again', fn: function () { A.go('#/words/puzzles'); } },
        secondary: { label: '🧩 Words', fn: function () { A.go('#/words'); } }
      });
    }
    draw();
  }
});
