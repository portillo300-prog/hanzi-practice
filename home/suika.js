/* Family Jar (a merge game in the style of "Suika"): drop characters into the jar; two the same merge into the next family member,
   all the way up to 家 (family). Physics: Matter.js (MIT), bundled in vendor/. Save key: hanzi.jar. Classes: sk-. No game over screen of failure:
   when the jar is full the round simply ends with a kind message and the stars she earned. */
(window.HANZI_MODS = window.HANZI_MODS || []).push(function (A) {
  'use strict';
  if (!window.Matter) return;
  var M = window.Matter, FX = A.FX, app = A.app, store = A.store, esc = A.esc;

  // the family grows in this order (all from lesson 0, ending with 家)
  var ORDER = ['子', '弟', '妹', '姐', '哥', '妈', '爸', '奶', '爷', '家'];
  var EXTRA = { '家': { py: 'jia1', en: 'family, home', t: '家' }, '子': { py: 'zi3', en: 'child' } };
  var COLORS = ['#ffd6e0', '#ffe0b8', '#fff3b0', '#d9f5b8', '#b8f0e0', '#b8e3ff', '#d4c8ff', '#f3c6ff', '#ffc6c6', '#ffe58a'];
  var RADII = [17, 21, 26, 32, 39, 47, 56, 66, 77, 90];
  var W = 380, H = 520, DANGER = 96, SPAWN_Y = 44;
  var B = store.get('jar', null) || { best: 0, top: 0, plays: 0 };

  function info(lvl) {
    var s = ORDER[lvl], f = null;
    A.lessons.forEach(function (L) { L.characters.forEach(function (c) { if (c.s === s) f = c; }); });
    var x = f || EXTRA[s] || {};
    var base = EXTRA[s] || {};
    return { s: s, t: (f && f.t) || base.t || s, py: x.py || base.py, en: (base.en || (x.en || '')).split('(')[0].trim() };
  }
  function ch(lvl) { return A.script() === 't' ? info(lvl).t : ORDER[lvl]; }

  A.registerGame({ id: 'jar', name: 'Family Jar', icon: '🫙', tag: 'Merge the family: 子 → 家!', order: 38, earnText: 'earn up to ⭐ 25' }, function (p) {
    if (p[0] === 'play') return play();
    intro();
  });

  function intro() {
    app.innerHTML =
      '<div class="screen">' +
      '<div class="topbar"><button class="btn" data-go="#/games">‹ Games</button><span class="tools">' + A.scriptToggle() + '</span>' + A.walletPill() + '</div>' +
      '<div class="hero small"><div class="bigemoji">🫙</div><h1 class="gh">Family Jar</h1>' +
      '<p class="shophint">Drop family members into the jar. When <b>two the same</b> touch, they grow into the next one! Can you reach <b>家</b>, the whole family?</p></div>' +
      '<div class="sk-chain">' + ORDER.map(function (s, i) {
        var f = info(i), seen = B.top >= i;
        return '<span class="sk-cc' + (seen ? ' on' : '') + '" style="--sk:' + COLORS[i] + '"><b>' + esc(seen ? ch(i) : '?') + '</b><small>' + esc(seen ? f.en : '') + '</small></span>';
      }).join('<span class="sk-arrow">›</span>') + '</div>' +
      '<p class="shophint">Best score: <b>' + B.best + '</b></p>' +
      '<div class="startrow"><button class="btn primary big" id="skstart">▶ Start</button></div></div>';
    A.bindTop(intro);
    document.getElementById('skstart').onclick = function () { FX.pop(); A.go('#/g/jar/play'); };
  }

  var G = null;
  function stop() {
    if (!G) return;
    G.stopped = true; cancelAnimationFrame(G.raf); G.raf = 0;
    document.removeEventListener('visibilitychange', G.vis);
    try { M.World.clear(G.engine.world, false); M.Engine.clear(G.engine); } catch (e) { /* ignore */ }
    G = null;
  }

  function play() {
    stop();
    app.innerHTML =
      '<div class="game sk-game">' +
      '<div class="topbar"><button class="btn" id="skquit">✕ Quit</button><span class="title"><span id="skscore">0</span> ⭐pts</span><span class="tools">' + A.soundBtn() + '</span></div>' +
      '<div class="sk-top"><div class="sk-next"><small>Next</small><span id="sknext" class="sk-nx"></span></div><div class="sk-msg" id="skmsg">Drag to aim, let go to drop!</div></div>' +
      '<div class="sk-wrap" id="skwrap"><canvas id="skcv"></canvas></div></div>';
    A.bindTop(function () { /* nothing to redraw */ });
    var cv = document.getElementById('skcv'), ctx = cv.getContext('2d');
    var engine = M.Engine.create({ gravity: { x: 0, y: 1.1 } });
    var st = { engine: engine, score: 0, bodies: [], aimX: W / 2, ready: true, nextLvl: 0, curLvl: 0, last: 0, pops: [], over: false, maxLvl: 0, drops: 0, merges: 0, vis: null, raf: 0, stopped: false, dangerT: 0, lastSay: 0 };
    G = st;
    // walls
    var t = 60;
    M.World.add(engine.world, [
      M.Bodies.rectangle(W / 2, H + t / 2, W + 2 * t, t, { isStatic: true, label: 'wall' }),
      M.Bodies.rectangle(-t / 2, H / 2, t, H * 3, { isStatic: true, label: 'wall' }),
      M.Bodies.rectangle(W + t / 2, H / 2, t, H * 3, { isStatic: true, label: 'wall' })
    ]);
    function pickLvl() { var r = Math.random(); return r < .38 ? 0 : r < .68 ? 1 : r < .9 ? 2 : 3; }
    st.curLvl = pickLvl(); st.nextLvl = pickLvl();
    function showNext() { var e = document.getElementById('sknext'); if (e) e.innerHTML = '<b>' + esc(ch(st.nextLvl)) + '</b>'; }
    showNext();
    function msg(m) { var e = document.getElementById('skmsg'); if (e) e.textContent = m; }
    function sync() { var e = document.getElementById('skscore'); if (e) e.textContent = st.score; }

    function fit() {   // scale the whole jar to the space available (logical size stays W x H, so physics never depends on the screen)
      var wrap = document.getElementById('skwrap'); if (!wrap) return;
      var bw = wrap.clientWidth, bh = wrap.clientHeight; if (!bw || !bh) return;
      var s = Math.min(bw / W, bh / H), dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.style.width = Math.floor(W * s) + 'px'; cv.style.height = Math.floor(H * s) + 'px';
      cv.width = Math.floor(W * s * dpr); cv.height = Math.floor(H * s * dpr);
      st.k = cv.width / W;
    }
    fit();
    var onResize = function () { fit(); };
    window.addEventListener('resize', onResize);
    var prevLeave = function () { window.removeEventListener('resize', onResize); stop(); };
    A.onLeave(prevLeave);

    function pos(e) { var r = cv.getBoundingClientRect(); return (e.clientX - r.left) / r.width * W; }
    function clampX(x, lvl) { var r = RADII[lvl]; return Math.max(r + 4, Math.min(W - r - 4, x)); }
    cv.style.touchAction = 'none';
    cv.addEventListener('pointerdown', function (e) { st.aimX = clampX(pos(e), st.curLvl); st.down = true; try { cv.setPointerCapture(e.pointerId); } catch (x) { /* ignore */ } });
    cv.addEventListener('pointermove', function (e) { if (st.down) st.aimX = clampX(pos(e), st.curLvl); });
    cv.addEventListener('pointerup', function (e) { if (!st.down) return; st.down = false; st.aimX = clampX(pos(e), st.curLvl); drop(); });
    cv.addEventListener('pointercancel', function () { st.down = false; });

    function mk(lvl, x, y) {
      var b = M.Bodies.circle(x, y, RADII[lvl], { restitution: .15, friction: .08, frictionAir: .004, label: 'p', density: .0012 });
      b.lvl = lvl; b.born = performance.now(); st.bodies.push(b); M.World.add(engine.world, b); return b;
    }
    function drop() {
      if (!st.ready || st.over) return;
      st.ready = false; st.drops++;
      mk(st.curLvl, st.aimX, SPAWN_Y);
      FX.tink();
      setTimeout(function () {
        if (st.stopped) return;
        st.curLvl = st.nextLvl; st.nextLvl = pickLvl(); st.aimX = clampX(st.aimX, st.curLvl); showNext(); st.ready = true;
      }, 520);
    }

    M.Events.on(engine, 'collisionStart', function (ev) {
      ev.pairs.forEach(function (pr) {
        var a = pr.bodyA, b = pr.bodyB;
        if (a.label !== 'p' || b.label !== 'p' || a.gone || b.gone || a.lvl !== b.lvl) return;
        a.gone = b.gone = true;
        var x = (a.position.x + b.position.x) / 2, y = (a.position.y + b.position.y) / 2, lvl = a.lvl;
        M.World.remove(engine.world, a); M.World.remove(engine.world, b);
        st.bodies = st.bodies.filter(function (o) { return !o.gone; });
        st.merges++;
        st.pops.push({ x: x, y: y, r: RADII[lvl], t: 0, c: COLORS[lvl] });
        if (lvl + 1 < ORDER.length) {
          var n = mk(lvl + 1, x, y); n.born = performance.now() - 2000;   // a new piece may rest above the line right away
          st.score += (lvl + 1) * (lvl + 2);
          if (lvl + 1 > st.maxLvl) {
            st.maxLvl = lvl + 1;
            var f = info(lvl + 1);
            msg(ch(lvl + 1) + '  ' + (f.py ? A.pinyinText(f.py) : '') + ' · ' + f.en + '!');
            if (performance.now() - st.lastSay > 700) { st.lastSay = performance.now(); A.say({ s: ORDER[lvl + 1] }, false, true); }
            FX.ding();
          } else FX.pop();
        } else {    // two 家: the whole family is together!
          st.score += 200; FX.fanfare(); FX.confetti({ kind: 'big' }); msg('Wow! The whole family is together! 🎉');
        }
        sync();
      });
    });

    function draw() {
      var k = st.k || 1;
      ctx.setTransform(k, 0, 0, k, 0, 0);
      ctx.clearRect(0, 0, W, H);
      // jar
      var g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, A.cssVar('--arena-a') || '#eaf6ff'); g.addColorStop(1, A.cssVar('--arena-b') || '#fff3e0');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = 'rgba(255,80,110,.55)'; ctx.setLineDash([8, 8]); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, DANGER); ctx.lineTo(W, DANGER); ctx.stroke(); ctx.setLineDash([]);
      // aim guide + preview piece
      if (st.ready && !st.over) {
        ctx.strokeStyle = 'rgba(120,120,120,.35)'; ctx.setLineDash([4, 8]); ctx.beginPath(); ctx.moveTo(st.aimX, SPAWN_Y + RADII[st.curLvl]); ctx.lineTo(st.aimX, H); ctx.stroke(); ctx.setLineDash([]);
        piece(st.curLvl, st.aimX, SPAWN_Y, 0, .95);
      }
      st.bodies.forEach(function (b) { piece(b.lvl, b.position.x, b.position.y, b.angle, 1); });
      st.pops = st.pops.filter(function (p) { return p.t < 1; });
      st.pops.forEach(function (p) {
        ctx.globalAlpha = 1 - p.t; ctx.strokeStyle = p.c; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(p.x, p.y, p.r * (1 + p.t * .9), 0, Math.PI * 2); ctx.stroke(); ctx.globalAlpha = 1;
      });
    }
    function piece(lvl, x, y, ang, alpha) {
      var r = RADII[lvl];
      ctx.save(); ctx.globalAlpha = alpha; ctx.translate(x, y);
      ctx.fillStyle = COLORS[lvl]; ctx.strokeStyle = 'rgba(70,50,60,.35)'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#4a2f3c'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.font = '600 ' + Math.round(r * 1.15) + 'px -apple-system, "PingFang SC", "PingFang TC", "Hiragino Sans GB", "Noto Sans CJK SC", sans-serif';
      ctx.fillText(ch(lvl), 0, r * .06);
      ctx.restore();
    }

    function finish() {
      if (st.over) return; st.over = true;
      var stars = Math.min(20, Math.floor(st.score / 40)) + Math.floor(st.maxLvl / 2);   // about 8-25 per round, in line with the other games
      var newBest = st.score > B.best;
      if (newBest) B.best = st.score;
      if (st.maxLvl > B.top) B.top = st.maxLvl;
      B.plays++; store.set('jar', B);
      if (stars > 0) A.earn(stars);
      var top = info(st.maxLvl);
      A.showWin({
        emoji: st.maxLvl >= 9 ? '🏆' : '🫙', title: 'The jar is full!', accent: A.cssVar('--accent'), stars: st.maxLvl >= 7 ? 3 : st.maxLvl >= 4 ? 2 : 1,
        lines: ['Score: ' + st.score + (newBest ? ' — a new best! 🎉' : ''), 'Biggest family member: ' + ch(st.maxLvl) + ' (' + top.en + ')', '+' + stars + ' ⭐'],
        primary: { label: '▶ Play again', fn: function () { play(); } },
        secondary: { label: 'Back to games', fn: function () { A.go('#/games'); } }
      });
    }

    function frame(now) {
      if (st.stopped) return;
      var dt = Math.min(34, now - (st.last || now)); st.last = now;
      if (!st.over) {
        M.Engine.update(engine, dt / 2); M.Engine.update(engine, dt / 2);
        // the jar is "full" when a settled piece stays above the red line for 2.5 seconds
        var over = st.bodies.some(function (b) { return now - b.born > 1500 && b.position.y - RADII[b.lvl] < DANGER && Math.abs(b.velocity.y) < .6; });
        st.dangerT = over ? st.dangerT + dt : 0;
        if (st.dangerT > 2500) finish();
        st.pops.forEach(function (p) { p.t += dt / 450; });
      }
      draw();
      st.raf = requestAnimationFrame(frame);
    }
    st.vis = function () { if (document.hidden) { cancelAnimationFrame(st.raf); } else { st.last = 0; st.raf = requestAnimationFrame(frame); } };
    document.addEventListener('visibilitychange', st.vis);
    document.getElementById('skquit').onclick = function () { stop(); A.go('#/games'); };
    st.raf = requestAnimationFrame(frame);
    // QA helper (only with ?qa=1 in the address): fills the jar so the end-of-round screen can be checked
    if (/[?&]qa=1/.test(location.search)) window.__jarQA = { fill: function () { for (var i = 0; i < 14; i++) mk(5 + (i % 3), 60 + (i * 53) % 260, 20 + i * 8); }, state: st };
  }
});
