# Hızlı Oku — Tasarım yönü

## Stil: Odak Akışı

Hızlı Oku, lise öğrencileri ve yetişkinler için tasarlanmış, sakin bir çalışma aracı ile çağdaş bir spor uygulaması arasında durur. Açık yüzeyler, net tipografik hiyerarşi ve ölçülü mavi vurgular kullanır; kokpit hissi yalnız ince ölçüm çizgileri ve odak işaretlerinde sezilir. Kartlar ve düğmeler dokunmaya canlı yanıt verir, ancak metin okuma alanı hareketsiz ve dikkat dağıtıcı öğelerden arınmış kalır. Özgün geometrik kompozisyonlar kullanılır; başka bir hızlı okuma sitesinin düzeni veya görsel dili taklit edilmez.

## Renk paleti

| Rol | Açık tema | Koyu tema |
|---|---|---|
| Zemin | `#F5F4F0` | `#171A1D` |
| Yüzey | `#FFFFFF` | `#22262A` |
| Yükseltilmiş yüzey | `#F9FAFB` | `#292E33` |
| Ana yazı | `#20242A` | `#F2F4F6` |
| Soluk yazı | `#596474` | `#ADB6C2` |
| Çizgi | `#D9D8D2` | `#3B424A` |
| Ana vurgu | `#1673B8` | `#59B7F4` |
| İkinci vurgu | `#6558B8` | `#A99CF7` |
| Başarı | `#18794E` | `#53C68C` |
| Hata | `#B83E45` | `#FF777B` |
| Odak halkası | `#0B66A3` | `#8BD2FF` |

### Kategori renkleri

Renk, her kategoride ikon/şerit/etiket alanında kullanılsın; metin rengi olarak açık veya koyu tema paletindeki ana/soluk yazı renkleri korunsun. Böylece renkler tek başına anlam taşımaz ve renk körlüğünde şekil ile ad da ayrımı destekler.

| Kategori | Renk | Yedek görsel ipucu |
|---|---|---|
| Ölçüm | `#1673B8` | Kadran ve tek ibre |
| Dikkat | `#B65B16` | Kare ızgara ve hedef hücre |
| Göz hareketleri | `#16816F` | Sürekli kıvrılan iz ve nokta |
| Görüş alanı ve flaş | `#7654B5` | Eş merkezli yaylar ve merkez noktası |
| Okuma teknikleri | `#A33D67` | Paralel satırlar ve izleme çizgisi |
| Anlama | `#677A19` | Birbirine bağlanan farklı boyda düğümler |

Renkler hem açık hem koyu temada küçük, dolu ikonlarda ayırt edilecek doygunlukta seçilmiştir. Koyu temada ince çizgiler gerekirse ilgili rengi açıklaştırarak en az `#AEB7C2` parlaklığına yaklaştırın; büyük renkli yüzey kullanmayın.

## Tipografi

- **Metin ve arayüz:** Noto Sans, SIL Open Font License (OFL), statik WOFF2 dosyaları projeye eklenebilir. Türkçe `ğ, ş, ı, İ, ç, ö, ü` karakterlerini destekler.
- **Başlık:** Aynı ailenin Noto Sans 600/700 ağırlıkları; ikinci font yükü oluşturmak gerekmez. İstenirse başlıklarda ayrıca Noto Sans Display kullanılabilir, yine OFL ve yerel dosya olarak.
- Dosyaları uygulama içinde yerel yükleyin, dış URL veya uzaktaki font servisi kullanmayın. Yüklenme sorunu için `system-ui, sans-serif` yedeği tanımlayın.
- Temel metin `1rem` (16px), satır yüksekliği `1.55`; küçük yardımcı metin en az `0.8125rem` (13px); ana başlık `1.75rem` (28px), bölüm başlığı `1.25rem` (20px). Okuma metni ayarlara bağlı `1.125–1.375rem` (18–22px), satır yüksekliği `1.75` olsun.

## Yerleşim ve bileşenler

### Ana sayfa

