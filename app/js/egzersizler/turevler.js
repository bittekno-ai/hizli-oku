'use strict';
// Seçenekli egzersizleri ayrı egzersizlere böler (ör. rehberle okumanın 5 görünümü = 5 egzersiz).
// Türev egzersiz, ana egzersizin kodunu sabit bir seçenekle çalıştırır; sonuçlar ana egzersiz
// adıyla kaydedilir (ilerleme grafikleri ve hedef hız hesapları bu yüzden değişmez).
(function () {
  const E = HO.egz;

  function turet(tabanId, v) {
    const taban = E[tabanId];
    const gizle = new Set([...Object.keys(v.sabit), ...(v.gizle || [])]);
    const ex = {
      ...taban,
      id: v.id,
      ad: v.ad,
      kisa: v.kisa,
      sure: v.sure || taban.sure,
      nasil: v.nasil || taban.nasil,
      ikon: v.ikon || tabanId,
      kayitId: taban.kayitId || taban.id,
      taban: tabanId,
      secenekler: (taban.secenekler || []).filter((s) => !gizle.has(s.ad)),
      calistir: (sahne, s, ctx, o) => taban.calistir(sahne, { ...s, ...v.sabit }, ctx, o),
    };
    E[v.id] = ex;
    return ex;
  }

  // Göz hareketleri
  const takipNasil = (ilk) => [ilk, 'Başınızı oynatmadan, yalnız gözlerinizle noktayı izleyin.', 'Ekrandan yaklaşık bir kol boyu uzakta oturun. Gözleriniz yorulursa durup birkaç kez göz kırpın.'];
  [
    ['yatay-sonsuzluk', 'Yatay sonsuzluk', 'Nokta yatay ∞ biçiminde döner.'],
    ['dikey-sonsuzluk', 'Dikey sonsuzluk', 'Nokta dik duran 8 biçiminde döner.'],
    ['yatay-zigzag', 'Yatay zigzag', 'Nokta soldan sağa zikzak çizerek gidip gelir.'],
    ['dikey-zigzag', 'Dikey zigzag', 'Nokta yukarıdan aşağı zikzak çizerek gidip gelir.'],
    ['kum-saati', 'Kum saati', 'Nokta kum saati biçimindeki çizginin köşelerine gider.'],
    ['sicrama', 'Kayan noktalar', 'Nokta ekranın iki yanı arasında sıçrar.'],
  ].forEach(([d, ad, kisa]) => turet('takip', { id: 'takip-' + d, ad, kisa, sabit: { desen: d }, nasil: takipNasil(kisa + ' Gözünüzle onu izleyin.') }));

  // Görüş alanı ve flaş
  [
    ['yatay', 'Çevresel görme: yatay', 'Sol, orta ve sağda beliren harfleri tanıyın.'],
    ['dikey', 'Çevresel görme: dikey', 'Üst, orta ve altta beliren harfleri tanıyın.'],
    ['capraz', 'Çevresel görme: çapraz', 'Çapraz köşelerde ve ortada beliren harfleri tanıyın.'],
  ].forEach(([y, ad, kisa]) => turet('cevresel', { id: 'cevresel-' + y, ad, kisa, sabit: { yon: y } }));
  [
    ['yatay', 'Beliren kelimeler: satır', 'Kelimeler satır satır, soldan sağa belirir.'],
    ['capraz', 'Beliren kelimeler: çapraz', 'Kelimeler çapraz çizgiler üzerinde belirir.'],
    ['rastgele', 'Beliren kelimeler: rastgele', 'Kelimeler ekranın rastgele yerlerinde belirir.'],
  ].forEach(([d, ad, kisa]) => turet('beliren', { id: 'beliren-' + d, ad, kisa, sabit: { desen: d } }));
  [
    ['rakam', 'Flaş: rakam dizisi', 'Kısa süre görünen rakamları tanıyın.', ['siluetGrup']],
    ['harf', 'Flaş: harf dizisi', 'Kısa süre görünen harfleri tanıyın.', ['siluetGrup']],
    ['kelime', 'Flaş: kelime', 'Kısa süre görünen kelimeyi tanıyın.', ['uzunluk', 'siluetGrup']],
    ['grup', 'Flaş: kelime grubu', 'Kısa süre görünen 2–4 kelimelik grubu tanıyın.', ['uzunluk', 'siluetGrup']],
  ].forEach(([t, ad, kisa, gizle]) => turet('flas', { id: 'flas-' + t, ad, kisa, sabit: { tur: t }, gizle }));
  turet('flas', {
    id: 'flas-siluet',
    ad: 'Flaş: siluet tanıma',
    kisa: 'Kısa süre görünen uçak, gemi ya da hayvan siluetini tanıyın.',
    sabit: { tur: 'siluet' },
    gizle: ['uzunluk'],
    nasil: [
      'Ekranın ortasındaki + işaretine bakın.',
      'Bir uçak, gemi ya da hayvan silueti çok kısa süre görünür. Hemen ardından yerine karışık lekeler gelir; bu lekeler gözde kalan izi siler.',
      'Dört seçenekten gördüğünüzü seçin (fareyle ya da 1–4 tuşlarıyla). Doğru cevapta gösterim süresi kısalır, yanlışta uzar.',
      'Renshaw yönteminde pilotlar uçak ve gemi siluetlerini bu şekilde tanımayı çalışırdı. Buradaki uçak ve gemiler kurgusaldır.',
    ],
  });

  // Okuma teknikleri: rehberle okumanın görünümleri
  const rehberOrtak = [
    'Hız, son ölçülen etkili hızınızın biraz üstüne ayarlanır. Anlama %70’in altında kalırsa bir sonraki seferde hız bir basamak düşer.',
    'Boşluk tuşu ya da metne dokunmak duraklatır. Yukarı/aşağı ok tuşları hızı 10 kelime/dk değiştirir. İsterseniz metronomu açın.',
    'Metin bitince anlama soruları gelir.',
  ];
  [
    ['soluk', 'Renklenen kelimeler', 'Silik metinde okunan kelime grubu renklenir.', 'Metin gri ve siliktir. Okunacak kelime ya da kelime grubu belirlediğiniz hızda renklenir; gözünüzle onu izleyin.', []],
    ['gizli', 'Gizli metin', 'Metin gizlidir; yalnız okunan kısım görünür.', 'Metnin tamamı gizlidir. Yalnız sırası gelen kelime grubu görünür; gözünüzle onu izleyin.', []],
    ['satir', 'Satır vurgusu', 'Okunan satır vurgulanır.', 'Metin satır satır vurgulanır. Vurgulanan satırı sonuna kadar okuyup bir sonrakine geçin.', ['grup']],
    ['silinen', 'Silinen metin', 'Kelimeler okundukça silinir.', 'Metin açıktır ama kelimeler belirlediğiniz hızda sırayla silinir. Silinmeden önce okumaya çalışın.', []],
    ['dar', 'Dar sütun okuma', 'Dar sütunda satır satır blok okuma.', 'Metin dar bir sütunda gösterilir ve satır satır vurgulanır. Her satırı tek bakışta, blok olarak görmeye çalışın.', ['grup']],
  ].forEach(([m, ad, kisa, ilk, gizle]) => turet('rehber', { id: 'rehber-' + m, ad, kisa, sabit: { mod: m }, gizle, nasil: [ilk, ...rehberOrtak] }));

  [
    ['yukaridan', 'Çam ağacı', 'Tek kelimeyle başlayıp aşağı doğru genişleyen satırlar.', 'Metin, tek kelimeyle başlayıp her satırda bir kelime artan satırlara bölünür; yukarıdan aşağı okunur.'],
    ['asagidan', 'Ters çam ağacı', 'Alttan başlayıp yukarı doğru genişleyen satırlar.', 'Metin, en altta tek kelimeyle başlar; satırlar yukarı doğru genişler ve aşağıdan yukarı okunur.'],
  ].forEach(([y, ad, kisa, ilk]) =>
    turet('piramit', { id: 'piramit-' + y, ad, kisa, sabit: { yon: y }, nasil: [ilk, 'Gözünüzü ortadaki ince çizgide tutun. Renklenen satırı tek bakışta bütün olarak görmeye çalışın.', 'Satırlar belirlediğiniz hızda sırayla renklenir.'] })
  );

  // Anlama
  turet('anlama', {
    id: 'anlama-anahtar',
    ad: 'Anahtar kelime bulma',
    kisa: 'Önemli kelimeleri seçin, onlarla hatırlayın.',
    sabit: { tur: 'anahtar' },
    nasil: [
      'Okurken her paragrafta en önemli bulduğunuz kelimelere dokunun (paragraf başına en çok 3).',
      'Okuma bitince metin kapanır; yalnız seçtiğiniz kelimelere bakarak soruları cevaplarsınız.',
      'Sonunda seçimleriniz önerilen anahtar kelimelerle karşılaştırılır.',
    ],
  });
  turet('anlama', {
    id: 'anlama-bes',
    ad: '5N1K okuma',
    kisa: 'Kim, ne, nerede, ne zaman, nasıl, neden?',
    sabit: { tur: 'bes' },
    nasil: [
      'Okumadan önce metne ait Kim, Ne, Nerede, Ne zaman, Nasıl, Neden sorularını görürsünüz.',
      'Metni bu soruların cevaplarını arayarak okursunuz. Sonra cevaplarınızı yazarsınız.',
      'Cevaplarınızı örnek cevaplarla karşılaştırıp kendinizi puanlarsınız; ardından bir ana fikir sorusu gelir.',
    ],
  });

  // Kategoriler: Egzersizler sayfası ve ana sayfa bu listeyi kullanır.
  HO.kategoriler = [
    { id: 'olcum', ad: 'Ölçüm', kisa: 'Hızınızı ve anlamanızı ölçün.', egz: ['test', 'okuma'] },
    { id: 'dikkat', ad: 'Dikkat', kisa: 'Seçici dikkat ve görsel arama.', egz: ['schulte', 'burdon', 'renk', 'kelimeavi'] },
    { id: 'goz', ad: 'Göz hareketleri', kisa: 'Gözle takip ve sıçrama.', egz: ['takip-yatay-sonsuzluk', 'takip-dikey-sonsuzluk', 'takip-yatay-zigzag', 'takip-dikey-zigzag', 'takip-kum-saati', 'takip-sicrama'] },
    {
      id: 'gorus',
      ad: 'Görüş alanı ve flaş',
      kisa: 'Çevresel görme ve hızlı tanıma.',
      egz: ['flas-rakam', 'flas-harf', 'flas-kelime', 'flas-grup', 'flas-siluet', 'cevresel-yatay', 'cevresel-dikey', 'cevresel-capraz', 'beliren-yatay', 'beliren-capraz', 'beliren-rastgele'],
    },
    { id: 'okuma', ad: 'Okuma teknikleri', kisa: 'Rehberli, bloklu ve odaklı okuma.', egz: ['rehber-soluk', 'rehber-gizli', 'rehber-satir', 'rehber-silinen', 'rehber-dar', 'piramit-yukaridan', 'piramit-asagidan', 'rsvp', 'tarama'] },
    { id: 'anlama', ad: 'Anlama', kisa: 'Okuduğunuzu yakalama teknikleri.', egz: ['anlama-anahtar', 'anlama-bes'] },
  ];
  HO.kategoriBul = (egzId) => HO.kategoriler.find((k) => k.egz.includes(egzId)) || null;
})();
