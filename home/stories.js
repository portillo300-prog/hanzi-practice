/* Stories: short readings from her textbook, then 4 English multiple-choice questions to check she understood.
   Each story has 3 sets of questions; the app hands them out in rotation (A, B, C, A, ...).
   Data lives in content.js (CONTENT.stories). Correct answer is always o[0] in the data; here the options are shuffled. */
(window.HANZI_MODS = window.HANZI_MODS || []).push(function (A) {
  'use strict';
  var FX = A.FX, $ = A.$, app = A.app, C = window.CONTENT, store = A.store;
  var stories = C.stories || [];
  var showPy = store.get('storypy', true);
  var nextSet = store.get('storynext', {});     // { s1: 0|1|2 }
  var sdone = store.get('storydone', {});       // { s1: { best: 3, sets: { 0: 3 } } }
  var SN = ['A', 'B', 'C'];

  function byId(id) { return stories.filter(function (s) { return s.id === id; })[0]; }
  function lessonOf(S) { return A.lessons.filter(function (l) { return l.id === S.lesson; })[0] || A.lessons[0]; }
  function isT() { return A.script() === 't'; }
  function title(S) { return isT() ? S.title.t : S.title.s; }

  // simplified -> traditional map built from the story lines, so Chinese snippets inside questions follow the script toggle
  var T = {};
  stories.forEach(function (S) {
    S.lines.concat([S.title]).forEach(function (ln) {
      var a = Array.from(ln.s), b = Array.from(ln.t);
      if (a.length === b.length) a.forEach(function (c, i) { T[c] = b[i]; });
    });
  });
  function cn(text) { return isT() ? Array.from(text).map(function (c) { return T[c] || c; }).join('') : text; }

  A.routes.s = function (p) {
    var S = byId(p[0]);
    if (!S) return A.go('#/');
    if (p[1] === 'q') return quiz(S);
    read(S);
  };

  function read(S) {
    var L = lessonOf(S);
    var lines = S.lines.map(function (ln) {
      return '<div class="stline"><div class="stzh">' + A.esc(isT() ? ln.t : ln.s) + '</div>' + (showPy ? '<div class="stpy">' + A.esc(ln.py) + '</div>' : '') + '</div>';
    }).join('');
    app.innerHTML =
      '<div class="screen story" style="--acc:' + A.acc(L) + '">' +
      '<div class="topbar"><button class="btn" data-go="#/l/' + L.id + '">‹ Back</button><span class="title">' + S.icon + ' Story</span><span class="tools">' + A.soundBtn() + A.scriptToggle() + '</span></div>' +
      '<div class="storycard"><h2 class="sttitle">' + A.esc(title(S)) + '</h2>' + (showPy ? '<div class="stpy sttp">' + A.esc(S.title.py) + '</div>' : '') + lines + '</div>' +
      '<div class="controls two"><button class="btn" id="stpy">' + (showPy ? 'Hide pinyin' : 'Show pinyin') + '</button>' +
      '<button class="btn primary" id="stq">📝 Questions</button></div></div>';
    A.bindTop(function () { read(S); });
    $('stpy').onclick = function () { showPy = !showPy; store.set('storypy', showPy); read(S); };
    $('stq').onclick = function () { A.go('#/s/' + S.id + '/q'); };
  }

  var Q = null;
  function quiz(S) {
    var n = nextSet[S.id] || 0;
    var set = S.sets[n % S.sets.length];
    Q = { S: S, n: n, set: set, i: 0, firsts: 0, miss: 0, locked: false, peek: false };
    draw();
  }

  function draw() {
    var S = Q.S, L = lessonOf(S), q = Q.set[Q.i];
    Q.miss = 0; Q.locked = false;
    var opts = A.shuffle(q.o.map(function (t, idx) { return { t: t, ok: idx === 0 }; }));
    var dots = '<span class="qdots">' + Q.set.map(function (x, k) { return '<i class="' + (k < Q.i ? 'ok' : (k === Q.i ? 'now' : '')) + '"></i>'; }).join('') + '</span>';
    var peekHTML = Q.peek ? '<div class="storycard small">' + S.lines.map(function (ln) { return '<div class="stzh">' + A.esc(isT() ? ln.t : ln.s) + '</div>'; }).join('') + '</div>' : '';
    app.innerHTML =
      '<div class="practice quiz story-q" style="--acc:' + A.acc(L) + '">' +
      '<div class="topbar"><button class="btn" id="sqquit">✕ Quit</button><span class="title">' + dots + '</span>' + A.soundBtn() + '</div>' +
      '<div class="info"><div class="qlabel">' + S.icon + ' ' + A.esc(title(S)) + ' · Questions ' + SN[Q.n % 3] + '</div>' +
      '<div class="sqtext">' + A.esc(cn(q.q)) + '</div><div class="hint" id="hint"></div></div>' +
      '<div class="boardwrap sq" id="bw"><div class="choices one">' + opts.map(function (o) {
        return '<button class="choice enc" data-ok="' + (o.ok ? 1 : 0) + '">' + A.esc(cn(o.t)) + '</button>';
      }).join('') + '</div>' + peekHTML + '</div>' +
      '<div class="controls one"><button class="btn" id="sqpeek">📖 ' + (Q.peek ? 'Hide story' : 'Look at the story') + '</button></div></div>';
    A.bindTop(function () { draw(); });
    $('sqquit').onclick = function () { Q = null; A.go('#/s/' + S.id); };
    $('sqpeek').onclick = function () { Q.peek = !Q.peek; draw(); };
    Array.prototype.forEach.call(app.querySelectorAll('.choice'), function (b) { b.onclick = function () { answer(b); }; });
  }

  function answer(btn) {
    if (!Q || Q.locked || btn.disabled) return;
    if (btn.getAttribute('data-ok') === '1') {
      Q.locked = true;
      btn.classList.add('right');
      FX.ding();
      A.showPraise(FX.mini(), true);
      if (Q.miss === 0) Q.firsts++;
      var me = Q;
      A.later(function () {
        if (Q !== me) return;
        Q.i++;
        if (Q.i >= Q.set.length) end(); else draw();
      }, 1300);
    } else {
      Q.miss++;
      btn.classList.add('nope'); btn.disabled = true;
      FX.oops();
      A.hint('Not quite. Look at the story again, then try another one!');
    }
  }

  function end() {
    var S = Q.S, L = lessonOf(S), first = Q.firsts, total = Q.set.length, n = Q.n;
    var stars = first >= total ? 3 : first >= total - 1 ? 2 : 1;
    var d = sdone[S.id] = sdone[S.id] || { best: 0, sets: {} };
    var isNew = !d.best;
    if (stars > d.best) d.best = stars;
    if (!d.sets[n] || stars > d.sets[n]) d.sets[n] = stars;
    store.set('storydone', sdone);
    nextSet[S.id] = (n + 1) % 3; store.set('storynext', nextSet);
    A.earn(2 + stars * 2 + (isNew ? 3 : 0));
    Q = null;
    A.showWin({
      emoji: stars === 3 ? '🏆' : '🎉', title: 'Great reading!', accent: A.acc(L), stars: stars,
      lines: ['You got ' + first + ' of ' + total + ' on the first try. Questions ' + SN[n % 3] + ' done. Next time: Questions ' + SN[(n + 1) % 3] + '!'],
      primary: { label: 'Questions ' + SN[(n + 1) % 3], fn: function () { A.go('#/s/' + S.id + '/q'); } },
      secondary: { label: 'Back to lesson', fn: function () { A.go('#/l/' + L.id); } }
    });
  }
});
