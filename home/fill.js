/* Writing games: "Fill the Blank" (write the missing 1-2 characters of a short phrase) and "Picture Words" (a picture + English, write the word).
   Both are checked stroke by stroke by Hanzi Writer, so the app can grade them with no guessing. */
(window.HANZI_MODS = window.HANZI_MODS || []).push(function (A) {
  'use strict';
  var FX = A.FX, $ = A.$, app = A.app, C = window.CONTENT, STROKES = window.STROKES || {};
  var ROUNDS = 8;

  function firstLesson() { return A.lessons.filter(function (L) { return L.id === 'l0'; })[0] || A.lessons[0]; }
  function chars(s) { return Array.from(s); }
  function textFor(it) { return A.script() === 't' ? (it.t || it.s) : it.s; }

  var fillCfg = { id: 'blank', order: 80, name: 'Fill the Blank', icon: '✍️', tag: 'Write the missing character!', how: 'A short phrase is missing a character or two. Read the English clue, then write the missing part with your finger. It will tell you if a stroke is right!', done: 'Great writing!', unit: ' words on the first try' };
  var picCfg = { id: 'picwords', order: 90, name: 'Picture Words', icon: '🖼️', tag: 'Look at the picture and write the word!', how: 'You will see a picture and its English name. Write the Chinese word with your finger. It will tell you if a stroke is right!', done: 'Great writing!', unit: ' words on the first try' };

  [fillCfg, picCfg].forEach(function (cfg) {
    A.registerGame({ id: cfg.id, name: cfg.name, icon: cfg.icon, tag: cfg.tag, order: cfg.order }, function (p) {
      if (p[0] === 'play') return play(cfg);
      setup(cfg);
    });
  });

  function setup(cfg) {
    app.innerHTML =
      '<div class="screen"><div class="topbar"><button class="btn" data-go="#/games">‹ Games</button>' + A.walletPill() + '</div>' +
      '<div class="hero small"><div class="bigemoji">' + cfg.icon + '</div><h1 class="gh">' + cfg.name + '</h1><p class="shophint">' + cfg.how + '</p></div>' +
      '<div class="startrow"><button class="btn primary big" id="start">▶ Start</button></div></div>';
    $('start').onclick = function () { FX.pop(); A.go('#/g/' + cfg.id + '/play'); };
  }

  // one puzzle = { it, n, start, len, en, emoji }
  function puzzles(cfg) {
    var list = [];
    if (cfg.id === 'blank') {
      (C.fill || []).forEach(function (f, n) { f.b.forEach(function (b) { list.push({ it: f, n: n, start: b[0], len: b[1], en: f.en }); }); });
    } else {
      (C.pics || []).forEach(function (p, n) { list.push({ it: p, n: n, start: 0, len: chars(p.s).length, en: p.en, emoji: p.e }); });
    }
    return list;
  }
  function pick(list) {   // 8 puzzles, never the same phrase twice
    var out = [], used = {};
    A.shuffle(list.slice()).forEach(function (p) { if (out.length < ROUNDS && !used[p.n]) { used[p.n] = 1; out.push(p); } });
    return out;
  }

  function play(cfg) {
    var lesson = firstLesson(), seq = pick(puzzles(cfg)), idx = 0, good = 0, alive = true, writer = null, cur = null;
    if (seq.length < 3 || typeof HanziWriter === 'undefined') return A.go('#/games');
    app.innerHTML =
      '<div class="game wr" style="--acc:' + A.acc(lesson) + '">' +
      '<div class="topbar"><button class="btn" id="gquit">✕ Quit</button><span class="title"><span id="gprog"></span></span><span class="tools">' + A.soundBtn() + '</span></div>' +
      '<div class="gprompt wrprompt" id="gprompt"></div>' +
      '<div class="boardwrap wrboard" id="bw"><div class="board" id="board"></div></div></div>';
    A.bindTop(function () {});
    $('gquit').onclick = function () { stop(); A.go('#/g/' + cfg.id); };
    A.onLeave(function () { alive = false; stop(); });
    function stop() { if (writer) { try { writer.cancelQuiz(); } catch (e) { /* ignore */ } writer = null; } }

    function next() {
      if (!alive) return;
      if (idx >= seq.length) {
        alive = false;
        var stars = A.starsFor(good, seq.length), pay = 2 + stars * 2;
        A.earn(pay);
        return A.showWin({
          emoji: stars === 3 ? '🏆' : '🎉', title: cfg.done, accent: A.acc(lesson), stars: stars,
          lines: [good + ' of ' + seq.length + cfg.unit + '. You earned ⭐ ' + pay + '!'],
          primary: { label: 'Play again', fn: function () { A.go('#/g/' + cfg.id + '/play'); } },
          secondary: { label: '🎮 Games', fn: function () { A.go('#/games'); } }
        });
      }
      var p = seq[idx], all = chars(textFor(p.it)), py = p.it.py.trim().split(/\s+/);
      cur = { p: p, all: all, ci: 0, miss: 0, peeked: false };
      $('gprog').textContent = (idx + 1) + ' / ' + seq.length;
      var phrase = all.map(function (ch, i) {
        var inBlank = i >= p.start && i < p.start + p.len;
        return inBlank ? '<span class="wslot" data-i="' + i + '"></span>' : '<span class="wfix">' + A.row(ch) + '</span>';
      }).join('');
      var blankPy = py.slice(p.start, p.start + p.len).join(' ');
      $('gprompt').innerHTML =
        (p.emoji ? '<div class="wpic">' + p.emoji + '</div>' : '') +
        '<div class="wphrase">' + phrase + '</div>' +
        '<div class="wen">' + A.esc(p.en) + '</div>' +
        '<div class="wpy">' + A.pinyinHTML(blankPy, null, '') + '</div>' +
        '<div class="hint" id="hint"></div>' +
        '<button class="btn" id="wpeek"><span class="ico">💡</span>Peek</button>';
      $('wpeek').onclick = function () { cur.peeked = true; if (writer) { writer.showOutline(); A.later(function () { if (writer) writer.hideOutline(); }, 1800); } A.hint('Take a good look…'); };
      writeChar();
    }

    function writeChar() {
      if (!alive) return;
      var p = cur.p, i = p.start + cur.ci, ch = cur.all[i], box = $('board'), bw = $('bw');
      box.innerHTML = '';
      Array.prototype.forEach.call(app.querySelectorAll('.wslot'), function (s) { s.classList.toggle('current', +s.getAttribute('data-i') === i); });
      var size = Math.max(200, Math.floor(Math.min(bw.clientWidth, bw.clientHeight)) - 8);
      box.style.width = size + 'px'; box.style.height = size + 'px';
      var me = writer = HanziWriter.create(box, ch, {
        width: size - 4, height: size - 4, padding: Math.round(size * 0.07),
        showOutline: false, showCharacter: false,
        strokeColor: A.cssVar('--stroke'), outlineColor: A.cssVar('--outline-c'), highlightColor: A.cssVar('--hl'),
        highlightCompleteColor: A.cssVar('--hlc'), drawingColor: A.cssVar('--draw'),
        drawingWidth: Math.max(10, Math.round(size * 0.035)), strokeAnimationSpeed: 1, delayBetweenStrokes: 250,
        charDataLoader: function (c, ok, fail) { if (STROKES[c]) ok(STROKES[c]); else fail(); }
      });
      me.quiz({
        leniency: 1.5, showHintAfterMisses: 2, markStrokeCorrectAfterMisses: 4, highlightOnComplete: true,
        onMistake: function () { cur.miss++; A.hint(A.nudgeHTML()); },
        onCorrectStroke: function () { A.hint(''); FX.tink(); },
        onComplete: function () {
          if (writer !== me || !alive) return;
          var slot = app.querySelector('.wslot[data-i="' + i + '"]');
          if (slot) { slot.innerHTML = A.glyph(ch); slot.classList.remove('current'); slot.classList.add('done'); }
          FX.ding();
          cur.ci++;
          if (cur.ci < p.len) { A.later(writeChar, 650); return; }
          box.classList.add('celebrate');
          FX.confetti({ x: 0.5, y: 0.5, n: 45 });
          A.showPraise(FX.praise(), false);
          var said = { s: cur.all.slice(p.start, p.start + p.len).join('') };
          if (A.hasVoice(said)) A.say(said, false);
          if (cur.miss <= 1 && !cur.peeked) good++;
          idx++;
          A.later(next, 1800);
        }
      });
    }
    next();
  }
});