- Üst gezinme 56–64px yüksekliğinde; solda simge ve ürün adı, sağda ana bölümler. Aktif bölüm soluk mavi zeminli kapsül biçiminde gösterilir.
- İçerik genişliği `min(100% - 32px, 880px)`; geniş masaüstünde günlük antrenman kartı, altında aynı genişlikte dört özet kartı. Kartlar arasında 16–20px boşluk.
- Günlük kartta haftanın/günün küçük üst etiketi, belirgin başlık, adım listesi ve tahmini süre; ana eylem sağ altta. Mobilde içerik tek kolona iner ve eylem tam genişliğe yaklaşır.
- Arka plan yalnız dekoratif, düşük kontrastlı hareket taşır. Başlık, egzersiz metni ve eylemler her zaman en yüksek görsel önceliktedir.

### Kategori kartı

- Izgarada 3 sütun (orta genişlikte 2, telefonda 1); kart oranı yaklaşık 1.45:1, iç boşluk 18–20px, köşe yarıçapı `14px`.
- Kategori renginde 4px sol kenar şeridi veya küçük geometrik simge; isim, bir satırlık açıklama ve varsa egzersiz sayısı. Görsel hiyerarşi için kategori adı kalın, açıklama soluk yazı.
- İmleçte 2px yükselir, gölge ve üst kenarda yumuşak renk yansıması belirir. Kartın tamamı erişilebilir bağlantı/düğme davranışı gösterir.

### Egzersiz kartı

- Beyaz/koyu yüzeyde, 1px çizgi, `12px` köşe, `16px` iç boşluk. Başlık, kısa açıklama, süre/ölçüm için ikincil bilgi sırası.
- Odak klavye ile gezilebilir; seçimde kategori renginin ince sol şeridi ve hafif yüzey tonu belirir. Süs animasyonu egzersiz metni veya talimatın içine taşmaz.

### Ana düğme

- Yükseklik `48px` (küçük ekranda en az 44px), yatay iç boşluk 22px, `10px` köşe. Ana vurgu dolgusu ve beyaz yazı; koyu temada ana vurgu rengi yeterli kontrast sağlayacak şekilde kullanılır.
- Üzerine gelince `translateY(-2px)` ve gölge artışı; basışta `scale(0.98)`; klavye odağında 3px odak halkası ve 2px boşluk. İsteğe bağlı parlama yalnız imleç girişinde bir kez, 420ms boyunca yüzey üzerinde kayan yarı saydam bir şerit olarak geçer; tekrarlanmaz.

### İkincil düğme

- Yükseklik `44px`, şeffaf/yüzey dolgulu, çizgili, ana yazı rengi. Üzerine gelince arka plan bir ton koyulaşır/açılır ve 1px yükselir; basışta `scale(0.985)`. Silme gibi yıkıcı eylemlerde hata rengi sadece eylem ve onay bağlamında kullanılır.

### Egzersiz üst çubuğu

- Sabit veya yapışkan yükseklik 56px; solda egzersiz adı ve geri/bitir eylemi, ortada sade ilerleme çizgisi, sağda kalan süre/ölçüm. Okuma alanından ince çizgiyle ayrılır.
- İlerleme çizgisi 3px, yuvarlak uçlu; değer değişince 220ms'de genişler. Süreyi bildiren sayılar her karede animasyon yapmaz; yalnız değişim anında kısa renk geçişi olur.

### Sonuç ekranı

- Yüzey kartı, üstte sakin başarı/sonuç simgesi ve net başlık; birincil ölçü büyük (`2rem`), birim ve bağlam hemen altında. Diğer ölçüler 2–3 kolonlu küçük kartlarda sunulur.
- Anlama oranı, okuma hızıyla aynı görünürlük düzeyinde gösterilir. Sonuç alanı rozet/konfeti patlaması kullanmaz; tamamlanma işareti 180ms ölçeklenip yerine oturur, ardından sabit kalır.
- Birincil eylem tekrar/sonraki adım, ikincil eylem ilerlemeye dönüş olur. Anlamlı karşılaştırma yoksa kıyas iddiası veya başarı rengi kullanılmaz.

## Hareket dili

Eğriler: **standart** `cubic-bezier(0.2, 0.7, 0.2, 1)`, **giriş** `cubic-bezier(0.16, 1, 0.3, 1)`, **basış** `cubic-bezier(0.3, 0, 0.7, 1)`. Hareketler kısa ve işlevsel; hiçbir öğe yanıp sönmez, titreşmez veya sürekli dikkat istemez.

