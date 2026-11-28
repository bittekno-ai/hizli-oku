# Hızlı Oku

Ücretsiz ve açık kaynak bir okuma antrenman programı. Lise öğrencileri ve yetişkinler için; 6 kategoride 34 egzersiz. Tarayıcıda (Mac, Windows, telefon) ve masaüstü uygulaması olarak çalışır. Hafta içi okunan metinlerin anlama soruları hafta sonundaki anlama testinde topluca sorulur. Seviye testi hızı ve anlamayı birlikte ölçer: **etkili hız = dakikadaki kelime × anlama oranı**.

## İçindekiler

- **Seviye testi:** Kısa bir metni kendi hızınızda okuyup 5 soru cevaplarsınız. Dakikada kelime, dakikada karakter, anlama ve etkili hız gösterilir. Her hafta başında tekrarlanır.
- **Günlük antrenman (13 adım, yaklaşık 25 dk):** Bir dikkat ısınması, dört göz takibi, flaş, çevresel görme, beliren kelimeler ve beş okuma adımı. Desenler günden güne değişir. Seviye testi günü son adım seviye testidir.
- **Haftalık anlama testi:** Okuma egzersizlerinin sonunda soru sorulmaz. Haftanın 5. antrenman gününün sonunda, o hafta okunan metinlerden sorular gelir (metin başına 2, en çok 20 soru). Sonuç %70'in altındaysa rehberli okumanın otomatik hızı bir basamak düşer.
- **Hız ayarı:** Hızlı egzersizlerin hepsinde hız 1x ile 10x arasında seçilir (1x en yavaş). Okuma egzersizlerinde 1x = 150, her basamak +50 kelime/dk (10x = 600).
- **Geniş ve tam ekran:** Egzersiz ekranının üstündeki **Geniş** düğmesi egzersizi pencerenin tamamına yayar, **Tam ekran** düğmesi tüm ekranı kaplar (çıkmak için Esc ya da aynı düğme). Büyük ekranda harfler, tablolar ve kutular ekrana göre büyür. Seçim hatırlanır; sonraki egzersizler aynı görünümde açılır.
- **Egzersizler:**
  - Schulte tablosu
  - Burdon dikkat testi
  - Renk egzersizi (yazının anlamı yerine rengini seçme)
  - Kelime avı
  - Göz takibi: yatay ve dikey sonsuzluk, yatay ve dikey zigzag, kum saati, kayan noktalar
  - Çevresel harf görme: yatay, dikey, çapraz
  - Beliren kelimeler: yatay, çapraz, rastgele
  - Pilot flaş eğitimi: İkinci Dünya Savaşı'nda pilotlara uygulanan Renshaw takistoskop yöntemine dayanan, uyarlamalı süreli rakam dizisi, harf dizisi, kelime ve kelime grubu tanıma; kurgusal uçak, gemi ve hayvan silueti tanıma
  - Çam ağacı: yukarıdan aşağı ve aşağıdan yukarı
  - Rehberle okuma: soluk metin, gizli metin, silinen metin, satır vurgusu, dar sütun; isteğe bağlı metronom
  - Akıllı tarama
  - Anlama teknikleri: anahtar kelime bulma, 5N1K
  - Tek nokta okuma (RSVP)
  - Okuma hızı
- **Metinlerim:** Kendi metninizi (kitap bölümü, ders notu) ekleyip isterseniz çoktan seçmeli sorular yazabilir, okuma egzersizlerinde kullanabilirsiniz. Metinler yalnız sizin cihazınızda kalır.
- **İlerleme:** Etkili hız, okuma hızı, anlama (seviye testi ve haftalık test), Schulte süresi, flaş eşiği, Burdon dikkat oranı ve çevresel görüş genişliği grafikleri; 4 haftalık plan takvimi, seri ve rozetler.

Sonuçlar yalnız kendi cihazınızda saklanır. Hesap, sunucu, reklam ya da takip kodu yoktur. Ayarlar sayfasından yedek alıp başka cihaza taşıyabilirsiniz.

> **Sağlık uyarısı:** Flaş ve beliren kelime egzersizlerinde görüntüler kısa süre belirip kaybolur. Işığa duyarlı epilepsisi olan kişiler bu egzersizleri yapmamalıdır.

## Nasıl açılır

**İnternetten (telefon ve bilgisayar):** https://bittekno-ai.github.io/hizli-oku/  
Telefonda tarayıcı menüsünden "Ana ekrana ekle" denirse uygulama gibi açılır ve internetsiz de çalışır.

**En kolayı:** `app/index.html` dosyasına çift tıklayın. Tarayıcıda açılır, kurulum gerekmez.

**Yerel sunucuyla** (Node.js gerekir; çevrimdışı önbellek yerel sunucuda kapalıdır, yalnız GitHub Pages sürümünde çalışır):

```
npm run basla
```

Ardından tarayıcıda `http://127.0.0.1:5180` adresini açın.

**Masaüstü uygulaması (Tauri):** Mac (.dmg) ve Windows (.exe) paketleri GitHub Actions'ta derlenir: Actions sekmesi > "Masaüstü paketleri" > Run workflow. Paketler bitince "Artifacts" altında çıkar. Kendi bilgisayarınızda derlemek için [Rust](https://rustup.rs) kurun, sonra:

```
npm install
npm run masaustu    # geliştirme penceresi
npm run paketle     # .dmg / .exe
```

Paketler imzasız olduğu için ilk açılışta Mac ve Windows güvenlik uyarısı verebilir. Mac'te: uygulamaya sağ tıklayıp "Aç" deyin. Windows'ta: "Ek bilgi" > "Yine de çalıştır".

## Klasörler

| Klasör | İçerik |
|---|---|
| `app/` | Uygulamanın kendisi (HTML, CSS, JavaScript; derleme gerekmez) |
| `app/icerik/` | Okuma metinleri, sorular, kelime listeleri |
| `src-tauri/` | Masaüstü paketi ayarları |
| `araclar/` | Yerel sunucu ve geçici ikon üretici |
| `docs/` | Araştırma ve tasarım notları |
| `icerik/KAYNAKLAR.md` | Metinlerin kaynak ve lisans bilgisi |
| `varliklar/` | Görsel istekleri ve kaynakları |

## Lisans

MIT. Ayrıntı: `LICENSE`. Yazı tipi Noto Sans, SIL Open Font License 1.1 (`app/yazitipi/OFL.txt`).
