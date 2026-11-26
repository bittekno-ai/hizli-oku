'use strict';
// Günlük antrenman: 13 adım, ağırlık göz egzersizlerinde. Desenler günden güne döner.
// Seviye testi günü son okuma adımının yerine test yapılır. Haftanın 5. gününde sonda haftalık anlama testi gelir.
(function () {
  const u = HO.u;
  const el = u.el;

  HO.gunlukSayisi = () => new Set(HO.depo.sonuclar('gunluk').map((r) => r.gun)).size;

  HO.gunlukAdimlar = function () {
    const d = HO.gunlukSayisi();
    const sonRakam = HO.depo.son('flas', (r) => r.tur2 === 'rakam');
    let uzunluk = sonRakam ? sonRakam.uzunluk : 4;
    if (sonRakam && sonRakam.esik <= 60) uzunluk = Math.min(9, uzunluk + 1);

    const testGunu = HO.depo.testGerekli();
    // Isınma: dikkat egzersizleri sırayla döner.
    const isinma = [
      { egz: 'schulte', secenek: { boyut: 5 } },
      { egz: 'burdon', secenek: { sure: 60 } },
      { egz: 'renk', secenek: { sure: 60 } },
      { egz: 'kelimeavi', secenek: { tur: 3 } },
    ][d % 4];
    const ters = d % 2;
    return [
      isinma,
      // Göz hareketleri: her gün dört takip
      { egz: ters ? 'takip-dikey-sonsuzluk' : 'takip-yatay-sonsuzluk', secenek: { sure: 60 } },
      { egz: ters ? 'takip-yatay-zigzag' : 'takip-dikey-zigzag', secenek: { sure: 60 } },
      { egz: 'takip-kum-saati', secenek: { sure: 60 } },
      { egz: 'takip-sicrama', secenek: { sure: 60 } },
      // Görüş alanı ve flaş
      { egz: 'flas-' + ['rakam', 'kelime', 'siluet', 'harf', 'grup'][d % 5], secenek: { uzunluk, deneme: 20 } },
      { egz: 'cevresel-' + ['yatay', 'dikey', 'capraz'][d % 3], secenek: { deneme: 15 } },
      { egz: 'beliren-' + ['yatay', 'capraz', 'rastgele'][d % 3], secenek: { adet: 50 } },
      // Okuma teknikleri
      { egz: ters ? 'piramit-asagidan' : 'piramit-yukaridan', secenek: { hiz: 'oto', sure: 90, kaynak: 'program' } },
      { egz: 'rehber-' + ['soluk', 'gizli', 'satir', 'silinen', 'dar'][d % 5], secenek: { hiz: 'oto', kaynak: 'program' } },
      { egz: 'rsvp', secenek: { hiz: 'oto', kaynak: 'program' } },
      { egz: 'tarama', secenek: { adet: 2 } },
      testGunu ? { egz: 'test' } : { egz: 'okuma', secenek: { kaynak: 'program' } },
    ];
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
    // Haftanın son okumasından sonra: hafta boyunca okunan metinlerin anlama soruları.
    if (HO.depo.haftalikTestZamani()) await HO.ui.haftalikTest(kap, ctx);
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
