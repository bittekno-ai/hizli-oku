'use strict';
// Başlatma ve sayfa yönlendirme (#/yol).
(function () {
  const el = HO.u.el;
  let ctx = null;

  async function goster() {
    if (ctx) ctx.abort();
    ctx = new HO.Ctx();
    const benim = ctx;
    const kap = document.getElementById('ana');
    const yol = location.hash.replace(/^#\/?/, '').split('/');
    const bolum = yol[0] || '';
    document.querySelectorAll('[data-nav]').forEach((a) => {
      const hedef = a.dataset.nav;
      a.classList.toggle('secili', hedef === bolum || (hedef === 'egzersizler' && bolum === 'egzersiz'));
    });
    document.getElementById('katman').replaceChildren();
    kap.replaceChildren();
    window.scrollTo(0, 0);
    try {
      if (bolum === '') HO.sayfa.ana(kap);
      else if (bolum === 'egzersizler') HO.sayfa.egzersizler(kap);
      else if (bolum === 'ilerleme') HO.sayfa.ilerleme(kap);
      else if (bolum === 'ayarlar') HO.sayfa.ayarlar(kap);
      else if (bolum === 'metinlerim') HO.sayfa.metinlerim(kap, yol[1]);
      else if (bolum === 'gunluk') await HO.gunlukCalistir(kap, benim);
      else if (bolum === 'egzersiz' && HO.egz[yol[1]]) await HO.ui.egzersizCalistir(kap, HO.egz[yol[1]], benim);
      else kap.replaceChildren(el('h1', { text: 'Sayfa bulunamadı' }), el('a', { href: '#/', text: 'Ana sayfaya dön' }));
    } catch (e) {
      if (HO.iptalMi(e)) return;
      console.error(e);
      kap.replaceChildren(
        el('section', { class: 'kart' }, el('h1', { text: 'Bir hata oldu' }), el('p', { text: String(e && e.message ? e.message : e) }), el('a', { class: 'dugme ana', href: '#/', text: 'Ana sayfa' }))
      );
    }
  }

  function baslat() {
    HO.depo.yukle();
    HO.ui.ayarlariUygula();
    window.addEventListener('hashchange', goster);
    goster();
    // Çevrimdışı kullanım (yalnız http/https üzerinde; masaüstü paketinde gerekmez).
    if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol) && !window.__TAURI_INTERNALS__ && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
      navigator.serviceWorker.register('sw.js').catch((e) => console.warn('Service worker kaydedilemedi', e));
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', baslat);
  else baslat();
})();
