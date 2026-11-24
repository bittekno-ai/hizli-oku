'use strict';
// Genel yardımcılar ve iptal edilebilir çalışma bağlamı (Ctx).
window.HO = window.HO || {};

(function () {
  const u = {};

  // Kısa DOM oluşturucu: u.el('div', {class: 'x', onclick: fn}, 'metin', başkaEleman)
  u.el = function (tag, attrs, ...kids) {
    const e = document.createElement(tag);
    if (attrs) {
      for (const [k, v] of Object.entries(attrs)) {
        if (v == null || v === false) continue;
        if (k === 'class') e.className = v;
        else if (k === 'text') e.textContent = v;
        else if (k === 'html') e.innerHTML = v;
        else if (k === 'style' && typeof v === 'object') Object.assign(e.style, v);
        else if (k.startsWith('on') && typeof v === 'function') e.addEventListener(k.slice(2), v);
        else if (v === true) e.setAttribute(k, '');
        else e.setAttribute(k, v);
      }
    }
    for (const kid of kids.flat(Infinity)) {
      if (kid == null || kid === false) continue;
      e.append(kid instanceof Node ? kid : String(kid));
    }
    return e;
  };

  u.shuffle = (a) => {
    a = a.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  u.pick = (a) => a[Math.floor(Math.random() * a.length)];
  u.randInt = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  u.clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  u.round5 = (x) => Math.round(x / 5) * 5;

  const pad = (n) => String(n).padStart(2, '0');
  u.dayKey = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  u.keyToDate = (k) => new Date(k + 'T12:00:00');
  u.dayDiff = (k1, k2) => Math.round((u.keyToDate(k2) - u.keyToDate(k1)) / 86400000);
  u.addDays = (k, n) => {
    const d = u.keyToDate(k);
    d.setDate(d.getDate() + n);
    return u.dayKey(d);
  };
  u.fmtDate = (k) => u.keyToDate(k).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });

  u.words = (t) => t.split(/\s+/).filter(Boolean);
  u.charCount = (t) => t.replace(/\s+/g, '').length;
  u.metinYazi = (m) => m.paragraflar.join('\n\n');

  u.fmtClock = (ms) => {
    const s = Math.round(ms / 1000);
    return `${Math.floor(s / 60)}:${pad(s % 60)}`;
  };
  u.fmtSec = (ms) => (ms / 1000).toFixed(1).replace('.', ',') + ' sn';
  u.pct = (x) => '%' + Math.round(x * 100);
  u.num = (x) => Math.round(x).toLocaleString('tr-TR');

  // Karşılaştırma için: Türkçe küçük harf, noktalama yok, tek boşluk.
  u.norm = (s) =>
    String(s)
      .toLocaleLowerCase('tr')
      .replace(/[^\p{L}\p{N}\s]/gu, '')
      .replace(/\s+/g, ' ')
      .trim();

  // Kelime başına okuma süresi ağırlıkları: uzun kelime ve noktalama biraz daha uzun.
  // Toplam süre, hedef kelime/dk değerini tutacak biçimde normalize edilir.
  u.kelimeAgirliklari = (kelimeler) => {
    const ham = kelimeler.map((w) => w.length + 2 + (/[.!?;:…]$/.test(w) ? 3 : /,$/.test(w) ? 1 : 0));
    const top = ham.reduce((a, b) => a + b, 0) || 1;
    return ham.map((h) => (h * kelimeler.length) / top);
  };

  HO.u = u;

  // İptal edilebilir bağlam: sayfa değişince ya da "Bitir"e basılınca tüm bekleyen işler durur.
  const ABORT = new Error('iptal');
  ABORT.name = 'Iptal';
  HO.ABORT = ABORT;
  HO.iptalMi = (e) => e === ABORT;

  class Ctx {
    constructor(parent) {
      this.aborted = false;
      this._fns = new Set();
      if (parent) this._offParent = parent.onAbort(() => this.abort());
    }
    onAbort(fn) {
      if (this.aborted) {
        fn();
        return () => {};
      }
      this._fns.add(fn);
      return () => this._fns.delete(fn);
    }
    abort() {
      if (this.aborted) return;
      this.aborted = true;
      const fns = [...this._fns];
      this._fns.clear();
      for (const fn of fns) {
        try {
          fn();
        } catch (e) {
          console.error(e);
        }
      }
    }
    child() {
      return new Ctx(this);
    }
    check() {
      if (this.aborted) throw ABORT;
    }
    wait(ms) {
      return new Promise((res, rej) => {
        if (this.aborted) return rej(ABORT);
        let off;
        const id = setTimeout(() => {
          off();
          res();
        }, ms);
        off = this.onAbort(() => {
          clearTimeout(id);
          rej(ABORT);
        });
      });
    }
    frame() {
      return new Promise((res, rej) => {
        if (this.aborted) return rej(ABORT);
        let off;
        const id = requestAnimationFrame((t) => {
          off();
          res(t);
        });
        off = this.onAbort(() => {
          cancelAnimationFrame(id);
          rej(ABORT);
        });
      });
    }
    // exec(resolve) kullanıcı eylemini bekler; bağlam iptal olursa reddedilir.
    promise(exec) {
      return new Promise((res, rej) => {
        if (this.aborted) return rej(ABORT);
        const off = this.onAbort(() => rej(ABORT));
        exec((v) => {
          off();
          res(v);
        });
      });
    }
    click(el) {
      return this.promise((res) => el.addEventListener('click', res, { once: true }));
    }
    listen(target, type, fn, opts) {
      target.addEventListener(type, fn, opts);
      this.onAbort(() => target.removeEventListener(type, fn, opts));
    }
    interval(fn, ms) {
      const id = setInterval(fn, ms);
      this.onAbort(() => clearInterval(id));
      return id;
    }
  }
  HO.Ctx = Ctx;
})();
