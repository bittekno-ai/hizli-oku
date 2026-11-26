'use strict';
// Çam ağacı: tek kelimeyle başlayıp her satırda bir kelime artan satırlar.
(function () {
  const u = HO.u;
  const el = u.el;
  HO.egz = HO.egz || {};

  const YONLER = { yukaridan: 'Yukarıdan aşağı (△)', asagidan: 'Aşağıdan yukarı (▽)' };

  HO.egz.piramit = {
    id: 'piramit',
    ad: 'Çam ağacı',
    kisa: 'Satır satır genişleyen kelime grupları.',
    sure: '1–2 dk',
    nasil: [
      'Metin, tek kelimeyle başlayıp her satırda bir kelime artan satırlara bölünür.',
      'Gözünüzü ortadaki ince çizgide tutun. Renklenen satırı tek bakışta bütün olarak görmeye çalışın.',
      'Satırlar belirlediğiniz hızda sırayla renklenir.',
    ],
    secenekler: [
      { ad: 'yon', etiket: 'Yön', degerler: Object.entries(YONLER), varsayilan: 'yukaridan' },
      { ad: 'enCok', etiket: 'En geniş satır', degerler: [[4, '4 kelime'], [5, '5 kelime'], [6, '6 kelime'], [7, '7 kelime']], varsayilan: 5 },
      HO.ui.hizSecenegi(),
      { ad: 'sure', etiket: 'Süre', degerler: [[60, '1 dakika'], [90, '1,5 dakika'], [120, '2 dakika']], varsayilan: 90 },
      {
        ad: 'kaynak',
        etiket: 'Metin',
        degerler: () => [['program', 'Program metinleri'], ...HO.depo.kendiMetinler().map((m) => [m.id, 'Metinlerim: ' + m.baslik])],
        varsayilan: 'program',
      },
    ],
    async calistir(sahne, s, ctx, { bilgi }) {
      const hiz = HO.ui.okumaHizi(s.hiz);
      const kdk = u.hizKdk(hiz);
      // Serbest metinler ve alıştırma metinleri (seviye testi metinleri önceden görülmesin diye kullanılmaz).
      // En az kullanılan metin seçilir, böylece aynı metin üst üste gelmez.
      const metin = (s.kaynak !== 'program' && HO.depo.kendiMetin(s.kaynak)) || HO.depo.metinSec([...HO.icerik.serbest, ...HO.icerik.alistirma]);
      const kelimeler = u.words(u.metinYazi(metin));
      const agirlik = u.kelimeAgirliklari(kelimeler);
      const birim = 60000 / kdk;

      // Kelimeleri ağaçlara böl: 1, 2, ..., enCok kelimelik satırlar.
      const agaclar = [];
      let i = 0;
      while (i < kelimeler.length) {
        const agac = [];
        for (let n = 1; n <= s.enCok && i < kelimeler.length; n++) {
          agac.push({ bas: i, son: Math.min(i + n, kelimeler.length) });
          i += n;
        }
        agaclar.push(agac);
      }

      await HO.ui.geriSayim(sahne, ctx);
      const sureMs = s.sure * 1000;
      const t0 = performance.now();
      let okunan = 0;
      outer: for (const agac of agaclar) {
        const kutu = el('div', { class: 'agac ' + (s.yon === 'asagidan' ? 'ters' : '') });
        const satirlar = agac.map((r) => el('div', { class: 'agac-satir', text: kelimeler.slice(r.bas, r.son).join(' ') }));
        satirlar.forEach((sat) => kutu.append(sat));
        sahne.replaceChildren(el('div', { class: 'agac-kap' }, el('div', { class: 'orta-cizgi' }), kutu));
        for (let j = 0; j < agac.length; j++) {
          const r = agac[j];
          satirlar[j].classList.add('aktif');
          let ms = 0;
          for (let k = r.bas; k < r.son; k++) ms += agirlik[k] * birim;
          bilgi.textContent = `${u.hizAdi(hiz)} · Kalan: ${u.fmtClock(Math.max(0, sureMs - (performance.now() - t0)))}`;
          await ctx.wait(ms);
          satirlar[j].classList.remove('aktif');
          satirlar[j].classList.add('okundu');
          okunan += r.son - r.bas;
          if (performance.now() - t0 >= sureMs) break outer;
        }
        await ctx.wait(250);
      }
      return { yon: s.yon, enCok: s.enCok, hiz, kdk, kelime: okunan, sure: Math.round(performance.now() - t0) };
    },
    ozet: (r) => [
      ['Yön', YONLER[r.yon]],
      ['En geniş satır', r.enCok + ' kelime'],
      ['Hız', HO.ui.hizYazi(r)],
      ['Okunan', r.kelime + ' kelime'],
    ],
  };
})();
