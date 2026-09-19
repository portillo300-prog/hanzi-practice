(function () {
  'use strict';

  var C = window.CONTENT;
  var STROKES = window.STROKES || {};
  var AUDIO = window.AUDIO || {};
  var FX = window.FX;
  var app = document.getElementById('app');

  /* ---------- tiny storage layer (never breaks the app if storage is blocked) ---------- */
  var store = {
    get: function (k, d) {
      try { var v = localStorage.getItem('hanzi.' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; }
    },
    set: function (k, v) { try { localStorage.setItem('hanzi.' + k, JSON.stringify(v)); } catch (e) { /* ignore */ } }
  };
  var script = store.get('script', 's');     // 's' simplified | 't' traditional
  var mode = store.get('mode', 'write');     // 'write' | 'read'
  var done = store.get('done', {});          // { "l1:在": true }
  var badges = store.get('badges', {});      // { l1: { writer: true, quiz: 3 } }
  var soundOn = store.get('sound', true);
  FX.setSound(soundOn);

  /* ---------- content ---------- */
  var lessons = C.lessons.map(function (L) {
    var items = L.characters.map(function (c) { return Object.assign({ kind: 'c' }, c); })
      .concat(L.words.map(function (w) { return Object.assign({ kind: 'w' }, w); }));
    return Object.assign({ accent: '#4fd1c5', sticker: '⭐' }, L, { items: items });
  });
  function keyOf(L, it) { return L.id + ':' + it.s; }
  function textOf(it) { return script === 't' ? (it.t || it.s) : it.s; }
  function titleOf(L) { return script === 't' ? L.title.t : L.title.s; }
  function lessonById(id) { return lessons.filter(function (l) { return l.id === id; })[0]; }
  function doneCount(L) { return L.items.filter(function (it) { return done[keyOf(L, it)]; }).length; }
  function badge(L) { return badges[L.id] || (badges[L.id] = {}); }

  /* ---------- small helpers ---------- */
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function $(id) { return document.getElementById(id); }
  function go(h) { if (location.hash === h) route(); else location.hash = h; }
  function later(fn, ms) { return setTimeout(fn, ms); }

  /* ---------- pinyin: tone numbers -> tone marks + tone color ---------- */
  var MARKS = { a: 'āáǎà', e: 'ēéěè', i: 'īíǐì', o: 'ōóǒò', u: 'ūúǔù', 'ü': 'ǖǘǚǜ' };
  function syllable(py) {
    var tone = parseInt(py.slice(-1), 10);
    var base = py.replace(/[1-5]$/, '').replace(/v/g, 'ü');
    if (!(tone >= 1 && tone <= 4)) return { text: base, tone: 5 };
    var i = base.indexOf('a');
    if (i < 0) i = base.indexOf('e');
    if (i < 0) i = base.indexOf('ou');
    if (i < 0) { for (var k = base.length - 1; k >= 0; k--) { if ('iouü'.indexOf(base[k]) >= 0) { i = k; break; } } }
    if (i >= 0) base = base.slice(0, i) + MARKS[base[i]][tone - 1] + base.slice(i + 1);
    return { text: base, tone: tone };
  }
  function pinyinHTML(py, alt, size, plain) {
    function one(s) {
      return s.trim().split(/\s+/).map(function (x) {
        var r = syllable(x);
        return '<span class="syl ' + (plain ? '' : 't' + r.tone) + '">' + r.text + '</span>';
      }).join('');
    }
    var h = one(py);
    if (alt) h += '<span class="sep">/</span>' + one(alt);
    return '<span class="pinyin ' + (size || '') + '">' + h + '</span>';
  }
  function pinyinText(py) { return py.trim().split(/\s+/).map(function (x) { return syllable(x).text; }).join(' '); }

  /* ---------- glyphs drawn from the stroke data (same look on every device) ---------- */
  function glyph(ch) {
    var d = STROKES[ch];
    if (!d) return '<span class="glyph" style="text-align:center;line-height:1">' + ch + '</span>';
    return '<svg class="glyph" viewBox="0 0 1024 1024" role="img" aria-label="' + ch + '"><g transform="translate(0,900) scale(1,-1)">' +
      d.strokes.map(function (p) { return '<path d="' + p + '"/>'; }).join('') + '</g></svg>';
  }
  function row(text) { return '<span class="wordrow">' + Array.from(text).map(glyph).join('') + '</span>'; }

  /* ---------- shared UI bits ---------- */
  function scriptToggle() {
    return '<div class="seg" role="group" aria-label="Script">' +
      '<button data-script="s" class="' + (script === 's' ? 'on' : '') + '" aria-label="Simplified">简</button>' +
      '<button data-script="t" class="' + (script === 't' ? 'on' : '') + '" aria-label="Traditional">繁</button></div>';
  }
  function soundBtn() { return '<button class="iconbtn" id="snd" aria-label="Sound on or off">' + (soundOn ? '🔊' : '🔇') + '</button>'; }
  function bindTop(after) {
    Array.prototype.forEach.call(app.querySelectorAll('[data-script]'), function (b) {
      b.onclick = function () { script = b.getAttribute('data-script'); store.set('script', script); after(); };
    });
    var s = $('snd');
    if (s) s.onclick = function () {
      soundOn = !soundOn; store.set('sound', soundOn); FX.setSound(soundOn);
      s.textContent = soundOn ? '🔊' : '🔇';
      if (soundOn) FX.pop();
    };
  }
  function hint(html) { var h = $('hint'); if (h) h.innerHTML = html || ''; }
  function praiseHTML(p, small) {
    if (small) return '<div class="pe">' + p.emoji + '</div><div class="pn">' + p.en + '</div>';
    return '<div class="pe">' + p.emoji + '</div>' +
      (p.zh ? '<div class="pz">' + p.zh + '</div>' + pinyinHTML(p.py, null, 'sm') + '<div class="pn">' + p.en + '</div>'
            : '<div class="pn big">' + p.en + '</div>');
  }
  function showPraise(p, small) {
    var host = $('bw'); if (!host) return;
    var old = host.querySelector('.praise'); if (old) old.parentNode.removeChild(old);
    var d = document.createElement('div');
    d.className = 'praise' + (small ? ' small' : '') + (p.anim ? ' a-' + p.anim : '');
    d.innerHTML = praiseHTML(p, small);
    host.appendChild(d);
    later(function () { if (d.parentNode) d.parentNode.removeChild(d); }, small ? 1050 : 1800);
  }
  function nudgeHTML() {
    var p = FX.nudge();
    return p.zh ? '<b>' + p.zh + '</b> ' + pinyinText(p.py) + ' — ' + p.en : p.en;
  }

  /* ---------- audio clips (recorded by native speakers) ---------- */
  function clipFor(it) { return AUDIO[it.s] ? AUDIO[it.s].f : null; }
  function say(it, force) { var f = clipFor(it); if (f) return FX.clip(f, force); return Promise.resolve(false); }
  function speakBtn(it) {
    return clipFor(it) ? '<button class="speak" id="speak" aria-label="Hear it">🔊</button>' : '';
  }
  function bindSpeak(it) { var b = $('speak'); if (b) b.onclick = function () { say(it, true); }; }

  /* ---------- celebration overlay ("Well done!" page) ---------- */
  function showWin(o) {
    var old = document.querySelector('.win'); if (old) old.parentNode.removeChild(old);
    var cheer = FX.cheerWin();
    var el = document.createElement('div');
    el.className = 'win';
    el.style.setProperty('--acc', o.accent || '#4fd1c5');
    el.innerHTML =
      '<div class="wincard">' +
      '<div class="win-emoji">' + (o.emoji || '🎉') + '</div>' +
      '<div class="win-title">' + o.title + '</div>' +
      '<div class="win-zh">' + cheer.zh + ' ' + pinyinHTML(cheer.py, null, 'sm') + '</div>' +
      (o.stars ? '<div class="win-stars">' + [1, 2, 3].map(function (n) { return '<span class="' + (n <= o.stars ? 'on' : '') + '" style="animation-delay:' + (0.5 + n * 0.25) + 's">⭐</span>'; }).join('') + '</div>' : '') +
      (o.lines || []).map(function (l) { return '<div class="win-line">' + l + '</div>'; }).join('') +
      (o.sticker ? '<div class="win-sticker"><span class="st">' + o.sticker.emoji + '</span><small>' + o.sticker.label + '</small></div>' : '') +
      '<div class="win-btns"><button class="btn primary" id="win-a">' + o.primary.label + '</button>' +
      (o.secondary ? '<button class="btn" id="win-b">' + o.secondary.label + '</button>' : '') + '</div></div>';
    document.body.appendChild(el);
    function close(fn) { return function () { if (el.parentNode) el.parentNode.removeChild(el); if (fn) fn(); }; }
    $('win-a').onclick = close(o.primary.fn);
    if (o.secondary) $('win-b').onclick = close(o.secondary.fn);
    FX.fanfare();
    FX.confetti({ kind: 'big' });
    later(function () { FX.confetti({ x: 0.5, y: 0.35, n: 70 }); }, 900);
  }

  function checkWriterBadge(L) {
    var b = badge(L);
    if (b.writer || doneCount(L) < L.items.length) return;
    b.writer = true; store.set('badges', badges);
    later(function () {
      showWin({
        emoji: '🎉', title: 'Lesson complete!', accent: L.accent,
        lines: ['You wrote every character and word in Lesson ' + L.number + '!'],
        sticker: { emoji: L.sticker, label: 'New sticker: Star Writer ✍️' },
        primary: { label: 'Keep going', fn: function () { go('#/l/' + L.id); } },
        secondary: { label: '🏠 Home', fn: function () { go('#/'); } }
      });
    }, 2100);
  }

  /* ---------- HOME ---------- */
  function ringHTML(frac, color, emoji) {
    var c = 2 * Math.PI * 44;
    return '<span class="ring" style="--acc:' + color + '"><svg viewBox="0 0 100 100"><circle class="track" cx="50" cy="50" r="44"/>' +
      '<circle class="bar" cx="50" cy="50" r="44" stroke-dasharray="' + (c * frac).toFixed(1) + ' ' + c.toFixed(1) + '"/></svg>' +
      '<span class="emo' + (frac >= 1 ? ' full' : '') + '">' + emoji + '</span></span>';
  }
  function renderHome() {
    var cards = lessons.map(function (L, idx) {
      var n = doneCount(L), b = badges[L.id] || {};
      return '<button class="lesson-card" style="--acc:' + L.accent + ';animation-delay:' + (idx * 0.08) + 's" data-go="#/l/' + L.id + '">' +
        ringHTML(n / L.items.length, L.accent, L.sticker) +
        '<span class="lc-body">' +
        '<span class="badge">Lesson ' + L.number + '</span>' +
        '<span class="zh">' + row(titleOf(L)) + '</span>' +
        pinyinHTML(L.py, null, 'sm') +
        '<span class="en">' + L.en + '</span>' +
        '<span class="stats"><span>' + L.characters.length + ' characters · ' + L.words.length + ' words</span>' +
        '<span class="stars">★ ' + n + '/' + L.items.length + '</span></span>' +
        '<span class="bdgs"><span class="bdg' + (b.writer ? ' on' : '') + '">✍️ Writer</span><span class="bdg' + (b.quiz ? ' on' : '') + '">🏆 Quiz</span></span>' +
        '</span></button>';
    }).join('');
    app.innerHTML =
      '<div class="screen">' +
      '<div class="topbar"><span class="spacer"></span>' + soundBtn() + scriptToggle() + '</div>' +
      '<div class="hero"><div class="logo">' + row(script === 't' ? C.appTitle.t : C.appTitle.s) + '</div><div class="sub">Hanzi Practice</div></div>' +
      '<div class="lessons">' + cards + '</div>' +
      '<div class="legend"><span><i class="dot1"></i>1st tone</span><span><i class="dot2"></i>2nd</span><span><i class="dot3"></i>3rd</span><span><i class="dot4"></i>4th</span><span><i class="dot5"></i>neutral</span></div>' +
      '<button class="about-link" data-go="#/about">About &amp; credits</button>' +
      '</div>';
    bindTop(renderHome);
  }

  /* ---------- LESSON ---------- */
  function renderLesson(L) {
    var b = badge(L);
    function tile(it, idx) {
      var isDone = done[keyOf(L, it)];
      return '<button class="tile' + (isDone ? ' done' : '') + '" data-go="#/' + (mode === 'write' ? 'w' : 'r') + '/' + L.id + '/' + idx + '" aria-label="' + it.s + '">' +
        row(textOf(it)) + (isDone && mode === 'write' ? '<span class="star">★</span>' : '') + '</button>';
    }
    var nc = L.characters.length;
    var stars = b.quiz ? '⭐'.repeat(b.quiz) : '';
    app.innerHTML =
      '<div class="screen" style="--acc:' + L.accent + '">' +
      '<div class="topbar"><button class="btn" data-go="#/">‹ Home</button><span class="spacer"></span>' + soundBtn() + scriptToggle() + '</div>' +
      '<div class="lesson-head"><div class="zh">' + row(titleOf(L)) + '</div>' + pinyinHTML(L.py, null, 'sm') + '<div class="en">Lesson ' + L.number + ' · ' + L.en + '</div></div>' +
      '<div class="modebar"><div class="seg" role="group" aria-label="Mode">' +
      '<button data-mode="write" class="' + (mode === 'write' ? 'on' : '') + '">✏️ Write</button>' +
      '<button data-mode="read" class="' + (mode === 'read' ? 'on' : '') + '">👀 Read</button></div></div>' +
      '<button class="quiz-btn" data-go="#/q/' + L.id + '"><span class="qi">🎯</span><span class="qt"><b>Mini Quiz</b><small>' + (b.quiz ? 'Best: ' + stars : '8 quick questions — you can do it!') + '</small></span><span class="qa">›</span></button>' +
      '<div class="section-title">Characters</div><div class="grid chars">' + L.characters.map(function (c, i) { return tile(c, i); }).join('') + '</div>' +
      '<div class="section-title">Words</div><div class="grid words">' + L.words.map(function (w, i) { return tile(w, nc + i); }).join('') + '</div>' +
      '</div>';
    bindTop(function () { renderLesson(L); });
    Array.prototype.forEach.call(app.querySelectorAll('[data-mode]'), function (bt) {
      bt.onclick = function () { mode = bt.getAttribute('data-mode'); store.set('mode', mode); renderLesson(L); };
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
    if (Q && Q.writer) { try { Q.writer.cancelQuiz(); } catch (e) { /* ignore */ } }
    W = null; Q = null;
    var w = document.querySelector('.win'); if (w) w.parentNode.removeChild(w);
  }

  function renderPractice(L, idx) {
    var it = L.items[idx];
    var chars = Array.from(textOf(it));
    var slots = chars.length > 1
      ? '<div class="wordslots">' + chars.map(function (c, i) { return '<button class="slot" data-ci="' + i + '" aria-label="Character ' + (i + 1) + '">' + glyph(c) + '</button>'; }).join('') + '</div>'
      : '';
    app.innerHTML =
      '<div class="practice" style="--acc:' + L.accent + '">' +
      '<div class="topbar"><button class="btn" data-go="#/l/' + L.id + '">‹ Back</button><span class="title">' + (idx + 1) + ' / ' + L.items.length + '</span>' + soundBtn() + scriptToggle() + '</div>' +
      '<div class="info">' + slots + '<div class="pyrow">' + pinyinHTML(it.py, it.alt) + speakBtn(it) + '</div><div class="meaning">' + it.en + '</div><div class="hint" id="hint"></div></div>' +
      '<div class="boardwrap" id="bw"><div class="board" id="board"></div></div>' +
      '<div class="controls">' +
      '<button class="btn" id="prev"' + (idx === 0 ? ' disabled' : '') + '><span class="ico">‹</span>Previous</button>' +
      '<button class="btn" id="show"><span class="ico">👁</span>Show me</button>' +
      '<button class="btn" id="again"><span class="ico">↺</span>Try again</button>' +
      '<button class="btn primary" id="next"><span class="ico">›</span>Next</button>' +
      '</div></div>';

    W = { L: L, idx: idx, it: it, chars: chars, ci: 0, doneSet: {}, writer: null, size: 0 };
    bindTop(function () { renderPractice(L, idx); });
    bindSpeak(it);
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

  function makeWriter(box, ch, size, outline) {
    return HanziWriter.create(box, ch, {
      width: size - 4,
      height: size - 4,
      padding: Math.round(size * 0.07),
      showOutline: outline,
      showCharacter: false,
      strokeColor: '#f1f4f9',
      outlineColor: '#3b4456',
      highlightColor: '#4fd1c5',
      highlightCompleteColor: '#ffd166',
      drawingColor: '#ffffff',
      drawingWidth: Math.max(10, Math.round(size * 0.035)),
      strokeAnimationSpeed: 1,
      delayBetweenStrokes: 250,
      charDataLoader: function (c, ok, fail) { if (STROKES[c]) ok(STROKES[c]); else fail(); }
    });
  }
  function sparkleAt(box, strokeData) {
    try {
      var pts = strokeData.drawnPath.points, p = pts[pts.length - 1];
      FX.sparkles(box, p.x, p.y);
    } catch (e) { /* ignore */ }
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
    W.writer = makeWriter(box, W.chars[W.ci], size, true);
    quiz();
  }

  function quiz() {
    var wr = W.writer, box = $('board');
    wr.quiz({
      leniency: 1.5,
      showHintAfterMisses: 2,
      markStrokeCorrectAfterMisses: 4,
      highlightOnComplete: true,
      onMistake: function () { hint(nudgeHTML()); },
      onCorrectStroke: function (d) { hint(''); FX.tink(); sparkleAt(box, d); },
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

  function celebrateBoard() { var b = $('board'); if (b) b.classList.add('celebrate'); }

  function onCharComplete() {
    W.doneSet[W.ci] = true;
    updateSlots();
    celebrateBoard();
    var total = W.chars.length;
    var count = Object.keys(W.doneSet).length;
    if (count >= total) {
      showPraise(FX.praise(), false);
      if (total > 1) FX.word(); else FX.ding();
      FX.confetti({ x: 0.5, y: 0.42, n: total > 1 ? 95 : 60 });
      done[keyOf(W.L, W.it)] = true;
      store.set('done', done);
      hint('');
      $('next').classList.add('pulse');
      var it = W.it, L = W.L;
      later(function () { if (W && W.it === it) say(it, false); }, 1000);
      checkWriterBadge(L);
    } else {
      showPraise(FX.mini(), true);
      FX.pop();
      hint('');
      advanceTimer = later(function () {
        if (!W) return;
        var nxt = W.ci;
        for (var k = 1; k <= total; k++) { var c = (W.ci + k) % total; if (!W.doneSet[c]) { nxt = c; break; } }
        W.ci = nxt;
        startChar();
      }, 1250);
    }
  }

  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (!$('bw')) return;
      if (W && Math.abs(boardSize() - W.size) > 8) startChar();
      else if (Q && Q.writer && Math.abs(boardSize() - Q.size) > 8) startWriteQ();
    }, 250);
  }

  /* ---------- READ (flashcards) ---------- */
  function renderRead(L, idx) {
    var it = L.items[idx];
    var t = textOf(it);
    var shown = false;
    app.innerHTML =
      '<div class="read" style="--acc:' + L.accent + '">' +
      '<div class="topbar"><button class="btn" data-go="#/l/' + L.id + '">‹ Back</button><span class="title">' + (idx + 1) + ' / ' + L.items.length + '</span>' + soundBtn() + scriptToggle() + '</div>' +
      '<button class="card" id="card" style="--n:' + Array.from(t).length + '" aria-label="Tap to show pinyin and meaning">' + row(t) + '</button>' +
      '<div class="reveal" id="rev"></div>' +
      '<div class="controls">' +
      '<button class="btn" id="prev"' + (idx === 0 ? ' disabled' : '') + '>‹ Previous</button>' +
      '<button class="btn primary" id="flip"></button>' +
      '<button class="btn" id="next">Next ›</button></div></div>';
    function paint() {
      $('rev').innerHTML = shown
        ? '<div class="pyrow">' + pinyinHTML(it.py, it.alt) + speakBtn(it) + '</div><div class="meaning">' + it.en + '</div>'
        : '<div class="placeholder">Say it out loud, then tap to check</div>';
      $('flip').textContent = shown ? 'Hide answer' : '👀 Show answer';
      if (shown) { bindSpeak(it); FX.pop(); }
    }
    function flip() { shown = !shown; paint(); }
    $('card').onclick = flip;
    $('flip').onclick = flip;
    $('prev').onclick = function () { go('#/r/' + L.id + '/' + (idx - 1)); };
    $('next').onclick = function () { go(idx + 1 < L.items.length ? '#/r/' + L.id + '/' + (idx + 1) : '#/l/' + L.id); };
    bindTop(function () { renderRead(L, idx); });
    paint();
  }

  /* ---------- MINI QUIZ ---------- */
  var Q = null;
  function buildQuiz(L) {
    var chars = shuffle(L.characters.slice()), words = shuffle(L.words.slice());
    var ci = 0, wi = 0;
    function nextChar() { return chars[ci++ % chars.length]; }
    function nextWord() { return words.length ? words[wi++ % words.length] : nextChar(); }
    var wq = nextWord();
    var pattern = [
      { t: 'py', it: nextChar() }, { t: 'py', it: nextChar() }, { t: 'write', it: nextChar() },
      { t: 'pick', it: nextChar() }, { t: 'py', it: nextChar() }, { t: 'write', it: nextChar() },
      { t: clipFor(wq) ? 'listen' : 'pick', it: wq }, { t: 'write', it: nextChar() }
    ];
    return pattern;
  }
  function uniqueBy(list, fn) { var seen = {}; return list.filter(function (x) { var k = fn(x); if (seen[k]) return false; seen[k] = 1; return true; }); }

  function renderQuiz(L) {
    Q = { L: L, qs: buildQuiz(L), i: 0, res: [], writer: null, size: 0, miss: 0, assist: false, locked: false };
    drawQuestion();
  }
  function dotsHTML() {
    return '<span class="qdots">' + Q.qs.map(function (q, i) {
      var c = i < Q.i ? (Q.res[i] === 'first' ? 'ok' : 'help') : (i === Q.i ? 'now' : '');
      return '<i class="' + c + '"></i>';
    }).join('') + '</span>';
  }
  function drawQuestion() {
    var q = Q.qs[Q.i], L = Q.L, it = q.it;
    Q.miss = 0; Q.assist = false; Q.locked = false;
    var label, info, body = '', ctrl = '';
    if (q.t === 'py') {
      label = 'Which pinyin matches?';
      info = '<div class="qbig">' + row(textOf(it)) + '</div><div class="meaning">' + it.en + '</div>';
      var base = it.py.replace(/[1-5]$/, '');
      var wrong = shuffle([1, 2, 3, 4].map(function (t) { return base + t; }).filter(function (x) { return x !== it.py; })).slice(0, 2);
      var others = shuffle(L.characters.filter(function (c) { return c.py !== it.py && c.py.replace(/[1-5]$/, '') !== base; })).slice(0, 1);
      var opts = [{ py: it.py, alt: it.alt, ok: true }].concat(wrong.map(function (p) { return { py: p }; })).concat(others.map(function (c) { return { py: c.py }; }));
      opts = shuffle(uniqueBy(opts, function (o) { return pinyinText(o.py); }));
      body = '<div class="choices">' + opts.map(function (o, i) {
        return '<button class="choice pyc" data-ok="' + (o.ok ? 1 : 0) + '">' + pinyinHTML(o.py, o.ok ? o.alt : null, '', true) + '</button>';
      }).join('') + '</div>';
    } else if (q.t === 'pick' || q.t === 'listen') {
      var pool = it.kind === 'w' ? L.words : L.characters;
      var picks = shuffle(pool.filter(function (x) { return x.s !== it.s; })).slice(0, 3);
      var options = shuffle([it].concat(picks));
      if (q.t === 'listen') {
        label = 'Listen, then tap the right one';
        info = '<button class="speak big" id="qspeak" aria-label="Play the sound">🔊</button>';
      } else {
        label = 'Which character is this?';
        info = '<div class="pyrow">' + pinyinHTML(it.py, it.alt) + '</div><div class="meaning">' + it.en + '</div>';
      }
      body = '<div class="choices">' + options.map(function (o) {
        return '<button class="choice glc" data-ok="' + (o.s === it.s ? 1 : 0) + '">' + row(textOf(o)) + '</button>';
      }).join('') + '</div>';
    } else {
      label = 'Write it from memory!';
      info = '<div class="pyrow">' + pinyinHTML(it.py, it.alt) + '</div><div class="meaning">' + it.en + '</div><div class="hint" id="hint"></div>';
      body = '<div class="board" id="board"></div>';
      ctrl = '<div class="controls two"><button class="btn" id="peek"><span class="ico">💡</span>Peek</button><button class="btn" id="qagain"><span class="ico">↺</span>Try again</button></div>';
    }
    app.innerHTML =
      '<div class="practice quiz" style="--acc:' + L.accent + '">' +
      '<div class="topbar"><button class="btn" id="qquit">✕ Quit</button><span class="title">' + dotsHTML() + '</span>' + soundBtn() + '</div>' +
      '<div class="info"><div class="qlabel">' + label + '</div>' + info + (q.t === 'write' ? '' : '<div class="hint" id="hint"></div>') + '</div>' +
      '<div class="boardwrap" id="bw">' + body + '</div>' + ctrl + '</div>';
    bindTop(function () { drawQuestion(); });
    $('qquit').onclick = function () { go('#/l/' + L.id); };
    if (q.t === 'write') {
      $('peek').onclick = function () {
        Q.assist = true;
        if (Q.writer) { Q.writer.showOutline(); later(function () { if (Q.writer) Q.writer.hideOutline(); }, 1800); }
        hint('Take a good look…');
      };
      $('qagain').onclick = function () { hint(''); startWriteQ(); };
      window.addEventListener('resize', onResize);
      startWriteQ();
    } else {
      Array.prototype.forEach.call(app.querySelectorAll('.choice'), function (b) { b.onclick = function () { answerChoice(b); }; });
      if (q.t === 'listen') {
        $('qspeak').onclick = function () { say(it, true); };
        later(function () { if (Q && Q.qs[Q.i] === q) say(it, true); }, 400);
      }
    }
  }
  function answerChoice(btn) {
    if (Q.locked || btn.disabled) return;
    if (btn.getAttribute('data-ok') === '1') {
      Q.locked = true;
      btn.classList.add('right');
      FX.ding();
      showPraise(FX.mini(), true);
      finishQuestion(Q.miss === 0 && !Q.assist ? 'first' : 'help');
    } else {
      Q.miss++;
      btn.classList.add('nope'); btn.disabled = true;
      FX.oops();
      hint('Not quite — try another one!');
    }
  }
  function startWriteQ() {
    if (!Q) return;
    var q = Q.qs[Q.i], box = $('board');
    box.innerHTML = '';
    var size = boardSize();
    Q.size = size;
    box.style.width = size + 'px'; box.style.height = size + 'px';
    var ch = Array.from(textOf(q.it))[0];
    var wr = Q.writer = makeWriter(box, ch, size, false);
    wr.quiz({
      leniency: 1.5,
      showHintAfterMisses: 3,
      markStrokeCorrectAfterMisses: 5,
      highlightOnComplete: true,
      onMistake: function () { Q.miss++; hint(nudgeHTML()); },
      onCorrectStroke: function (d) { hint(''); FX.tink(); sparkleAt(box, d); },
      onComplete: function () {
        if (!Q || Q.writer !== wr) return;
        box.classList.add('celebrate');
        FX.ding();
        FX.confetti({ x: 0.5, y: 0.45, n: 45 });
        showPraise(FX.praise(), false);
        finishQuestion(!Q.assist && Q.miss <= 1 ? 'first' : 'help');
      }
    });
  }
  function finishQuestion(result) {
    var q = Q;
    q.res[q.i] = result;
    later(function () {
      if (Q !== q) return;
      if (Q.writer) { try { Q.writer.cancelQuiz(); } catch (e) { /* ignore */ } Q.writer = null; }
      Q.i++;
      if (Q.i >= Q.qs.length) endQuiz(); else drawQuestion();
    }, 1500);
  }
  function endQuiz() {
    var L = Q.L, first = Q.res.filter(function (r) { return r === 'first'; }).length;
    var stars = first >= 7 ? 3 : first >= 5 ? 2 : 1;
    var b = badge(L), isNew = !b.quiz;
    if (!b.quiz || stars > b.quiz) b.quiz = stars;
    store.set('badges', badges);
    var msg = stars === 3 ? 'Amazing! You got ' + first + ' of 8 on the first try!' :
              stars === 2 ? 'Great work! ' + first + ' of 8 on the first try.' :
              'You finished the quiz! Every try makes you stronger.';
    Q = null;
    showWin({
      emoji: stars === 3 ? '🏆' : '🎉', title: 'Well done!', accent: L.accent, stars: stars,
      lines: [msg],
      sticker: isNew ? { emoji: '🏆', label: 'New badge: Quiz Champion!' } : null,
      primary: { label: 'Play again', fn: function () { go('#/q/' + L.id); } },
      secondary: { label: 'Back to lesson', fn: function () { go('#/l/' + L.id); } }
    });
  }

  /* ---------- ABOUT & CREDITS ---------- */
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }
  function renderAbout() {
    var by = {};
    Object.keys(AUDIO).forEach(function (k) {
      var a = AUDIO[k]; var w = a.who || 'Unknown';
      (by[w] = by[w] || { lic: {}, items: [] });
      by[w].lic[a.lic || 'CC'] = 1;
      by[w].items.push({ k: k, src: a.src });
    });
    var speakers = Object.keys(by).sort().map(function (w) {
      return '<div class="credit"><div class="cw">' + esc(w) + '</div><div class="cl">' + esc(Object.keys(by[w].lic).join(', ')) + '</div><div class="ci">' +
        by[w].items.map(function (i) { return '<a href="' + esc(i.src || '#') + '" target="_blank" rel="noopener">' + esc(i.k) + '</a>'; }).join(' ') + '</div></div>';
    }).join('');
    app.innerHTML =
      '<div class="screen about">' +
      '<div class="topbar"><button class="btn" data-go="#/">‹ Home</button><span class="title">About</span></div>' +
      '<div class="acard"><h2>写汉字 Hanzi Practice</h2><p>A little app for practicing Chinese characters: trace each stroke in the right order, see the pinyin with tone colors, and learn what it means. It works with no internet, and nothing you do here leaves the device — no accounts, no tracking.</p></div>' +
      '<div class="acard"><h2>Voice recordings</h2><p>The spoken characters and words are real recordings by native speakers, shared on Wikimedia Commons (Lingua Libre and the Chinese pronunciation set) under Creative Commons licenses. Thank you to everyone who lent their voice! Tap a character to see its recording page.</p>' +
      (speakers || '<p class="muted">Audio is coming soon.</p>') + '</div>' +
      '<div class="acard"><h2>Stroke order</h2><p>Stroke animations use <a href="https://hanziwriter.org" target="_blank" rel="noopener">Hanzi Writer</a> (MIT License), with character data from <a href="https://github.com/skishore/makemeahanzi" target="_blank" rel="noopener">Make Me a Hanzi</a> and <a href="https://github.com/parsimonhi/animCJK" target="_blank" rel="noopener">AnimCJK</a>, based on the Arphic PL fonts (Arphic Public License).</p></div>' +
      '<div class="acard"><h2>Sounds &amp; pictures</h2><p>Chimes and cheers are generated by the app itself. Emoji are drawn by your device.</p></div>' +
      '<div class="acard"><h2>Made with ❤️</h2><p>Built for a young learner by a family that loves Chinese. Words and lessons can be updated any time.</p></div>' +
      '</div>';
    bindTop(renderAbout);
  }

  /* ---------- router ---------- */
  function route() {
    stopWriter();
    var p = location.hash.replace(/^#\/?/, '').split('/');
    var L = lessonById(p[1]);
    var i = parseInt(p[2], 10);
    if (p[0] === 'l' && L) return renderLesson(L);
    if (p[0] === 'w' && L && L.items[i]) return renderPractice(L, i);
    if (p[0] === 'r' && L && L.items[i]) return renderRead(L, i);
    if (p[0] === 'q' && L) return renderQuiz(L);
    if (p[0] === 'about') return renderAbout();
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
    var hadController = !!navigator.serviceWorker.controller, reloaded = false;
    navigator.serviceWorker.addEventListener('controllerchange', function () {
      if (!hadController || reloaded) return;          // first install: nothing to refresh
      if (W || Q) { window.addEventListener('hashchange', function () { if (!reloaded) { reloaded = true; location.reload(); } }, { once: true }); return; }
      reloaded = true; location.reload();
    });
    window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () { /* ignore */ }); });
  }

  route();
})();
