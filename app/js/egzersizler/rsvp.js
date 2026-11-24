'use strict';
// Tek nokta okuma (RSVP): kelimeler ekranın ortasında tek tek gösterilir.
(function () {
  const u = HO.u;
  const el = u.el;
  HO.egz = HO.egz || {};

  // Gözün odaklanacağı harf: kelimenin yaklaşık üçte birinde.
  const odak = (w) => Math.min(w.length - 1, Math.max(0, Math.floor((w.length - 1) * 0.35)));

  HO.egz.rsvp = {
    id: 'rsvp',
    ad: 'Tek nokta okuma',
    kisa: 'Kelimeler ekranın ortasında tek tek akar.',
    sure: '2–3 dk',
    nasil: [
      'Kelimeler ekranın ortasında, seçtiğiniz hızda tek tek gösterilir. Gözünüzü renkli harfte tutun.',
      'Boşluk tuşu duraklatır. Sol ok 10 kelime geri sarar.',
      'Metin bitince anlama soruları gelir.',
    ],
    secenekler: [
      {
        ad: 'hiz',
        etiket: 'Hız',
        degerler: [['oto', () => `Hedef hız (${HO.depo.rehberHedef()} kelime/dk)`], [150, '150 kelime/dk'], [200, '200 kelime/dk'], [250, '250 kelime/dk'], [300, '300 kelime/dk'], [400, '400 kelime/dk'], [500, '500 kelime/dk']],
        varsayilan: 'oto',
      },
    ],
    async calistir(sahne, s, ctx, { bilgi }) {
      const kdk = s.hiz === 'oto' ? HO.depo.rehberHedef() : s.hiz;
      const metin = HO.depo.metinSec(HO.icerik.alistirma);
      const kelimeler = u.words(u.metinYazi(metin));
      const agirlik = u.kelimeAgirliklari(kelimeler);
      await HO.ui.geriSayim(sahne, ctx, metin.baslik);

      const sol = el('span', { class: 'rsvp-sol' });
      const orta = el('span', { class: 'rsvp-odak' });
      const sag = el('span', { class: 'rsvp-sag' });
      const kutu = el('div', { class: 'rsvp-kutu' }, sol, orta, sag);
      const duraklatDugme = el('button', { class: 'dugme ikincil', text: 'Duraklat' });
      const geriDugme = el('button', { class: 'dugme ikincil', text: '◀ 10 kelime geri' });
      const ilerleme = el('div', { class: 'rsvp-ilerleme' }, el('div'));
      sahne.replaceChildren(
        el('div', { class: 'rsvp-alan' }, el('div', { class: 'rsvp-isaret' }), kutu, el('div', { class: 'rsvp-isaret' }), ilerleme, el('div', { class: 'dugmeler' }, geriDugme, duraklatDugme))
      );

      let i = 0;
      let geri = 0;
      let duraklat = false;
      let devamEt = null;
      const degistir = () => {
        duraklat = !duraklat;
        duraklatDugme.textContent = duraklat ? 'Devam' : 'Duraklat';
        if (!duraklat && devamEt) devamEt();
      };
      const geriSar = () => {
        i = Math.max(0, i - 10);
        geri++;
      };
      duraklatDugme.addEventListener('click', degistir);
      geriDugme.addEventListener('click', geriSar);
      ctx.listen(window, 'keydown', (e) => {
        if (e.code === 'Space') {
          e.preventDefault();
          degistir();
        } else if (e.code === 'ArrowLeft') {
          e.preventDefault();
          geriSar();
        }
      });

      bilgi.textContent = `${kdk} kelime/dk`;
      while (i < kelimeler.length) {
        while (duraklat) await ctx.promise((res) => (devamEt = res));
        const w = kelimeler[i];
        const o = odak(w);
        sol.textContent = w.slice(0, o);
        orta.textContent = w[o];
        sag.textContent = w.slice(o + 1);
        ilerleme.firstChild.style.width = ((i + 1) / kelimeler.length) * 100 + '%';
        const ms = agirlik[i] * (60000 / kdk);
        i++;
        await ctx.wait(ms);
      }
      const cevap = await HO.ui.sorular(sahne, metin.sorular, ctx);
      return { metin: metin.id, kdk, geri, dogru: cevap.dogru, toplam: cevap.toplam, oran: cevap.oran };
    },
    ozet: (r) => [
      ['Hız', r.kdk + ' kelime/dk'],
      ['Geri sarma', String(r.geri)],
      ['Anlama', `${u.pct(r.oran)} (${r.dogru}/${r.toplam})`],
    ],
  };
})();
