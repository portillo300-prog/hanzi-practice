/* Narrator voice: one clip per recording-sheet ID (data in audio-own.js, made by scripts/own-audio.py).
   Plays through the app's own audio engine (FX.clip / FX.sequence), so iPhone and iPad handling is shared with the other voices. */
(function () {
  'use strict';
  var OWN = window.AUDIO_OWN || { byId: {}, byText: {} };
  var V = (window.OWNV = {});

  V.norm = function (t) { return String(t || '').replace(/[\s，。！？、：；,.!?:;“”‘’"'「」()（）]/g, ''); };
  V.file = function (id) { var e = OWN.byId[id]; return e ? e.f : null; };
  V.idForText = function (t) { return OWN.byText[V.norm(t)] || null; };
  V.fileForText = function (t) { var id = V.idForText(t); return id ? V.file(id) : null; };
  V.secs = function (id) { var e = OWN.byId[id]; return e ? e.secs : 0; };

  /* story s5 -> ST05-01, ST05-02 ... and ST05-TITLE */
  V.storyKey = function (S) { var n = parseInt(String(S.id).replace(/\D/g, ''), 10); return 'ST' + (n < 10 ? '0' : '') + n; };
  V.lineId = function (S, i) { return V.storyKey(S) + '-' + (i < 9 ? '0' : '') + (i + 1); };
  V.titleId = function (S) { return V.storyKey(S) + '-TITLE'; };
  V.storyIds = function (S) {
    var ids = [V.titleId(S)].concat(S.lines.map(function (_, i) { return V.lineId(S, i); }));
    return ids.filter(function (id) { return !!V.file(id); });
  };

  /* play one clip; resolves true when it started (or was replaced by a newer one) */
  V.play = function (id, force) { var f = V.file(id); return f ? window.FX.clip(f, !!force, false) : Promise.resolve(false); };
  V.playFile = function (f, force, auto) { return f ? window.FX.clip(f, !!force, !!auto) : Promise.resolve(false); };
  /* play a whole list, one after another; a newer tap anywhere cancels it */
  V.playAll = function (ids, force) {
    var urls = ids.map(V.file).filter(Boolean);
    return urls.length ? window.FX.sequence(urls, !!force, false, 20000) : Promise.resolve(false);
  };

  /* markup for a speaker button (empty when there is no clip, so nothing dead is ever shown) */
  V.btn = function (id, cls, label) {
    return V.file(id) ? '<button type="button" class="speak own ' + (cls || '') + '" data-own="' + id + '" aria-label="' + (label || 'Hear it') + '">🔊</button>' : '';
  };
  /* wire every [data-own] button inside root; onFail(ok) lets the caller show the "could not play" hint */
  V.bind = function (root, onFail) {
    Array.prototype.forEach.call((root || document).querySelectorAll('[data-own]'), function (b) {
      b.onclick = function (e) {
        e.stopPropagation();
        V.play(b.getAttribute('data-own'), true).then(function (ok) { if (ok === false && onFail) onFail(ok); });
      };
    });
  };
})();
