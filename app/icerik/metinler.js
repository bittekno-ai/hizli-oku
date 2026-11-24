'use strict';
// Okuma metinleri. Hepsi Hızlı Oku için özgün olarak yazılmıştır (bkz. icerik/KAYNAKLAR.md).
// Soru biçimi: {soru, secenekler: [...], dogru: doğru seçeneğin sırası}. Seçenekler ekranda karıştırılır.
// tarama: akıllı tarama görevleri. "anahtar", cevabın geçtiği cümlede aynen bulunan ifadedir.
HO.icerik = HO.icerik || {};

// Seviye testi metinleri (yaklaşık 400 kelime, 5 soru). Her hafta biri kullanılır.
HO.icerik.testler = [
  {
    id: 'test-saatci',
    baslik: 'Saatçinin Çırağı',
    seviye: 'orta',
    paragraflar: [
      'Kasabanın eski çarşısında, bakırcılarla kumaşçıların arasında küçük bir saatçi dükkânı vardı. Dükkânın sahibi Hilmi Usta kırk yıldır aynı tezgâhın başında oturuyor, kasabadaki hemen her saati en az bir kez onarmış olmakla övünüyordu. Vitrinde duvar saatleri, cep saatleri ve camı çatlamış eski çalar saatler yan yana dururdu. Dükkâna girenler önce tik taklardan oluşan bir koroyla karşılaşır, sonra Hilmi Usta’nın gözlüğünün üstünden bakan meraklı gözlerini görürdü.',
      'Hilmi Usta’nın bir alışkanlığı vardı. Her sabah dükkânı açtığında bütün saatleri tek tek kurar, sonra meydandaki büyük saat kulesine bakarak hepsini aynı zamana getirirdi. Ona göre yanlış çalışan bir saat, hiç çalışmayan bir saatten daha tehlikeliydi, çünkü insanı yanıltırdı. Çocuğu ya da yardımcısı olmadığı için bildiklerinin bir gün kendisiyle birlikte kaybolacağından korkuyordu.',
      'Bir sonbahar sabahı dükkânın kapısında on dört yaşlarında bir çocuk belirdi. Adı Kerem’di. Okuldan sonra çalışabileceği bir yer aradığını, saatlerin içini çok merak ettiğini söyledi. Hilmi Usta çocuğa uzun uzun baktı, sonra tezgâhın altından tozlu bir kutu çıkardı. Kutunun içinde parçalara ayrılmış bir masa saati vardı. “Bunu bir hafta içinde yeniden çalıştırabilirsen seni yanıma alırım,” dedi.',
      'Kerem o hafta her gün dükkâna geldi. Parçaları beyaz bir bezin üstüne dizdi, her birinin yerini bir deftere çizdi. Dişlilerin birbirine nasıl geçtiğini anlamak için saatlerce büyüteçle baktı. Üçüncü gün küçük bir yayı kırdı ve neredeyse vazgeçiyordu. Hilmi Usta ona kızmadı. Çekmeceden yedek bir yay çıkarıp “Her usta önce birkaç yay kırmıştır,” diye gülümsedi.',
      'Altıncı günün akşamı masa saati yeniden tik taklamaya başladı. Ama saat her saatte iki dakika ileri gidiyordu. Kerem hayal kırıklığına uğradı. Usta ona sarkacın boyunu ayarlamayı gösterdi: sarkaç uzadıkça saat yavaşlıyor, kısaldıkça hızlanıyordu. Kerem küçük vidayı yarım tur çevirdi. Ertesi sabah saat, meydandaki kuleyle tam aynı zamanı gösteriyordu.',
      'Kerem o günden sonra dükkânın çırağı oldu. Yıllar geçti. Hilmi Usta emekli olduğunda dükkânın anahtarını ona bıraktı ve tek bir şey istedi: meydandaki saat kulesine her ay bir kez bakılmasını. Kerem bugün hâlâ aynı tezgâhta çalışıyor. Dükkâna gelen her yeni çırağa da önce tozlu bir kutu ve parçalara ayrılmış bir masa saati veriyor.',
    ],
    sorular: [
      { soru: 'Hilmi Usta kaç yıldır aynı tezgâhta çalışıyordu?', secenekler: ['Kırk yıl', 'Yirmi yıl', 'Otuz yıl', 'Elli yıl'], dogru: 0 },
      { soru: 'Hilmi Usta her sabah saatleri neye göre ayarlardı?', secenekler: ['Meydandaki saat kulesine', 'Radyodaki saat ayarına', 'Kendi cep saatine', 'Güneşin konumuna'], dogru: 0 },
      { soru: 'Kerem’e verilen ilk görev neydi?', secenekler: ['Parçalara ayrılmış bir masa saatini bir haftada çalıştırmak', 'Vitrindeki saatleri temizlemek', 'Çatlak bir saat camını değiştirmek', 'Bütün saatleri her sabah kurmak'], dogru: 0 },
      { soru: 'Saat ileri gidince sorun nasıl çözüldü?', secenekler: ['Sarkacın boyu ayarlandı', 'Yeni bir yay takıldı', 'Dişliler yağlandı', 'Saatin pili değiştirildi'], dogru: 0 },
      { soru: 'Kerem bugün yeni çıraklarına ilk olarak ne veriyor?', secenekler: ['Tozlu bir kutuda parçalara ayrılmış bir masa saati', 'Dükkânın anahtarını', 'Bir büyüteç ve bir defter', 'Saat kulesinin bakım listesini'], dogru: 0 },
    ],
  },
  {
    id: 'test-su',
    baslik: 'Suyun Bitmeyen Yolculuğu',
    seviye: 'orta',
    paragraflar: [
      'Bugün bardağınızdaki su, milyonlarca yıl önce bir dinozorun içtiği suyla aynı olabilir. Bunun nedeni, Dünya’daki suyun sürekli bir döngü içinde dolaşmasıdır. Su ne yoktan var olur ne de tamamen kaybolur; yalnızca biçim ve yer değiştirir. Bilim insanları bu dolaşıma su döngüsü adını verir.',
      'Döngünün itici gücü Güneş’tir. Güneş ışığı denizlerin, göllerin ve nehirlerin yüzeyini ısıtır. Isınan su buharlaşarak gaz hâline geçer ve havaya karışır. Buharlaşan suyun büyük bölümü okyanuslardan gelir, çünkü yeryüzündeki suyun çok büyük kısmı okyanuslarda bulunur. Bitkiler de yapraklarından havaya su buharı verir; buna terleme denir.',
      'Yükselen su buharı, yukarı çıktıkça soğuyan havada küçük su damlacıklarına dönüşür. Bu olaya yoğuşma denir. Milyarlarca damlacık bir araya gelince bulutları oluşturur. Bulutların içindeki damlacıklar çarpışıp birleştikçe büyür ve ağırlaşır. Hava akımları onları artık taşıyamadığında yağmur, kar ya da dolu olarak yere düşerler.',
      'Yere düşen suyun izleyebileceği birkaç yol vardır. Bir kısmı yüzeyden akarak derelere, nehirlere ve sonunda denizlere ulaşır. Bir kısmı toprağa sızar ve yeraltı suyu olarak kayaların arasındaki boşluklarda birikir. Yeraltı suları bazen yüzlerce, hatta binlerce yıl yerin altında kalabilir. Kaynaklardan çıkan su çoğu zaman bu uzun yolculuğun bir parçasıdır. Soğuk bölgelerde düşen kar ise buzullarda donmuş olarak çok uzun süre bekleyebilir.',
      'Yeryüzündeki suyun yalnızca küçük bir bölümü tatlı sudur ve bu tatlı suyun büyük kısmı buzullarda ve yeraltında saklıdır. İnsanların kolayca kullanabildiği göl ve nehir suları, toplam suyun çok küçük bir parçasıdır. Bu nedenle suyu kirletmemek ve israf etmemek, döngünün bize sunduğu kaynağı korumanın en basit yoludur.',
      'Su döngüsü yalnızca su sağlamakla kalmaz, iklimi de etkiler. Buharlaşma, yeryüzündeki ısıyı havaya taşır. Su buharı başka bir yerde yoğuşup yağmur olduğunda bu ısı oraya bırakılır. Böylece döngü, ısıyı bir bölgeden başka bölgelere taşıyarak gezegenin sıcaklığının dengelenmesine katkıda bulunur.',
    ],
    sorular: [
      { soru: 'Metne göre su döngüsünün itici gücü nedir?', secenekler: ['Güneş', 'Ay', 'Rüzgâr', 'Dünya’nın dönüşü'], dogru: 0 },
      { soru: 'Su buharının soğuyarak damlacıklara dönüşmesine ne denir?', secenekler: ['Yoğuşma', 'Buharlaşma', 'Terleme', 'Sızma'], dogru: 0 },
      { soru: 'Bitkilerin yapraklarından havaya su buharı vermesine ne denir?', secenekler: ['Terleme', 'Yoğuşma', 'Mayalanma', 'Erime'], dogru: 0 },
      { soru: 'Metne göre tatlı suyun büyük kısmı nerede bulunur?', secenekler: ['Buzullarda ve yeraltında', 'Göllerde ve nehirlerde', 'Bulutlarda', 'Okyanuslarda'], dogru: 0 },
      { soru: 'Metne göre su döngüsü iklimi nasıl etkiler?', secenekler: ['Isıyı bir bölgeden başka bölgelere taşır', 'Okyanusların tuzunu azaltır', 'Rüzgârı tamamen durdurur', 'Güneş ışığını engeller'], dogru: 0 },
    ],
  },
  {
    id: 'test-harita',
    baslik: 'Sandıktaki Harita',
    seviye: 'kolay',
    paragraflar: [
      'Elif yaz tatilini her yıl olduğu gibi babaannesinin köyünde geçiriyordu. Bir öğleden sonra yağmur başlayınca dışarı çıkamadı ve babaannesinin izniyle tavan arasındaki eski sandığı karıştırmaya karar verdi. Sandıkta naftalin kokan yün kazaklar, sararmış fotoğraflar ve bir deste mektup vardı. En altta ise dörde katlanmış, kenarları yıpranmış bir kâğıt duruyordu.',
      'Kâğıdı açınca bunun elle çizilmiş bir harita olduğunu gördü. Haritada köyün evleri, cami, okul ve dere kenarındaki değirmen küçük resimlerle gösterilmişti. Köşede mürekkeple yazılmış bir isim vardı: dedesinin adı. Elif’in dikkatini en çok, haritanın kuzeyinde çizilmiş ve yanına “Gelin Çeşmesi” yazılmış küçük bir çeşme çekti. Köyde böyle bir çeşmeyi hiç duymamıştı.',
      'Akşam yemeğinde haritayı babaannesine gösterdi. Babaannesi gözlüğünü takıp haritaya uzun uzun baktı. Çeşmenin, kendisi çocukken köyün en soğuk suyunu verdiğini, ama köye yeni su şebekesi gelince kimsenin oraya gitmediğini anlattı. “Şimdi herhalde otların altında kalmıştır,” dedi.',
      'Ertesi sabah Elif, kuzeni Can’la birlikte yola çıktı. Haritaya göre çeşme, değirmenden kuzeye giden patikanın sonundaki üç ceviz ağacının yanındaydı. Değirmeni kolayca buldular ama patika dikenli çalılarla kapanmıştı. Can’ın getirdiği bahçe makasıyla yol açarak ilerlediler. Bir saat sonra üç yaşlı ceviz ağacını gördüler. Ağaçların dibinde sarmaşıkla kaplı taş bir duvar vardı.',
      'Sarmaşıkları dikkatle temizleyince taşın üstüne oyulmuş bir yazı ortaya çıktı. Yazıda çeşmenin yapıldığı yıl ve “Gelen geçen içsin, hayır dua etsin” sözleri okunuyordu. Çeşmenin lülesinden su akmıyordu, ama yalağın dibinde hâlâ biraz nem vardı.',
      'Elif ile Can gördüklerini köyün muhtarına anlattılar. Muhtar, köyün gençleriyle birlikte bir hafta sonu çeşmenin çevresini temizlemeye karar verdi. Tıkanan su yolu açıldı ve çeşme yıllar sonra yeniden akmaya başladı. Babaannesi ilk suyu içtiğinde, tadının çocukluğundaki gibi olduğunu söyledi. Elif ise haritayı çerçeveletip köy kahvesinin duvarına astırdı.',
    ],
    sorular: [
      { soru: 'Elif haritayı nerede buldu?', secenekler: ['Tavan arasındaki eski bir sandıkta', 'Değirmenin içinde', 'Köy kahvesinde', 'Okulun kütüphanesinde'], dogru: 0 },
      { soru: 'Haritanın köşesinde kimin adı yazıyordu?', secenekler: ['Elif’in dedesinin', 'Babaannesinin', 'Köy muhtarının', 'Kuzeni Can’ın'], dogru: 0 },
      { soru: 'Haritaya göre çeşme neyin yanındaydı?', secenekler: ['Üç ceviz ağacının', 'Caminin', 'Okulun', 'Dere kenarındaki değirmenin'], dogru: 0 },
      { soru: 'Babaannesine göre çeşmeye neden kimse gitmez olmuştu?', secenekler: ['Köye yeni su şebekesi geldiği için', 'Suyu acılaştığı için', 'Yolu sel yüzünden yıkıldığı için', 'Çeşme başka yere taşındığı için'], dogru: 0 },
      { soru: 'Elif haritayla en sonunda ne yaptı?', secenekler: ['Çerçeveletip köy kahvesinin duvarına astırdı', 'Sandığa geri koydu', 'Muhtara hediye etti', 'Babaannesine bıraktı'], dogru: 0 },
    ],
  },
  {
    id: 'test-kagit',
    baslik: 'Kâğıdın Yolculuğu',
    seviye: 'zor',
    paragraflar: [
      'Bugün elimizden hiç düşürmediğimiz kâğıt, insanlık tarihinde oldukça yeni sayılır. Kâğıttan önce insanlar yazılarını kil tabletlere, taşlara, ağaç kabuklarına ve hayvan derilerine yazıyordu. Eski Mısır’da Nil kıyısında yetişen papirüs bitkisinin gövdesinden ince yapraklar hazırlanıyordu. Hayvan derisinden yapılan parşömen de uzun süre yaygın olarak kullanıldı. Bu malzemeler ya ağır, ya kırılgan, ya da çok pahalıydı.',
      'Kâğıdın Çin’de icat edildiği kabul edilir. Geleneksel anlatıya göre MS 105 yılında saray görevlisi Cai Lun, ağaç kabuğu, kenevir lifleri, eski kumaş parçaları ve balık ağlarını suda ezerek bir hamur elde etti. Bu hamuru ince bir elek üzerine yayıp kurutunca hafif ve dayanıklı bir yaprak ortaya çıktı. Arkeolojik buluntular, daha basit kâğıtların bundan önce de yapıldığını gösteriyor; ama yöntemi geliştirip yayan kişi olarak Cai Lun hatırlanıyor.',
      'Çinliler kâğıt yapmanın yöntemini yüzyıllarca kendilerine sakladı. Kâğıt, sekizinci yüzyılda Orta Asya’daki Semerkant’a ulaştı ve Semerkant kâğıdı kısa sürede ün kazandı. Ardından Bağdat’ta kâğıt atölyeleri kuruldu ve kâğıt İslam dünyasında hızla yayıldı. Kitapların çoğalması, kütüphanelerin ve bilim çalışmalarının gelişmesine büyük katkı sağladı.',
      'Avrupa kâğıtla Endülüs, yani bugünkü İspanya üzerinden tanıştı. On üçüncü yüzyılda İtalya’da kurulan atölyeler, su gücüyle çalışan tokmaklar kullanarak üretimi artırdı. On beşinci yüzyılda Gutenberg’in hareketli harflerle baskı yapan matbaası ortaya çıkınca kâğıda olan ihtiyaç büyük ölçüde arttı.',
      'Uzun süre kâğıt eski bezlerden yapıldı. Bez bulmak zorlaştıkça yeni bir hammadde arandı. On dokuzuncu yüzyılda ağaçtan elde edilen odun hamuru kullanılmaya başlandı ve kâğıt ucuzladı. Gazeteler, defterler ve kitaplar herkesin ulaşabileceği şeyler hâline geldi.',
      'İstanbul’daki Kâğıthane semtinin adını, Osmanlı döneminde orada kurulan bir kâğıt imalathanesinden aldığı söylenir. Bugün ise kâğıdın önemli bir bölümü geri dönüştürülmüş kâğıttan üretiliyor. Kullandığımız bir kâğıdı geri dönüşüme ayırmak, onu yeni bir yolculuğa göndermek demek.',
    ],
    sorular: [
      { soru: 'Eski Mısır’da yazı yaprağı yapmak için hangi bitki kullanılıyordu?', secenekler: ['Papirüs', 'Kenevir', 'Bambu', 'Pamuk'], dogru: 0 },
      { soru: 'Geleneksel anlatıya göre kâğıt yapımını geliştiren kişi kimdir?', secenekler: ['Cai Lun', 'Gutenberg', 'Semerkantlı bir tüccar', 'Bağdatlı bir kâtip'], dogru: 0 },
      { soru: 'Kâğıt sekizinci yüzyılda Orta Asya’da hangi şehre ulaştı?', secenekler: ['Semerkant', 'Buhara', 'Kaşgar', 'Herat'], dogru: 0 },
      { soru: 'Metne göre Avrupa kâğıtla nereden tanıştı?', secenekler: ['Endülüs (bugünkü İspanya) üzerinden', 'Bizans üzerinden', 'Balkanlar üzerinden', 'Rusya üzerinden'], dogru: 0 },
      { soru: 'On dokuzuncu yüzyılda kâğıdı ucuzlatan gelişme neydi?', secenekler: ['Odun hamurunun kullanılması', 'Matbaanın icadı', 'Su gücüyle çalışan tokmaklar', 'Geri dönüşüm'], dogru: 0 },
    ],
  },
];

