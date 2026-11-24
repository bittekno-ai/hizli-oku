'use strict';
// Kelime avı: kelime yığını içinde istenen kelimeleri bulup tıklama.
(function () {
  const u = HO.u;
  const el = u.el;
  HO.egz = HO.egz || {};

  HO.egz.kelimeavi = {
    id: 'kelimeavi',
    ad: 'Kelime avı',
    kisa: 'Kelime yığınında istenen kelimeleri bulun.',
    sure: '1–2 dk',
    nasil: [
      'Üstte bulmanız gereken kelimeler yazar. Altta karışık bir kelime yığını vardır.',
      'İstenen kelimeleri yığında bulup dokunun. Bulduğunuz kelimenin üstü listede çizilir.',
      'Bir tur bitince yeni kelimelerle sonraki tur başlar. Süre ve yanlış dokunuşlar kaydedilir.',
    ],
    secenekler: [
      { ad: 'tur', etiket: 'Tur sayısı', degerler: [[2, '2 tur'], [3, '3 tur'], [5, '5 tur']], varsayilan: 3 },
      { ad: 'yigin', etiket: 'Yığın büyüklüğü', degerler: [[30, '30 kelime'], [48, '48 kelime'], [70, '70 kelime']], varsayilan: 48 },
    ],
    async calistir(sahne, s, ctx, { bilgi }) {
      let hata = 0;
      const turSureleri = [];
      for (let t = 0; t < s.tur; t++) {
        const kelimeler = u.shuffle(HO.icerik.kelimeler).slice(0, s.yigin);
        const hedefler = kelimeler.slice(0, 6);
        const liste = el('div', { class: 'av-liste' }, hedefler.map((w) => el('span', { class: 'av-hedef', text: w, 'data-w': w })));
        const yigin = el('div', { class: 'av-yigin' }, u.shuffle(kelimeler).map((w) => el('button', { class: 'av-kelime', type: 'button', text: w, 'data-w': w })));
        if (t === 0) await HO.ui.geriSayim(sahne, ctx);
        sahne.replaceChildren(el('div', { class: 'av-ust' }, el('span', { class: 'soluk', text: `Tur ${t + 1}/${s.tur} · Bulun:` }), liste), yigin);
        const kalan = new Set(hedefler);
        const t0 = performance.now();
        bilgi.textContent = `Tur ${t + 1}/${s.tur} · Yanlış: ${hata}`;
        await ctx.promise((bitti) => {
          yigin.addEventListener('click', (e) => {
            const b = e.target.closest('.av-kelime');
            if (!b || b.disabled) return;
            const w = b.dataset.w;
            if (kalan.has(w)) {
              kalan.delete(w);
              b.classList.add('bulundu');
              b.disabled = true;
              liste.querySelector(`[data-w="${CSS.escape(w)}"]`).classList.add('bulundu');
              if (!kalan.size) bitti();
            } else {
              hata++;
              b.classList.add('yanlis');
              setTimeout(() => b.classList.remove('yanlis'), 400);
              bilgi.textContent = `Tur ${t + 1}/${s.tur} · Yanlış: ${hata}`;
            }
          });
        });
        turSureleri.push(performance.now() - t0);
        await ctx.wait(500);
      }
      const toplam = turSureleri.reduce((a, b) => a + b, 0);
      return { turSayisi: s.tur, yigin: s.yigin, sure: Math.round(toplam), ortTur: Math.round(toplam / s.tur), hata };
    },
    ozet: (r) => [
      ['Tur', `${r.turSayisi} tur, ${r.yigin} kelimelik yığın`],
      ['Toplam süre', u.fmtSec(r.sure)],
      ['Tur başına', u.fmtSec(r.ortTur)],
      ['Yanlış dokunuş', String(r.hata)],
    ],
  };
})();
