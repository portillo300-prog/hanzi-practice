(function () {
  'use strict';

  var C = window.CONTENT;
  var STROKES = window.STROKES || {};
  var app = document.getElementById('app');

  /* ---------- tiny storage layer (never breaks the app if storage is blocked) ---------- */
  var store = {
    get: function (k, d) {
      try { var v = localStorage.getItem('hanzi.' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; }
    },
    set: function (k, v) { try { localStorage.setItem('hanzi.' + k, JSON.stringify(v)); } catch (e) { /* ignore */ } }
  };
  var script = store.get('script', 's');   // 's' simplified | 't' traditional
  var mode = store.get('mode', 'write');   // 'write' | 'read'
  var done = store.get('done', {});        // { "l1:在": true }

  /* ---------- content ---------- */
  var lessons = C.lessons.map(function (L) {
    var items = L.characters.map(function (c) { return Object.assign({ kind: 'c' }, c); })
      .concat(L.words.map(function (w) { return Object.assign({ kind: 'w' }, w); }));
    return Object.assign({}, L, { items: items });
  });
  function keyOf(L, it) { return L.id + ':' + it.s; }
  function textOf(it) { return script === 't' ? (it.t || it.s) : it.s; }
  function titleOf(L) { return script === 't' ? L.title.t : L.title.s; }

  /* ---------- pinyin: tone numbers -> tone marks + tone color ---------- */
  var MARKS = { a: 'āáǎà', e: 'ēéěè', i: 'īíǐì', o: 'ōóǒò', u: 'ūúǔù', 'ü': 'ǖǘǚǜ' };
  function syllable(py) {
    var tone = parseInt(py.slice(-1), 10);
    var base = py.replace(/[1-5]$/, '').replace(/v/g, 'ü');
    if (!(tone >= 1 && tone <= 4)) return { text: base, tone: 5 };
    var i = base.indexOf('a');
    if (i < 0) i = base.indexOf('e');
    if (i < 0) i = base.indexOf('ou');            // "ou": the mark goes on the o
    if (i < 0) { for (var k = base.length - 1; k >= 0; k--) { if ('iouü'.indexOf(base[k]) >= 0) { i = k; break; } } }
    if (i >= 0) base = base.slice(0, i) + MARKS[base[i]][tone - 1] + base.slice(i + 1);
    return { text: base, tone: tone };
  }
  function pinyinHTML(py, alt, size) {
    function one(s) {
      return s.trim().split(/\s+/).map(function (x) {
        var r = syllable(x);
        return '<span class="syl t' + r.tone + '">' + r.text + '</span>';
      }).join('');
    }
    var h = one(py);
    if (alt) h += '<span class="sep">/</span>' + one(alt);
    return '<span class="pinyin ' + (size || '') + '">' + h + '</span>';
  }

  /* ---------- glyphs drawn from the stroke data (same look on every device) ---------- */
  function glyph(ch) {
    var d = STROKES[ch];
    if (!d) return '<span class="glyph" style="text-align:center;line-height:1">' + ch + '</span>';
    return '<svg class="glyph" viewBox="0 0 1024 1024" role="img" aria-label="' + ch + '"><g transform="translate(0,900) scale(1,-1)">' +
      d.strokes.map(function (p) { return '<path d="' + p + '"/>'; }).join('') + '</g></svg>';
  }
  function row(text) { return '<span class="wordrow">' + Array.from(text).map(glyph).join('') + '</span>'; }

  /* ---------- shared bits ---------- */
  function scriptToggle() {
    return '<div class="seg" role="group" aria-label="Script">' +
      '<button data-script="s" class="' + (script === 's' ? 'on' : '') + '" aria-label="Simplified">简</button>' +
      '<button data-script="t" class="' + (script === 't' ? 'on' : '') + '" aria-label="Traditional">繁</button></div>';
  }
  function bindScript(after) {
    Array.prototype.forEach.call(app.querySelectorAll('[data-script]'), function (b) {
      b.onclick = function () { script = b.getAttribute('data-script'); store.set('script', script); after(); };
    });
  }
  function go(h) { if (location.hash === h) route(); else location.hash = h; }
  function $(id) { return document.getElementById(id); }

  /* ---------- HOME ---------- */
  function renderHome() {
    var cards = lessons.map(function (L) {
      var n = L.items.filter(function (it) { return done[keyOf(L, it)]; }).length;
      return '<button class="lesson-card" data-go="#/l/' + L.id + '">' +
        '<span class="badge">Lesson ' + L.number + '</span>' +
        '<span class="zh">' + row(titleOf(L)) + '</span>' +
        pinyinHTML(L.py, null, 'sm') +
        '<span class="en">' + L.en + '</span>' +
        '<span class="stats"><span>' + L.characters.length + ' characters · ' + L.words.length + ' words</span>' +
        '<span class="stars">★ ' + n + ' / ' + L.items.length + '</span></span></button>';
    }).join('');
    app.innerHTML =
      '<div class="screen">' +
      '<div class="topbar"><span class="spacer"></span>' + scriptToggle() + '</div>' +
      '<div class="hero"><div class="logo">' + row(script === 't' ? C.appTitle.t : C.appTitle.s) + '</div><div class="sub">Hanzi Practice</div></div>' +
      '<div class="lessons">' + cards + '</div>' +
      '<div class="legend"><span><i class="dot1"></i>1st tone</span><span><i class="dot2"></i>2nd</span><span><i class="dot3"></i>3rd</span><span><i class="dot4"></i>4th</span><span><i class="dot5"></i>neutral</span></div>' +
      '</div>';
    bindScript(renderHome);
  }

  /* ---------- LESSON ---------- */
  function renderLesson(L) {
    function tile(it, idx) {
      var isDone = done[keyOf(L, it)];
      return '<button class="tile' + (isDone ? ' done' : '') + '" data-go="#/' + (mode === 'write' ? 'w' : 'r') + '/' + L.id + '/' + idx + '" aria-label="' + it.s + '">' +
        row(textOf(it)) + (isDone && mode === 'write' ? '<span class="star">★</span>' : '') + '</button>';
    }
    var nc = L.characters.length;
    app.innerHTML =
      '<div class="screen">' +
      '<div class="topbar"><button class="btn" data-go="#/">‹ Home</button><span class="spacer"></span>' + scriptToggle() + '</div>' +
      '<div class="lesson-head"><div class="zh">' + row(titleOf(L)) + '</div>' + pinyinHTML(L.py, null, 'sm') + '<div class="en">Lesson ' + L.number + ' · ' + L.en + '</div></div>' +
      '<div class="modebar"><div class="seg" role="group" aria-label="Mode">' +
      '<button data-mode="write" class="' + (mode === 'write' ? 'on' : '') + '">✏️ Write</button>' +
      '<button data-mode="read" class="' + (mode === 'read' ? 'on' : '') + '">👀 Read</button></div></div>' +
      '<div class="section-title">Characters</div><div class="grid chars">' + L.characters.map(function (c, i) { return tile(c, i); }).join('') + '</div>' +
      '<div class="section-title">Words</div><div class="grid words">' + L.words.map(function (w, i) { return tile(w, nc + i); }).join('') + '</div>' +
      '</div>';
    bindScript(function () { renderLesson(L); });
    Array.prototype.forEach.call(app.querySelectorAll('[data-mode]'), function (b) {
      b.onclick = function () { mode = b.getAttribute('data-mode'); store.set('mode', mode); renderLesson(L); };
    });
  }

  /* ---------- PRACTICE (write) ---------- */
  var W = null;            // current practice state
  var advanceTimer = null;
  var resizeTimer = null;

  function stopWriter() {
    clearTimeout(advanceTimer);
    clearTimeout(resizeTimer);
    window.removeEventListener('resize', onResize);
    if (W && W.writer) { try { W.writer.cancelQuiz(); } catch (e) { /* ignore */ } }
    W = null;
  }

  function hint(msg) { var h = $('hint'); if (h) h.textContent = msg || ''; }

  function renderPractice(L, idx) {
    var it = L.items[idx];
    var chars = Array.from(textOf(it));
    var slots = chars.length > 1
      ? '<div class="wordslots">' + chars.map(function (c, i) { return '<button class="slot" data-ci="' + i + '" aria-label="Character ' + (i + 1) + '">' + glyph(c) + '</button>'; }).join('') + '</div>'
      : '';
    app.innerHTML =
      '<div class="practice">' +
      '<div class="topbar"><button class="btn" data-go="#/l/' + L.id + '">‹ Back</button><span class="title">' + (idx + 1) + ' / ' + L.items.length + '</span>' + scriptToggle() + '</div>' +
      '<div class="info">' + slots + pinyinHTML(it.py, it.alt) + '<div class="meaning">' + it.en + '</div><div class="hint" id="hint"></div></div>' +
      '<div class="boardwrap" id="bw"><div class="board" id="board"></div></div>' +
      '<div class="controls">' +
      '<button class="btn" id="prev"' + (idx === 0 ? ' disabled' : '') + '><span class="ico">‹</span>Previous</button>' +
      '<button class="btn" id="show"><span class="ico">👁</span>Show me</button>' +
      '<button class="btn" id="again"><span class="ico">↺</span>Try again</button>' +
      '<button class="btn primary" id="next"><span class="ico">›</span>Next</button>' +
      '</div></div>';

    W = { L: L, idx: idx, it: it, chars: chars, ci: 0, doneSet: {}, writer: null, size: 0 };
    bindScript(function () { renderPractice(L, idx); });
    $('prev').onclick = function () { go('#/w/' + L.id + '/' + (idx - 1)); };
    $('next').onclick = function () { go(idx + 1 < L.items.length ? '#/w/' + L.id + '/' + (idx + 1) : '#/l/' + L.id); };
    $('again').onclick = function () { clearTimeout(advanceTimer); hint(''); startChar(); };
    $('show').onclick = showMe;
    Array.prototype.forEach.call(app.querySelectorAll('[data-ci]'), function (b) {
      b.onclick = function () { clearTimeout(advanceTimer); W.ci = parseInt(b.getAttribute('data-ci'), 10); hint(''); startChar(); };
    });
    window.addEventListener('resize', onResize);
    startChar();
  }

  function boardSize() {
    var bw = $('bw');
    return Math.max(200, Math.floor(Math.min(bw.clientWidth, bw.clientHeight)) - 8);
  }

  function updateSlots() {
    Array.prototype.forEach.call(app.querySelectorAll('.slot'), function (s, i) {
      s.classList.toggle('current', i === W.ci);
      s.classList.toggle('done', !!W.doneSet[i]);
    });
  }

  function startChar() {
    if (!W) return;
    if (typeof HanziWriter === 'undefined') { hint('The writing tool did not load. Please reopen the app.'); return; }
    var box = $('board');
    box.innerHTML = '';
    box.classList.remove('celebrate');
    var size = boardSize();
    W.size = size;
    box.style.width = size + 'px';
    box.style.height = size + 'px';
    updateSlots();
    W.writer = HanziWriter.create(box, W.chars[W.ci], {
      width: size - 4,
      height: size - 4,
      padding: Math.round(size * 0.07),
      showOutline: true,
      showCharacter: false,
      strokeColor: '#f1f4f9',
      outlineColor: '#3b4456',
      highlightColor: '#4fd1c5',
      drawingColor: '#ffffff',
      drawingWidth: Math.max(10, Math.round(size * 0.035)),
      strokeAnimationSpeed: 1,
      delayBetweenStrokes: 250,
      charDataLoader: function (c, ok, fail) { if (STROKES[c]) ok(STROKES[c]); else fail(); }
    });
    quiz();
  }

  function quiz() {
    var wr = W.writer;
    wr.quiz({
      leniency: 1.5,
      showHintAfterMisses: 2,
      markStrokeCorrectAfterMisses: 4,
      highlightOnComplete: true,
      onMistake: function () { hint('Almost! Try that stroke again.'); },
      onCorrectStroke: function () { hint(''); },
      onComplete: function () { if (W && W.writer === wr) onCharComplete(); }
    });
  }

  function showMe() {
    if (!W || !W.writer) return;
    clearTimeout(advanceTimer);
    var wr = W.writer;
    wr.cancelQuiz();
    hint('Watch the strokes…');
    wr.animateCharacter({
      onComplete: function () { if (W && W.writer === wr) { hint('Now you try!'); quiz(); } }
    });
  }

  function pop(symbol) {
    var box = $('board');
    if (!box) return;
    box.classList.add('celebrate');
    var p = document.createElement('div');
    p.className = 'pop';
    p.textContent = symbol;
    box.appendChild(p);
    setTimeout(function () { if (p.parentNode) p.parentNode.removeChild(p); }, 1200);
  }

  function onCharComplete() {
    W.doneSet[W.ci] = true;
    updateSlots();
    var total = W.chars.length;
    var count = Object.keys(W.doneSet).length;
    if (count >= total) {
      pop('⭐');
      done[keyOf(W.L, W.it)] = true;
      store.set('done', done);
      hint('Great job!');
      $('next').classList.add('pulse');
    } else {
      pop('✓');
      hint('');
      advanceTimer = setTimeout(function () {
        if (!W) return;
        var nxt = W.ci;
        for (var k = 1; k <= total; k++) { var c = (W.ci + k) % total; if (!W.doneSet[c]) { nxt = c; break; } }
        W.ci = nxt;
        startChar();
      }, 1100);
    }
  }

  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (!W || !$('bw')) return;
      if (Math.abs(boardSize() - W.size) > 8) startChar();
    }, 250);
  }

  /* ---------- READ (flashcards) ---------- */
  function renderRead(L, idx) {
    var it = L.items[idx];
    var t = textOf(it);
    var shown = false;
    app.innerHTML =
      '<div class="read">' +
      '<div class="topbar"><button class="btn" data-go="#/l/' + L.id + '">‹ Back</button><span class="title">' + (idx + 1) + ' / ' + L.items.length + '</span>' + scriptToggle() + '</div>' +
      '<button class="card" id="card" style="--n:' + Array.from(t).length + '" aria-label="Tap to show pinyin and meaning">' + row(t) + '</button>' +
      '<div class="reveal" id="rev"></div>' +
      '<div class="controls">' +
      '<button class="btn" id="prev"' + (idx === 0 ? ' disabled' : '') + '>‹ Previous</button>' +
      '<button class="btn primary" id="flip"></button>' +
      '<button class="btn" id="next">Next ›</button></div></div>';
    function paint() {
      $('rev').innerHTML = shown
        ? pinyinHTML(it.py, it.alt) + '<div class="meaning">' + it.en + '</div>'
        : '<div class="placeholder">Say it out loud, then tap to check</div>';
      $('flip').textContent = shown ? 'Hide answer' : '👀 Show answer';
    }
    function flip() { shown = !shown; paint(); }
    $('card').onclick = flip;
    $('flip').onclick = flip;
    $('prev').onclick = function () { go('#/r/' + L.id + '/' + (idx - 1)); };
    $('next').onclick = function () { go(idx + 1 < L.items.length ? '#/r/' + L.id + '/' + (idx + 1) : '#/l/' + L.id); };
    bindScript(function () { renderRead(L, idx); });
    paint();
  }

  /* ---------- router ---------- */
  function route() {
    stopWriter();
    var p = location.hash.replace(/^#\/?/, '').split('/');
    var L = lessons.filter(function (l) { return l.id === p[1]; })[0];
    var i = parseInt(p[2], 10);
    if (p[0] === 'l' && L) return renderLesson(L);
    if (p[0] === 'w' && L && L.items[i]) return renderPractice(L, i);
    if (p[0] === 'r' && L && L.items[i]) return renderRead(L, i);
    renderHome();
  }
  window.addEventListener('hashchange', route);
  app.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target.closest('[data-go]') : null;
    if (t) go(t.getAttribute('data-go'));
  });

  /* ---------- iPad polish: no pinch-zoom, no long-press menus ---------- */
  ['gesturestart', 'gesturechange', 'gestureend'].forEach(function (ev) {
    document.addEventListener(ev, function (e) { e.preventDefault(); });
  });
  document.addEventListener('contextmenu', function (e) { e.preventDefault(); });

  /* ---------- offline support ---------- */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () { /* ignore */ }); });
  }

  route();
})();