// Alıştırma metinleri (yaklaşık 250 kelime, 4 soru). Rehberle okuma, okuma-anlama, tek nokta okuma ve tarama.
HO.icerik.alistirma = [
  {
    id: 'fener',
    baslik: 'Fenerin Bekçisi',
    seviye: 'kolay',
    paragraflar: [
      'Şaban Efendi, Karadeniz kıyısındaki küçük bir burunda duran deniz fenerinin bekçisiydi. Fener, kayalık burnun en ucunda, beyaz badanalı ve tepesi kırmızıya boyanmış bir kuleydi. Her akşam güneş batmadan yarım saat önce kulenin yetmiş iki basamağını tırmanır, lambanın camlarını yumuşak bir bezle siler, sonra ışığı yakardı.',
      'Fenerin ışığı her on saniyede bir dönerek denizi tarıyordu. Kaptanlar bu ışığın aralığını ellerindeki fener listesiyle karşılaştırarak hangi fenerin önünden geçtiklerini anlardı. Şaban Efendi’ye göre her fenerin kendine özgü bir sesi vardı, ama bu ses kulakla değil gözle duyulurdu.',
      'Bir kış gecesi şiddetli bir fırtına çıktı ve elektrik kesildi. Şaban Efendi hiç vakit kaybetmeden yedek jeneratörü çalıştırdı. Jeneratör birkaç kez öksürdükten sonra çalıştı ve ışık yeniden dönmeye başladı. O gece sabaha kadar kulede kaldı, her saat başı jeneratörün yakıtını kontrol etti.',
      'Sabah olduğunda limana bir balıkçı teknesi girdi. Teknenin kaptanı doğruca fenere geldi. Gece fırtınada yolunu kaybettiğini, kıyıya çok yaklaştığını ve fenerin ışığını görünce rotasını düzelttiğini anlattı. Teşekkür olarak bir kasa taze hamsi bıraktı.',
      'Şaban Efendi kasadaki hamsileri köydeki komşularıyla paylaştı. Akşam olunca da her zamanki gibi yetmiş iki basamağı tırmandı ve camları silmeye başladı.',
    ],
    sorular: [
      { soru: 'Fener nerede bulunuyordu?', secenekler: ['Karadeniz kıyısındaki bir burunda', 'Ege’de küçük bir adada', 'Bir göl kıyısında', 'Büyük bir limanın içinde'], dogru: 0 },
      { soru: 'Kulede kaç basamak vardı?', secenekler: ['Yetmiş iki', 'Kırk sekiz', 'Altmış', 'Yüz'], dogru: 0 },
      { soru: 'Elektrik kesilince Şaban Efendi ne yaptı?', secenekler: ['Yedek jeneratörü çalıştırdı', 'Gaz lambası yaktı', 'Limana haber vermeye gitti', 'Sabahı bekledi'], dogru: 0 },
      { soru: 'Balıkçı kaptan teşekkür olarak ne bıraktı?', secenekler: ['Bir kasa taze hamsi', 'Yeni bir lamba', 'Bir mektup', 'Bir çuval kömür'], dogru: 0 },
    ],
    tarama: [
      { soru: 'Fenerin ışığı kaç saniyede bir dönüyordu?', anahtar: 'her on saniyede bir' },
      { soru: 'Şaban Efendi ışığı her akşam ne zaman yakardı?', anahtar: 'güneş batmadan yarım saat önce' },
    ],
  },
  {
    id: 'leylek',
    baslik: 'Leyleklerin Yolu',
    seviye: 'orta',
    paragraflar: [
      'Leylekler, her yıl binlerce kilometre yol kateden göçmen kuşlardır. İlkbaharda Avrupa’ya ve Anadolu’ya gelir, yuvalarını genellikle yüksek bacaların, elektrik direklerinin ya da eski minarelerin tepesine kurarlar. Aynı çiftin her yıl aynı yuvaya dönmesi sık görülür. Yuvalar her yıl eklenen dallarla büyür ve bazıları yüz kiloyu aşan bir ağırlığa ulaşır.',
      'Leyleklerin uçuşunun sırrı sıcak hava akımlarıdır. Güneş yeryüzünü ısıttıkça yükselen sıcak hava sütunları oluşur. Leylekler bu sütunların içinde kanatlarını çırpmadan daireler çizerek yükselir, sonra süzülerek bir sonraki sütuna geçer. Böylece çok az enerji harcarlar. Ancak denizlerin üstünde bu akımlar zayıf olduğu için uzun deniz geçişlerinden kaçınırlar.',
      'Bu yüzden Avrupa’dan Afrika’ya giden leyleklerin önemli bir kısmı İstanbul Boğazı’nın üstünden geçer. Ağustos sonu ve eylül aylarında binlerce leyleğin Boğaz üzerinde döne döne yükseldiği görülebilir. Diğer büyük göç yolu ise İspanya’nın güneyindeki Cebelitarık Boğazı’dır.',
      'Leylekler ötmez. Birbirleriyle gagalarını hızla vurarak takırtıya benzeyen bir sesle iletişim kurarlar. Anadolu’da leyleğin gelişi baharın müjdecisi sayılır ve pek çok yerde bu kuşlara “hacı leylek” denir.',
    ],
    sorular: [
      { soru: 'Leylekler yükselmek için neyi kullanır?', secenekler: ['Sıcak hava akımlarını', 'Deniz rüzgârlarını', 'Sürekli kanat çırpmayı', 'Fırtınaları'], dogru: 0 },
      { soru: 'Leylekler neden uzun deniz geçişlerinden kaçınır?', secenekler: ['Denizlerin üstünde sıcak hava akımları zayıf olduğu için', 'Deniz üstünde yön bulamadıkları için', 'Deniz kuşlarından korktukları için', 'Suyun üstünde hava çok sıcak olduğu için'], dogru: 0 },
      { soru: 'Leylekler birbirleriyle nasıl iletişim kurar?', secenekler: ['Gagalarını hızla vurarak', 'Yüksek sesle öterek', 'Kanatlarını çırparak', 'Islık çalarak'], dogru: 0 },
      { soru: 'Metinde adı geçen diğer büyük göç yolu hangisidir?', secenekler: ['Cebelitarık Boğazı', 'Çanakkale Boğazı', 'Süveyş Kanalı', 'Hürmüz Boğazı'], dogru: 0 },
    ],
    tarama: [
      { soru: 'Leylekler Boğaz üzerinde en çok hangi aylarda görülür?', anahtar: 'ağustos sonu ve eylül' },
      { soru: 'Bazı leylek yuvaları ne kadar ağır olabilir?', anahtar: 'yüz kiloyu aşan' },
    ],
  },
  {
    id: 'zeytin',
    baslik: 'Zeytin Ağacı',
    seviye: 'orta',
    paragraflar: [
      'Zeytin ağacı, Akdeniz ikliminin simgesi sayılır. Sıcak ve kurak yazlara, ılık ve yağışlı kışlara iyi uyum sağlar. Kökleri toprağın derinlerine ve geniş bir alana yayıldığı için uzun süre yağmur yağmasa da yaşayabilir. Yapraklarının alt yüzü gümüşi renktedir; rüzgâr estiğinde zeytinlikler gümüş gibi parıldar.',
      'Zeytin ağacı çok uzun yaşar. Akdeniz çevresinde yüzlerce, hatta bin yıldan yaşlı olduğu düşünülen ağaçlar bulunur. Gövde yaşlandıkça kıvrılır, oyuklar oluşur ve her ağaç kendine özgü bir şekil alır. Yaşlı bir ağaç kesilse bile kökünden yeni sürgünler verebilir.',
      'Zeytin hasadı genellikle sonbaharın sonundan kışın ortasına kadar sürer. Yeşil zeytinler meyve olgunlaşmadan, siyah zeytinler ise tam olgunlaştığında toplanır. Yani yeşil ve siyah zeytin çoğu zaman farklı ağaçlardan değil, aynı ağaçtan farklı zamanlarda toplanır. Ağaçtan yeni koparılan zeytin çok acıdır; yenebilmesi için suda, tuzda ya da salamurada bekletilmesi gerekir.',
      'Zeytinyağı elde etmek için zeytinler yıkanır, ezilir ve hamur hâline getirilir. Bu hamurdan yağ ayrıştırılır. Türkiye’de zeytincilik en çok Ege, Marmara ve Akdeniz kıyılarında yapılır. Zeytin dalı ise binlerce yıldır barışın simgesi olarak kullanılır.',
    ],
    sorular: [
      { soru: 'Zeytin ağacı kuraklığa neden dayanabilir?', secenekler: ['Kökleri derine ve geniş bir alana yayıldığı için', 'Yapraklarında su depoladığı için', 'Yalnız kışın büyüdüğü için', 'Gövdesi çok kalın olduğu için'], dogru: 0 },
      { soru: 'Metne göre yeşil ve siyah zeytin arasındaki fark nedir?', secenekler: ['Çoğu zaman aynı ağaçtan farklı olgunlukta toplanırlar', 'Tamamen farklı türlerdir', 'Farklı bölgelerde yetişirler', 'Siyah zeytin boyanarak elde edilir'], dogru: 0 },
      { soru: 'Ağaçtan yeni koparılan zeytin neden hemen yenmez?', secenekler: ['Çok acı olduğu için', 'Çok sert olduğu için', 'Çok küçük olduğu için', 'İçi boş olduğu için'], dogru: 0 },
      { soru: 'Zeytin dalı neyin simgesidir?', secenekler: ['Barışın', 'Zenginliğin', 'Zaferin', 'Bilginin'], dogru: 0 },
    ],
    tarama: [
      { soru: 'Zeytin hasadı hangi dönemde yapılır?', anahtar: 'sonbaharın sonundan kışın ortasına' },
      { soru: 'Zeytin yapraklarının alt yüzü ne renktir?', anahtar: 'gümüşi renktedir' },
    ],
  },
  {
    id: 'ay',
    baslik: 'Ay’ın Evreleri',
    seviye: 'orta',
    paragraflar: [
      'Ay kendi ışığını üretmez. Geceleri gördüğümüz parlaklık, Güneş’ten gelip Ay’ın yüzeyinden yansıyan ışıktır. Ay, Dünya’nın çevresinde dönerken Güneş’e göre konumu değişir. Bu yüzden Ay’ın aydınlanan yüzünün ne kadarını gördüğümüz de gün gün değişir. Bu değişimlere Ay’ın evreleri denir.',
      'Ay, Dünya ile Güneş’in arasına girdiğinde aydınlanan yüzü bize dönük değildir ve Ay’ı neredeyse hiç göremeyiz. Bu evreye yeni ay denir. Birkaç gün sonra akşamüstü batı ufkunda ince bir hilal belirir. Hilal her gece biraz daha kalınlaşır. Yaklaşık bir hafta sonra Ay’ın yarısı aydınlık görünür; buna ilk dördün denir.',
      'Ay, Dünya’nın Güneş’e göre öbür tarafına geçtiğinde aydınlanan yüzünün tamamını görürüz. Buna dolunay denir. Dolunay, Güneş batarken doğar ve bütün gece gökyüzünde kalır. Sonra aydınlık kısım yeniden küçülmeye başlar: önce son dördün, ardından sabaha karşı görülen ince bir hilal gelir ve döngü yeni ayla yeniden başlar.',
      'Bir yeni aydan bir sonrakine kadar geçen süre yaklaşık 29,5 gündür. Pek çok eski takvim bu düzenli döngüye göre hazırlanmıştır. Hicri takvim de Ay’ın hareketlerine dayanan bir takvimdir. Ay, Dünya’ya her zaman aynı yüzünü gösterir; bu yüzden Ay’ın arka yüzünü Dünya’dan hiç göremeyiz.',
    ],
    sorular: [
      { soru: 'Ay’ın parlaklığı nereden gelir?', secenekler: ['Güneş’ten gelen ışığın yansımasından', 'Kendi ürettiği ışıktan', 'Yakındaki yıldızlardan', 'Dünya’daki şehir ışıklarından'], dogru: 0 },
      { soru: 'Ay’ı neredeyse hiç göremediğimiz evreye ne denir?', secenekler: ['Yeni ay', 'Dolunay', 'İlk dördün', 'Son dördün'], dogru: 0 },
      { soru: 'Dolunay ne zaman doğar?', secenekler: ['Güneş batarken', 'Gece yarısı', 'Sabaha karşı', 'Öğle vakti'], dogru: 0 },
      { soru: 'Ay’ın arka yüzünü Dünya’dan neden göremeyiz?', secenekler: ['Ay, Dünya’ya hep aynı yüzünü gösterdiği için', 'Arka yüzü hiç aydınlanmadığı için', 'Arka yüzü bulutlarla kaplı olduğu için', 'Ay çok hızlı döndüğü için'], dogru: 0 },
    ],
    tarama: [
      { soru: 'Bir yeni aydan sonrakine kadar kaç gün geçer?', anahtar: 'yaklaşık 29,5 gündür' },
      { soru: 'Ay’ın yarısının aydınlık göründüğü evreye ne denir?', anahtar: 'buna ilk dördün denir' },
    ],
  },
  {
    id: 'pazar',
    baslik: 'Cumartesi Pazarı',
    seviye: 'kolay',
    paragraflar: [
      'Her cumartesi sabahı mahallenin aşağısındaki boş arsada semt pazarı kurulurdu. Zeynep Hanım pazara hep aynı saatte, sekizi çeyrek geçe giderdi. Ona göre pazarın en güzel zamanı, tezgâhların yeni kurulduğu ve sebzelerin üstünde hâlâ sabah çiyinin durduğu bu saatlerdi.',
      'O sabah alışveriş listesinde domates, biber, bir demet maydanoz ve bir kilo elma vardı. İlk olarak her hafta uğradığı Mehmet Amca’nın tezgâhına gitti. Mehmet Amca, domatesleri kendi bahçesinde yetiştirdiğini anlatmayı hiç ihmal etmezdi. Zeynep Hanım iki kilo domatesle bir kilo sivri biber aldı.',
      'Maydanoz için yeşillikçinin tezgâhına geçtiğinde, satıcının yanında küçük bir kızın oturup ödev yaptığını gördü. Kız çarpım tablosunda takılmıştı. Zeynep Hanım emekli bir matematik öğretmeniydi. Dayanamadı, tezgâhın kenarına çömelip kıza dokuzlar tablosunu parmaklarla hesaplamanın kolay bir yolunu gösterdi. Kızın yüzü aydınlandı.',
      'Satıcı teşekkür etmek için maydanozun parasını almak istemedi, üstüne bir demet de dereotu ekledi. Zeynep Hanım elmaları da aldıktan sonra dolu filesiyle eve döndü. O akşam pencereden bakarken pazardaki küçük kızın annesiyle birlikte kapısına geldiğini gördü. Kızın elindeki defterde, kırmızı kalemle yazılmış kocaman bir “Aferin” vardı.',
    ],
    sorular: [
      { soru: 'Zeynep Hanım pazara saat kaçta giderdi?', secenekler: ['Sekizi çeyrek geçe', 'Yedi buçukta', 'Dokuzda', 'Öğleye doğru'], dogru: 0 },
      { soru: 'Zeynep Hanım Mehmet Amca’nın tezgâhından ne aldı?', secenekler: ['Domates ve sivri biber', 'Elma ve armut', 'Maydanoz ve dereotu', 'Patates ve soğan'], dogru: 0 },
      { soru: 'Zeynep Hanım’ın eski mesleği neydi?', secenekler: ['Matematik öğretmeni', 'Hemşire', 'Muhasebeci', 'Kütüphaneci'], dogru: 0 },
      { soru: 'Yeşillikçi satıcı teşekkür etmek için ne yaptı?', secenekler: ['Maydanozun parasını almadı ve dereotu ekledi', 'Ona bir kilo elma hediye etti', 'Filesini eve kadar taşıdı', 'Gelecek hafta için indirim yaptı'], dogru: 0 },
    ],
    tarama: [
      { soru: 'Zeynep Hanım’ın listesinde ne kadar elma vardı?', anahtar: 'bir kilo elma' },
      { soru: 'Zeynep Hanım küçük kıza hangi çarpım tablosunu gösterdi?', anahtar: 'dokuzlar tablosunu' },
    ],
  },
  {
    id: 'peri',
    baslik: 'Peri Bacaları',
    seviye: 'zor',
    paragraflar: [
      'Kapadokya’daki peri bacaları, başka hiçbir yere pek benzemeyen bir manzara oluşturur. Bu ilginç kaya oluşumlarının hikâyesi milyonlarca yıl önce başlar. O dönemde bölgedeki Erciyes, Hasandağı ve Göllüdağ gibi volkanlar defalarca püskürdü. Püskürmelerle çıkan küller ve lavlar üst üste yığılarak kalın katmanlar oluşturdu.',
      'Küllerin sıkışmasıyla oluşan yumuşak kayaya tüf denir. Tüf, kolayca aşınabilen bir kayadır. Bazı yerlerde tüfün üstünde daha sert bir kaya katmanı bulunuyordu. Yağmur, kar suyu, rüzgâr ve sıcaklık farkları zamanla yumuşak tüfü aşındırdı. Sert kaya parçalarının korduğu bölümler ise ayakta kaldı. Böylece tepesinde şapka gibi sert bir kaya taşıyan, konik biçimli kuleler ortaya çıktı.',
      'Aşınma bugün de sürüyor. Şapkası düşen bir peri bacası korumasız kalır ve zamanla erir; bu arada yeni bacalar da oluşmaya devam eder. Yani manzara, yavaş da olsa sürekli değişiyor.',
      'Tüfün kolayca oyulabilmesi, insanların bu bölgede yaşamasını da kolaylaştırdı. Yüzyıllar boyunca kayalara evler, ambarlar, güvercinlikler ve kiliseler oyuldu. Yerin altında katlar boyunca uzanan yeraltı şehirleri de aynı yumuşak kaya sayesinde kazılabildi. Göreme ve çevresi, doğal ve kültürel değerleri nedeniyle UNESCO Dünya Mirası Listesi’nde yer alıyor.',
    ],
    sorular: [
      { soru: 'Peri bacalarını oluşturan yumuşak kayaya ne denir?', secenekler: ['Tüf', 'Mermer', 'Granit', 'Kireçtaşı'], dogru: 0 },
      { soru: 'Peri bacalarının tepesindeki sert kaya ne işe yarar?', secenekler: ['Altındaki yumuşak kayayı aşınmaktan korur', 'Bacaların daha hızlı büyümesini sağlar', 'Yağmur suyunu toplar', 'Bacaları birbirine bağlar'], dogru: 0 },
      { soru: 'Şapkası düşen bir peri bacasına ne olur?', secenekler: ['Korumasız kalır ve zamanla erir', 'Yeni bir şapka oluşturur', 'Olduğu gibi kalır', 'Hemen yıkılır'], dogru: 0 },
      { soru: 'Metne göre yeraltı şehirleri nasıl kazılabildi?', secenekler: ['Kaya yumuşak ve kolay oyulabilir olduğu için', 'Toprak çok gevşek olduğu için', 'Volkanlar mağaralar açtığı için', 'Yeraltı suları boşluklar oluşturduğu için'], dogru: 0 },
    ],
    tarama: [
      { soru: 'Metinde adı geçen volkanlar hangileri?', anahtar: 'Erciyes, Hasandağı ve Göllüdağ' },
      { soru: 'İnsanlar kayalara neler oydu?', anahtar: 'evler, ambarlar, güvercinlikler ve kiliseler' },
    ],
  },
  {
    id: 'satranc',
    baslik: 'Satrancın Uzun Yolu',
    seviye: 'orta',
    paragraflar: [
      'Satrancın kökeni, yaklaşık bin beş yüz yıl önce Hindistan’da oynanan çaturanga adlı oyuna dayanır. Çaturanga, o dönemin ordusunu temsil ediyordu: piyadeler, atlılar, filler ve savaş arabaları. Oyun buradan İran’a geçti ve orada “şatranç” adını aldı. Bugün kullandığımız “şah mat” sözü de Farsçadan gelir.',
      'İslam dünyasında satranç çok sevildi. Oyunun kuralları üzerine kitaplar yazıldı, ustalar arasında karşılaşmalar düzenlendi. Satranç, Endülüs ve Sicilya üzerinden Avrupa’ya ulaştı. Avrupa’da zamanla bazı taşların hareketleri değişti. On beşinci yüzyılın sonlarında vezir tahtanın en güçlü taşı hâline geldi ve oyun çok daha hızlı oynanmaya başladı. Bugünkü kurallar büyük ölçüde o dönemde biçimlendi.',
      'Satranç tahtası sekize sekiz, toplam altmış dört kareden oluşur. Her oyuncunun on altı taşı vardır: bir şah, bir vezir, iki kale, iki fil, iki at ve sekiz piyade. Oyunun amacı, rakibin şahını kaçamayacağı biçimde sıkıştırmaktır. Buna mat denir.',
      'Satranç oynarken birkaç hamle sonrasını düşünmek, rakibin planını tahmin etmek ve sabırlı olmak gerekir. Günümüzde dünyanın her yerinde milyonlarca insan satranç oynuyor; kimi aynı masada, kimi binlerce kilometre uzaktaki rakibiyle internet üzerinden.',
    ],
    sorular: [
      { soru: 'Satrancın kökeni hangi oyuna dayanır?', secenekler: ['Çaturanga', 'Go', 'Tavla', 'Mangala'], dogru: 0 },
      { soru: 'Satranç tahtasında kaç kare vardır?', secenekler: ['Altmış dört', 'Kırk dokuz', 'Seksen bir', 'Yüz'], dogru: 0 },
      { soru: 'On beşinci yüzyılın sonlarında hangi taş en güçlü taş oldu?', secenekler: ['Vezir', 'Kale', 'At', 'Fil'], dogru: 0 },
      { soru: 'Her oyuncunun kaç piyadesi vardır?', secenekler: ['Sekiz', 'Altı', 'On', 'Dört'], dogru: 0 },
    ],
    tarama: [
      { soru: 'Satranç Avrupa’ya hangi yollarla ulaştı?', anahtar: 'Endülüs ve Sicilya üzerinden' },
      { soru: 'Oyun İran’da hangi adı aldı?', anahtar: 'orada “şatranç” adını aldı' },
    ],
  },
  {
    id: 'bisiklet',
    baslik: 'Göl Çevresinde Bir Gün',
    seviye: 'kolay',
    paragraflar: [
      'Emre ile Selin, yaz tatilinin son haftasında göl çevresinde bisiklet turu yapmaya karar verdiler. Gölün çevresi yaklaşık kırk kilometreydi. Babaları, yola çıkmadan önce iki bisikletin de lastiklerini şişirdi, frenlerini kontrol etti ve her birine birer su şişesi taktı. “Yorulursanız mola verin, yarışmıyorsunuz,” diye tembihledi.',
      'Sabah dokuzda yola çıktılar. İlk on kilometre düz ve gölgeli bir yoldu. Sazlıkların arasından geçerken bir balıkçılın suya daldığını gördüler. Selin hemen durup fotoğrafını çekti. On beşinci kilometrede yol yokuşa döndü. Emre bisikletten inip yürümeyi önerdi, ama Selin vites değiştirerek yavaş yavaş tırmandı.',
      'Yokuşun tepesinde küçük bir köy kahvesi vardı. Orada ayran içip dinlendiler. Kahvenin sahibi, gölün kuzeyindeki yolun tamir edildiğini ve o tarafın kapalı olduğunu söyledi. Haritaya bakıp köy yolundan dolaşmaya karar verdiler. Bu yol turu altı kilometre uzatıyordu, ama bahçelerin arasından geçiyordu ve kiraz ağaçlarının gölgesinde serin serin ilerlediler.',
      'Akşamüstü saat beşte eve döndüklerinde bacakları ağrıyordu ama çok mutluydular. Selin’in çektiği balıkçıl fotoğrafı o akşam aile albümünün ilk sayfasına yerleşti. Emre ise bir sonraki yaz için şimdiden daha uzun bir tur planlamaya başlamıştı.',
    ],
    sorular: [
      { soru: 'Gölün çevresi yaklaşık kaç kilometreydi?', secenekler: ['Kırk', 'Yirmi', 'Altmış', 'On beş'], dogru: 0 },
      { soru: 'Yokuşta Selin ne yaptı?', secenekler: ['Vites değiştirerek yavaş yavaş tırmandı', 'Bisikletten inip yürüdü', 'Geri dönmeyi önerdi', 'Babasını aradı'], dogru: 0 },
      { soru: 'Neden köy yolundan dolaştılar?', secenekler: ['Gölün kuzeyindeki yol tamir için kapalıydı', 'Köy yolu daha kısaydı', 'Kiraz toplamak istediler', 'Bisikletlerinden biri bozulmuştu'], dogru: 0 },
      { soru: 'Selin’in çektiği fotoğrafta ne vardı?', secenekler: ['Suya dalan bir balıkçıl', 'Kiraz ağaçları', 'Köy kahvesi', 'Gün batımında göl'], dogru: 0 },
    ],
    tarama: [
      { soru: 'Köy yolu turu kaç kilometre uzatıyordu?', anahtar: 'altı kilometre uzatıyordu' },
      { soru: 'Emre ile Selin eve saat kaçta döndü?', anahtar: 'akşamüstü saat beşte' },
    ],
  },
  {
    id: 'gokkusagi',
    baslik: 'Gökkuşağı Nasıl Oluşur?',
    seviye: 'zor',
    paragraflar: [
      'Yağmurlu bir günün ardından güneş açtığında gökyüzünde bazen renkli bir yay belirir. Gökkuşağını görmek için güneşin arkanızda, yağmur damlalarının ise önünüzde olması gerekir. Bu nedenle gökkuşakları çoğunlukla sabah batı tarafında, akşamüstü ise doğu tarafında görülür.',
      'Güneş ışığı beyaz görünse de aslında birçok rengin karışımıdır. Işık bir yağmur damlasına girerken kırılır, yani yönü biraz değişir. Her renk farklı miktarda kırıldığı için renkler birbirinden ayrılır. Işık damlanın arka yüzünden yansıyıp dışarı çıkarken bir kez daha kırılır. Böylece milyonlarca damladan gelen ışık gözümüze renk renk bir yay olarak ulaşır.',
      'Gökkuşağının dış kenarı kırmızı, iç kenarı mordur. Aradaki renkler genellikle turuncu, sarı, yeşil, mavi ve lacivert olarak sayılır. Aslında renkler birbirine kesintisiz geçer; yedi renk saymak eski bir gelenektir.',
      'Bazen ana gökkuşağının dışında daha soluk ikinci bir yay görülür. İkinci yayda ışık damlanın içinde iki kez yansıdığı için renklerin sırası ters döner: kırmızı içte, mor dışta kalır. İki yayın arasındaki gökyüzü de çevresinden biraz daha koyu görünür.',
      'Gökkuşağı belirli bir yerde duran bir nesne değildir. Her insan, kendi gözüne gelen ışıktan oluşan kendi gökkuşağını görür. Bu yüzden gökkuşağının ucuna hiçbir zaman ulaşılamaz.',
    ],
    sorular: [
      { soru: 'Gökkuşağını görmek için güneş nerede olmalıdır?', secenekler: ['Arkamızda', 'Önümüzde', 'Tam tepemizde', 'Ufkun altında'], dogru: 0 },
      { soru: 'Ana gökkuşağının dış kenarı hangi renktir?', secenekler: ['Kırmızı', 'Mor', 'Sarı', 'Yeşil'], dogru: 0 },
      { soru: 'İkinci yayda renklerin sırası neden ters döner?', secenekler: ['Işık damlanın içinde iki kez yansıdığı için', 'Güneş daha alçakta olduğu için', 'Damlalar daha büyük olduğu için', 'Işık damlaya hiç girmediği için'], dogru: 0 },
      { soru: 'Metne göre gökkuşağının ucuna neden ulaşılamaz?', secenekler: ['Herkes kendi gözüne gelen ışıktan oluşan gökkuşağını gördüğü için', 'Gökkuşağı çok uzakta olduğu için', 'Gökkuşağı çok kısa sürdüğü için', 'Gökkuşağı bulutların üstünde olduğu için'], dogru: 0 },
    ],
    tarama: [
      { soru: 'Akşamüstü gökkuşağı hangi yönde görülür?', anahtar: 'akşamüstü ise doğu tarafında' },
      { soru: 'Gökkuşağının iç kenarı hangi renktir?', anahtar: 'iç kenarı mordur' },
    ],
  },
  {
    id: 'maya',
    baslik: 'Ekmeği Kabartan Canlılar',
    seviye: 'zor',
    paragraflar: [
      'Ekmeği kabartan şey, gözle göremediğimiz kadar küçük canlılardır. Maya, tek hücreli bir mantar türüdür. Hamurdaki şekerlerle beslenir ve bu sırada karbondioksit gazı ile az miktarda alkol üretir. Bu olaya fermantasyon, yani mayalanma denir.',
      'Hamur yoğrulduğunda undaki proteinler esnek bir ağ oluşturur. Mayanın ürettiği gaz kabarcıkları bu ağın içinde sıkışır ve hamuru bir balon gibi şişirir. Hamur fırına girdiğinde sıcaklık mayayı öldürür, alkol buharlaşır ve kabarcıkların bıraktığı boşluklar ekmeğin içinde süngerimsi bir doku olarak kalır.',
      'Maya ılık ortamı sever. Çok soğuk bir mutfakta hamur yavaş kabarır; çok sıcak suyla yoğrulan hamurda ise maya ölebilir. Bu yüzden tariflerde genellikle ılık su kullanılması önerilir.',
      'İnsanlar binlerce yıldır mayalı ekmek yapıyor, ama mayalanmanın canlılar tarafından yapıldığı ancak on dokuzuncu yüzyılda Louis Pasteur’ün çalışmalarıyla anlaşıldı. Eskiden ekmekçiler bir önceki hamurdan ayırdıkları bir parçayı sonraki hamura katardı. Bugün ekşi maya denen bu yöntem hâlâ kullanılıyor. Ekşi mayada mayaların yanında bakteriler de bulunur ve ekmeğe hafif ekşi bir tat verir.',
      'Bir dilim ekmeğin içindeki küçük deliklere baktığınızda, aslında milyonlarca minik canlının bıraktığı izleri görüyorsunuz.',
    ],
    sorular: [
      { soru: 'Maya nasıl bir canlıdır?', secenekler: ['Tek hücreli bir mantar', 'Bir bakteri', 'Bir bitki tohumu', 'Küçük bir böcek'], dogru: 0 },
      { soru: 'Hamuru kabartan gaz hangisidir?', secenekler: ['Karbondioksit', 'Oksijen', 'Azot', 'Hidrojen'], dogru: 0 },
      { soru: 'Çok sıcak suyla yoğrulan hamurda ne olabilir?', secenekler: ['Maya ölebilir', 'Hamur çok hızlı kabarır', 'Ekmek daha yumuşak olur', 'Hamur ekşir'], dogru: 0 },
      { soru: 'Ekşi mayaya ekşi tadı veren nedir?', secenekler: ['İçindeki bakteriler', 'Eklenen limon', 'Sirke', 'Fazla tuz'], dogru: 0 },
    ],
    tarama: [
      { soru: 'Mayalanmanın canlılarca yapıldığı kimin çalışmalarıyla anlaşıldı?', anahtar: 'Louis Pasteur’ün çalışmalarıyla' },
      { soru: 'Tariflerde hamur için nasıl su önerilir?', anahtar: 'ılık su kullanılması önerilir' },
    ],
  },
];

