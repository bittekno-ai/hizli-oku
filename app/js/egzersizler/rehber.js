'use strict';
// Rehberle okuma: okunacak kelime ya da grup belirlenen hızda vurgulanır.
// Modlar: soluk metin (gri, okunan renkli), gizli metin (yalnız okunan görünür), satır vurgusu.
(function () {
  const u = HO.u;
  const el = u.el;
  HO.egz = HO.egz || {};

  const MODLAR = {
    soluk: 'Soluk metin, okunan renkli',
    gizli: 'Gizli metin, yalnız okunan görünür',
    satir: 'Satır vurgusu',
    silinen: 'Silinen metin, okunan kelimeler silinir',
    dar: 'Dar sütun (dikey blok okuma)',
  };
  const SATIRLI = (mod) => mod === 'satir' || mod === 'dar';

  // Kelime dizisini gruplara ayırır (paragraf sınırını aşmaz).
  function gruplar(kelimeler, n) {
    const out = [];
    let i = 0;
    while (i < kelimeler.length) {
      const g = [kelimeler[i]];
      const p = kelimeler[i].dataset.p;
      i++;
      while (g.length < n && i < kelimeler.length && kelimeler[i].dataset.p === p) g.push(kelimeler[i++]);
      out.push(g);
    }
    return out;
  }

  // Ekrandaki satırlara göre gruplar.
  function satirlar(kelimeler) {
    const out = [];
    let son = null;
    for (const k of kelimeler) {
      const y = k.offsetTop;
      if (son === null || Math.abs(y - son) > 4) {
        out.push([]);
        son = y;
      }
      out[out.length - 1].push(k);
    }
    return out;
  }

  HO.egz.rehber = {
    id: 'rehber',
    ad: 'Rehberle okuma',
    kisa: 'Vurgulanan kelimeleri belirlenen hızda izleyin.',
    sure: '4–5 dk',
    nasil: [
      'Metinde okunacak kelime ya da kelime grubu belirlediğiniz hızda renklenir. Gözünüzle onu izleyin.',
      'Boşluk tuşu ya da metne dokunmak duraklatır. Yukarı ve aşağı ok tuşları hızı 10 kelime/dk değiştirir.',
      'İsterseniz metronomu açın: her kelime grubunda bir tık sesi gelir, yeni paragrafta ses biraz incelir. Okumanızı bu ritme uydurun.',
      'Silinen metin: kelimeler sırayla silinir, silinmeden önce okumaya çalışın. Dar sütun: metin dar bir sütunda satır satır vurgulanır.',
      'Metin bitince anlama soruları gelir.',
      'Hedef hız, son ölçülen etkili hızınızın biraz üstüne ayarlanır. Anlama %70’in altında kalırsa bir sonraki seferde hız bir basamak düşer.',
    ],
    secenekler: [
      { ad: 'mod', etiket: 'Görünüm', degerler: Object.entries(MODLAR), varsayilan: 'soluk' },
      { ad: 'grup', etiket: 'Grup büyüklüğü', degerler: [[1, '1 kelime'], [2, '2 kelime'], [3, '3 kelime'], [4, '4 kelime']], varsayilan: 2 },
      {
        ad: 'hiz',
        etiket: 'Hız',
        degerler: [['oto', () => `Hedef hız (${HO.depo.rehberHedef()} kelime/dk)`], [150, '150 kelime/dk'], [200, '200 kelime/dk'], [250, '250 kelime/dk'], [300, '300 kelime/dk'], [350, '350 kelime/dk'], [400, '400 kelime/dk'], [500, '500 kelime/dk']],
        varsayilan: 'oto',
      },
      HO.ui.metinSecenegi(),
      { ad: 'metronom', etiket: 'Metronom (tık sesi)', degerler: [['kapali', 'Kapalı'], ['acik', 'Açık']], varsayilan: 'kapali' },
    ],
    async calistir(sahne, s, ctx, { bilgi }) {
      let kdk = s.hiz === 'oto' ? HO.depo.rehberHedef() : s.hiz;
      const baslangicKdk = kdk;
      const metin = HO.depo.metinKaynak(s.kaynak, HO.icerik.alistirma);
      await HO.ui.geriSayim(sahne, ctx, metin.baslik);
      const { govde, kelimeler } = HO.ui.metinYerlestir(sahne, metin, 'rehber rehber-' + s.mod);
      const agirlik = u.kelimeAgirliklari(kelimeler.map((k) => k.textContent));
      kelimeler.forEach((k, i) => (k._w = agirlik[i]));
      window.scrollTo(0, 0);

      const birimler = SATIRLI(s.mod) ? satirlar(kelimeler) : gruplar(kelimeler, s.grup);
      let duraklat = false;
      let devamEt = null;
      const yaz = () => (bilgi.textContent = `${kdk} kelime/dk${duraklat ? ' · Duraklatıldı' : ''}`);
      yaz();
      ctx.listen(window, 'keydown', (e) => {
        if (e.code === 'Space') {
          e.preventDefault();
          duraklat = !duraklat;
          if (!duraklat && devamEt) devamEt();
          yaz();
        } else if (e.code === 'ArrowUp') {
          e.preventDefault();
          kdk = Math.min(1500, kdk + 10);
          yaz();
        } else if (e.code === 'ArrowDown') {
          e.preventDefault();
          kdk = Math.max(60, kdk - 10);
          yaz();
        }
      });
      govde.addEventListener('click', () => {
        duraklat = !duraklat;
        if (!duraklat && devamEt) devamEt();
        yaz();
      });

      const t0 = performance.now();
      let bekleme = 0;
      let sonSatirY = null;
      let oncekiP = null;
      for (const b of birimler) {
        while (duraklat) {
          const tp = performance.now();
          await ctx.promise((res) => (devamEt = res));
          bekleme += performance.now() - tp;
        }
        b.forEach((k) => k.classList.add('aktif'));
        if (s.metronom === 'acik') HO.ui.tik(b[0].dataset.p !== oncekiP);
        oncekiP = b[0].dataset.p;
        const y = b[0].getBoundingClientRect().top;
        if (sonSatirY === null || y !== sonSatirY) {
          sonSatirY = y;
          const vh = window.innerHeight;
          if (y > vh * 0.62 || y < vh * 0.12) {
            window.scrollBy({ top: y - vh * 0.35, behavior: 'smooth' });
            sonSatirY = null;
          }
        }
        const ms = b.reduce((a, k) => a + k._w, 0) * (60000 / kdk);
        await ctx.wait(ms);
        b.forEach((k) => {
          k.classList.remove('aktif');
          k.classList.add('okundu');
        });
      }
      const sure = performance.now() - t0 - bekleme;
      const cevap = metin.sorular && metin.sorular.length ? await HO.ui.sorular(sahne, metin.sorular, ctx) : { dogru: null, toplam: 0, oran: null };
      return {
        metin: metin.id,
        mod: s.mod,
        grup: SATIRLI(s.mod) ? null : s.grup,
        kdk,
        baslangicKdk,
        gercekKdk: Math.round(kelimeler.length / (sure / 60000)),
        dogru: cevap.dogru,
        toplam: cevap.toplam,
        oran: cevap.oran,
      };
    },
    ozet: (r) => [
      ['Görünüm', MODLAR[r.mod] + (r.grup ? ` · ${r.grup} kelime` : '')],
      ['Hız', r.kdk + ' kelime/dk'],
      ['Anlama', HO.ui.anlamaYazi(r)],
    ],
    notlar: (r) =>
      typeof r.oran !== 'number'
        ? ['Bu metnin sorusu olmadığı için hedef hız bu sonuçla değişmedi.']
        : r.oran < 0.7
        ? ['Anlama %70’in altında. Bir sonraki rehberli okumada hız bir basamak düşürülecek.']
        : [`Bir sonraki hedef hız: ${HO.depo.rehberHedef()} kelime/dk.`],
  };
})();
