/* Pet: an animated pomeranian. Readings earn kibble (🥣) that keeps it fed; stars buy treats that make it dance, jump and spin;
   a big saving goal lets her adopt more dogs. No fail states: the dog is never sad, only cheerfully "hungry".
   Save key: hanzi.pet. All CSS classes start with pt-. */
(window.HANZI_MODS = window.HANZI_MODS || []).push(function (A) {
  'use strict';
  var FX = A.FX, app = A.app, store = A.store;
  function esc(s) { return A.esc(s); }

  /* ---------------- the dogs (same chibi shape, different fur) ---------------- */
  var PETS = {
    sunset: { name: 'Sunset orange', fur: '#e8832e', dark: '#d26d1a', chest: '#fff0d8', mask: '#ffd9a8', ear: '#ffb0a0', blush: '#ff8f7a', price: 150 },
    honey:  { name: 'Honey cream',   fur: '#eec88a', dark: '#dcae68', chest: '#fff6e6', mask: '#fbe6c4', ear: '#ffb7a8', blush: '#ff9d8a', price: 150 },
    choco:  { name: 'Chocolate',     fur: '#8a5a3c', dark: '#6f452b', chest: '#f3dcc0', mask: '#e0b78e', ear: '#e8a79a', blush: '#f09a88', price: 150 },
    black:  { name: 'Black and tan', fur: '#4a3a38', dark: '#362a28', chest: '#f0d2a8', mask: '#d9a066', ear: '#c98a8a', blush: '#e8907e', price: 150 },
    snow:   { name: 'Snow white',    fur: '#ffffff', dark: '#e3e8f0', chest: '#f7f9fc', mask: '#f1f3f8', ear: '#ffc2d1', blush: '#ffa3b8', price: 250 },
    candy:  { name: 'Cotton candy',  fur: '#f7a8d0', dark: '#e98fbd', chest: '#fff0f7', mask: '#ffd6ea', ear: '#ffc2de', blush: '#ff8fb8', price: 350 },
    catorange: { kind: 'cat', name: 'Orange tabby cat', fur: '#f0a458', dark: '#d9803a', chest: '#fff1dc', stripe: '#c8702a', ear: '#ffb3b3', iris: '#8bd17c', price: 150 },
    catgray:   { kind: 'cat', name: 'Gray cat', fur: '#aab3bd', dark: '#8d97a3', chest: '#eef1f4', stripe: '#7d8793', ear: '#ffc0c8', iris: '#ffcf5a', price: 200 },
    catblack:  { kind: 'cat', name: 'Black cat', fur: '#3d3d48', dark: '#2a2a33', chest: '#4d4d59', stripe: null, ear: '#c98a98', iris: '#ffe066', price: 200 },
    koala:     { kind: 'koala', name: 'Koala', fur: '#a9b0b8', dark: '#8b929b', chest: '#eef0f2', ear: '#ffd3dc', price: 250 },
    panda:     { kind: 'panda', name: 'Panda', fur: '#ffffff', price: 400 },
    uniwhite:  { kind: 'unicorn', name: 'White unicorn', fur: '#ffffff', dark: '#e6dff2', chest: '#fff4fa', ear: '#ffc6dd', mane: ['#ff9ec4', '#ffc27a', '#fff08a', '#9ee6b0', '#8fd0ff', '#c4a6ff'], price: 500 },
    unililac:  { kind: 'unicorn', name: 'Lilac unicorn', fur: '#e9dcff', dark: '#cdb8f2', chest: '#f7f0ff', ear: '#ffc6dd', mane: ['#ff9ec4', '#ffc27a', '#fff08a', '#9ee6b0', '#8fd0ff', '#c4a6ff'], price: 600 }
  };
  var COLORS = PETS;
  var SECTIONS = [{ title: '🐶 Dogs', keys: ['sunset', 'honey', 'choco', 'black', 'snow', 'candy'] }, { title: '🐱 Cats', keys: ['catorange', 'catgray', 'catblack'] },
                  { title: '🐨 Special friends', keys: ['koala', 'panda', 'uniwhite', 'unililac'] }];
  var ORDER = SECTIONS.reduce(function (a, x) { return a.concat(x.keys); }, []);
  var STARTERS = ['sunset', 'honey', 'choco'];     // the free first pets are dogs
  var NAMES = ['Mochi', 'Bao', 'Dumpling', 'Peach', 'Biscuit', 'Boba', 'Pudding', 'Nugget', 'Sesame', 'Mango', 'Cookie', 'Panda'];

  /* ---------------- foods: kibble comes from readings; treats are bought with stars; each treat gets its own trick ---------------- */
  var FOODS = [
    { id: 'carrot', e: '🥕', name: 'Carrot', price: 5, trick: 'wiggle', full: 8, love: 2 },
    { id: 'bone', e: '🦴', name: 'Bone', price: 8, trick: 'chew', full: 10, love: 3 },
    { id: 'sausage', e: '🌭', name: 'Sausage', price: 15, trick: 'spin', full: 12, love: 4 },
    { id: 'drumstick', e: '🍗', name: 'Drumstick', price: 20, trick: 'dance', full: 12, love: 5 },
    { id: 'steak', e: '🥩', name: 'Steak', price: 30, trick: 'jump', full: 15, love: 6 },
    { id: 'cupcake', e: '🧁', name: 'Pup-cake', price: 45, trick: 'party', full: 10, love: 8 },
    { id: 'cake', e: '🍰', name: 'Cake', price: 60, trick: 'flip', full: 10, love: 10 }
  ];
  var SPECIAL = {
    cat: { id: 'fish', e: '🐟', name: 'Fish', price: 25, trick: 'dance', full: 12, love: 8, fav: 'cat' },
    koala: { id: 'eucalyptus', e: '🌿', name: 'Eucalyptus', price: 30, trick: 'spin', full: 12, love: 9, fav: 'koala' },
    panda: { id: 'bamboo', e: '🎋', name: 'Bamboo', price: 35, trick: 'jump', full: 14, love: 10, fav: 'panda' },
    unicorn: { id: 'rainbow', e: '🌈', name: 'Rainbow treat', price: 60, trick: 'flip', full: 10, love: 14, fav: 'unicorn' }
  };
  var SPECIALS = Object.keys(SPECIAL).map(function (k) { return SPECIAL[k]; });
  var ALLFOODS = FOODS.concat(SPECIALS);
  function kindOf(d) { var c = PETS[d && d.color]; return (c && c.kind) || 'dog'; }
  function foodById(id) { return ALLFOODS.filter(function (f) { return f.id === id; })[0]; }
  var KIBBLE = { id: 'kibble', e: '🥣', name: 'Kibble', trick: 'chew', full: 30, love: 1 };

  /* little Chinese the dog "says" (flavor words, shown with pinyin) */
  var SAY = {
    woof: { s: '汪汪', t: '汪汪', py: 'wang1 wang1', en: 'woof woof' },
    meow: { s: '喵喵', t: '喵喵', py: 'miao1 miao1', en: 'meow meow' },
    hello: { s: '你好', t: '你好', py: 'ni3 hao3', en: 'hello' },
    yum: { s: '好吃', t: '好吃', py: 'hao3 chi1', en: 'yummy' },
    hungry: { s: '好饿', t: '好餓', py: 'hao3 e4', en: 'so hungry' },
    thanks: { s: '谢谢', t: '謝謝', py: 'xie4 xie5', en: 'thank you' },
    love: { s: '我爱你', t: '我愛你', py: 'wo3 ai4 ni3', en: 'I love you' }
  };

  /* ---------------- saved state ---------------- */
  var P = store.get('pet', null) || { dogs: [], cur: null, kibble: 0, stock: {}, goal: null, next: 1 };
  function save() { store.set('pet', P); }
  function dog() { return P.dogs.filter(function (d) { return d.id === P.cur; })[0] || P.dogs[0] || null; }
  // fullness drifts down slowly while she is away, but never below 20 (the pup is never in trouble)
  function refresh(d) {
    var now = Date.now(), hours = Math.max(0, (now - (d.t || now)) / 3600000);
    d.full = Math.max(20, Math.min(100, (d.full == null ? 80 : d.full) - hours * 4));
    d.t = now;
  }
  A.addKibble = function (n) { P.kibble = (P.kibble || 0) + n; save(); return n; };
  A.petDog = function () { var d = dog(); return d ? { color: d.color, name: d.name } : null; };
  A.petSVG = function (color) { return dogSVG(color); };

  A.tabs.push({ id: 'pet', icon: '🐾', label: 'Pet', href: '#/pet', order: 35 });
  A.routes.pet = function (p) {
    if (!P.dogs.length) return renderAdopt();
    if (p[0] === 'food') return renderFood();
    if (p[0] === 'dogs') return renderDogs();
    renderPet();
  };

  /* ---------------- the dog drawing (SVG; every part can animate) ---------------- */
  function ring(cx, cy, rx, ry, n, r, fill) {
    var s = '';
    for (var i = 0; i < n; i++) { var a = i / n * Math.PI * 2; s += '<circle cx="' + (cx + Math.cos(a) * rx).toFixed(1) + '" cy="' + (cy + Math.sin(a) * ry).toFixed(1) + '" r="' + r + '" fill="' + fill + '"/>'; }
    return s;
  }
  function eye(cx) {
    var r = 8.6;
    return '<g class="pt-eye"><circle cx="' + cx + '" cy="82" r="' + r + '" fill="#2b1d17"/><circle cx="' + (cx + r * .3) + '" cy="' + (82 - r * .35) + '" r="' + (r * .38) + '" fill="#fff"/><circle cx="' + (cx - r * .3) + '" cy="' + (82 + r * .35) + '" r="' + (r * .18) + '" fill="#fff"/></g>';
  }
  function dogArt(key) {
    var c = COLORS[key] || COLORS.sunset;
    var head = '<g transform="translate(100 98) scale(1.28) translate(-100 -85)">' +
      '<g class="pt-earL"><path d="M68 56 Q64 38 72 34 Q86 38 92 52 Z" fill="' + c.fur + '"/><path d="M72 51 Q70 42 74 40 Q82 43 85 50 Z" fill="' + c.ear + '"/></g>' +
      '<g class="pt-earR"><path d="M132 56 Q136 38 128 34 Q114 38 108 52 Z" fill="' + c.fur + '"/><path d="M128 51 Q130 42 126 40 Q118 43 115 50 Z" fill="' + c.ear + '"/></g>' +
      ring(100, 88, 40, 36, 30, 7, c.fur) + '<ellipse cx="100" cy="86" rx="42" ry="38" fill="' + c.fur + '"/>' +
      '<path d="M100 60 Q80 62 70 90 Q82 112 100 112 Q118 112 130 90 Q120 62 100 60Z" fill="' + c.mask + '"/>' +
      '<ellipse cx="100" cy="102" rx="20" ry="14" fill="' + c.chest + '"/>' + eye(82) + eye(118) +
      '<ellipse cx="72" cy="98" rx="8" ry="5" fill="' + c.blush + '" opacity=".6"/><ellipse cx="128" cy="98" rx="8" ry="5" fill="' + c.blush + '" opacity=".6"/>' +
      '<ellipse cx="100" cy="93" rx="6" ry="4.2" fill="#3a2620"/><ellipse cx="98.5" cy="91.8" rx="2" ry="1.1" fill="#fff" opacity=".7"/>' +
      '<path class="pt-smile" d="M100 97 Q100 105 92 104 M100 97 Q100 105 108 104" stroke="#3a2620" stroke-width="2.4" fill="none" stroke-linecap="round"/>' +
      '<g class="pt-open"><path d="M91 100 Q100 118 109 100 Q100 104 91 100Z" fill="#8f2f3a"/><ellipse cx="100" cy="110" rx="6" ry="4.2" fill="#ff8da1"/></g></g>';
    var body = '<g transform="translate(100 168) scale(.72) translate(-100 -150)">' +
      '<g class="pt-tail">' + ring(152, 128, 13, 17, 16, 7, c.fur) + '<circle cx="152" cy="128" r="17" fill="' + c.dark + '"/></g>' +
      ring(100, 150, 40, 28, 26, 8, c.fur) + '<ellipse cx="100" cy="150" rx="42" ry="30" fill="' + c.fur + '"/>' +
      '<ellipse cx="100" cy="158" rx="22" ry="20" fill="' + c.chest + '"/><ellipse cx="80" cy="180" rx="13" ry="9" fill="' + c.chest + '"/><ellipse cx="120" cy="180" rx="13" ry="9" fill="' + c.chest + '"/></g>';
    return '<svg class="pt-svg" viewBox="0 0 200 200" aria-hidden="true"><ellipse cx="100" cy="192" rx="52" ry="7" fill="#000" opacity=".12"/>' +
      '<g class="pt-wrap"><g class="pt-body">' + body + head + '</g></g>' +
      '<text class="pt-food" x="100" y="122" text-anchor="middle" font-size="34"></text>' +
      '<text class="pt-fx pt-fx1" x="142" y="52" font-size="26">❤️</text><text class="pt-fx pt-fx2" x="50" y="64" font-size="22">💕</text><text class="pt-fx pt-fx3" x="100" y="36" font-size="22">✨</text></svg>';
  }

  /* ---- cats, koala, panda and unicorns (same chibi style, same reactions) ---- */
  function wrapSVG(body, head) {
    return '<svg class="pt-svg" viewBox="0 0 200 200" aria-hidden="true"><ellipse cx="100" cy="192" rx="52" ry="7" fill="#000" opacity=".12"/>' +
      '<g class="pt-wrap"><g class="pt-body">' + body + head + '</g></g>' +
      '<text class="pt-food" x="100" y="122" text-anchor="middle" font-size="34"></text>' +
      '<text class="pt-fx pt-fx1" x="142" y="52" font-size="26">❤️</text><text class="pt-fx pt-fx2" x="50" y="64" font-size="22">💕</text><text class="pt-fx pt-fx3" x="100" y="36" font-size="22">✨</text></svg>';
  }
  var MOUTH = '<g class="pt-open"><path d="M91 100 Q100 118 109 100 Q100 104 91 100Z" fill="#8f2f3a"/><ellipse cx="100" cy="110" rx="6" ry="4.2" fill="#ff8da1"/></g>';
  function catEyes(r, iris) {
    function one(cx) { return '<g class="pt-eye"><circle cx="' + cx + '" cy="82" r="' + r + '" fill="' + iris + '"/><ellipse cx="' + cx + '" cy="82" rx="' + (r * .42) + '" ry="' + (r * .85) + '" fill="#1b1414"/><circle cx="' + (cx + r * .32) + '" cy="' + (82 - r * .35) + '" r="' + (r * .34) + '" fill="#fff"/><circle cx="' + (cx - r * .3) + '" cy="' + (82 + r * .35) + '" r="' + (r * .16) + '" fill="#fff"/></g>'; }
    return one(82) + one(118);
  }
  function catArt(c) {
    var head = '<g transform="translate(100 98) scale(1.26) translate(-100 -85)">' +
      '<g class="pt-earL"><path d="M62 60 L64 22 L94 46 Z" fill="' + c.fur + '" stroke="' + c.dark + '" stroke-width="2" stroke-linejoin="round"/><path d="M67 52 L68 32 L84 46 Z" fill="' + c.ear + '"/></g>' +
      '<path d="M138 60 L136 22 L106 46 Z" fill="' + c.fur + '" stroke="' + c.dark + '" stroke-width="2" stroke-linejoin="round"/><path d="M133 52 L132 32 L116 46 Z" fill="' + c.ear + '"/>' +
      '<ellipse cx="100" cy="86" rx="43" ry="37" fill="' + c.fur + '"/>' +
      (c.stripe ? '<path d="M100 52 L100 64 M90 54 L92 65 M110 54 L108 65" stroke="' + c.stripe + '" stroke-width="3.5" stroke-linecap="round"/><path d="M58 80 L68 82 M58 90 L67 90 M142 80 L132 82 M142 90 L133 90" stroke="' + c.stripe + '" stroke-width="3" stroke-linecap="round"/>' : '') +
      '<ellipse cx="100" cy="102" rx="19" ry="13" fill="' + c.chest + '"/>' + catEyes(8, c.iris) +
      '<ellipse cx="72" cy="98" rx="8" ry="5" fill="#ff9aa8" opacity=".55"/><ellipse cx="128" cy="98" rx="8" ry="5" fill="#ff9aa8" opacity=".55"/>' +
      '<path d="M95 91 L105 91 L100 97 Z" fill="#ff8da1"/>' +
      '<path class="pt-smile" d="M100 97 L100 100 M100 100 Q95 106 90 102 M100 100 Q105 106 110 102" stroke="#4a2f3c" stroke-width="2.3" fill="none" stroke-linecap="round"/>' + MOUTH +
      '<path d="M70 96 L48 92 M70 101 L48 103 M130 96 L152 92 M130 101 L152 103" stroke="#5a4a50" stroke-width="1.6" stroke-linecap="round" opacity=".6"/></g>';
    var body = '<g transform="translate(100 168) scale(.72) translate(-100 -150)">' +
      '<g class="pt-tail"><path d="M140 150 Q190 150 182 100 Q178 80 160 84" fill="none" stroke="' + c.fur + '" stroke-width="20" stroke-linecap="round"/>' + (c.stripe ? '<path d="M178 112 L190 108 M172 92 L184 84" stroke="' + c.stripe + '" stroke-width="4" stroke-linecap="round"/>' : '') + '</g>' +
      '<ellipse cx="100" cy="152" rx="42" ry="32" fill="' + c.fur + '"/><ellipse cx="100" cy="160" rx="22" ry="20" fill="' + c.chest + '"/>' +
      '<ellipse cx="80" cy="182" rx="14" ry="9" fill="' + c.chest + '"/><ellipse cx="120" cy="182" rx="14" ry="9" fill="' + c.chest + '"/></g>';
    return wrapSVG(body, head);
  }
  function koalaArt(c) {
    var head = '<g transform="translate(100 98) scale(1.24) translate(-100 -85)">' +
      '<g class="pt-earL"><circle cx="56" cy="56" r="22" fill="' + c.fur + '"/><circle cx="56" cy="56" r="13" fill="' + c.ear + '"/>' + ring(56, 56, 16, 16, 10, 4, '#fff') + '</g>' +
      '<circle cx="144" cy="56" r="22" fill="' + c.fur + '"/><circle cx="144" cy="56" r="13" fill="' + c.ear + '"/>' + ring(144, 56, 16, 16, 10, 4, '#fff') +
      '<ellipse cx="100" cy="88" rx="44" ry="38" fill="' + c.fur + '"/><ellipse cx="100" cy="102" rx="26" ry="16" fill="' + c.chest + '"/>' +
      '<g class="pt-eye"><circle cx="80" cy="80" r="6" fill="#2b1d17"/><circle cx="82" cy="78" r="2" fill="#fff"/></g><g class="pt-eye"><circle cx="120" cy="80" r="6" fill="#2b1d17"/><circle cx="122" cy="78" r="2" fill="#fff"/></g>' +
      '<ellipse cx="72" cy="94" rx="8" ry="5" fill="#ffa0b0" opacity=".5"/><ellipse cx="128" cy="94" rx="8" ry="5" fill="#ffa0b0" opacity=".5"/>' +
      '<ellipse cx="100" cy="92" rx="10" ry="13" fill="#2f2a2e"/><ellipse cx="97" cy="87" rx="3" ry="2" fill="#fff" opacity=".5"/>' +
      '<path class="pt-smile" d="M100 105 Q100 111 93 110 M100 105 Q100 111 107 110" stroke="#4a2f3c" stroke-width="2.3" fill="none" stroke-linecap="round"/>' + MOUTH + '</g>';
    var body = '<g transform="translate(100 168) scale(.74) translate(-100 -150)">' +
      '<ellipse cx="100" cy="152" rx="44" ry="33" fill="' + c.fur + '"/><ellipse cx="100" cy="160" rx="26" ry="22" fill="' + c.chest + '"/>' +
      '<ellipse class="pt-tail" cx="60" cy="150" rx="13" ry="22" fill="' + c.fur + '"/><ellipse cx="140" cy="150" rx="13" ry="22" fill="' + c.fur + '"/>' +
      '<ellipse cx="80" cy="183" rx="15" ry="9" fill="' + c.dark + '"/><ellipse cx="120" cy="183" rx="15" ry="9" fill="' + c.dark + '"/></g>';
    return wrapSVG(body, head);
  }
  function pandaArt(c) {
    var head = '<g transform="translate(100 98) scale(1.26) translate(-100 -85)">' +
      '<g class="pt-earL"><circle cx="60" cy="52" r="15" fill="#2a2a30"/></g><circle cx="140" cy="52" r="15" fill="#2a2a30"/>' +
      '<ellipse cx="100" cy="88" rx="45" ry="39" fill="' + c.fur + '"/>' +
      '<ellipse cx="80" cy="82" rx="12" ry="16" fill="#2a2a30" transform="rotate(18 80 82)"/><ellipse cx="120" cy="82" rx="12" ry="16" fill="#2a2a30" transform="rotate(-18 120 82)"/>' +
      '<g class="pt-eye"><circle cx="80" cy="82" r="6.5" fill="#fff"/><circle cx="80" cy="83" r="4.2" fill="#1b1414"/><circle cx="81.5" cy="81.5" r="1.6" fill="#fff"/></g><g class="pt-eye"><circle cx="120" cy="82" r="6.5" fill="#fff"/><circle cx="120" cy="83" r="4.2" fill="#1b1414"/><circle cx="121.5" cy="81.5" r="1.6" fill="#fff"/></g>' +
      '<ellipse cx="68" cy="100" rx="8" ry="5" fill="#ffa0b0" opacity=".5"/><ellipse cx="132" cy="100" rx="8" ry="5" fill="#ffa0b0" opacity=".5"/>' +
      '<ellipse cx="100" cy="94" rx="8" ry="5.5" fill="#2a2a30"/><ellipse cx="98" cy="92.5" rx="2.4" ry="1.3" fill="#fff" opacity=".5"/>' +
      '<path class="pt-smile" d="M100 99 Q100 106 93 105 M100 99 Q100 106 107 105" stroke="#2a2a30" stroke-width="2.4" fill="none" stroke-linecap="round"/>' + MOUTH + '</g>';
    var body = '<g transform="translate(100 168) scale(.74) translate(-100 -150)">' +
      '<circle class="pt-tail" cx="146" cy="160" r="10" fill="' + c.fur + '"/><ellipse cx="100" cy="152" rx="46" ry="34" fill="' + c.fur + '"/>' +
      '<ellipse cx="58" cy="146" rx="14" ry="24" fill="#2a2a30" transform="rotate(14 58 146)"/><ellipse cx="142" cy="146" rx="14" ry="24" fill="#2a2a30" transform="rotate(-14 142 146)"/>' +
      '<ellipse cx="78" cy="182" rx="17" ry="11" fill="#2a2a30"/><ellipse cx="122" cy="182" rx="17" ry="11" fill="#2a2a30"/></g>';
    return wrapSVG(body, head);
  }
  function unicornArt(c) {
    var M = c.mane;
    var head = '<g transform="translate(100 98) scale(1.26) translate(-100 -85)">' +
      '<path d="M64 62 L62 30 L86 48 Z" fill="' + c.fur + '" stroke="' + c.dark + '" stroke-width="2" stroke-linejoin="round"/><path d="M66 54 L66 38 L79 49 Z" fill="' + c.ear + '"/>' +
      '<path d="M136 62 L138 30 L114 48 Z" fill="' + c.fur + '" stroke="' + c.dark + '" stroke-width="2" stroke-linejoin="round"/><path d="M134 54 L134 38 L121 49 Z" fill="' + c.ear + '"/>' +
      '<path d="M100 8 L91 50 L109 50 Z" fill="#ffd54a" stroke="#e0a800" stroke-width="2" stroke-linejoin="round"/><path d="M95 38 L106 33 M97 28 L104 24 M93 46 L108 42" stroke="#e0a800" stroke-width="2" stroke-linecap="round"/>' +
      '<ellipse cx="100" cy="88" rx="44" ry="38" fill="' + c.fur + '"/>' +
      '<g><circle cx="58" cy="62" r="11" fill="' + M[0] + '"/><circle cx="52" cy="78" r="11" fill="' + M[1] + '"/><circle cx="54" cy="94" r="10" fill="' + M[2] + '"/><circle cx="142" cy="62" r="11" fill="' + M[3] + '"/><circle cx="148" cy="78" r="11" fill="' + M[4] + '"/><circle cx="146" cy="94" r="10" fill="' + M[5] + '"/>' +
      '<circle cx="86" cy="56" r="9" fill="' + M[1] + '"/><circle cx="100" cy="53" r="9" fill="' + M[0] + '"/><circle cx="114" cy="56" r="9" fill="' + M[3] + '"/></g>' +
      '<ellipse cx="100" cy="102" rx="22" ry="14" fill="' + c.chest + '"/>' +
      '<g class="pt-eye"><circle cx="82" cy="82" r="8.5" fill="#3b2a55"/><circle cx="85" cy="78.5" r="3.2" fill="#fff"/><circle cx="79.5" cy="85" r="1.5" fill="#fff"/><path d="M72 76 L66 72 M73 73 L69 68" stroke="#3b2a55" stroke-width="2" stroke-linecap="round"/></g>' +
      '<g class="pt-eye"><circle cx="118" cy="82" r="8.5" fill="#3b2a55"/><circle cx="121" cy="78.5" r="3.2" fill="#fff"/><circle cx="115.5" cy="85" r="1.5" fill="#fff"/><path d="M128 76 L134 72 M127 73 L131 68" stroke="#3b2a55" stroke-width="2" stroke-linecap="round"/></g>' +
      '<ellipse cx="72" cy="98" rx="8" ry="5" fill="#ffa6c8" opacity=".6"/><ellipse cx="128" cy="98" rx="8" ry="5" fill="#ffa6c8" opacity=".6"/>' +
      '<circle cx="94" cy="99" r="1.8" fill="#c28aa8"/><circle cx="106" cy="99" r="1.8" fill="#c28aa8"/>' +
      '<path class="pt-smile" d="M100 103 Q100 109 94 108 M100 103 Q100 109 106 108" stroke="#7a4a72" stroke-width="2.3" fill="none" stroke-linecap="round"/>' + MOUTH + '</g>';
    var body = '<g transform="translate(100 168) scale(.72) translate(-100 -150)">' +
      '<g class="pt-tail"><path d="M142 150 Q196 150 186 108" fill="none" stroke="' + M[0] + '" stroke-width="12" stroke-linecap="round"/><path d="M142 156 Q190 160 184 122" fill="none" stroke="' + M[2] + '" stroke-width="10" stroke-linecap="round"/><path d="M140 162 Q180 170 178 134" fill="none" stroke="' + M[4] + '" stroke-width="9" stroke-linecap="round"/></g>' +
      '<ellipse cx="100" cy="152" rx="42" ry="32" fill="' + c.fur + '"/><ellipse cx="100" cy="160" rx="22" ry="20" fill="' + c.chest + '"/>' +
      '<ellipse cx="80" cy="182" rx="14" ry="9" fill="#ffd54a"/><ellipse cx="120" cy="182" rx="14" ry="9" fill="#ffd54a"/></g>';
    return wrapSVG(body, head);
  }
  // one call for every species
  function dogSVG(key) {
    var c = PETS[key] || PETS.sunset, k = c.kind || 'dog';
    return k === 'cat' ? catArt(c) : k === 'koala' ? koalaArt(c) : k === 'panda' ? pandaArt(c) : k === 'unicorn' ? unicornArt(c) : dogArt(key);
  }
  function say(k) { var w = SAY[k], t = A.script() === 't'; return '<b>' + esc(t ? w.t : w.s) + '</b> ' + A.pinyinHTML(w.py, null, 'sm') + ' <i>' + esc(w.en) + '</i>'; }

  /* ---------------- adoption (first run) ---------------- */
  function pickName() { return NAMES[Math.floor(Math.random() * NAMES.length)]; }
  function adoptDog(color, name) {
    var d = { id: 'd' + (P.next++), color: color, name: (name || '').trim().slice(0, 12) || pickName(), full: 90, t: Date.now(), love: 0 };
    P.dogs.push(d); P.cur = d.id; save(); return d;
  }
  function renderAdopt() {
    var chosen = STARTERS[0];
    app.innerHTML =
      '<div class="screen has-tabs">' +
      '<div class="topbar"><span class="title gtitle">🐾 Your first pet</span>' + A.walletPill() + '</div>' +
      '<div class="pt-adopt"><h2>Choose your first puppy!</h2><p>It is free. Later you can save your stars to adopt more.</p>' +
      '<div class="pt-picks" id="ptpicks">' + STARTERS.map(function (k) {
        return '<button class="pt-pick' + (k === chosen ? ' on' : '') + '" data-c="' + k + '"><span class="pt-mini pt-r-idle">' + dogSVG(k) + '</span><span class="pt-pn">' + COLORS[k].name + '</span></button>';
      }).join('') + '</div>' +
      '<label class="pt-namebox">Name your puppy <input id="ptname" maxlength="12" autocomplete="off" autocapitalize="words" value="' + esc(pickName()) + '"></label>' +
      '<button class="btn primary pt-big" id="ptgo">🐾 Adopt!</button></div>' + A.tabbar('pet') + '</div>';
    document.getElementById('ptpicks').onclick = function (e) {
      var b = e.target.closest('.pt-pick'); if (!b) return;
      chosen = b.getAttribute('data-c');
      Array.prototype.forEach.call(document.querySelectorAll('.pt-pick'), function (x) { x.classList.toggle('on', x === b); });
    };
    document.getElementById('ptgo').onclick = function () {
      adoptDog(chosen, document.getElementById('ptname').value);
      FX.fanfare(); FX.confetti({ kind: 'big' }); A.go('#/pet');
    };
  }

  /* ---------------- main pet screen ---------------- */
  var timers = [], busy = false;
  function clearTimers() { timers.forEach(clearTimeout); timers = []; busy = false; }
  function tm(fn, ms) { timers.push(setTimeout(fn, ms)); }
  function petIcon(d) { return { dog: '🐶', cat: '🐱', koala: '🐨', panda: '🐼', unicorn: '🦄' }[kindOf(d)] || '🐾'; }
  function level(d) { return Math.min(10, 1 + Math.floor((d.love || 0) / 20)); }
  function mood(d) { return d.full >= 70 ? 'Full and happy!' : d.full >= 40 ? 'Doing great!' : 'Tummy rumbling... a snack would be wonderful! 🥣'; }

  function tray(d) {
    var items = [];
    if (P.kibble > 0) items.push({ f: KIBBLE, n: P.kibble });
    ALLFOODS.forEach(function (f) { if ((P.stock[f.id] || 0) > 0) items.push({ f: f, n: P.stock[f.id] }); });
    if (!items.length) return '<div class="pt-empty">Nothing to eat yet. 🥣 Kibble comes from <b>reading stories</b>. Treats come from the Food shop.</div>';
    return items.map(function (it) {
      return '<button class="pt-food-btn" data-food="' + it.f.id + '" aria-label="Give ' + it.f.name + '"><span class="pt-fe">' + it.f.e + '</span><span class="pt-fn">' + it.f.name + '</span><b class="pt-fcount">×' + it.n + '</b></button>';
    }).join('');
  }
  function goalLine() {
    if (!P.goal || P.dogs.some(function (x) { return x.color === P.goal; })) return '';
    var c = COLORS[P.goal], have = A.wallet().bal + A.wallet().gold * A.goldWorth, pct = Math.min(100, Math.round(have / c.price * 100));
    return '<button class="pt-goal" data-go="#/pet/dogs">⭐ Saving for ' + esc(c.name) + ': <b>' + pct + '%</b><span class="pt-bar"><i style="width:' + pct + '%"></i></span></button>';
  }
  function header(mode) {
    var d = dog();
    return '<div class="topbar"><span class="title gtitle">' + petIcon(d) + ' ' + esc(d.name) + '</span>' + A.walletPill() + '</div>' +
      '<div class="modebar"><div class="seg" role="group" aria-label="Pet screens">' +
      '<button data-go="#/pet" class="' + (mode === 'pet' ? 'on' : '') + '">🐾 Pet</button>' +
      '<button data-go="#/pet/food" class="' + (mode === 'food' ? 'on' : '') + '">🍖 Food shop</button>' +
      '<button data-go="#/pet/dogs" class="' + (mode === 'dogs' ? 'on' : '') + '">🏠 Pets</button></div></div>';
  }

  function renderPet() {
    clearTimers();
    var d = dog(); refresh(d); save();
    app.innerHTML =
      '<div class="screen has-tabs">' + header('pet') +
      '<div class="pt-stage-wrap"><div class="pt-stage pt-r-idle' + (d.full < 40 ? ' pt-hungry' : '') + '" id="ptstage">' +
      '<div class="pt-bubble" id="ptbubble" hidden></div>' + dogSVG(d.color) + '</div></div>' +
      '<div class="pt-stats"><div class="pt-stat"><span>Tummy</span><span class="pt-bar"><i id="ptfull" style="width:' + Math.round(d.full) + '%"></i></span></div>' +
      '<div class="pt-stat pt-lv"><span>Love ❤️ Lv ' + level(d) + '</span><span class="pt-bar love"><i id="ptlove" style="width:' + (level(d) >= 10 ? 100 : ((d.love || 0) % 20) * 5) + '%"></i></span></div></div>' +
      '<div class="pt-mood" id="ptmood">' + mood(d) + '</div>' +
      goalLine() +
      '<div class="section-title">Feed ' + esc(d.name) + '</div><div class="pt-tray" id="pttray">' + tray(d) + '</div>' +
      '<div class="pt-tip">Tap ' + esc(d.name) + ' to say hi! 👋</div>' +
      A.tabbar('pet') + '</div>';
    A.onLeave(clearTimers);
    var stage = document.getElementById('ptstage');
    stage.onclick = function () { if (!busy) pet(d); };
    document.getElementById('pttray').onclick = function (e) {
      var b = e.target.closest('[data-food]'); if (!b || busy) return;
      give(d, b.getAttribute('data-food'));
    };
    if (d.full < 40) speak('hungry');
  }

  var SAYID = { woof: 'PET-01', meow: 'PET-02', hello: 'PET-03', yum: 'PET-04', hungry: 'PET-05', thanks: 'PET-06', love: 'PET-07' };
  function speak(k, ms) {
    var b = document.getElementById('ptbubble'); if (!b) return;
    b.innerHTML = say(k); b.hidden = false;
    // the narrator says it too when she taps the pet (not for the quiet "hungry" bubble shown when the screen opens)
    if (ms && SAYID[k] && window.OWNV) window.OWNV.playFile(window.OWNV.file(SAYID[k]), false, true);
    tm(function () { b.hidden = true; }, ms || 2600);
  }
  function setClass(name) {
    var st = document.getElementById('ptstage'); if (!st) return null;
    st.className = 'pt-stage pt-r-' + name;
    void st.offsetWidth; return st;
  }
  function idle(d) {
    var st = document.getElementById('ptstage'); if (!st) return;
    st.className = 'pt-stage pt-r-idle' + (d.full < 40 ? ' pt-hungry' : '');
    busy = false;
  }
  function pet(d) {
    busy = true; FX.pop(); setClass('wiggle'); speak(kindOf(d) === 'dog' ? 'woof' : kindOf(d) === 'cat' ? 'meow' : 'hello', 1800);
    d.love = (d.love || 0) + 0;   // tapping is just for fun: it never pays, so there is nothing to farm
    tm(function () { idle(d); }, 1500);
  }
  var TRICK_MS = { chew: 2800, wiggle: 1800, spin: 2000, dance: 3800, jump: 2400, party: 4200, flip: 2600 };
  function give(d, id) {
    var f = id === 'kibble' ? KIBBLE : foodById(id); if (!f) return;
    if (id === 'kibble') { if (!(P.kibble > 0)) return; P.kibble--; } else { if (!(P.stock[id] > 0)) return; P.stock[id]--; }
    var lv0 = level(d);
    d.full = Math.min(100, d.full + f.full); d.love = (d.love || 0) + f.love * (f.fav === kindOf(d) ? 2 : 1); d.t = Date.now(); save();
    busy = true;
    var st = setClass(f.trick); st.querySelector('.pt-food').textContent = f.e;
    FX.pop(); speak('yum', 1800);
    if (f.trick === 'party' || f.trick === 'flip') { FX.fanfare(); FX.confetti({ kind: 'big' }); } else if (f.trick === 'dance' || f.trick === 'jump') { FX.ding(); }
    tm(function () { speak(level(d) > lv0 ? 'love' : 'thanks', 2200); }, 1300);
    var full = document.getElementById('ptfull'), love = document.getElementById('ptlove');
    if (full) full.style.width = Math.round(d.full) + '%';
    if (love) love.style.width = (level(d) >= 10 ? 100 : ((d.love || 0) % 20) * 5) + '%';
    var mo = document.getElementById('ptmood'); if (mo) mo.textContent = level(d) > lv0 ? 'Level up! ' + esc(d.name) + ' is now Love Lv ' + level(d) + ' 🎉' : mood(d);
    var tr = document.getElementById('pttray'); if (tr) tr.innerHTML = tray(d);
    tm(function () { idle(d); }, TRICK_MS[f.trick] || 2500);
  }

  /* ---------------- food shop ---------------- */
  function renderFood() {
    clearTimers();
    var d = dog();
    app.innerHTML =
      '<div class="screen has-tabs">' + header('food') +
      '<p class="shophint">Treats cost ⭐ (🌟 counts as ' + A.goldWorth + ' ⭐). Every treat makes ' + esc(d.name) + ' do something different!</p>' + A.swapButton() +
      '<div class="pt-shop">' + foodList(d).map(function (f) {
        var have = P.stock[f.id] || 0, ok = A.canAfford(f.price);
        return '<div class="pt-item"><span class="pt-ie">' + f.e + '</span><span class="pt-in"><b>' + f.name + (f.fav ? ' <span class="pt-fav">❤ favorite</span>' : '') + '</b><small>Trick: ' + trickName(f.trick) + (have ? ' · you have ' + have : '') + '</small></span>' +
          '<button class="btn pt-buy' + (ok ? ' primary' : '') + '" data-buy="' + f.id + '"' + (ok ? '' : ' disabled') + '>⭐ ' + f.price + '</button></div>';
      }).join('') + '</div>' +
      '<p class="shophint">🥣 Kibble is free: you earn it by <b>reading stories</b>.</p>' +
      A.tabbar('pet') + '</div>';
    app.querySelector('.pt-shop').onclick = function (e) {
      var b = e.target.closest('[data-buy]'); if (!b || b.disabled) return;
      var f = foodById(b.getAttribute('data-buy'));
      if (!A.spendMixed(f.price)) return;
      P.stock[f.id] = (P.stock[f.id] || 0) + 1; save(); FX.pop();
      A.toast(f.e + ' ' + f.name + ' bought!'); renderFood();
    };
    A.bindSwap(app, renderFood);
  }
  function foodList(d) { var sp = SPECIAL[kindOf(d)]; return (sp ? [sp] : []).concat(FOODS); }
  function trickName(t) { return { wiggle: 'happy wiggle', chew: 'happy munch', spin: 'spin', dance: 'dance', jump: 'big jump', party: 'party!', flip: 'flip!' }[t] || t; }

  /* ---------------- pet store (save up for more pets) ---------------- */
  function renderDogs() {
    clearTimers();
    var d = dog(), have = A.wallet().bal + A.wallet().gold * A.goldWorth;
    function card(k) {
      var c = PETS[k], owned = P.dogs.filter(function (x) { return x.color === k; })[0];
      var pct = Math.min(100, Math.round(have / c.price * 100)), ok = have >= c.price;
      var action = owned ? (owned.id === P.cur ? '<span class="pt-here">✓ With you now</span>' : '<button class="btn" data-switch="' + owned.id + '">Play with ' + esc(owned.name) + '</button>')
        : '<span class="pt-bar"><i style="width:' + pct + '%"></i></span><div class="pt-prow"><b>⭐ ' + c.price + '</b>' + (ok ? '<button class="btn primary" data-adopt="' + k + '">Adopt!</button>' : '<button class="btn' + (P.goal === k ? ' on' : '') + '" data-goal="' + k + '">' + (P.goal === k ? '⭐ My goal' : 'Save for this') + '</button>') + '</div>' + (ok ? '' : '<small>' + (c.price - have) + ' more ⭐ to go</small>');
      return '<div class="pt-dcard' + (owned ? ' owned' : '') + '"><span class="pt-mini pt-r-idle">' + dogSVG(k) + '</span><b>' + esc(c.name) + '</b>' + (owned ? '<small>' + esc(owned.name) + '</small>' : '') + action + '</div>';
    }
    app.innerHTML =
      '<div class="screen has-tabs">' + header('dogs') +
      '<p class="shophint">New friends are special, so they cost a lot. Saving up takes patience, and it feels great when you get there! 🐷 You have ⭐ <b class="wnum">' + A.wallet().bal + '</b> and 🌟 <b class="gnum">' + A.wallet().gold + '</b>.</p>' + A.swapButton() +
      '<div id="ptstore">' + SECTIONS.map(function (sec) { return '<div class="section-title">' + sec.title + '</div><div class="pt-dogs">' + sec.keys.map(card).join('') + '</div>'; }).join('') + '</div>' + A.tabbar('pet') + '</div>';
    A.bindSwap(app, renderDogs);
    document.getElementById('ptstore').onclick = function (e) {
      var b = e.target.closest('button'); if (!b) return;
      if (b.getAttribute('data-switch')) { P.cur = b.getAttribute('data-switch'); save(); return A.go('#/pet'); }
      if (b.getAttribute('data-goal')) { P.goal = b.getAttribute('data-goal'); save(); return renderDogs(); }
      var k = b.getAttribute('data-adopt');
      if (k) nameAndAdopt(k);
    };
  }
  function nameAndAdopt(k) {
    var c = COLORS[k], el = document.createElement('div');
    el.className = 'win pt-name-overlay';
    el.innerHTML = '<div class="wincard"><div class="win-emoji"><span class="pt-mini pt-r-idle">' + dogSVG(k) + '</span></div><div class="win-title">Adopt ' + esc(c.name) + '!</div>' +
      '<label class="pt-namebox">Name your new friend <input id="ptn2" maxlength="12" autocomplete="off" value="' + esc(pickName()) + '"></label>' +
      '<div class="win-btns"><button class="btn primary" id="ptok">🐾 Adopt for ⭐ ' + c.price + '</button><button class="btn" id="ptno">Not yet</button></div></div>';
    document.body.appendChild(el);
    document.getElementById('ptno').onclick = function () { el.remove(); };
    document.getElementById('ptok').onclick = function () {
      if (!A.spendMixed(c.price)) { el.remove(); return; }
      adoptDog(k, document.getElementById('ptn2').value);
      if (P.goal === k) P.goal = null; save();
      el.remove(); FX.fanfare(); FX.confetti({ kind: 'big' }); A.go('#/pet');
    };
  }
});
