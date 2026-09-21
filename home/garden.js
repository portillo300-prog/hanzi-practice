/* Garden + Shop: spend earned stars on emoji, then arrange them in "My Garden". */
(window.HANZI_MODS = window.HANZI_MODS || []).push(function (A) {
  'use strict';
  var FX = A.FX, $ = A.$, app = A.app, store = A.store;

  // emoji are drawn by the device (free, offline, always pretty). Only widely supported ones are used.
  var SHOP = [
    { cat: 'Flowers', items: [['🌸', 5, 'Cherry blossom'], ['🌷', 5, 'Tulip'], ['🌼', 5, 'Daisy'], ['🌾', 4, 'Grass'], ['🌹', 8, 'Rose'], ['🌻', 8, 'Sunflower'], ['🌺', 8, 'Hibiscus'], ['💐', 15, 'Bouquet']] },
    { cat: 'Plants', items: [['🌿', 4, 'Herb'], ['🍀', 6, 'Clover'], ['🌵', 6, 'Cactus'], ['🍄', 8, 'Mushroom'], ['🌲', 10, 'Pine tree'], ['🌴', 12, 'Palm tree'], ['🌳', 12, 'Tree']] },
    { cat: 'Animals', items: [['🐌', 8, 'Snail'], ['🐞', 10, 'Ladybug'], ['🐝', 12, 'Bee'], ['🦋', 15, 'Butterfly'], ['🐥', 15, 'Chick'], ['🐠', 15, 'Fish'], ['🐢', 18, 'Turtle'], ['🐰', 20, 'Bunny'], ['🐱', 20, 'Kitten'], ['🐶', 20, 'Puppy'], ['🐼', 25, 'Panda'], ['🦄', 40, 'Unicorn']] },
    { cat: 'Treats', items: [['🍓', 8, 'Strawberry'], ['🍉', 8, 'Watermelon'], ['🍭', 8, 'Lollipop'], ['🧁', 10, 'Cupcake'], ['🍦', 10, 'Ice cream'], ['🎂', 20, 'Cake']] },
    { cat: 'Sky & fun', items: [['☁️', 6, 'Cloud'], ['☀️', 10, 'Sun'], ['🎈', 10, 'Balloon'], ['🎀', 10, 'Ribbon'], ['🌙', 12, 'Moon'], ['🏮', 15, 'Lantern'], ['🌈', 20, 'Rainbow'], ['🏡', 30, 'Little house'], ['🎠', 40, 'Carousel']] }
  ];
  var SCENES = [
    { id: 'meadow', name: 'Sunny meadow', price: 0 },
    { id: 'blossom', name: 'Blossom sky', price: 30 },
    { id: 'sunset', name: 'Sunset', price: 25 },
    { id: 'night', name: 'Starry night', price: 25 },
    { id: 'ocean', name: 'Ocean', price: 30 }
  ];

  var G = store.get('garden', null) || { bg: 'meadow', bgs: ['meadow'], inv: [], next: 1 };
  function save() { store.set('garden', G); }
  function esc(s) { return A.esc(s); }

  A.tabs.push({ id: 'garden', icon: '🌸', label: 'Garden', href: '#/garden', order: 40 });
  A.routes.garden = function (p) { renderGarden(p[0] === 'shop' ? 'shop' : 'garden'); };

  function header(mode) {
    return '<div class="topbar"><span class="title gtitle">🌸 My Garden</span>' + A.walletPill() + '</div>' +
      '<div class="modebar"><div class="seg" role="group" aria-label="Garden or shop">' +
      '<button data-gm="garden" class="' + (mode === 'garden' ? 'on' : '') + '">🌷 My Garden</button>' +
      '<button data-gm="shop" class="' + (mode === 'shop' ? 'on' : '') + '">🛍️ Shop</button></div></div>';
  }
  function bindHeader() {
    Array.prototype.forEach.call(app.querySelectorAll('[data-gm]'), function (b) {
      b.onclick = function () { A.go(b.getAttribute('data-gm') === 'shop' ? '#/garden/shop' : '#/garden'); };
    });
  }

  /* ---------------- MY GARDEN ---------------- */
  var selected = null;
  function placedItems() { return G.inv.filter(function (i) { return i.placed; }); }
  function trayItems() { return G.inv.filter(function (i) { return !i.placed; }); }

  function sceneHTML() {
    var items = placedItems();
    return items.map(function (i) {
      return '<span class="gi' + (selected === i.id ? ' sel' : '') + '" data-id="' + i.id + '" style="left:' + i.x + '%;top:' + i.y + '%;z-index:' + Math.round(i.y) + '">' + i.e + '</span>';
    }).join('') + (items.length ? '' : '<div class="scene-empty">Your garden is waiting!<br><small>Earn ⭐ by practicing and playing, then visit the Shop 🛍️</small></div>');
  }
  function trayHTML() {
    var t = trayItems();
    if (!t.length) return '<div class="tray-empty">' + (G.inv.length ? 'Everything is in your garden. 🎉' : 'Things you buy wait here, ready to place.') + '</div>';
    return t.map(function (i) { return '<button class="tt" data-id="' + i.id + '" aria-label="Place ' + i.e + '">' + i.e + '</button>'; }).join('');
  }

  function renderGarden(mode) {
    if (mode === 'shop') return renderShop();
    selected = null;
    app.innerHTML =
      '<div class="screen has-tabs garden">' + header('garden') +
      '<div class="scene bg-' + G.bg + '" id="scene">' + sceneHTML() + '</div>' +
      '<div class="scenebar" id="scenebar"></div>' +
      '<div class="traytitle">My tray <small>tap to place</small></div><div class="tray" id="tray">' + trayHTML() + '</div>' +
      A.tabbar('garden') + '</div>';
    bindHeader();
    bindScene();
    bindTray();
  }

  function refreshScene() {
    var s = $('scene'); if (!s) return;
    s.innerHTML = sceneHTML(); bindScene();
    var t = $('tray'); if (t) { t.innerHTML = trayHTML(); bindTray(); }
    var bar = $('scenebar');
    if (bar) {
      var it = selected && G.inv.filter(function (i) { return i.id === selected; })[0];
      bar.innerHTML = it ? '<button class="btn" id="putaway">🧺 Put ' + it.e + ' back in the tray</button>' : '';
      if (it) $('putaway').onclick = function () { it.placed = false; selected = null; save(); refreshScene(); };
    }
  }

  function bindTray() {
    Array.prototype.forEach.call(app.querySelectorAll('.tt'), function (b) {
      b.onclick = function () {
        var id = parseInt(b.getAttribute('data-id'), 10);
        var it = G.inv.filter(function (i) { return i.id === id; })[0];
        if (!it) return;
        it.placed = true; it.x = 22 + Math.random() * 56; it.y = 30 + Math.random() * 45;
        selected = it.id; save(); FX.pop(); refreshScene();
      };
    });
  }

  function bindScene() {
    var scene = $('scene'); if (!scene) return;
    Array.prototype.forEach.call(scene.querySelectorAll('.gi'), function (el) {
      var id = parseInt(el.getAttribute('data-id'), 10);
      var it = G.inv.filter(function (i) { return i.id === id; })[0];
      var sx, sy, ox, oy, moved, down;
      el.onpointerdown = function (e) {
        e.preventDefault(); down = true; moved = false;
        try { el.setPointerCapture(e.pointerId); } catch (x) { /* ignore */ }
        sx = e.clientX; sy = e.clientY; ox = it.x; oy = it.y;
        el.classList.add('drag');
      };
      el.onpointermove = function (e) {
        if (!down) return;
        var r = scene.getBoundingClientRect();
        if (Math.abs(e.clientX - sx) + Math.abs(e.clientY - sy) > 6) moved = true;
        it.x = Math.max(5, Math.min(95, ox + (e.clientX - sx) / r.width * 100));
        it.y = Math.max(8, Math.min(94, oy + (e.clientY - sy) / r.height * 100));
        el.style.left = it.x + '%'; el.style.top = it.y + '%'; el.style.zIndex = 500;
      };
      el.onpointerup = el.onpointercancel = function () {
        if (!down) return; down = false; el.classList.remove('drag');
        if (!moved) { selected = selected === it.id ? null : it.id; FX.tink(); }
        save(); refreshScene();
      };
    });
  }

  /* ---------------- SHOP ---------------- */
  function renderShop() {
    var bal = A.wallet().bal;
    var scenes = '<div class="sh-cat"><div class="section-title">Scenes</div><div class="sgrid scenes">' + SCENES.map(function (s) {
      var owned = G.bgs.indexOf(s.id) >= 0;
      return '<button class="scard scene-card' + (owned ? ' owned' : '') + (!owned && bal < s.price ? ' cant' : '') + '" data-scene="' + s.id + '">' +
        '<span class="swatch bg-' + s.id + '"></span><span class="sn">' + esc(s.name) + '</span>' +
        '<span class="sp">' + (G.bg === s.id ? '✓ In use' : owned ? 'Use it' : '⭐ ' + s.price) + '</span></button>';
    }).join('') + '</div></div>';
    var cats = SHOP.map(function (c) {
      return '<div class="sh-cat"><div class="section-title">' + c.cat + '</div><div class="sgrid">' + c.items.map(function (it) {
        return '<button class="scard' + (bal < it[1] ? ' cant' : '') + '" data-e="' + it[0] + '" data-p="' + it[1] + '" data-n="' + esc(it[2]) + '"><span class="se">' + it[0] + '</span><span class="sp">⭐ ' + it[1] + '</span></button>';
      }).join('') + '</div></div>';
    }).join('');
    app.innerHTML = '<div class="screen has-tabs garden">' + header('shop') +
      '<p class="shophint">You have <b>⭐ <span class="wnum">' + bal + '</span></b>. Earn more by practicing, quizzes and games!</p>' + scenes + cats + A.tabbar('garden') + '</div>';
    bindHeader();
    Array.prototype.forEach.call(app.querySelectorAll('[data-e]'), function (b) {
      b.onclick = function () { confirmBuy({ e: b.getAttribute('data-e'), p: parseInt(b.getAttribute('data-p'), 10), n: b.getAttribute('data-n') }); };
    });
    Array.prototype.forEach.call(app.querySelectorAll('[data-scene]'), function (b) {
      b.onclick = function () { chooseScene(b.getAttribute('data-scene')); };
    });
  }

  function modal(html) {
    var old = document.querySelector('.modal'); if (old) old.parentNode.removeChild(old);
    var m = document.createElement('div'); m.className = 'modal'; m.innerHTML = '<div class="mcard">' + html + '</div>';
    document.body.appendChild(m);
    m.addEventListener('click', function (e) { if (e.target === m) close(); });
    function close() { if (m.parentNode) m.parentNode.removeChild(m); }
    return { el: m, close: close };
  }

  function confirmBuy(it) {
    var bal = A.wallet().bal;
    if (bal < it.p) {
      var m0 = modal('<div class="me">' + it.e + '</div><div class="mn">' + esc(it.n) + '</div><div class="mm">You need <b>' + (it.p - bal) + ' more ⭐</b>. Keep practicing and playing, you can do it!</div><div class="mb"><button class="btn primary" id="m-ok">OK</button></div>');
      $('m-ok').onclick = m0.close; return;
    }
    var m = modal('<div class="me">' + it.e + '</div><div class="mn">' + esc(it.n) + '</div><div class="mp">⭐ ' + it.p + '</div><div class="mm">You have ⭐ ' + bal + '</div>' +
      '<div class="mb"><button class="btn primary" id="m-buy">Buy it!</button><button class="btn" id="m-no">Not now</button></div>');
    $('m-no').onclick = m.close;
    $('m-buy').onclick = function () {
      if (!A.spend(it.p)) return;
      G.inv.push({ id: G.next++, e: it.e, placed: false, x: 50, y: 50 }); save();
      FX.ding(); FX.confetti({ x: 0.5, y: 0.5, n: 40 });
      m.el.querySelector('.mcard').innerHTML = '<div class="me pop-in">' + it.e + '</div><div class="mn">It\'s yours!</div><div class="mm">Waiting in your tray. Let\'s put it in your garden.</div>' +
        '<div class="mb"><button class="btn primary" id="m-go">🌷 Go to my garden</button><button class="btn" id="m-more">Keep shopping</button></div>';
      $('m-go').onclick = function () { m.close(); A.go('#/garden'); };
      $('m-more').onclick = function () { m.close(); renderShop(); };
    };
  }

  function chooseScene(id) {
    var s = SCENES.filter(function (x) { return x.id === id; })[0];
    if (G.bgs.indexOf(id) >= 0) { G.bg = id; save(); FX.pop(); renderShop(); return; }
    var bal = A.wallet().bal;
    if (bal < s.price) {
      var m0 = modal('<div class="swatch big bg-' + id + '"></div><div class="mn">' + esc(s.name) + '</div><div class="mm">You need <b>' + (s.price - bal) + ' more ⭐</b>. You can do it!</div><div class="mb"><button class="btn primary" id="m-ok">OK</button></div>');
      $('m-ok').onclick = m0.close; return;
    }
    var m = modal('<div class="swatch big bg-' + id + '"></div><div class="mn">' + esc(s.name) + '</div><div class="mp">⭐ ' + s.price + '</div><div class="mm">You have ⭐ ' + bal + '</div>' +
      '<div class="mb"><button class="btn primary" id="m-buy">Buy it!</button><button class="btn" id="m-no">Not now</button></div>');
    $('m-no').onclick = m.close;
    $('m-buy').onclick = function () {
      if (!A.spend(s.price)) return;
      G.bgs.push(id); G.bg = id; save(); FX.ding(); FX.confetti({ x: 0.5, y: 0.5, n: 40 });
      m.close(); renderShop();
    };
  }
});
