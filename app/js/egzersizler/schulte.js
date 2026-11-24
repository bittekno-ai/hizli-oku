'use strict';
(function () {
  const u = HO.u;
  const el = u.el;
  HO.egz = HO.egz || {};

  HO.egz.schulte = {
    id: 'schulte',
    ad: 'Schulte tablosu',
    kisa: 'Karışık sayıları sırayla bulun.',
    sure: '1–2 dk',
    nasil: [
      'Tablodaki sayıları 1’den başlayarak sırayla tıklayın.',
      'Gözünüzü tablonun ortasındaki turuncu işarette tutmaya çalışın. Sayıları çevrenizdeki görüşle arayın.',
      'Süre ilk sayı göründüğünde başlar, son sayıda biter.',
    ],
    secenekler: [
      { ad: 'boyut', etiket: 'Tablo boyutu', degerler: [[3, '3 × 3'], [4, '4 × 4'], [5, '5 × 5'], [6, '6 × 6']], varsayilan: 5 },
    ],
    async calistir(sahne, s, ctx, { bilgi }) {
      const n = s.boyut;
      const toplam = n * n;
      await HO.ui.geriSayim(sahne, ctx);
      const sayilar = u.shuffle(Array.from({ length: toplam }, (_, i) => i + 1));
      const tablo = el('div', { class: 'schulte', style: { gridTemplateColumns: `repeat(${n}, 1fr)` } });
      const merkez = n % 2 ? (toplam - 1) / 2 : -1;
      sayilar.forEach((x, i) => tablo.append(el('button', { class: 'hucre' + (i === merkez ? ' merkez' : ''), text: x, 'data-n': x })));
      // Çift boyutlarda ortada bir odak noktası; tek boyutlarda ortadaki hücre işaretli.
      if (merkez < 0) tablo.append(el('div', { class: 'schulte-nokta', 'aria-hidden': 'true' }));
      sahne.replaceChildren(el('div', { class: 'ortala' }, tablo));
      let sira = 1;
      let hata = 0;
      const t0 = performance.now();
      const guncelle = () => (bilgi.textContent = `Sıradaki: ${sira} · Hata: ${hata}`);
      guncelle();
      await ctx.promise((bitti) => {
        tablo.addEventListener('click', (e) => {
          const h = e.target.closest('.hucre');
          if (!h) return;
          const x = Number(h.dataset.n);
          if (x === sira) {
            h.classList.add('bulundu');
            setTimeout(() => h.classList.remove('bulundu'), 250);
            sira++;
            if (sira > toplam) bitti();
          } else {
            hata++;
            h.classList.add('hata');
            setTimeout(() => h.classList.remove('hata'), 300);
          }
          guncelle();
        });
      });
      return { boyut: n, sure: Math.round(performance.now() - t0), hata };
    },
    ozet: (r) => [
      ['Tablo', `${r.boyut} × ${r.boyut}`],
      ['Süre', u.fmtSec(r.sure)],
      ['Hata', String(r.hata)],
    ],
  };
})();
