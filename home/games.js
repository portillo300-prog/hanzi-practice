/* Games hub + the "pop" games (Bubble Pop, Fish Pond, Star Catcher). Other games register themselves with A.registerGame. */
(window.HANZI_MODS = window.HANZI_MODS || []).push(function (A) {
  'use strict';
  var FX = A.FX, $ = A.$, app = A.app, store = A.store;

  var GAMES = A.games = [];
  A.gameRoutes = {};
  A.registerGame = function (g, handler) { GAMES.push(g); A.gameRoutes[g.id] = handler; };

  A.tabs.push({ id: 'games', icon: '🎮', label: 'Games', href: '#/games', order: 20 });
  A.routes.games = function () { renderHub(); };
  A.routes.g = function (p) { var h = A.gameRoutes[p[0]]; if (h) return h(p.slice(1)); renderHub(); };

  function renderHub() {
    var list = GAMES.slice().sort(function (a, b) { return (a.order || 50) - (b.order || 50); });
    app.innerHTML =
      '<div class="screen has-tabs">' +
      '<div class="topbar"><span class="title gtitle">🎮 Games</span>' + A.walletPill() + '</div>' +
      '<p class="shophint">Play, earn ⭐, and spend them in your Garden 🌷</p>' +
      '<div class="gamegrid">' + list.map(function (g, i) {
        return '<button class="gamecard" style="animation-delay:' + (i * 0.05) + 's" data-go="#/g/' + g.id + '"><span class="gicon">' + g.icon + '</span><span class="gname">' + g.name + '</span><span class="gtag">' + g.tag + '</span><span class="gearn">earn up to ⭐ 8</span></button>';
      }).join('') + '</div>' + A.tabbar('games') + '</div>';
  }

  /* ---------- helpers shared by the games ---------- */
  A.selectedLessons = function () {
    var sel = store.get('bubbleSel', null), ids = A.lessons.map(function (L) { return L.id; });
    if (!sel || !sel.length) sel = ids;
    return sel.filter(function (id) { return ids.indexOf(id) >= 0; });
  };
  A.poolFor = function (sel) {
    var out = [];
    A.lessons.forEach(function (L) { if (sel.indexOf(L.id) >= 0) L.characters.forEach(function (c) { out.push(c); }); });
    return out;
  };
  // setup screen: pick the lessons, then Start
  A.gameSetup = function (cfg) {
    var sel = A.selectedLessons();
    app.innerHTML =
      '<div class="screen">' +
      '<div class="topbar"><button class="btn" data-go="#/games">‹ Games</button>' + A.walletPill() + '</div>' +
      '<div class="hero small"><div class="bigemoji">' + cfg.icon.replace('bubble-ico', 'bubble-ico big') + '</div><h1 class="gh">' + cfg.name + '</h1>' +
      '<p class="shophint">' + cfg.how + '</p></div>' +
      (cfg.noChips ? '' : '<div class="section-title">Which characters?</div>' +
      '<div class="chips">' + A.lessons.map(function (L) {
        return '<button class="chip' + (sel.indexOf(L.id) >= 0 ? ' on' : '') + '" data-l="' + L.id + '">Lesson ' + L.number + ' ' + L.sticker + '</button>';
      }).join('') + '</div>') +
      '<div class="startrow"><button class="btn primary big" id="start">▶ Start</button></div></div>';
    Array.prototype.forEach.call(app.querySelectorAll('.chip'), function (c) {
      c.onclick = function () {
        c.classList.toggle('on');
        var now = Array.prototype.map.call(app.querySelectorAll('.chip.on'), function (x) { return x.getAttribute('data-l'); });
        if (!now.length) { c.classList.add('on'); return; }
        store.set('bubbleSel', now);
      };
    });
    $('start').onclick = function () { FX.pop(); A.go('#/g/' + cfg.id + '/play'); };
  };
  // a prompt for a target character: pinyin, meaning, or (when there is a voice) a sound
  A.promptKind = function (target) {
    var t = ['pinyin', 'meaning'];
    if (A.hasVoice(target)) t.push('listen');
    return t[Math.floor(Math.random() * t.length)];
  };
  A.promptHTML = function (target, kind, verb) {
    verb = verb || 'Find the character';
    if (kind === 'pinyin') return '<div class="gq">' + verb + ' for</div>' + A.pinyinHTML(target.py, target.alt);
    if (kind === 'meaning') return '<div class="gq">' + verb + ' that means</div><div class="gmean">' + A.esc(target.en) + '</div>';
    return '<div class="gq">Listen, then choose</div><button class="speak big" id="gspeak" aria-label="Play the sound">🔊</button>';
  };
  A.bindPromptSound = function (target, kind, stillCurrent) {
    var b = $('gspeak');
    if (!b) return;
    b.onclick = function () { A.say(target, true); };
    setTimeout(function () { if (stillCurrent()) A.say(target, true); }, 350);
  };
  A.starsFor = function (good, total) { var r = good / total; return r >= 0.85 ? 3 : r >= 0.6 ? 2 : 1; };

  /* ---------------- the "pop" games: things that move, tap the right one ---------------- */
  var POPS = [
    { id: 'bubbles', order: 10, name: 'Bubble Pop', icon: '<span class="bubble-ico"></span>', tag: 'Pop the bubble that matches!', how: 'A word shows up. Pop the bubble with the right character! Wrong bubbles just wobble, so try again.', dir: 'up', body: 'b-bubble', arena: 'sea', done: 'Bubbles popped!' },
    { id: 'fish', order: 20, name: 'Fish Pond', icon: '🐟', tag: 'Tap the fish with the right character!', how: 'Fish swim across the pond. Tap the fish that has the right character!', dir: 'right', body: 'b-fish', arena: 'pond', done: 'Fish caught!' },
    { id: 'stars', order: 30, name: 'Star Catcher', icon: '⭐', tag: 'Catch the falling star that matches!', how: 'Stars fall from the sky. Catch the one with the right character!', dir: 'down', body: 'b-starb', arena: 'sky', done: 'Stars caught!' }
  ];
  POPS.forEach(function (cfg) {
    A.registerGame({ id: cfg.id, name: cfg.name, icon: cfg.icon, tag: cfg.tag, order: cfg.order }, function (p) {
      if (p[0] === 'play') return popPlay(cfg);
      A.gameSetup(cfg);
    });
  });

  var ROUNDS = 8;
  function popPlay(cfg) {
    var sel = A.selectedLessons(), pool = A.poolFor(sel);
    if (pool.length < 4) { A.go('#/g/' + cfg.id); return; }
    var lesson = A.lessons.filter(function (L) { return sel.indexOf(L.id) >= 0; })[0];
    app.innerHTML =
      '<div class="game" style="--acc:' + A.acc(lesson) + '">' +
      '<div class="topbar"><button class="btn" id="gquit">✕ Quit</button><span class="title"><span id="gprog">1 / ' + ROUNDS + '</span></span><span class="tools">' + A.soundBtn() + '</span></div>' +
      '<div class="gprompt" id="gprompt"></div>' +
      '<div class="arena ' + cfg.arena + '" id="arena"></div></div>';
    A.bindTop(function () { /* nothing to redraw */ });
    $('gquit').onclick = function () { A.go('#/g/' + cfg.id); };

    var arena = $('arena'), reduced = FX.reduced(), dir = cfg.dir;
    var W = arena.clientWidth, H = arena.clientHeight;
    var size = Math.max(92, Math.min(150, Math.round(Math.min(W, H) * 0.25)));
    var N = dir === 'right' ? (H > 560 ? 6 : 5) : (W > 700 ? 7 : 6);
    var bubbles = [], seq = [], idx = 0, target = null, miss = 0, locked = false, firstTry = 0, raf = 0, last = 0, alive = true;
    var shuf = A.shuffle(pool.slice());
    for (var s = 0; s < ROUNDS; s++) seq.push(shuf[s % shuf.length]);
    var speed = reduced ? 0.6 : 1;

    function randomItem(avoid) {
      var options = pool.filter(function (c) { return avoid.indexOf(c.s) < 0; });
      if (!options.length) options = pool;
      return options[Math.floor(Math.random() * options.length)];
    }
    function shownChars() { return bubbles.map(function (b) { return b.item.s; }); }
    function paint(b) { b.el.innerHTML = A.row(A.textOf(b.item)); b.el.setAttribute('data-ok', b.item === target ? '1' : '0'); }
    function place(b, initial) {
      if (dir === 'up') {
        var lane = W / N;
        b.x = Math.max(0, Math.min(W - size, b.lane * lane + (lane - size) / 2 + (Math.random() - 0.5) * lane * 0.4));
        b.y = initial ? H * (0.1 + Math.random() * 0.85) : H + size * (0.2 + Math.random() * 0.8);
        b.vx = 0; b.vy = -((26 + Math.random() * 22) * speed); b.sway = reduced ? 0 : 10 + Math.random() * 16;
      } else if (dir === 'down') {
        var lane2 = W / N;
        b.x = Math.max(0, Math.min(W - size, b.lane * lane2 + (lane2 - size) / 2 + (Math.random() - 0.5) * lane2 * 0.4));
        b.y = initial ? -size + H * (Math.random() * 0.8) : -size * (1 + Math.random());
        b.vx = 0; b.vy = (34 + Math.random() * 26) * speed; b.sway = reduced ? 0 : 8 + Math.random() * 12;
      } else {   // swim across, left to right
        var laneH = (H - size) / Math.max(1, N - 1);
        b.y = Math.max(0, Math.min(H - size, b.lane * laneH + (Math.random() - 0.5) * laneH * 0.3));
        b.x = initial ? W * (Math.random() * 0.9) - size * 0.3 : -size * (1.1 + Math.random() * 1.4);
        b.vx = (40 + Math.random() * 34) * speed; b.vy = 0; b.sway = reduced ? 0 : 6 + Math.random() * 10;
      }
      b.f = 0.6 + Math.random() * 0.7;
      b.item = randomItem(shownChars().concat(target ? [target.s] : []));
      b.el.classList.remove('popping', 'wob', 'nope');
      paint(b);
    }
    function makeBubble(i) {
      var el = document.createElement('button');
      el.className = 'bubble ' + cfg.body; el.style.setProperty('--bs', size + 'px');
      arena.appendChild(el);
      var b = { el: el, x: 0, y: 0, vx: 0, vy: 0, sway: 0, f: 0, ph: Math.random() * 6.28, item: null, lane: i };
      place(b, true);
      el.onpointerdown = function (e) { e.preventDefault(); tap(b); };
      return b;
    }
    for (var i = 0; i < N; i++) bubbles.push(makeBubble(i));

    function onScreen(b) { var cx = b.x + size / 2, cy = b.y + size / 2; return cx > size * 0.35 && cx < W - size * 0.35 && cy > size * 0.35 && cy < H - size * 0.35; }
    function nextPrompt() {
      if (!alive) return;
      if (idx >= ROUNDS) return finish();
      target = seq[idx]; miss = 0; locked = false;
      $('gprog').textContent = (idx + 1) + ' / ' + ROUNDS;
      var kind = A.promptKind(target);
      $('gprompt').innerHTML = A.promptHTML(target, kind, 'Find the character');
      A.bindPromptSound(target, kind, function () { return alive && target === seq[idx]; });
      var visible = bubbles.filter(onScreen);
      var host = visible.length ? visible[Math.floor(Math.random() * visible.length)] : bubbles[0];
      bubbles.forEach(function (b) { if (b !== host && b.item.s === target.s) b.item = randomItem(shownChars().concat([target.s])); });
      host.item = target;
      bubbles.forEach(paint);
    }
    function tap(b) {
      if (locked || !alive) return;
      if (b.item === target) {
        locked = true; if (miss === 0) firstTry++;
        var r = b.el.getBoundingClientRect();
        b.el.classList.add('popping'); FX.ding();
        FX.confetti({ x: (r.left + r.width / 2) / window.innerWidth, y: (r.top + r.height / 2) / window.innerHeight, n: 30 });
        idx++;
        setTimeout(function () { if (!alive) return; place(b, false); nextPrompt(); }, 850);
      } else {
        miss++; FX.oops();
        b.el.classList.remove('wob'); void b.el.offsetWidth; b.el.classList.add('wob', 'nope');
        var p = $('gprompt'); if (p && !p.querySelector('.gtry')) p.insertAdjacentHTML('beforeend', '<div class="gtry">Not that one. Try another!</div>');
        setTimeout(function () { var g = p && p.querySelector('.gtry'); if (g) g.parentNode.removeChild(g); b.el.classList.remove('nope'); }, 1200);
      }
    }
    function frame(t) {
      if (!alive) return;
      var dt = last ? Math.min(0.05, (t - last) / 1000) : 0.016; last = t;
      bubbles.forEach(function (b) {
        if (!b.el.classList.contains('popping')) {
          b.x += b.vx * dt; b.y += b.vy * dt;
          if ((dir === 'up' && b.y < -size - 10) || (dir === 'down' && b.y > H + 10) || (dir === 'right' && b.x > W + 10)) place(b, false);
        }
        var w = Math.sin(t / 1000 * b.f + b.ph) * b.sway;
        b.el.style.transform = 'translate3d(' + (b.x + (dir === 'right' ? 0 : w)).toFixed(1) + 'px,' + (b.y + (dir === 'right' ? w : 0)).toFixed(1) + 'px,0)';
      });
      raf = requestAnimationFrame(frame);
    }
    function finish() {
      alive = false; cancelAnimationFrame(raf);
      var stars = firstTry >= 7 ? 3 : firstTry >= 5 ? 2 : 1;
      A.earn(2 + stars * 2);
      A.showWin({
        emoji: stars === 3 ? '🏆' : '🎉', title: cfg.done, accent: A.acc(lesson), stars: stars,
        lines: [firstTry + ' of ' + ROUNDS + ' on the first try. You earned ⭐ ' + (2 + stars * 2) + '!'],
        primary: { label: 'Play again', fn: function () { A.go('#/g/' + cfg.id + '/play'); } },
        secondary: { label: '🎮 Games', fn: function () { A.go('#/games'); } }
      });
    }
    A.onLeave(function () { alive = false; cancelAnimationFrame(raf); });
    nextPrompt();
    raf = requestAnimationFrame(frame);
  }
});
