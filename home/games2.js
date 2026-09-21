/* More games: Tone Houses, Memory Match, Treasure Garden (tap to discover), Sentence Builder. */
(window.HANZI_MODS = window.HANZI_MODS || []).push(function (A) {
  'use strict';
  var FX = A.FX, $ = A.$, app = A.app, C = window.CONTENT;
  var ROUNDS = 8;

  function frame(lesson, extra) {   // common game screen top: quit, progress, sound
    return '<div class="game' + (extra || '') + '" style="--acc:' + A.acc(lesson) + '">' +
      '<div class="topbar"><button class="btn" id="gquit">✕ Quit</button><span class="title"><span id="gprog"></span></span><span class="tools">' + A.soundBtn() + '</span></div>';
  }
  function win(cfg, lesson, good, total, again) {
    var stars = A.starsFor(good, total), pay = 2 + stars * 2;
    A.earn(pay);
    A.showWin({
      emoji: stars === 3 ? '🏆' : '🎉', title: cfg.done, accent: A.acc(lesson), stars: stars,
      lines: [good + ' of ' + total + (cfg.unit || ' on the first try') + '. You earned ⭐ ' + pay + '!'],
      primary: { label: 'Play again', fn: function () { A.go('#/g/' + cfg.id + '/play'); } },
      secondary: { label: '🎮 Games', fn: function () { A.go('#/games'); } }
    });
  }
  function firstLesson() { var sel = A.selectedLessons(); return A.lessons.filter(function (L) { return sel.indexOf(L.id) >= 0; })[0] || A.lessons[0]; }
  function reg(cfg, play) {
    A.registerGame({ id: cfg.id, name: cfg.name, icon: cfg.icon, tag: cfg.tag, order: cfg.order }, function (p) {
      if (p[0] === 'play') return play();
      A.gameSetup(cfg);
    });
  }

  /* ---------------- Tone Houses ---------------- */
  var TONES = [
    { n: 1, mark: 'ā', name: '1st tone', how: 'high and flat' },
    { n: 2, mark: 'á', name: '2nd tone', how: 'going up' },
    { n: 3, mark: 'ǎ', name: '3rd tone', how: 'down and up' },
    { n: 4, mark: 'à', name: '4th tone', how: 'falling fast' }
  ];
  var toneCfg = { id: 'tones', order: 40, name: 'Tone Houses', icon: '🏠', tag: 'Which tone house does it live in?', how: 'Every character lives in a tone house. Look, listen, then tap its house!', done: 'Tone masters!' };
  reg(toneCfg, tonesPlay);

  function tonesPlay() {
    var sel = A.selectedLessons(), lesson = firstLesson();
    var pool = A.poolFor(sel).filter(function (c) { return /[1-4]$/.test(c.py); });
    if (pool.length < 4) return A.go('#/g/tones');
    var seq = A.shuffle(pool.slice()).slice(0, ROUNDS), idx = 0, miss = 0, good = 0, locked = false, alive = true;
    app.innerHTML = frame(lesson, ' tones') +
      '<div class="gprompt tcardwrap" id="tcard"></div>' +
      '<div class="houses" id="houses">' + TONES.map(function (t) {
        return '<button class="house" data-t="' + t.n + '" style="--tc:var(--t' + t.n + ')"><span class="hroof">🏠</span><span class="hmark">' + t.mark + '</span><span class="hname">' + t.name + '</span><span class="hhow">' + t.how + '</span></button>';
      }).join('') + '</div></div>';
    A.bindTop(function () {});
    $('gquit').onclick = function () { A.go('#/g/tones'); };
    A.onLeave(function () { alive = false; });
    function show() {
      if (!alive) return;
      if (idx >= seq.length) { alive = false; return win(toneCfg, lesson, good, seq.length); }
      var c = seq[idx]; miss = 0; locked = false;
      $('gprog').textContent = (idx + 1) + ' / ' + seq.length;
      var base = c.py.replace(/[1-5]$/, '').replace(/v/g, 'ü');
      $('tcard').innerHTML = '<div class="tc-glyph">' + A.row(A.textOf(c)) + '</div><div class="tc-py" id="tcpy">' + base + '</div><div class="tc-en">' + A.esc(c.en) + '</div>' +
        (A.hasVoice(c) ? '<button class="speak" id="gspeak" aria-label="Play the sound">🔊</button>' : '');
      if ($('gspeak')) { $('gspeak').onclick = function () { A.say(c, true); }; setTimeout(function () { if (alive && seq[idx] === c) A.say(c, false); }, 400); }
      Array.prototype.forEach.call(app.querySelectorAll('.house'), function (h) { h.classList.remove('yes', 'wob', 'shine'); });
    }
    Array.prototype.forEach.call(app.querySelectorAll('.house'), function (h) {
      h.onclick = function () {
        if (locked || !alive) return;
        var c = seq[idx], want = parseInt(c.py.slice(-1), 10), got = parseInt(h.getAttribute('data-t'), 10);
        function reveal() { $('tcpy').innerHTML = A.pinyinHTML(c.py, c.alt, 'md'); }
        if (got === want) {
          locked = true; if (miss === 0) good++;
          h.classList.add('yes'); reveal(); FX.ding();
          var r = h.getBoundingClientRect(); FX.confetti({ x: (r.left + r.width / 2) / window.innerWidth, y: (r.top + r.height / 2) / window.innerHeight, n: 26 });
          A.say(c, false);
          idx++; setTimeout(show, 1500);
        } else {
          miss++; FX.oops(); h.classList.remove('wob'); void h.offsetWidth; h.classList.add('wob');
          if (miss >= 2) {   // show the answer and move on
            locked = true; reveal();
            Array.prototype.forEach.call(app.querySelectorAll('.house'), function (x) { if (parseInt(x.getAttribute('data-t'), 10) === want) x.classList.add('shine'); });
            A.say(c, false); idx++; setTimeout(show, 2200);
          } else A.say(c, false);
        }
      };
    });
    show();
  }

  /* ---------------- Memory Match ---------------- */
  var memCfg = { id: 'memory', order: 50, name: 'Memory Match', icon: '🃏', tag: 'Find the matching pairs!', how: 'Flip two cards. A character matches its pinyin. Find all six pairs!', done: 'All pairs found!', unit: ' moves (fewer is better)' };
  reg(memCfg, memoryPlay);

  function memoryPlay() {
    var sel = A.selectedLessons(), lesson = firstLesson(), pool = A.poolFor(sel);
    if (pool.length < 6) return A.go('#/g/memory');
    var picks = A.shuffle(pool.slice()).slice(0, 6), cards = [];
    picks.forEach(function (c, i) { cards.push({ k: i, kind: 'g', item: c }); cards.push({ k: i, kind: 'p', item: c }); });
    cards = A.shuffle(cards);
    app.innerHTML = frame(lesson, ' memory') + '<div class="gprompt"><div class="gq">Find the pairs</div><div class="mv" id="mv">Moves: 0</div></div>' +
      '<div class="mgrid" id="mgrid">' + cards.map(function (cd, i) {
        var front = cd.kind === 'g' ? '<span class="mf g">' + A.row(A.textOf(cd.item)) + '</span>' : '<span class="mf p">' + A.pinyinHTML(cd.item.py, cd.item.alt, 'md') + '</span>';
        return '<button class="mc" data-i="' + i + '"><span class="mc-in"><span class="mc-back">✿</span><span class="mc-front">' + front + '</span></span></button>';
      }).join('') + '</div></div>';
    A.bindTop(function () {});
    $('gquit').onclick = function () { A.go('#/g/memory'); };
    var first = null, busy = false, moves = 0, matched = 0, alive = true;
    A.onLeave(function () { alive = false; });
    Array.prototype.forEach.call(app.querySelectorAll('.mc'), function (el) {
      el.onclick = function () {
        if (busy || !alive || el.classList.contains('flip') || el.classList.contains('done')) return;
        var cd = cards[parseInt(el.getAttribute('data-i'), 10)];
        el.classList.add('flip'); FX.tink();
        if (cd.kind === 'g') A.say(cd.item, false);
        if (!first) { first = { el: el, cd: cd }; return; }
        moves++; $('mv').textContent = 'Moves: ' + moves;
        var a = first; first = null; busy = true;
        if (a.cd.k === cd.k) {
          setTimeout(function () {
            a.el.classList.add('done'); el.classList.add('done'); FX.ding(); matched++; busy = false;
            var r = el.getBoundingClientRect(); FX.confetti({ x: (r.left + r.width / 2) / window.innerWidth, y: (r.top + r.height / 2) / window.innerHeight, n: 22 });
            if (matched === picks.length) {
              alive = false;
              var stars = moves <= 9 ? 3 : moves <= 13 ? 2 : 1, pay = 2 + stars * 2; A.earn(pay);
              setTimeout(function () {
                A.showWin({ emoji: stars === 3 ? '🏆' : '🎉', title: memCfg.done, accent: A.acc(lesson), stars: stars, lines: ['You did it in ' + moves + ' moves. You earned ⭐ ' + pay + '!'],
                  primary: { label: 'Play again', fn: function () { A.go('#/g/memory/play'); } }, secondary: { label: '🎮 Games', fn: function () { A.go('#/games'); } } });
              }, 700);
            }
          }, 450);
        } else {
          setTimeout(function () { a.el.classList.remove('flip'); el.classList.remove('flip'); busy = false; }, 1000);
        }
      };
    });
  }

  /* ---------------- Treasure Garden (tap to discover) ---------------- */
  var treasureCfg = { id: 'treasure', order: 60, name: 'Treasure Garden', icon: '🌷', tag: 'Tap the flowers to find the treasure!', how: 'Something is hiding under the flowers. Tap to discover the character you are looking for!', done: 'Treasure found!' };
  reg(treasureCfg, treasurePlay);

  function treasurePlay() {
    var sel = A.selectedLessons(), lesson = firstLesson(), pool = A.poolFor(sel);
    if (pool.length < 6) return A.go('#/g/treasure');
    var cells = Math.min(12, pool.length >= 12 ? 12 : pool.length >= 9 ? 9 : 6);
    var seq = A.shuffle(pool.slice()).slice(0, ROUNDS), idx = 0, miss = 0, good = 0, locked = false, alive = true;
    var covers = ['🌸', '🌼', '🌷', '🌺', '🌻', '🌹'];
    app.innerHTML = frame(lesson, ' treasure') + '<div class="gprompt" id="gprompt"></div><div class="fgrid" id="fgrid"></div></div>';
    A.bindTop(function () {});
    $('gquit').onclick = function () { A.go('#/g/treasure'); };
    A.onLeave(function () { alive = false; });
    function deal() {
      if (!alive) return;
      if (idx >= seq.length) { alive = false; return win(treasureCfg, lesson, good, seq.length); }
      var t = seq[idx]; miss = 0; locked = false;
      $('gprog').textContent = (idx + 1) + ' / ' + seq.length;
      var kind = A.promptKind(t);
      $('gprompt').innerHTML = A.promptHTML(t, kind, 'Discover the character');
      A.bindPromptSound(t, kind, function () { return alive && seq[idx] === t; });
      var others = A.shuffle(pool.filter(function (c) { return c.s !== t.s; })).slice(0, cells - 1), row = A.shuffle([t].concat(others));
      $('fgrid').style.setProperty('--cols', cells === 12 ? 3 : 3);
      $('fgrid').innerHTML = row.map(function (c, i) {
        return '<button class="fl" data-ok="' + (c === t ? 1 : 0) + '"><span class="fl-in"><span class="fl-cover">' + covers[i % covers.length] + '</span><span class="fl-card">' + A.row(A.textOf(c)) + '</span></span></button>';
      }).join('');
      Array.prototype.forEach.call(app.querySelectorAll('.fl'), function (f) {
        f.onclick = function () {
          if (locked || f.classList.contains('open') || !alive) return;
          f.classList.add('open'); FX.tink();
          if (f.getAttribute('data-ok') === '1') {
            locked = true; if (miss === 0) good++;
            f.classList.add('treasure'); FX.ding(); A.say(t, false);
            var r = f.getBoundingClientRect(); FX.confetti({ x: (r.left + r.width / 2) / window.innerWidth, y: (r.top + r.height / 2) / window.innerHeight, n: 34 });
            idx++; setTimeout(deal, 1300);
          } else {
            miss++; FX.oops();
            setTimeout(function () { if (alive) f.classList.remove('open'); }, 1000);
          }
        };
      });
    }
    deal();
  }

  /* ---------------- Sentence Builder ---------------- */
  var sentCfg = { id: 'sentences', order: 70, name: 'Sentence Builder', icon: '🧱', tag: 'Put the words in order!', how: 'These sentences come from your book. Tap the words in the right order to build each one!', done: 'Sentences built!', noChips: true, unit: ' sentences on the first try' };
  reg(sentCfg, sentencePlay);

  function sentencePlay() {
    var all = (C.sentences || []).slice();
    if (all.length < 3) return A.go('#/games');
    var lesson = A.lessons[0], list = A.shuffle(all).slice(0, 6), idx = 0, good = 0, alive = true, miss = 0, seq, locked;
    app.innerHTML = frame(lesson, ' sentences') + '<div class="gprompt" id="gprompt"></div><div class="sslots" id="sslots"></div><div class="wl-msg" id="wlmsg">&nbsp;</div><div class="schunks" id="schunks"></div></div>';
    A.bindTop(function () {});
    $('gquit').onclick = function () { A.go('#/g/sentences'); };
    A.onLeave(function () { alive = false; });
    function chunksOf(st) { return A.script() === 't' ? st.tchunks : st.chunks; }
    function msg(t, cls) { var m = $('wlmsg'); if (m) { m.innerHTML = t || '&nbsp;'; m.className = 'wl-msg ' + (cls || ''); } }
    function draw() {
      if (!alive) return;
      if (idx >= list.length) { alive = false; return win(sentCfg, lesson, good, list.length); }
      var st = list[idx], ch = chunksOf(st); seq = []; miss = 0; locked = false; msg('');
      $('gprog').textContent = (idx + 1) + ' / ' + list.length;
      $('gprompt').innerHTML = '<div class="gq">Put the words in order</div><div class="gmean">' + A.esc(st.en) + '</div><button class="btn" id="shint">💡 Hint</button><div class="pz-py" id="spy"></div>';
      $('shint').onclick = function () { miss = Math.max(miss, 1); $('spy').innerHTML = A.pinyinHTML(st.py, null, 'md'); };
      var order = A.shuffle(ch.map(function (c, i) { return { c: c, i: i }; }));
      function slots() {
        $('sslots').innerHTML = ch.map(function (_, i) { return '<button class="sslot' + (seq[i] ? ' full' : '') + '">' + (seq[i] ? A.row(seq[i].c) : '') + '</button>'; }).join('');
        Array.prototype.forEach.call($('sslots').querySelectorAll('.sslot.full'), function (b) { b.onclick = function () { if (!locked) { var back = seq.pop(); tray(); slots(); void back; } }; });
      }
      function tray() {
        var used = seq.map(function (s) { return s.i; });
        $('schunks').innerHTML = order.map(function (o) { return used.indexOf(o.i) >= 0 ? '' : '<button class="chunk" data-i="' + o.i + '">' + A.row(o.c) + '</button>'; }).join('');
        Array.prototype.forEach.call($('schunks').querySelectorAll('.chunk'), function (b) {
          b.onclick = function () {
            if (locked || seq.length >= ch.length) return;
            var i = parseInt(b.getAttribute('data-i'), 10), o = order.filter(function (x) { return x.i === i; })[0];
            seq.push(o); FX.tink(); tray(); slots();
            if (seq.length === ch.length) check();
          };
        });
      }
      function check() {
        var built = seq.map(function (s) { return s.c; }).join(''), want = ch.join('');
        if (built === want) {
          locked = true; if (miss === 0) good++;
          FX.word(); FX.confetti({ x: 0.5, y: 0.35, n: 80 });
          $('spy').innerHTML = A.pinyinHTML(st.py, null, 'md'); msg('🎉 Great sentence!', 'good');
          idx++; setTimeout(draw, 2600);
        } else {
          locked = true; miss++; FX.oops(); msg('Almost! Try again.', 'try');
          var s = $('sslots'); s.classList.add('wob');
          setTimeout(function () { if (!alive) return; s.classList.remove('wob'); seq = []; locked = false; tray(); slots(); msg(''); }, 1000);
        }
      }
      tray(); slots();
    }
    draw();
  }
});
