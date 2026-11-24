'use strict';
// Akıllı tarama: önce soru verilir, kullanıcı metni tarayıp cevabın geçtiği cümleyi bulur.
(function () {
  const u = HO.u;
  const el = u.el;
  HO.egz = HO.egz || {};

  const cumleler = (p) => p.split(/(?<=[.!?…])\s+/).filter(Boolean);

  HO.egz.tarama = {
    id: 'tarama',
    ad: 'Akıllı tarama',
    kisa: 'Metni tarayıp aranan bilgiyi bulun.',
    sure: '2–3 dk',
    nasil: [
      'Önce bir soru görürsünüz. Soruyu okuyup aklınızda tutun.',
      'Metin açılınca baştan sona okumayın: başlığa ve paragrafların ilk cümlelerine göz atın, sorudaki kelimelere benzeyenleri arayın.',
      'Cevabın geçtiği cümleye tıklayın. Süre metin açılınca başlar.',
    ],
    secenekler: [{ ad: 'adet', etiket: 'Görev sayısı', degerler: [[1, '1'], [2, '2'], [3, '3']], varsayilan: 2 }],
    async calistir(sahne, s, ctx, { bilgi }) {
      const sonuclar = [];
      const kullanilan = [];
      for (let g = 0; g < s.adet; g++) {
        bilgi.textContent = `Görev ${g + 1}/${s.adet}`;
        // Önce okunmuş metinler seçilir; böylece okuma testlerinin metinleri önceden görülmez.
        const havuz = HO.icerik.alistirma.filter((m) => m.tarama && !kullanilan.includes(m.id));
        const okunmus = havuz.filter((m) => HO.depo.metinKullanildi(m.id));
        const metin = u.pick(okunmus.length ? okunmus : havuz);
        kullanilan.push(metin.id);
        const gorev = u.pick(metin.tarama);

        const ac = el('button', { class: 'dugme ana buyuk', text: 'Metni aç' });
        sahne.replaceChildren(
          el('div', { class: 'kart tarama-soru' }, el('div', { class: 'adim-yazi', text: 'Aranan bilgi' }), el('h2', { text: gorev.soru }), el('div', { class: 'dugmeler' }, ac))
        );
        ac.focus();
        await ctx.click(ac);

        const govde = el('div', { class: 'okuma-metni tarama' }, el('h2', { class: 'metin-baslik', text: metin.baslik }));
        const hepsi = [];
        metin.paragraflar.forEach((p) => {
          const pEl = el('p');
          cumleler(p).forEach((c, i) => {
            if (i) pEl.append(' ');
            const sp = el('span', { class: 'cumle', text: c });
            pEl.append(sp);
            hepsi.push(sp);
          });
          govde.append(pEl);
        });
        const soruBant = el('div', { class: 'tarama-bant', text: gorev.soru });
        sahne.replaceChildren(soruBant, govde);
        window.scrollTo(0, 0);
        const anahtar = u.norm(gorev.anahtar);
        const t0 = performance.now();
        let hata = 0;
        const bulundu = await ctx.promise((res) => {
          govde.addEventListener('click', (e) => {
            const c = e.target.closest('.cumle');
            if (!c || c.classList.contains('dogru')) return;
            if (u.norm(c.textContent).includes(anahtar)) {
              c.classList.add('dogru');
              res(true);
            } else {
              hata++;
              c.classList.add('yanlis');
              setTimeout(() => c.classList.remove('yanlis'), 500);
              if (hata >= 3) {
                const d = hepsi.find((x) => u.norm(x.textContent).includes(anahtar));
                if (d) d.classList.add('goster');
                res(false);
              }
            }
          });
        });
        const sure = performance.now() - t0;
        sonuclar.push({ bulundu, sure, hata });
        await ctx.wait(bulundu ? 900 : 2200);
      }
      const bulunan = sonuclar.filter((x) => x.bulundu);
      return {
        gorev: sonuclar.length,
        bulunan: bulunan.length,
        ortSure: bulunan.length ? Math.round(bulunan.reduce((a, b) => a + b.sure, 0) / bulunan.length) : null,
        hata: sonuclar.reduce((a, b) => a + b.hata, 0),
      };
    },
    ozet: (r) => [
      ['Bulunan', `${r.gorev} görevde ${r.bulunan}`],
      ['Ortalama süre', r.ortSure ? u.fmtSec(r.ortSure) : '-'],
      ['Yanlış tıklama', String(r.hata)],
    ],
  };
})();
