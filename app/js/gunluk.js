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
    adimlar.push(
      { egz: 'schulte', secenek: { boyut: 5 } },
      { egz: 'takip', secenek: { desen: ['yatay-sonsuzluk', 'dikey-sonsuzluk', 'kum-saati', 'sicrama'][d % 4], sure: 60 } },
      { egz: 'flas', secenek: { tur: ['rakam', 'kelime', 'grup'][d % 3], uzunluk, deneme: 20 } },
      d % 2 === 0
        ? { egz: 'piramit', secenek: { yon: d % 4 === 0 ? 'yukaridan' : 'asagidan', hiz: 'oto', sure: 90 } }
        : { egz: 'beliren', secenek: { desen: ['yatay', 'capraz', 'rastgele'][d % 3], adet: 50 } },
      { egz: 'rehber', secenek: { mod: ['soluk', 'gizli', 'satir'][d % 3], hiz: 'oto' } },
      { egz: 'tarama', secenek: { adet: 2 } },
      { egz: 'okuma' }
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