| Bileşen/olay | Hareket | Süre ve eğri |
|---|---|---|
| Kategori/egzersiz kartı hover | `translateY(-2px)`, gölge ve çizgi tonu artışı | `180ms`, standart |
| Kartın basılması | `scale(0.99)` | `100ms`, basış |
| Ana düğme hover | `translateY(-2px)`, gölge; bir kerelik ışık şeridi | `180ms`, standart; şerit `420ms`, giriş |
| Düğme basışı | `scale(0.98)` | `100ms`, basış |
| İkincil düğme hover | Zemin/çizgi tonu geçişi, `translateY(-1px)` | `150ms`, standart |
| Sayfa/bölüm değişimi | İçerik `opacity: 0 → 1`, `translateY(6px → 0)` | `220ms`, giriş |
| Sonuç değerinin görünmesi | `opacity: 0 → 1`, `translateY(5px → 0)`; yalnız ilk görünüm | `260ms`, giriş |
| Egzersiz ilerleme çubuğu | Genişlik yeni değere geçer | `220ms`, standart |
| Odak halkası | Renk ve opaklık geçişi; sıçrama yok | `120ms`, standart |

Mobilde hover hareketi beklenmez; dokunma geri bildirimi için basış hareketi korunur. Egzersiz ve okuma sırasında dekoratif kart/arka plan animasyonları durdurulur.

## Arka plan

CSS ile yapılabilen, çok düşük kontrastlı ve yavaş bir **odak akışı** kullanın. Temel zemin paletin zemin rengidir. İçerik genişliğinin dış kenarlarında iki büyük radyal leke (açık temada `rgba(22,115,184,0.035)`, ikinci leke `rgba(101,88,184,0.025)`; koyu temada sırasıyla `rgba(89,183,244,0.055)` ve `rgba(169,156,247,0.035)`) yer alır. Bunların üstünde 56px aralıklı, yatay/dikey çok silik çizgiler (`opacity: 0.12` ve kategori renginden türetilen çizgi) bulunabilir. Izgara metin alanının arkasında belirginleşmemeli; egzersiz okuma yüzeyi düz, opak yüzey olmalıdır.

Bir arka plan lekesi `transform: translate3d()` ile 28–36 saniyede yavaşça 12–18px yer değiştirip başlangıç noktasına döner; `ease-in-out`, tek döngü 36s veya CSS `alternate` döngüsü. İkinci leke ters yönde 42s hareket eder. Opaklık sabit kalır; parlaklık nabız yapmaz, renk değişimi ve yanıp sönme yoktur. Arka plan hareketi içerik altında kalır, sabit gezinme/okuma görünümünde kapatılır.

`prefers-reduced-motion: reduce` durumunda arka plan döngüleri, ışık şeridi, kart yükselmesi/eğilmesi, sayfa kayması ve sonuç giriş animasyonları kapatılır; içerik anında görünür. Renk/çizgi gibi işlevsel durum değişiklikleri en fazla `80ms` geçişle veya geçişsiz gösterilir. Animasyon olmadan da hover, odak, seçili ve basılı durumlar renk/çizgiyle anlaşılır.

## Kategori görselleri

Altı görsel tek bir SVG illüstrasyon serisi olsun: `4:3` (800×600 viewBox), şeffaf zemin, ince ve tutarlı `3px` çizgi, yuvarlak uç/bağlantı, sınırlı derinlik. Her görsel kendi kategori rengi ile ana vurgu `#1673B8`/`#59B7F4`, yüzey tonu ve ana yazı rengini kullanır. SVG içinde yazı, harf, marka, insan veya hayvan çizilmez. Hareketler CSS/SVG animasyonuyla, yavaş ve tekil mikro-hareketler şeklinde; yanıp sönme ya da tam görsel flaşı olmadan yapılır. Hareketi desteklemeyen ortamda statik kompozisyon eksiksiz görünür.

