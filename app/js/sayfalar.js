'use strict';
// Sayfalar: ana sayfa, egzersiz listesi, ilerleme, ayarlar.
(function () {
  const u = HO.u;
  const el = u.el;
  const sayfa = {};


  function kutucuk(etiket, deger, alt) {
    return el('div', { class: 'kutucuk' }, el('div', { class: 'kutucuk-etiket', text: etiket }), el('div', { class: 'kutucuk-deger', text: deger }), alt ? el('div', { class: 'kutucuk-alt', text: alt }) : null);
  }

  function planDurumu() {
    const bas = HO.depo.planBaslangic();
    if (!bas) return null;
    const fark = u.dayDiff(bas, u.dayKey());
    const dongu = Math.floor(fark / 28);
    const donguBas = u.addDays(bas, dongu * 28);
    const hafta = Math.floor((fark - dongu * 28) / 7) + 1;
    const haftaBas = u.addDays(donguBas, (hafta - 1) * 7);
    const gunlukGunler = new Set(HO.depo.sonuclar('gunluk').map((r) => r.gun));
    let buHafta = 0;
    for (let i = 0; i < 7; i++) if (gunlukGunler.has(u.addDays(haftaBas, i))) buHafta++;
    return { bas, dongu, donguBas, hafta, buHafta, gunlukGunler };
  }

  // Ana sayfadaki "odak akışı" görseli: satırlar merkezdeki odak noktasına akar.
  function odakGorseli() {
    const kap = el('div', { class: 'odak-gorsel', 'aria-hidden': 'true' });
    const ys = [40, 78, 116, 154, 192];
    const yollar = ys.map((y, i) => `M10 ${y} C 120 ${y}, 170 ${116 + (y - 116) * 0.25}, 250 116`);
    kap.innerHTML =
      `<svg viewBox="0 0 400 232">` +
      yollar.map((d) => `<path d="${d}" class="o-iz"/>`).join('') +
      yollar.map((d, i) => `<path d="${d}" class="o-satir" style="--i:${i}"/>`).join('') +
      `<circle cx="262" cy="116" r="34" class="o-halka"/><circle cx="262" cy="116" r="34" class="o-halka h2"/>` +
      `<circle cx="262" cy="116" r="12" class="o-merkez"/>` +
      `<path d="M300 92 C 340 100, 360 108, 392 108 M300 140 C 340 132, 360 124, 392 124" class="o-iz"/>` +
      `</svg>`;
    return kap;
  }

  function kategoriBolumu() {
    return [
      el('div', { class: 'bolum-bas' }, el('h2', { text: 'Egzersiz kategorileri' }), el('a', { href: '#/egzersizler', text: 'Tümü →' })),
      el('div', { class: 'kat-izgara' }, HO.kategoriler.map((k, i) => sayfa.kategoriKarti(k, i))),
    ];
  }

  sayfa.ana = function (kap) {
    const d = HO.depo;
    if (!d.sonuclar().length) {
      kap.replaceChildren(
        el(
          'section',
          { class: 'karsilama-alan' },
          el(
            'div',
            null,
            el('div', { class: 'adim-yazi', text: 'Ücretsiz okuma antrenmanı' }),
            el('h1', null, 'Daha hızlı oku, ', el('em', { text: 'anlayarak' }), ' oku.'),
            el('p', { text: 'Günde 15–20 dakikalık antrenman: göz hareketleri, dikkat, görüş alanı ve okuma teknikleri. Hızınız her zaman anlama sorularıyla birlikte ölçülür.' }),
            el('p', { class: 'soluk', text: 'İlk adım kısa bir seviye testi. Sonuçlarınız yalnız bu cihazda saklanır.' }),
            el('div', { class: 'dugmeler' }, el('a', { class: 'dugme ana buyuk', href: '#/egzersiz/test', text: 'Seviye testiyle başla' }), el('a', { class: 'dugme ikincil', href: '#/egzersizler', text: 'Egzersizlere göz at' }))
          ),
          odakGorseli()
        ),
        ...kategoriBolumu()
      );
      return;
    }
    const plan = planDurumu();
    const bugunYapildi = plan.gunlukGunler.has(u.dayKey());
    const adimlar = HO.gunlukAdimlar();
    const etkili = d.sonEtkiliHiz();
    const sonTest = d.son('test');
    kap.replaceChildren(
      el(
        'section',
        { class: 'karsilama-alan' },
        el(
          'div',
          null,
          el('div', { class: 'adim-yazi', text: `${plan.hafta}. hafta${plan.dongu ? ` · ${plan.dongu + 1}. tur` : ''} · Bu hafta ${plan.buHafta}/5 gün` }),
          el('h1', { text: bugunYapildi ? 'Bugünkü antrenmanınız tamam.' : 'Bugünkü antrenmanınız hazır.' }),
          el('p', { text: bugunYapildi ? 'İsterseniz tekrar yapabilir ya da tek tek egzersiz seçebilirsiniz.' : `${adimlar.length} adım, yaklaşık ${Math.round(adimlar.length * 2.5)} dakika. İstediğiniz adımı atlayabilirsiniz.` }),
          el('div', { class: 'dugmeler' }, el('a', { class: 'dugme ' + (bugunYapildi ? 'ikincil' : 'ana buyuk'), href: '#/gunluk', text: bugunYapildi ? 'Yeniden yap' : 'Antrenmanı başlat' }))
        ),
        odakGorseli()
      ),
      el(
        'section',
        { class: 'kart gunluk-kart' },
        el('h2', { text: 'Bugünün adımları' }),
        el(
          'ol',
          { class: 'adim-listesi zengin' },
          adimlar.map((a) => {
            const ex = HO.egz[a.egz];
            const k = HO.kategoriBul(a.egz) || HO.kategoriBul(ex.taban ? a.egz : '');
            return el('li', { class: k ? 'kat-' + k.id : '' }, HO.ikon(ex), el('span', { class: 'adim-ad' }, ex.ad, el('small', { text: ex.sure })));
          })
        )
      ),
      el(
        'section',
        { class: 'kutucuklar' },
        kutucuk('Son etkili hız', etkili ? u.num(etkili) : '-', 'kelime/dk'),
        kutucuk('Seri', String(d.seri()), 'gün üst üste'),
        kutucuk('Rehber hedef hızı', String(d.rehberHedef()), 'kelime/dk'),
        kutucuk('Son seviye testi', sonTest ? u.fmtDate(sonTest.gun) : '-', d.testGerekli() ? 'Yeni test zamanı' : 'Haftaya tekrar')
      ),
      ...kategoriBolumu()
    );
    kap.querySelectorAll('.kutucuk').forEach((k, i) => k.style.setProperty('--sira', i));
  };

  // Kategori kartı (Egzersizler sayfası ve ana sayfa).
  sayfa.kategoriKarti = function (k, i) {
    return el(
      'a',
      { class: 'kat-kart isikli kat-' + k.id, href: '#/kategori/' + k.id, style: { '--sira': i } },
      HO.katGorsel(k.id, 'kat-gorsel'),
      el('span', { class: 'kat-yazi' }, el('strong', { text: k.ad }), el('span', { text: k.kisa }), el('small', { text: k.egz.length + ' egzersiz' })),
      el('span', { class: 'kat-ok', 'aria-hidden': 'true', text: '→' })
    );
  };

  sayfa.egzersizler = function (kap) {
    kap.replaceChildren(
      el('header', { class: 'sayfa-bas' }, el('h1', { text: 'Egzersizler' }), el('p', { class: 'soluk', text: 'Günlük antrenman bunları sırayla yaptırır. Buradan tek tek de çalışabilirsiniz.' })),
      el('div', { class: 'kat-izgara' }, HO.kategoriler.map((k, i) => sayfa.kategoriKarti(k, i)))
    );
  };

  sayfa.egzKarti = function (ex, i, katId) {
    return el(
      'a',
      { class: 'egz-kart isikli kat-' + katId, href: '#/egzersiz/' + ex.id, style: { '--sira': i } },
      HO.ikon(ex),
      el('span', { class: 'egz-yazi' }, el('strong', { text: ex.ad }), el('span', { text: ex.kisa }), el('small', { text: ex.sure + (ex.flas ? ' · yanıp sönen öğe' : '') }))
    );
  };

  sayfa.kategori = function (kap, id) {
    const k = HO.kategoriler.find((x) => x.id === id);
    if (!k) {
      location.hash = '#/egzersizler';
      return;
    }
    kap.replaceChildren(
      el(
        'header',
        { class: 'kat-bas kat-' + k.id },
        el('a', { class: 'geri-link', href: '#/egzersizler', text: '← Tüm kategoriler' }),
        el('div', { class: 'kat-bas-ic' }, el('div', null, el('h1', { text: k.ad }), el('p', { class: 'soluk', text: k.kisa })), HO.katGorsel(k.id, 'kat-bas-gorsel'))
      ),
      el('div', { class: 'egz-kartlar' }, k.egz.map((id2, i) => sayfa.egzKarti(HO.egz[id2], i, k.id)))
    );
  };

  function enUzunSeri() {
    const gunler = [...HO.depo.aktifGunler()].sort();
    let en = 0;
    let n = 0;
    let onceki = null;
    for (const g of gunler) {
      n = onceki && u.dayDiff(onceki, g) === 1 ? n + 1 : 1;
      en = Math.max(en, n);
      onceki = g;
    }
    return en;
  }

  const ROZETLER = [
    { ad: 'İlk ölçüm', aciklama: 'İlk seviye testini tamamladınız.', kosul: (d) => d.sonuclar('test').length > 0 },
    { ad: 'İlk antrenman', aciklama: 'İlk günlük antrenmanı bitirdiniz.', kosul: (d) => d.sonuclar('gunluk').length > 0 },
    { ad: '3 günlük seri', aciklama: '3 gün üst üste çalıştınız.', kosul: () => enUzunSeri() >= 3 },
    { ad: '7 günlük seri', aciklama: '7 gün üst üste çalıştınız.', kosul: () => enUzunSeri() >= 7 },
    { ad: '4 haftalık plan', aciklama: '20 gün günlük antrenman yaptınız.', kosul: () => HO.gunlukSayisi() >= 20 },
    { ad: 'Keskin göz', aciklama: '5 × 5 Schulte tablosunu 30 saniyenin altında bitirdiniz.', kosul: (d) => d.sonuclar('schulte').some((r) => r.boyut === 5 && r.sure < 30000) },
    { ad: 'Pilot gözü', aciklama: 'Pilot flaş eğitiminde 50 ms ya da altında eşiğe indiniz.', kosul: (d) => d.sonuclar('flas').some((r) => r.esik <= 50) },
    { ad: 'Tam anlama', aciklama: 'Bir okuma testinde tüm soruları doğru cevapladınız.', kosul: (d) => [...d.sonuclar('test'), ...d.sonuclar('okuma')].some((r) => r.oran === 1) },
    { ad: 'İz sürücü', aciklama: 'Akıllı taramada ortalama 10 saniyenin altına indiniz.', kosul: (d) => d.sonuclar('tarama').some((r) => r.ortSure && r.ortSure < 10000) },
  ];

  function takvim(plan) {
    const bugun = u.dayKey();
    const aktif = HO.depo.aktifGunler();
    const satirlar = [];
    for (let h = 0; h < 4; h++) {
      const hucreler = [];
      let say = 0;
      for (let g = 0; g < 7; g++) {
        const k = u.addDays(plan.donguBas, h * 7 + g);
        const tam = plan.gunlukGunler.has(k);
        if (tam) say++;
        const sinif = ['gun', tam ? 'tam' : aktif.has(k) ? 'kismi' : '', k === bugun ? 'bugun' : '', k > bugun ? 'gelecek' : ''].join(' ');
        hucreler.push(el('div', { class: sinif, title: u.fmtDate(k) + (tam ? ': günlük antrenman tamam' : aktif.has(k) ? ': egzersiz yapıldı' : '') }, String(u.keyToDate(k).getDate())));
      }
      satirlar.push(el('div', { class: 'takvim-satir' }, el('div', { class: 'takvim-hafta', text: `${h + 1}. hafta` }), hucreler, el('div', { class: 'takvim-say', text: `${say}/5` })));
    }
    return el(
      'section',
      { class: 'kart' },
      el('h2', { text: '4 haftalık plan' }),
      el('p', { class: 'soluk', text: 'Haftada 5 gün günlük antrenman. Her hafta başında seviye testi.' }),
      el('div', { class: 'takvim' }, satirlar),
      el('div', { class: 'takvim-acik' }, el('span', { class: 'gun tam' }, ''), ' günlük antrenman  ', el('span', { class: 'gun kismi' }, ''), ' tek egzersiz')
    );
  }

  sayfa.ilerleme = function (kap) {
    const d = HO.depo;
    if (!d.sonuclar().length) {
      kap.replaceChildren(el('h1', { text: 'İlerleme' }), el('p', { text: 'Henüz sonuç yok. Seviye testiyle başlayabilirsiniz.' }), el('a', { class: 'dugme ana', href: '#/egzersiz/test', text: 'Seviye testi' }));
      return;
    }
    const plan = planDurumu();
    const okumalar = d.sonuclar().filter((r) => (r.tur === 'test' || r.tur === 'okuma') && typeof r.etkili === 'number');
    const etiket = (r) => (r.tur === 'test' ? 'Seviye testi' : 'Okuma');
    const kdk = (v, eksen) => (eksen ? u.num(v) : u.num(v) + ' kelime/dk');
    const yuzde = (v) => '%' + Math.round(v);
    const schulte = d.sonuclar('schulte').filter((r) => r.boyut === 5);
    const flas = d.sonuclar('flas').filter((r) => r.tur2 === 'rakam');
    const burdon = d.sonuclar('burdon');
    const cevre = d.sonuclar('cevresel').filter((r) => r.yon === 'yatay');
    const rozet = ROZETLER.map((r) => ({ ...r, var: r.kosul(d) }));

    kap.replaceChildren(
      el('h1', { text: 'İlerleme' }),
      el(
        'section',
        { class: 'kutucuklar' },
        kutucuk('Seri', String(d.seri()), 'gün üst üste'),
        kutucuk('Antrenman günü', String(HO.gunlukSayisi()), 'günlük antrenman'),
        kutucuk('Bu hafta', `${plan.buHafta}/5`, 'gün'),
        kutucuk('Son etkili hız', d.sonEtkiliHiz() ? u.num(d.sonEtkiliHiz()) : '-', 'kelime/dk')
      ),
      takvim(plan),
      el(
        'section',
        { class: 'grafikler' },
        HO.grafik('Etkili hız (kelime/dk)', okumalar.map((r) => ({ gun: r.gun, deger: r.etkili, etiket: etiket(r) })), kdk),
        HO.grafik('Anlama (%)', okumalar.map((r) => ({ gun: r.gun, deger: r.oran * 100, etiket: etiket(r) })), yuzde, { ust: 100 }),
        HO.grafik('Schulte 5 × 5 süresi (saniye)', schulte.map((r) => ({ gun: r.gun, deger: r.sure / 1000, etiket: r.hata + ' hata' })), (v, eksen) => (eksen ? Math.round(v) : v.toFixed(1).replace('.', ',')) + ' sn', { bos: 'Henüz 5 × 5 Schulte sonucu yok.' }),
        HO.grafik('Flaş eşiği, rakam dizisi (ms)', flas.map((r) => ({ gun: r.gun, deger: r.esik, etiket: r.uzunluk + ' rakam' })), (v) => Math.round(v) + ' ms', { bos: 'Henüz rakam dizisi sonucu yok.' }),
        HO.grafik('Burdon dikkat oranı (%)', burdon.map((r) => ({ gun: r.gun, deger: r.dikkat * 100, etiket: r.taranan + ' harf tarandı' })), yuzde, { ust: 100, bos: 'Henüz Burdon testi sonucu yok.' }),
        HO.grafik('Çevresel görüş genişliği, yatay (%)', cevre.map((r) => ({ gun: r.gun, deger: r.genislik, etiket: r.gosterim + ' ms' })), yuzde, { ust: 100, bos: 'Henüz yatay çevresel harf görme sonucu yok.' })
      ),
      el(
        'section',
        { class: 'kart' },
        el('h2', { text: 'Rozetler' }),
        el('div', { class: 'rozetler' }, rozet.map((r) => el('div', { class: 'rozet ' + (r.var ? 'var' : 'yok') }, el('span', { class: 'rozet-isaret', text: r.var ? '★' : '☆' }), el('strong', { text: r.ad }), el('small', { text: r.aciklama }))))
      )
    );
  };

  sayfa.ayarlar = function (kap) {
    const d = HO.depo;
    const a = d.ayarlar;
    const secim = (ad, etiket, degerler, deger, degistir) => {
      const s = el('select', { id: 'ay-' + ad });
      degerler.forEach(([v, t]) => {
        const o = el('option', { value: String(v), text: t });
        if (v === deger) o.selected = true;
        s.append(o);
      });
      s.addEventListener('change', () => degistir(degerler.find(([v]) => String(v) === s.value)[0]));
      return el('label', { class: 'secenek-satir', for: 'ay-' + ad }, el('span', { text: etiket }), s);
    };
    const uygula = (k) => (v) => {
      d.ayarla(k, v);
      HO.ui.ayarlariUygula();
      ornek.replaceChildren(ornekMetin());
    };
    const ornekMetin = () => el('div', { class: 'okuma-metni' }, el('p', { text: 'Örnek metin: Okuma metinleri bu boyutta ve bu satır aralığında gösterilir.' }));
    const ornek = el('div', { class: 'ornek' }, ornekMetin());

    const dosya = el('input', { type: 'file', accept: 'application/json,.json', hidden: true });
    dosya.addEventListener('change', async () => {
      if (!dosya.files[0]) return;
      try {
        await d.iceAktar(dosya.files[0]);
        HO.ui.ayarlariUygula();
        await HO.ui.pencere(el('p', { text: 'Yedek yüklendi.' }), [{ yazi: 'Tamam', deger: true, tur: 'ana' }]);
        sayfa.ayarlar(kap);
      } catch (e) {
        await HO.ui.pencere(el('p', { text: 'Yedek yüklenemedi: ' + e.message }), [{ yazi: 'Tamam', deger: true, tur: 'ana' }]);
      }
    });

    kap.replaceChildren(
      el('h1', { text: 'Ayarlar' }),
      el(
        'section',
        { class: 'kart' },
        el('h2', { text: 'Görünüm' }),
        secim('boyut', 'Okuma yazı boyutu', [[16, 'Küçük'], [19, 'Orta'], [22, 'Büyük'], [26, 'Çok büyük']], a.yaziBoyu, uygula('yaziBoyu')),
        secim('aralik', 'Satır aralığı', [[1.4, 'Dar'], [1.7, 'Normal'], [2, 'Geniş']], a.satirAraligi, uygula('satirAraligi')),
        secim('tema', 'Tema', [['sistem', 'Sistemle aynı'], ['acik', 'Açık'], ['koyu', 'Koyu']], a.tema, uygula('tema')),
        secim('hareket', 'Arayüz hareketleri', [['sistem', 'Sistem ayarına göre'], ['acik', 'Açık'], ['az', 'Azaltılmış']], a.hareket || 'sistem', uygula('hareket')),
        ornek
      ),
      el(
        'section',
        { class: 'kart' },
        el('h2', { text: 'Sağlık' }),
        secim('mola', 'Göz molası hatırlatıcısı (20 dakikada bir)', [[true, 'Açık'], [false, 'Kapalı']], a.gozMolasi, (v) => d.ayarla('gozMolasi', v)),
        secim('epi', 'Flaş egzersizlerinden önce epilepsi uyarısı', [[false, 'Her seferinde göster'], [true, 'Gösterme']], a.epilepsiGizle, (v) => d.ayarla('epilepsiGizle', v))
      ),
      el(
        'section',
        { class: 'kart' },
        el('h2', { text: 'Verileriniz' }),
        el('p', { text: 'Sonuçlarınız yalnız bu cihazda, bu tarayıcıda saklanır. Hesap, sunucu ya da takip kodu yoktur. Başka bir cihaza taşımak için yedek alıp orada yükleyebilirsiniz.' }),
        d.kalici ? null : el('p', { class: 'uyari', text: 'Tarayıcınız veri kaydetmeye izin vermiyor (gizli pencere olabilir). Sonuçlar sayfa kapanınca silinir.' }),
        el(
          'div',
          { class: 'dugmeler sola' },
          el('button', { class: 'dugme ikincil', text: 'Yedek al (JSON)', onclick: () => d.disaAktar() }),
          el('button', { class: 'dugme ikincil', text: 'Yedek yükle', onclick: () => dosya.click() }),
          el('button', {
            class: 'dugme tehlike',
            text: 'Tüm verileri sil',
            onclick: async () => {
              if (await HO.ui.onay('Tüm sonuçlarınız ve ayarlarınız silinecek. Bu geri alınamaz. Emin misiniz?', 'Sil')) {
                d.sifirla();
                HO.ui.ayarlariUygula();
                location.hash = '#/';
              }
            },
          }),
          dosya
        )
      ),
      el(
        'section',
        { class: 'kart' },
        el('h2', { text: 'Hakkında' }),
        el('p', { text: 'Hızlı Oku ücretsiz ve açık kaynak bir okuma antrenman programıdır. Okuma hızı her zaman anlama sorularıyla birlikte ölçülür. Etkili hız = okuma hızı × anlama oranı.' }),
        el('p', { class: 'soluk', text: 'Okuma metinleri bu program için özgün olarak yazılmıştır. Sürüm 0.4.2' })
      )
    );
  };

  HO.sayfa = sayfa;
})();
