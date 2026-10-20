/* Garden + Shop: spend earned stars on emoji, then arrange them in "My Garden". */
(window.HANZI_MODS = window.HANZI_MODS || []).push(function (A) {
  'use strict';
  var FX = A.FX, $ = A.$, app = A.app, store = A.store;

  // emoji are drawn by the device (free, offline, always pretty). Only widely supported ones are used.
  var SHOP = [
    { cat: 'Flowers', items: [['🌾', 4, 'Grass'], ['🌱', 4, 'Seedling'], ['🌷', 5, 'Tulip'], ['🌼', 5, 'Daisy'], ['🌸', 6, 'Cherry blossom'], ['🌹', 8, 'Rose'], ['🌻', 8, 'Sunflower'], ['🌺', 8, 'Hibiscus'], ['💮', 10, 'White flower'], ['🏵️', 12, 'Rosette'], ['💐', 15, 'Bouquet']] },
    { cat: 'Plants', items: [['🍃', 8, 'Leaves'], ['🌿', 8, 'Herb'], ['🍀', 10, 'Clover'], ['🌵', 10, 'Cactus'], ['🍁', 10, 'Maple leaf'], ['🍄', 12, 'Mushroom'], ['🌲', 14, 'Pine tree'], ['🎍', 14, 'Bamboo'], ['🌴', 16, 'Palm tree'], ['🌳', 16, 'Tree'], ['🎋', 18, 'Wish tree']] },
    { cat: 'Animals', items: [['🐌', 12, 'Snail'], ['🐞', 14, 'Ladybug'], ['🐝', 16, 'Bee'], ['🐸', 18, 'Frog'], ['🦋', 20, 'Butterfly'], ['🐥', 20, 'Chick'], ['🐠', 20, 'Fish'], ['🦆', 22, 'Duck'], ['🐢', 24, 'Turtle'], ['🐷', 25, 'Piglet'], ['🐰', 28, 'Bunny'], ['🐱', 28, 'Kitten'], ['🐶', 28, 'Puppy'], ['🦀', 26, 'Crab'], ['🐧', 30, 'Penguin'], ['🦔', 30, 'Hedgehog'], ['🐨', 32, 'Koala'], ['🦉', 30, 'Owl'], ['🐙', 34, 'Octopus'], ['🐻', 35, 'Bear'], ['🦊', 35, 'Fox'], ['🐼', 40, 'Panda'], ['🐬', 40, 'Dolphin'], ['🐴', 40, 'Pony'], ['🦁', 45, 'Lion'], ['🦄', 50, 'Unicorn']] },
    { cat: 'Treats', items: [['🍎', 12, 'Apple'], ['🍓', 12, 'Strawberry'], ['🍉', 12, 'Watermelon'], ['🍭', 12, 'Lollipop'], ['🍒', 14, 'Cherries'], ['🍪', 14, 'Cookie'], ['🧁', 16, 'Cupcake'], ['🍦', 16, 'Ice cream'], ['🍩', 16, 'Donut'], ['🍫', 16, 'Chocolate'], ['🍰', 24, 'Shortcake'], ['🎂', 30, 'Birthday cake']] },
    { cat: 'Sky & fun', items: [['☁️', 10, 'Cloud'], ['✨', 14, 'Sparkles'], ['☀️', 16, 'Sun'], ['🎈', 16, 'Balloon'], ['🎀', 16, 'Ribbon'], ['🌙', 20, 'Moon'], ['🏮', 22, 'Lantern'], ['🌟', 24, 'Glowing star'], ['🎁', 26, 'Present'], ['🎨', 26, 'Paint palette'], ['🌈', 30, 'Rainbow'], ['🚗', 30, 'Little car'], ['🚂', 34, 'Train'], ['⛲', 38, 'Fountain'], ['🏡', 45, 'Little house'], ['🚀', 45, 'Rocket'], ['🎪', 50, 'Circus tent'], ['🎠', 55, 'Carousel'], ['🎡', 60, 'Ferris wheel']] }
  ];
  SHOP.unshift({ cat: 'Houses & buildings', items: [['⛺', 40, 'Tent', 1], ['🏠', 50, 'House', 1], ['🏫', 70, 'School', 1], ['🏰', 90, 'Castle', 1], ['🏯', 100, 'Pagoda', 1]] });
  SHOP.push({ cat: 'Pet corner', items: [['🦴', 10, 'Bone'], ['🥣', 12, 'Food bowl'], ['⚽', 16, 'Soccer ball'], ['🎾', 16, 'Tennis ball'], ['🧸', 24, 'Teddy bear'], ['🛏️', 30, 'Cozy bed', 1]] });
  SHOP.push({ cat: 'Chinese corner', items: [['🧧', 25, 'Red envelope'], ['🥟', 20, 'Dumpling'], ['🍵', 25, 'Tea'], ['🐉', 90, 'Dragon', 1], ['🎎', 40, 'Dolls']] });
  var BIG = { '🏡': true, '🐼': true };   // existing items that look better bigger
   SHOP.forEach(function (c) { c.items.forEach(function (it) { if (it[3]) BIG[it[0]] = true; }); });
  var SCENES = [
    { id: 'meadow', name: 'Sunny meadow', price: 0 },
    { id: 'blossom', name: 'Blossom sky', price: 40 },
    { id: 'sunset', name: 'Sunset', price: 35 },
    { id: 'night', name: 'Starry night', price: 35 },
    { id: 'ocean', name: 'Ocean', price: 40 }
  ];

  var G = store.get('garden', null) || { bg: 'meadow', bgs: ['meadow'], inv: [], next: 1 };
  function save() { store.set('garden', G); }
  function esc(s) { return A.esc(s); }

  A.tabs.push({ id: 'garden', icon: '🌍', label: 'World', href: '#/garden', order: 40 });
  A.routes.garden = function (p) { renderGarden(p[0] === 'shop' ? 'shop' : 'garden'); };

  function header(mode) {
    return '<div class="topbar"><span class="title gtitle">🌍 My World</span>' + A.walletPill() + '</div>' +
      '<div class="modebar"><div class="seg" role="group" aria-label="Garden or shop">' +
      '<button data-gm="garden" class="' + (mode === 'garden' ? 'on' : '') + '">🌷 My World</button>' +
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
      return '<span class="gi' + (BIG[i.e] ? ' big' : '') + (selected === i.id ? ' sel' : '') + '" data-id="' + i.id + '" style="left:' + i.x + '%;top:' + i.y + '%;z-index:' + Math.round(i.y) + '">' + i.e + '</span>';
    }).join('') + (items.length ? '' : '<div class="scene-empty">Your garden is waiting!<br><small>Earn ⭐ by practicing and playing, then visit the Shop 🛍️</small></div>');
  }
  function trayHTML() {
    var t = trayItems();
    if (!t.length) return '<div class="tray-empty">' + (G.inv.length ? 'Everything is in your garden. 🎉' : 'Things you buy wait here, ready to place.') + '</div>';
    return t.map(function (i) { return '<button class="tt" data-id="' + i.id + '" aria-label="Place ' + i.e + '">' + i.e + '</button>'; }).join('');
  }

  /* ---- the pet walks around the world; tap it to say hi ---- */
  function petHTML() {
    var d = A.petDog && A.petDog(); if (!d) return '';
    return '<div class="gpet" id="gpet" aria-label="' + esc(d.name) + '"><div class="gpet-in">' + A.petSVG(d.color) + '</div><div class="gpet-say" id="gpetsay" hidden></div></div>';
  }
  function bindPet() {
    var el = $('gpet'); if (!el) return;
    el.onclick = function () {
      el.classList.remove('pt-r-wiggle'); void el.offsetWidth; el.classList.add('pt-r-wiggle'); FX.pop();
      var b = $('gpetsay'); if (b) { b.innerHTML = '<b>汪汪</b>'; b.hidden = false; setTimeout(function () { b.hidden = true; el.classList.remove('pt-r-wiggle'); }, 1500); }
    };
  }
  /* ---- the world grows: every 10 things placed is a milestone ---- */
  function worldBar() {
    var n = placedItems().length, lv = 1 + Math.floor(n / 10), into = n % 10;
    return '<div class="worldbar" id="worldbar"><span>🌍 World level <b>' + lv + '</b></span><span class="wbar"><i style="width:' + (into * 10) + '%"></i></span><small>' + (10 - into) + ' more to level ' + (lv + 1) + '</small></div>';
  }
  function checkMilestone() {
    var n = placedItems().length, lv = Math.floor(n / 10);
    if (lv > (G.mile || 0)) { G.mile = lv; save(); A.earn(25); FX.fanfare(); FX.confetti({ kind: 'big' }); A.toast('🌍 Your world reached level ' + (lv + 1) + '!'); }
  }

  function renderGarden(mode) {
    if (mode === 'shop') return renderShop();
    selected = null;
    app.innerHTML =
      '<div class="screen has-tabs garden">' + header('garden') +
      '<div class="scene bg-' + G.bg + '" id="scene"><div class="sitems" id="sitems">' + sceneHTML() + '</div>' + petHTML() + '</div>' +
      worldBar() +
      '<div class="scenebar" id="scenebar"></div>' +
      '<div class="traytitle">My tray <small>tap to place</small></div><div class="tray" id="tray">' + trayHTML() + '</div>' +
      A.tabbar('garden') + '</div>';
    bindHeader();
    bindScene();
    bindTray();
    bindPet();
  }

  function refreshScene() {
    var s = $('scene'); if (!s) return;
    $('sitems').innerHTML = sceneHTML(); bindScene(); var wb = $('worldbar'); if (wb) wb.outerHTML = worldBar();
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
        selected = it.id; save(); FX.pop(); refreshScene(); checkMilestone();
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
      return '<button class="scard scene-card' + (owned ? ' owned' : '') + (!owned && !A.canAfford(s.price) ? ' cant' : '') + '" data-scene="' + s.id + '">' +
        '<span class="swatch bg-' + s.id + '"></span><span class="sn">' + esc(s.name) + '</span>' +
        '<span class="sp">' + (G.bg === s.id ? '✓ In use' : owned ? 'Use it' : '⭐ ' + s.price) + '</span></button>';
    }).join('') + '</div></div>';
    var cats = SHOP.map(function (c) {
      return '<div class="sh-cat"><div class="section-title">' + c.cat + '</div><div class="sgrid">' + c.items.map(function (it) {
        return '<button class="scard' + (!A.canAfford(it[1]) ? ' cant' : '') + '" data-e="' + it[0] + '" data-p="' + it[1] + '" data-n="' + esc(it[2]) + '"><span class="se">' + it[0] + '</span><span class="sp">⭐ ' + it[1] + '</span></button>';
      }).join('') + '</div></div>';
    }).join('');
    app.innerHTML = '<div class="screen has-tabs garden">' + header('shop') +
      '<p class="shophint">You have <b>⭐ <span class="wnum">' + bal + '</span></b> and <b>🌟 <span class="gnum">' + A.wallet().gold + '</span></b> (each 🌟 counts as ' + A.goldWorth + ' ⭐). Earn more by practicing, reading and games!</p>' + A.swapButton() + scenes + cats + A.tabbar('garden') + '</div>';
    bindHeader(); A.bindSwap(app, renderShop);
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
  A.modal = modal;
  // exchange: swap super stars 🌟 for regular stars ⭐ (shown on the shop and pet pages)
  A.swapButton = function () { return '<div class="swaprow"><button class="btn" data-swap="1">🔁 Swap 🌟 for ⭐</button></div>'; };
  A.bindSwap = function (root, after) {
    Array.prototype.forEach.call((root || app).querySelectorAll('[data-swap]'), function (b) { b.onclick = function () { A.openExchange(after); }; });
  };
  A.openExchange = function (after) {
    var g = A.wallet().gold, w = A.goldWorth;
    var m = modal('<div class="me">🔁</div><div class="mn">Swap super stars</div><div class="mm">You have <b>🌟 ' + g + '</b>. Each 🌟 swaps for <b>⭐ ' + w + '</b>.</div>' +
      '<div class="mb">' + (g > 0 ? '<button class="btn primary" id="x-one">Swap 1 🌟 → ⭐ ' + w + '</button>' : '') + (g > 1 ? '<button class="btn" id="x-all">Swap all ' + g + ' 🌟 → ⭐ ' + (g * w) + '</button>' : '') + '<button class="btn" id="x-no">' + (g > 0 ? 'Not now' : 'OK') + '</button></div>');
    function done(n) { if (A.exchangeGold(n)) { FX.ding(); FX.confetti({ x: 0.5, y: 0.5, n: 40 }); } m.close(); if (after) after(); }
    if ($('x-one')) $('x-one').onclick = function () { done(1); };
    if ($('x-all')) $('x-all').onclick = function () { done(A.wallet().gold); };
    $('x-no').onclick = m.close;
  };

  function confirmBuy(it) {
    var bal = A.wallet().bal + A.wallet().gold * A.goldWorth;
    if (!A.canAfford(it.p)) {
      var m0 = modal('<div class="me">' + it.e + '</div><div class="mn">' + esc(it.n) + '</div><div class="mm">You need <b>' + (it.p - bal) + ' more ⭐</b>. Keep practicing and playing, you can do it!</div><div class="mb"><button class="btn primary" id="m-ok">OK</button></div>');
      $('m-ok').onclick = m0.close; return;
    }
    var m = modal('<div class="me">' + it.e + '</div><div class="mn">' + esc(it.n) + '</div><div class="mp">⭐ ' + it.p + '</div><div class="mm">You have ⭐ ' + bal + '</div>' +
      '<div class="mb"><button class="btn primary" id="m-buy">Buy it!</button><button class="btn" id="m-no">Not now</button></div>');
    $('m-no').onclick = m.close;
    $('m-buy').onclick = function () {
      if (!A.spendMixed(it.p)) return;
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
    var bal = A.wallet().bal + A.wallet().gold * A.goldWorth;
    if (!A.canAfford(s.price)) {
      var m0 = modal('<div class="swatch big bg-' + id + '"></div><div class="mn">' + esc(s.name) + '</div><div class="mm">You need <b>' + (s.price - bal) + ' more ⭐</b>. You can do it!</div><div class="mb"><button class="btn primary" id="m-ok">OK</button></div>');
      $('m-ok').onclick = m0.close; return;
    }
    var m = modal('<div class="swatch big bg-' + id + '"></div><div class="mn">' + esc(s.name) + '</div><div class="mp">⭐ ' + s.price + '</div><div class="mm">You have ⭐ ' + bal + '</div>' +
      '<div class="mb"><button class="btn primary" id="m-buy">Buy it!</button><button class="btn" id="m-no">Not now</button></div>');
    $('m-no').onclick = m.close;
    $('m-buy').onclick = function () {
      if (!A.spendMixed(s.price)) return;
      G.bgs.push(id); G.bg = id; save(); FX.ding(); FX.confetti({ x: 0.5, y: 0.5, n: 40 });
      m.close(); renderShop();
    };
  }
});