1. **Ölçüm — `kategori-olcum.png` karşılığı:** Merkezden hafif sağa yerleşmiş, 190px çaplı yarım daire kadran; dışta iki ince yay, yay üzerinde 7 kısa çizgi, merkezde sabit daire ve tek ibre. Kadranın arkasında düşük kontrastlı ince ikinci yay bulunur. İbre merkezinden dönerek `-18°` ile `+18°` arasında gidip başlangıca döner (bir tam salınım 3.2s, `cubic-bezier(0.45, 0, 0.55, 1)`); kadran çizgileri sabittir. Sayı veya kadran etiketi yoktur.
2. **Dikkat — `kategori-dikkat.png` karşılığı:** Ortada 5×5 eş karelerden oluşan yuvarlatılmış ızgara, hücre arası 9px; ızgarada yalnız bir hücre kategori turuncusuyla dolu, çevresinde 2px ince kontur ve köşelerde dört odak köşebendi. Hedef hücre sabit kalırken içindeki küçük daire ızgara hücreleri arasında sırayla ilerleyip hedefte durur; 8 konumluk döngü 4.8s, her geçiş 220ms `cubic-bezier(0.2, 0.7, 0.2, 1)`, hedefte 500ms bekleme. Sayı/harf kullanılmaz.
3. **Göz hareketleri — `kategori-goz.png` karşılığı:** Üç geniş kıvrımlı iz üst üste; ana iz yatay sonsuzluk eğrisi, ikinci iz çapraz zigzag, üçüncü iz hafif kum saati kıvrımıdır. İzler 3px çizgi, başlangıç ve dönüşlerde küçük sabit düğümler. Parlak olmayan tek nokta ana eğri boyunca ilerler; 5.5s `linear` döngüyle yörüngeyi tamamlar ve arkada kısa, soluk bir iz (aynı rengin düşük opaklıklı SVG kopyası) bırakır. Nokta büyüyüp küçülmez.
4. **Görüş alanı ve flaş — `kategori-gorus.png` karşılığı:** Ortada sabit bir hedef noktası; çevresinde üç eş merkezli, ince halka ve dört yöne uzanan kısa radar kılavuzları. En dış halkada 8 küçük geometrik işaret (nokta, baklava, kısa çizgi dönüşümlü) bulunur; yazı/harf yoktur. Bir tarama yayı 30°'lik dilim olarak merkezin çevresinde 8s'de tam döner (`linear`), opaklığı sabit ve düşük tutulur; sabit halkalar asla yanıp sönmez, ölçek atlaması yapmaz.
5. **Okuma teknikleri — `kategori-okuma.png` karşılığı:** Soldan sağa uzanan 5 yatay, yuvarlatılmış çizgi; her çizginin uzunluğu farklı, metin görünümü veren küçük soyut bloklar çizgi boyunca aralıklıdır ama harf şekli oluşturmaz. Bir rehber çizgisi satırların önünde ince dikey ray ve yumuşak dikdörtgen vurgu alanı olarak kurulur. Vurgu 1. satırdan 5. satıra 3.6s'de iner (`cubic-bezier(0.4, 0, 0.2, 1)`), altta 450ms bekleyip yukarı döner; içerik çizgileri sabit kalır.
6. **Anlama — `kategori-anlama.png` karşılığı:** Farklı boyutlarda 7 dairesel düğüm, üç küme halinde; düğümler arasında ince bağlantı çizgileri, ana düğümlerde kategori zeytin rengi ve ikincillerde mavi/mor tonları. Bağlantılar yön belirtmeyen temiz eğriler; soru işareti, harf veya metin yoktur. Küçük bir vurgu noktası bağlantı yollarından birini izleyip kavşak düğümde durur, ardından sonraki kola geçer; toplam tur 6s, yumuşak `cubic-bezier(0.4, 0, 0.2, 1)`, düğümler ve çizgiler sabittir.

SVG'ler PNG'ye çevrilecekse kaynak SVG dosyası da saklansın; PNG şeffaflığı korusun. Kategori görselleri küçük kartlarda kırpılmadan, iç boşluklu ve `object-fit: contain` ile kullanılsın. `prefers-reduced-motion: reduce` altında hareketler durdurulup SVG'nin başlangıç kompozisyonu gösterilsin.

## Uygulama notları

- Renk teması, palet tokenları olarak CSS değişkenlerine bağlanmalı; bileşenlerde ham renk yerine token kullanılmalı.
- Tüm etkileşimler klavye ile kullanılabilir, görünür odak halkasına sahip ve dokunmatik hedefleri en az 44×44px olmalı.
- Metin okuma alanında dekoratif arka plan, otomatik kayma, hareketli imleç/ışık ve sürekli animasyon kullanılmamalı.
- Başarı, hata ve kategori yalnız renkle anlatılmamalı; metin, şekil veya durum işaretiyle de belirtilmeli.
