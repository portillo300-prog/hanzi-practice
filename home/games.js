/* Games hub + Bubble Pop. New games register themselves in GAMES. */
(window.HANZI_MODS = window.HANZI_MODS || []).push(function (A) {
  'use strict';
  var FX = A.FX, $ = A.$, app = A.app, store = A.store;

  var GAMES = [
    { id: 'bubbles', icon: '<span class="bubble-ico"></span>', name: 'Bubble Pop', tag: 'Pop the bubble that matches!', go: '#/g/bubbles' }
  ];
  A.games = GAMES;

  A.tabs.push({ id: 'games', icon: '🎮', label: 'Games', href: '#/games', order: 20 });
  A.routes.games = function () { renderHub(); };
  A.routes.g = function (p) {
    if (p[0] === 'bubbles' && p[1] === 'play') return bubblesPlay();
    if (p[0] === 'bubbles') return bubblesSetup();
    renderHub();
  };

  function renderHub() {
    app.innerHTML =
      '<div class="screen has-tabs">' +
      '<div class="topbar"><span class="title gtitle">🎮 Games</span>' + A.walletPill() + '</div>' +
      '<p class="shophint">Play, earn ⭐, and spend them in your Garden 🌷</p>' +
      '<div class="gamegrid">' + GAMES.map(function (g) {
        return '<button class="gamecard" data-go="' + g.go + '"><span class="gicon">' + g.icon + '</span><span class="gname">' + g.name + '</span><span class="gtag">' + g.tag + '</span><span class="gearn">earn up to ⭐ 8</span></button>';
      }).join('') + '</div>' + A.tabbar('games') + '</div>';
  }

  /* ---------------- Bubble Pop ---------------- */
  var ROUNDS = 8;

  function selectedLessons() {
    var sel = store.get('bubbleSel', null);
    var ids = A.lessons.map(function (L) { return L.id; });
    if (!sel || !sel.length) sel = ids;
    return sel.filter(function (id) { return ids.indexOf(id) >= 0; });
  }
  function poolFor(sel) {
    var out = [];
    A.lessons.forEach(function (L) { if (sel.indexOf(L.id) >= 0) L.characters.forEach(function (c) { out.push(c); }); });
    return out;
  }

  function bubblesSetup() {
    var sel = selectedLessons();
    app.innerHTML =
      '<div class="screen">' +
      '<div class="topbar"><button class="btn" data-go="#/games">‹ Games</button>' + A.walletPill() + '</div>' +
      '<div class="hero small"><div class="bigemoji"><span class="bubble-ico big"></span></div><h1 class="gh">Bubble Pop</h1>' +
      '<p class="shophint">A word shows up. Pop the bubble with the right character! Wrong bubbles just wobble, so try again.</p></div>' +
      '<div class="section-title">Which characters?</div>' +
      '<div class="chips">' + A.lessons.map(function (L) {
        return '<button class="chip' + (sel.indexOf(L.id) >= 0 ? ' on' : '') + '" data-l="' + L.id + '">Lesson ' + L.number + ' ' + L.sticker + '</button>';
      }).join('') + '</div>' +
      '<div class="startrow"><button class="btn primary big" id="start">▶ Start</button></div></div>';
    Array.prototype.forEach.call(app.querySelectorAll('.chip'), function (c) {
      c.onclick = function () {
        c.classList.toggle('on');
        var now = Array.prototype.map.call(app.querySelectorAll('.chip.on'), function (x) { return x.getAttribute('data-l'); });
        if (!now.length) { c.classList.add('on'); return; }   // keep at least one lesson
        store.set('bubbleSel', now);
      };
    });
    $('start').onclick = function () { FX.pop(); A.go('#/g/bubbles/play'); };
  }

  function bubblesPlay() {
    var sel = selectedLessons(), pool = poolFor(sel);
    if (pool.length < 4) { A.go('#/g/bubbles'); return; }
    var lesson = A.lessons.filter(function (L) { return sel.indexOf(L.id) >= 0; })[0];
    app.innerHTML =
      '<div class="game" style="--acc:' + A.acc(lesson) + '">' +
      '<div class="topbar"><button class="btn" id="gquit">✕ Quit</button><span class="title"><span id="gprog">1 / ' + ROUNDS + '</span></span><span class="tools">' + A.soundBtn() + '</span></div>' +
      '<div class="gprompt" id="gprompt"></div>' +
      '<div class="arena" id="arena"></div></div>';
    A.bindTop(function () { /* nothing to redraw */ });
    $('gquit').onclick = function () { A.go('#/g/bubbles'); };

    var arena = $('arena');
    var reduced = FX.reduced();
    var W = arena.clientWidth, H = arena.clientHeight;
    var size = Math.max(92, Math.min(156, Math.round(Math.min(W, H) * 0.25)));
    var N = W > 700 ? 7 : 6;
    var bubbles = [], seq = [], idx = 0, target = null, miss = 0, locked = false, firstTry = 0, raf = 0, last = 0, alive = true;

    // the order of targets: shuffled, wrapping if the pool is small
    var shuf = A.shuffle(pool.slice());
    for (var s = 0; s < ROUNDS; s++) seq.push(shuf[s % shuf.length]);

    function randomItem(avoid) {
      var options = pool.filter(function (c) { return avoid.indexOf(c.s) < 0; });
      if (!options.length) options = pool;
      return options[Math.floor(Math.random() * options.length)];
    }
    function shownChars() { return bubbles.map(function (b) { return b.item.s; }); }
    function paint(b) {
      b.el.innerHTML = A.row(A.textOf(b.item));
      b.el.setAttribute('data-ok', b.item === target ? '1' : '0');
    }
    function makeBubble(i) {
      var el = document.createElement('button');
      el.className = 'bubble'; el.style.setProperty('--bs', size + 'px'); el.style.setProperty('--hue', (i * 47) % 360);
      arena.appendChild(el);
      var b = { el: el, x: 0, y: 0, vy: 0, sway: 0, f: 0, ph: Math.random() * 6.28, item: null, lane: i };
      resetBubble(b, true);
      el.onpointerdown = function (e) { e.preventDefault(); tap(b); };
      return b;
    }
    function resetBubble(b, initial) {
      var lane = W / N;
      b.x = Math.max(0, Math.min(W - size, b.lane * lane + (lane - size) / 2 + (Math.random() - 0.5) * lane * 0.4));
      b.y = initial ? H * (0.1 + Math.random() * 0.95) : H + size * (0.2 + Math.random() * 0.8);
      b.vy = (reduced ? 16 : 26) + Math.random() * (reduced ? 10 : 22);
      b.sway = reduced ? 0 : 10 + Math.random() * 16;
      b.f = 0.6 + Math.random() * 0.7;
      b.item = randomItem(shownChars().concat(target ? [target.s] : []));
      b.el.classList.remove('popping', 'wob', 'nope');
      paint(b);
    }
    for (var i = 0; i < N; i++) bubbles.push(makeBubble(i));

    function type() {
      var t = ['pinyin', 'meaning'];
      if (A.AUDIO[target.s]) t.push('listen');
      return t[Math.floor(Math.random() * t.length)];
    }
    function nextPrompt() {
      if (!alive) return;
      if (idx >= ROUNDS) return finish();
      target = seq[idx]; miss = 0; locked = false;
      $('gprog').textContent = (idx + 1) + ' / ' + ROUNDS;
      var kind = type(), p = $('gprompt');
      if (kind === 'pinyin') p.innerHTML = '<div class="gq">Find the character for</div>' + A.pinyinHTML(target.py, target.alt);
      else if (kind === 'meaning') p.innerHTML = '<div class="gq">Find the character that means</div><div class="gmean">' + A.esc(target.en) + '</div>';
      else { p.innerHTML = '<div class="gq">Listen, then pop the right one</div><button class="speak big" id="gspeak" aria-label="Play the sound">🔊</button>'; $('gspeak').onclick = function () { A.say(target, true); }; later(function () { if (alive && target === seq[idx]) A.say(target, true); }, 350); }
      // make sure exactly one bubble shows the answer, and it is on screen
      var visible = bubbles.filter(function (b) { return b.y > H * 0.12 && b.y < H * 0.72; });
      var host = visible.length ? visible[Math.floor(Math.random() * visible.length)] : bubbles[0];
      bubbles.forEach(function (b) { if (b !== host && b.item.s === target.s) b.item = randomItem(shownChars().concat([target.s])); });
      host.item = target;
      bubbles.forEach(paint);
    }
    function later(fn, ms) { return setTimeout(fn, ms); }

    function tap(b) {
      if (locked || !alive) return;
      if (b.item === target) {
        locked = true; if (miss === 0) firstTry++;
        var r = b.el.getBoundingClientRect();
        b.el.classList.add('popping');
        FX.ding();
        FX.confetti({ x: (r.left + r.width / 2) / window.innerWidth, y: (r.top + r.height / 2) / window.innerHeight, n: 30 });
        idx++;
        later(function () { if (!alive) return; resetBubble(b, false); nextPrompt(); }, 850);
      } else {
        miss++; FX.oops();
        b.el.classList.remove('wob'); void b.el.offsetWidth; b.el.classList.add('wob', 'nope');
        var p = $('gprompt'); if (p && !p.querySelector('.gtry')) p.insertAdjacentHTML('beforeend', '<div class="gtry">Not that one. Try another bubble!</div>');
        later(function () { var g = p && p.querySelector('.gtry'); if (g) g.parentNode.removeChild(g); b.el.classList.remove('nope'); }, 1200);
      }
    }

    function frame(t) {
      if (!alive) return;
      var dt = last ? Math.min(0.05, (t - last) / 1000) : 0.016; last = t;
      bubbles.forEach(function (b) {
        if (!b.el.classList.contains('popping')) {
          b.y -= b.vy * dt;
          if (b.y < -size - 10) resetBubble(b, false);
        }
        var sx = Math.sin(t / 1000 * b.f + b.ph) * b.sway;
        b.el.style.transform = 'translate3d(' + (b.x + sx).toFixed(1) + 'px,' + b.y.toFixed(1) + 'px,0)';
      });
      raf = requestAnimationFrame(frame);
    }

    function finish() {
      alive = false; cancelAnimationFrame(raf);
      var stars = firstTry >= 7 ? 3 : firstTry >= 5 ? 2 : 1;
      A.earn(2 + stars * 2);
      A.showWin({
        emoji: stars === 3 ? '🏆' : '🎉', title: 'Bubbles popped!', accent: A.acc(lesson), stars: stars,
        lines: [firstTry + ' of ' + ROUNDS + ' on the first try. You earned ⭐ ' + (2 + stars * 2) + '!'],
        primary: { label: 'Play again', fn: function () { A.go('#/g/bubbles/play'); } },
        secondary: { label: '🎮 Games', fn: function () { A.go('#/games'); } }
      });
    }

    A.onLeave(function () { alive = false; cancelAnimationFrame(raf); });
    nextPrompt();
    raf = requestAnimationFrame(frame);
  }
});