// Serbest metinler: sorusuz, çam ağacı egzersizi için.
HO.icerik.serbest = [
  {
    id: 'serbest-sabah',
    baslik: 'Sabah',
    paragraflar: [
      'Sabahın ilk saatlerinde şehir henüz uyanmamıştır. Sokak lambaları birer birer söner, fırınların önünde sıcak ekmek kokusu yayılır. Bir kedi duvarın üstünde gerinir, bir martı çatıların üzerinden süzülerek denize doğru uçar. Otobüs duraklarında ilk yolcular ellerindeki çay bardaklarıyla bekler. Gökyüzü önce griden pembeye, sonra açık maviye döner. Pencereler birer birer aydınlanır, perdeler açılır ve günün sesleri yavaş yavaş artar. Kimi işe, kimi okula, kimi de sadece yürümek için yola çıkar. Her sabah aynı gibi görünse de aslında hiçbir sabah bir öncekinin tıpatıp aynısı değildir. Işık biraz farklı düşer, rüzgâr başka bir yönden eser, yolda başka bir yüzle karşılaşırız.',
    ],
  },
  {
    id: 'serbest-kitaplik',
    baslik: 'Eski Kitaplık',
    paragraflar: [
      'Dedemin evindeki kitaplık, salonun bir duvarını baştan sona kaplardı. Raflarda ciltleri solmuş romanlar, kenarları kıvrılmış ansiklopediler ve içine kurutulmuş çiçekler konmuş şiir kitapları dururdu. Çocukken en üst rafa uzanabilmek için sandalyeye çıkar, parmak uçlarımda yükselirdim. Bazı kitapların ilk sayfasında dedemin el yazısıyla bir tarih ve bir şehir adı yazardı. O kitabı nerede ve ne zaman aldığını not etmeyi hiç ihmal etmezdi. Yıllar sonra o notları okurken, dedemin hayatını kitapların arasından izleyebildiğimi fark ettim. Her raf bir yolculuğu, her cilt bir anıyı saklıyordu.',
    ],
  },
  {
    id: 'serbest-yagmur',
    baslik: 'Yağmur',
    paragraflar: [
      'Yağmur önce birkaç iri damlayla başladı. Kaldırımda koyu lekeler belirdi, toprağın o tanıdık kokusu havaya yayıldı. Sokaktaki insanlar adımlarını hızlandırdı, kimi şemsiyesini açtı, kimi bir saçağın altına sığındı. Birkaç dakika içinde damlalar sıklaştı ve pencerelere ritimli bir sesle vurmaya başladı. Çocuklar su birikintilerinin üstünden atlayarak gülüştü. Bahçedeki ağaçların yaprakları yıkanmış gibi parladı. Yarım saat sonra bulutlar dağıldı, güneş yeniden göründü ve damlalar dalların ucunda küçük ışıklar gibi parıldadı. Hava serinlemiş, şehir sanki derin bir nefes almıştı.',
    ],
  },
];
