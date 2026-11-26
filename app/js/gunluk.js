'use strict';
// Günlük antrenman: 15–20 dakikalık, otomatik sıralı adımlar. Desenler günden güne döner.
(function () {
  const u = HO.u;
  const el = u.el;

  HO.gunlukSayisi = () => new Set(HO.depo.sonuclar('gunluk').map((r) => r.gun)).size;

  HO.gunlukAdimlar = function () {
    const d = HO.gunlukSayisi();
    const sonRakam = HO.depo.son('flas', (r) => r.tur2 === 'rakam');
    let uzunluk = sonRakam ? sonRakam.uzunluk : 4;
    if (sonRakam && sonRakam.esik <= 60) uzunluk = Math.min(9, uzunluk + 1);

    const adimlar = [];
    if (HO.depo.testGerekli()) adimlar.push({ egz: 'test' });
    // Isınma: dikkat egzersizleri sırayla döner.
    const isinma = [
      { egz: 'schulte', secenek: { boyut: 5 } },
      { egz: 'burdon', secenek: { sure: 60 } },
      { egz: 'renk', secenek: { sure: 60 } },
      { egz: 'kelimeavi', secenek: { tur: 3 } },
    ][d % 4];
    const gorus = [
      { egz: d % 4 === 0 ? 'piramit-yukaridan' : 'piramit-asagidan', secenek: { hiz: 'oto', sure: 90, kaynak: 'program' } },
      { egz: 'beliren-' + ['yatay', 'capraz', 'rastgele'][d % 3], secenek: { adet: 50 } },
      { egz: 'cevresel-' + ['yatay', 'dikey', 'capraz'][d % 3], secenek: { deneme: 15 } },
    ][d % 3];
    adimlar.push(
      isinma,
      { egz: 'takip-' + ['yatay-sonsuzluk', 'yatay-zigzag', 'dikey-sonsuzluk', 'kum-saati', 'dikey-zigzag', 'sicrama'][d % 6], secenek: { sure: 60 } },
      { egz: 'flas-' + ['rakam', 'kelime', 'siluet', 'harf', 'grup'][d % 5], secenek: { uzunluk, deneme: 20 } },
      gorus,
      { egz: 'rehber-' + ['soluk', 'gizli', 'satir', 'silinen', 'dar'][d % 5], secenek: { hiz: 'oto', kaynak: 'program' } },
      { egz: 'tarama', secenek: { adet: 2 } },
      { egz: 'okuma', secenek: { kaynak: 'program' } }
    );
    return adimlar;
  };

  HO.gunlukCalistir = async function (kap, ctx) {
    const adimlar = HO.gunlukAdimlar();
    const durumlar = [];
    for (let i = 0; i < adimlar.length; i++) {
      const a = adimlar[i];
      const ex = HO.egz[a.egz];
      const r = await HO.ui.egzersizCalistir(kap, ex, ctx, {
        gunluk: true,
        secenek: a.secenek,
        adimYazi: `Günlük antrenman · Adım ${i + 1}/${adimlar.length}`,
      });
      durumlar.push({ egz: a.egz, durum: r.durum });
    }
    const tamam = durumlar.filter((x) => x.durum === 'bitti').length;
    HO.depo.sonucEkle('gunluk', { tamamlanan: tamam, adim: adimlar.length });
    const ana = el('a', { class: 'dugme ana buyuk', href: '#/', text: 'Ana sayfa' });
    const ilerleme = el('a', { class: 'dugme ikincil', href: '#/ilerleme', text: 'İlerlemeyi gör' });
    kap.replaceChildren(
      el(
        'section',
        { class: 'kart sonuc' },
        el('h1', { text: 'Günlük antrenman bitti' }),
        el('p', { text: `${adimlar.length} adımdan ${tamam} tanesini tamamladınız.` }),
        el(
          'ul',
          { class: 'adim-listesi' },
          durumlar.map((x) => el('li', { class: x.durum }, HO.egz[x.egz].ad, el('span', { text: x.durum === 'bitti' ? 'tamam' : 'atlandı' })))
        ),
        el('div', { class: 'dugmeler' }, ilerleme, ana)
      )
    );
    window.scrollTo(0, 0);
  };
})();
