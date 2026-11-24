'use strict';
// Anlama teknikleri için alıştırma metinlerine ek bilgiler (özgün, Hızlı Oku için yazıldı).
// anahtar: önerilen anahtar kelimeler; metinde geçtiği biçimiyle (noktalama dikkate alınmaz).
// bes: 5N1K soruları ve örnek cevaplar. anaFikir: çoktan seçmeli, doğru cevap ilk sırada.
HO.icerik = HO.icerik || {};

HO.icerik.anlama = {
  fener: {
    anahtar: ['bekçisiydi', 'Karadeniz', 'basamağını', 'ışığı', 'saniyede', 'fırtına', 'jeneratörü', 'kaptanı', 'rotasını', 'hamsi', 'paylaştı'],
    bes: [
      { tur: 'Kim', soru: 'Metnin ana kişisi kimdir?', cevap: 'Fener bekçisi Şaban Efendi.' },
      { tur: 'Nerede', soru: 'Olay nerede geçer?', cevap: 'Karadeniz kıyısında küçük bir burundaki deniz fenerinde.' },
      { tur: 'Ne zaman', soru: 'Elektrik ne zaman kesildi?', cevap: 'Bir kış gecesi, şiddetli bir fırtınada.' },
      { tur: 'Ne', soru: 'O gece ne oldu?', cevap: 'Elektrik kesildi; Şaban Efendi yedek jeneratörle feneri yaktı ve yolunu kaybeden bir balıkçı teknesi rotasını düzeltti.' },
      { tur: 'Nasıl', soru: 'Şaban Efendi ışığı nasıl yanık tuttu?', cevap: 'Yedek jeneratörü çalıştırıp sabaha kadar her saat başı yakıtını kontrol etti.' },
      { tur: 'Neden', soru: 'Kaptan neden fenere teşekküre geldi?', cevap: 'Fenerin ışığını görünce kıyıya çarpmadan rotasını düzeltebildiği için.' },
    ],
    anaFikir: {
      soru: 'Metnin ana fikri hangisidir?',
      secenekler: ['İşini her koşulda özenle yapan biri, farkında olmadan başkalarının hayatını kurtarabilir.', 'Fırtınalı havalarda denize açılmamak gerekir.', 'Deniz fenerleri artık elektrikle çalışmaktadır.', 'Balıkçılar hamsiyi komşularıyla paylaşır.'],
      dogru: 0,
    },
  },
  leylek: {
    anahtar: ['göçmen', 'yuvalarını', 'kiloyu', 'sıcak', 'enerji', 'kaçınırlar', 'İstanbul', 'eylül', 'Cebelitarık', 'gagalarını', 'müjdecisi'],
    bes: [
      { tur: 'Kim', soru: 'Metin kimi anlatıyor?', cevap: 'Göçmen kuşlar olan leylekleri.' },
      { tur: 'Ne', soru: 'Leylekler her yıl ne yapar?', cevap: 'Binlerce kilometre göç eder; ilkbaharda gelip yuva kurar, sonra Afrika’ya giderler.' },
      { tur: 'Nerede', soru: 'Göç yolları nereden geçer?', cevap: 'Büyük ölçüde İstanbul Boğazı ve Cebelitarık Boğazı üzerinden.' },
      { tur: 'Ne zaman', soru: 'Boğaz üzerinde en çok ne zaman görülürler?', cevap: 'Ağustos sonu ve eylül aylarında.' },
      { tur: 'Nasıl', soru: 'Az enerjiyle nasıl uçarlar?', cevap: 'Sıcak hava sütunlarında kanat çırpmadan daire çizerek yükselir, sonra süzülürler.' },
      { tur: 'Neden', soru: 'Neden uzun deniz geçişlerinden kaçınırlar?', cevap: 'Denizlerin üstünde sıcak hava akımları zayıf olduğu için.' },
    ],
    anaFikir: {
      soru: 'Metnin ana fikri hangisidir?',
      secenekler: ['Leylekler, sıcak hava akımlarından yararlanarak uzun göçlerini az enerjiyle yapar.', 'Leylekler yuvalarını yalnız minarelere kurar.', 'Leylekler denizi geçmekten hoşlanır.', 'Leylekler Anadolu’da kış boyunca kalır.'],
      dogru: 0,
    },
  },
  zeytin: {
    anahtar: ['Akdeniz', 'Kökleri', 'gümüşi', 'uzun', 'sürgünler', 'hasadı', 'olgunlaşmadan', 'aynı', 'acıdır', 'zeytinyağı', 'barışın'],
    bes: [
      { tur: 'Ne', soru: 'Metin neyi anlatıyor?', cevap: 'Zeytin ağacının özelliklerini, hasadını ve zeytinyağı yapımını.' },
      { tur: 'Nerede', soru: 'Zeytin en çok nerede yetişir?', cevap: 'Akdeniz ikliminde; Türkiye’de Ege, Marmara ve Akdeniz kıyılarında.' },
      { tur: 'Ne zaman', soru: 'Hasat ne zaman yapılır?', cevap: 'Sonbaharın sonundan kışın ortasına kadar.' },
      { tur: 'Nasıl', soru: 'Zeytinyağı nasıl elde edilir?', cevap: 'Zeytinler yıkanır, ezilip hamur yapılır ve bu hamurdan yağ ayrıştırılır.' },
      { tur: 'Neden', soru: 'Zeytin ağacı neden kuraklığa dayanır?', cevap: 'Kökleri derine ve geniş bir alana yayıldığı için.' },
    ],
    anaFikir: {
      soru: 'Metnin ana fikri hangisidir?',
      secenekler: ['Zeytin ağacı, kuraklığa dayanıklı, uzun ömürlü ve çok yönlü değeri olan bir Akdeniz ağacıdır.', 'Siyah zeytin ile yeşil zeytin farklı ağaçlardan toplanır.', 'Zeytin ağaçları yalnız Ege’de yetişir.', 'Zeytin dalı bir savaş simgesidir.'],
      dogru: 0,
    },
  },
  ay: {
    anahtar: ['yansıyan', 'konumu', 'evreleri', 'yeni', 'hilal', 'dördün', 'dolunay', 'Güneş', '29,5', 'takvim', 'yüzünü'],
    bes: [
      { tur: 'Ne', soru: 'Ay’ın evreleri nedir?', cevap: 'Ay’ın aydınlanan yüzünün Dünya’dan görülen kısmının gün gün değişmesi.' },
      { tur: 'Nasıl', soru: 'Ay nasıl parlar?', cevap: 'Güneş’ten gelen ışığı yansıtarak; kendi ışığı yoktur.' },
      { tur: 'Neden', soru: 'Evreler neden oluşur?', cevap: 'Ay Dünya’nın çevresinde dönerken Güneş’e göre konumu değiştiği için.' },
      { tur: 'Ne zaman', soru: 'Dolunay ne zaman doğar?', cevap: 'Güneş batarken.' },
      { tur: 'Ne', soru: 'Bir döngü ne kadar sürer?', cevap: 'Yaklaşık 29,5 gün.' },
    ],
    anaFikir: {
      soru: 'Metnin ana fikri hangisidir?',
      secenekler: ['Ay’ın görünüşü, Güneş’e göre konumu değiştikçe düzenli bir döngüyle değişir.', 'Ay kendi ışığını üretir.', 'Ay’ın arka yüzü dolunayda görülür.', 'Hicri takvim Güneş’e göre hazırlanır.'],
      dogru: 0,
    },
  },
  pazar: {
    anahtar: ['cumartesi', 'sekizi', 'listesinde', 'Mehmet', 'domates', 'ödev', 'matematik', 'dokuzlar', 'parasını', 'dereotu', 'Aferin'],
    bes: [
      { tur: 'Kim', soru: 'Metnin ana kişisi kimdir?', cevap: 'Emekli matematik öğretmeni Zeynep Hanım.' },
      { tur: 'Nerede', soru: 'Olay nerede geçer?', cevap: 'Mahalledeki cumartesi semt pazarında.' },
      { tur: 'Ne zaman', soru: 'Ne zaman?', cevap: 'Bir cumartesi sabahı, sekizi çeyrek geçe.' },
      { tur: 'Ne', soru: 'Pazarda ne oldu?', cevap: 'Zeynep Hanım, ödevinde zorlanan küçük bir kıza dokuzlar tablosunu öğretti.' },
      { tur: 'Nasıl', soru: 'Kıza nasıl yardım etti?', cevap: 'Dokuzlar tablosunu parmaklarla hesaplamanın kolay bir yolunu göstererek.' },
      { tur: 'Neden', soru: 'Satıcı neden para almadı?', cevap: 'Kızına yardım ettiği için teşekkür etmek istedi.' },
    ],
    anaFikir: {
      soru: 'Metnin ana fikri hangisidir?',
      secenekler: ['Küçük bir yardım, beklenmedik bir yerde birinin gününü değiştirebilir.', 'Pazara erken gitmek daha ucuzdur.', 'Domatesler en iyi bahçede yetişir.', 'Çarpım tablosu ezberlenmeden öğrenilemez.'],
      dogru: 0,
    },
  },
  peri: {
    anahtar: ['Kapadokya’daki', 'volkanlar', 'küller', 'tüf', 'sert', 'aşındırdı', 'şapka', 'erir', 'oyuldu', 'yeraltı', 'UNESCO'],
    bes: [
      { tur: 'Ne', soru: 'Peri bacaları nedir?', cevap: 'Tepesinde sert bir kaya taşıyan, konik biçimli doğal kaya kuleleri.' },
      { tur: 'Nerede', soru: 'Nerededir?', cevap: 'Kapadokya’da (Göreme ve çevresi).' },
      { tur: 'Ne zaman', soru: 'Oluşumları ne zaman başladı?', cevap: 'Milyonlarca yıl önce volkanların püskürmesiyle; aşınma bugün de sürüyor.' },
      { tur: 'Nasıl', soru: 'Nasıl oluştular?', cevap: 'Volkan küllerinden oluşan yumuşak tüf aşınırken, sert kayanın koruduğu bölümler ayakta kaldı.' },
      { tur: 'Neden', soru: 'İnsanlar neden bu bölgede kayalara ev oydu?', cevap: 'Tüf yumuşak olduğu için kolayca oyulabiliyordu.' },
    ],
    anaFikir: {
      soru: 'Metnin ana fikri hangisidir?',
      secenekler: ['Peri bacaları, volkanik kayaların aşınmasıyla oluşmuş ve insan yaşamını da şekillendirmiştir.', 'Peri bacaları insanlar tarafından inşa edilmiştir.', 'Kapadokya’da volkanlar hâlâ püskürmektedir.', 'Tüf çok sert bir kayadır.'],
      dogru: 0,
    },
  },
  satranc: {
    anahtar: ['Hindistan’da', 'çaturanga', 'ordusunu', 'İran’a', 'Farsçadan', 'Avrupa’ya', 'vezir', 'altmış', 'piyade', 'mat', 'sabırlı'],
    bes: [
      { tur: 'Ne', soru: 'Metin neyi anlatıyor?', cevap: 'Satrancın kökenini, yayılışını ve temel kurallarını.' },
      { tur: 'Nerede', soru: 'Satranç nerede doğdu?', cevap: 'Hindistan’da, çaturanga adlı oyundan.' },
      { tur: 'Ne zaman', soru: 'Bugünkü kurallar ne zaman biçimlendi?', cevap: 'On beşinci yüzyılın sonlarında, Avrupa’da.' },
      { tur: 'Nasıl', soru: 'Satranç Avrupa’ya nasıl ulaştı?', cevap: 'İran ve İslam dünyası üzerinden, Endülüs ve Sicilya yoluyla.' },
      { tur: 'Neden', soru: 'Oyun neden hızlandı?', cevap: 'Vezir tahtanın en güçlü taşı hâline geldiği için.' },
    ],
    anaFikir: {
      soru: 'Metnin ana fikri hangisidir?',
      secenekler: ['Satranç, Hindistan’dan dünyaya yayılırken değişmiş ve bugünkü biçimini almış köklü bir oyundur.', 'Satranç Avrupa’da icat edilmiştir.', 'Satrançta amaç rakibin bütün taşlarını almaktır.', 'Satranç yalnız internette oynanır.'],
      dogru: 0,
    },
  },
  bisiklet: {
    anahtar: ['bisiklet', 'kırk', 'lastiklerini', 'balıkçılın', 'yokuşa', 'vites', 'kahvesi', 'kapalı', 'altı', 'beşte', 'albümünün'],
    bes: [
      { tur: 'Kim', soru: 'Metnin kahramanları kimler?', cevap: 'Emre ile Selin.' },
      { tur: 'Ne', soru: 'Ne yaptılar?', cevap: 'Göl çevresinde bir günlük bisiklet turu.' },
      { tur: 'Nerede', soru: 'Nerede?', cevap: 'Yaklaşık kırk kilometrelik bir gölün çevresinde.' },
      { tur: 'Ne zaman', soru: 'Ne zaman?', cevap: 'Yaz tatilinin son haftasında; sabah dokuzdan akşamüstü beşe kadar.' },
      { tur: 'Nasıl', soru: 'Yokuşu Selin nasıl çıktı?', cevap: 'Vites değiştirerek yavaş yavaş tırmandı.' },
      { tur: 'Neden', soru: 'Neden köy yolundan dolaştılar?', cevap: 'Gölün kuzeyindeki yol tamir için kapalıydı.' },
    ],
    anaFikir: {
      soru: 'Metnin ana fikri hangisidir?',
      secenekler: ['Yolda çıkan zorluklar, iyi hazırlık ve esneklikle güzel bir deneyime dönüşebilir.', 'Bisiklet sürmek tehlikelidir.', 'Göl çevresindeki yollar her zaman kapalıdır.', 'Fotoğraf çekmek için durmak gerekir.'],
      dogru: 0,
    },
  },
  gokkusagi: {
    anahtar: ['güneşin', 'arkanızda', 'karışımıdır', 'kırılır', 'yansıyıp', 'kırmızı', 'mordur', 'ikinci', 'ters', 'kendi', 'ulaşılamaz'],
    bes: [
      { tur: 'Ne', soru: 'Gökkuşağı nedir?', cevap: 'Güneş ışığının yağmur damlalarında renklerine ayrılmasıyla görülen renkli yay.' },
      { tur: 'Nerede', soru: 'Nerede görülür?', cevap: 'Güneşin karşı tarafında: sabah batıda, akşamüstü doğuda.' },
      { tur: 'Ne zaman', soru: 'Ne zaman görülür?', cevap: 'Yağmurun ardından güneş açtığında.' },
      { tur: 'Nasıl', soru: 'Nasıl oluşur?', cevap: 'Işık damlaya girerken kırılır, arka yüzden yansır, çıkarken yeniden kırılır; renkler ayrılır.' },
      { tur: 'Neden', soru: 'İkinci yayda renkler neden ters?', cevap: 'Işık damlanın içinde iki kez yansıdığı için.' },
    ],
    anaFikir: {
      soru: 'Metnin ana fikri hangisidir?',
      secenekler: ['Gökkuşağı, güneş ışığının yağmur damlalarında kırılıp yansımasıyla oluşan bir ışık olayıdır.', 'Gökkuşağının belirli bir yeri ve ucu vardır.', 'Gökkuşağı yalnız öğle saatlerinde görülür.', 'Gökkuşağında tam olarak yedi ayrı renk vardır.'],
      dogru: 0,
    },
  },
  maya: {
    anahtar: ['mantar', 'şekerlerle', 'karbondioksit', 'mayalanma', 'ağ', 'kabarcıkları', 'ılık', 'ölebilir', 'Pasteur’ün', 'ekşi', 'bakteriler'],
    bes: [
      { tur: 'Ne', soru: 'Maya nedir?', cevap: 'Tek hücreli bir mantar türü.' },
      { tur: 'Nasıl', soru: 'Ekmek nasıl kabarır?', cevap: 'Maya şekerle beslenip karbondioksit üretir; gaz kabarcıkları hamurdaki esnek ağda sıkışıp hamuru şişirir.' },
      { tur: 'Kim', soru: 'Mayalanmanın canlılarca yapıldığını kim gösterdi?', cevap: 'Louis Pasteur.' },
      { tur: 'Ne zaman', soru: 'Bu ne zaman anlaşıldı?', cevap: 'On dokuzuncu yüzyılda.' },
      { tur: 'Neden', soru: 'Tariflerde neden ılık su önerilir?', cevap: 'Maya ılık ortamı sever; çok sıcak su mayayı öldürebilir, soğukta hamur yavaş kabarır.' },
    ],
    anaFikir: {
      soru: 'Metnin ana fikri hangisidir?',
      secenekler: ['Ekmeğin kabarması, mayanın ürettiği gazla gerçekleşen canlı bir süreçtir.', 'Ekmek yapmak için maya gerekmez.', 'Maya sıcak suda daha iyi çalışır.', 'Ekşi maya yalnız bakterilerden oluşur.'],
      dogru: 0,
    },
  },
};
