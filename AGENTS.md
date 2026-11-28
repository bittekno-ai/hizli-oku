# Hızlı okuma programı: ajan talimatları

Bu klasörde Ömer Bey için (hitap: "Ömer Bey") ücretsiz, açık kaynak bir **hızlı okuma antrenman programı** geliştiriyorsun. Program GitHub'da paylaşılacak, arkadaşları ücretsiz kullanacak. Türkçe konuş. Önce `KURALLAR.md`, sonra `docs/ARASTIRMA.md` ve `docs/PROGRAM-TASARIMI.md` dosyalarını oku.

## Amaç (kullanıcı beyanı, 2026-11-24)
- Ömer Bey yıllar önce bir hızlı okuma kursuna gitti. Orada göz kaslarını çalıştırıp okuma hızını artırdığı söylenen bir bilgisayar programı kullanıldı. Benzerini, internetteki araştırmalara göre en etkili yöntemlerle yapmak istiyor.
- Pilotların kullandığı "fotoğrafik" tanıma tekniklerinin de eklenmesini istiyor. Araştırmaya göre bu, İkinci Dünya Savaşı'ndaki Renshaw takistoskop (flaş tanıma) eğitimi. Ayrıntı `docs/ARASTIRMA.md` içinde.
- Mac ve Windows'ta çalışmalı.
- Görsel gerekirse Codex ile üretilir. Ömer Bey'in Mac'inde ChatGPT uygulaması var. Kurallar için bkz. `docs/CODEX-GORSEL.md`.

## Durum
- 2026-11-24: Kit ve araştırma ikinci beyin penceresinde hazırlandı.
- 2026-11-24: Kararlar alındı (ad "Hızlı Oku", web + Tauri, lisans sonra). 0.1.0 (MVP) kodlandı ve headless Chrome ile uçtan uca denendi. Ayrıntı: `calisma/vaulta-aktarim.md`.
- 2026-11-24: Yayında. Repo https://github.com/bittekno-ai/hizli-oku (herkese açık, MIT). Web: https://bittekno-ai.github.io/hizli-oku/ (`app/` değişip main'e gönderilince kendiliğinden güncellenir). `calisma/` repoya girmez.
- 2026-11-24: 0.2.0 (Burdon, anlama teknikleri, metronom) ve 0.3.0 (zigzag, harf flaşı, silinen metin ve dar sütun, Metinlerim, renk egzersizi, kelime avı, çevresel harf görme) yayında.
- Not: egzersiz sonucunda `tur`, `zaman`, `gun` alan adlarını kullanmayın (depo bunları kendisi yazar).
- 2026-11-24: 0.4.0: tasarım ("Odak Akışı", Codex'in tasarım yönüne göre: `varliklar/tasarim/TASARIM-YONU.md`, `app/css/tasarim.css`), 6 kategori, seçenekli egzersizler ayrı egzersizlere bölündü (`app/js/egzersizler/turevler.js`; sonuçlar ana egzersiz adıyla kaydedilir).
- 2026-11-26: 0.5.0: ChatGPT ile üretilen uygulama ikonu ve 24 siluet; yeni egzersiz "Flaş: siluet tanıma".
- 2026-11-26: 0.6.0: günlük antrenman 13 adım (4 göz takibi); okuma egzersizlerinde soru yok, haftalık anlama testi (`HO.ui.haftalikTest`, sonuç türü `haftalik`, bekleyen okumalar `soruBekliyor: true`); hız ayarları 1x–10x (`u.HIZLAR`, `u.hizSure`, `u.hizKdk`).
- 2026-11-26: 0.6.1: 30 ek alıştırma metni (`app/icerik/metinler2.js`, toplam 40); çam ağacı da alıştırma metinlerini kullanıyor.
- 2026-11-28: 0.7.0: egzersiz ekranında Geniş ve Tam ekran düğmeleri (`arayuz.js` ekran modu, ayar `ekranModu`). Büyük modda kök yazı boyu `--olcek` ile büyür; egzersiz CSS'inde px yerine rem kullanın ki birlikte büyüsün. Sahne yüksekliği `--sahne-h`. Tuvalde çizim boyutu için `HO.ui.olcek()`.
- Codex: `/Applications/ChatGPT.app/Contents/Resources/codex-cli/bin/codex exec -m gpt-6-luna ...` (config'deki gpt-6-astra CLI'da çalışmıyor). Görsel üretimi 2026-11-26'dan beri CLI'da çalışıyor: istemi stdin'den verin, görseli çalışma klasörüne kopyalamasını isteyin. Görseller `~/.codex/generated_images/` altında da kalır.
- Sıradaki adım: Ömer Bey'in elle denemesi, geri bildirimler; masaüstü sürüm derlemesi.

## Kod yapısı (kısa)
- `app/` derleme gerektirmeyen saf HTML/CSS/JS. Klasik `<script>` dosyaları, ortak ad alanı `window.HO`. `index.html` çift tıkla da açılır.
- `app/js/egzersizler/*.js`: her egzersiz `HO.egz.<id>` nesnesi (`ad`, `nasil`, `secenekler`, `calistir(sahne, s, ctx)`, `ozet`). Çalıştırıcı `HO.ui.egzersizCalistir` (arayuz.js).
- Veri: `HO.depo` (depo.js), localStorage anahtarı `hizlioku.v1`.
- İçerik: `app/icerik/metinler.js`, `kelimeler.js`. Metin eklerken `icerik/KAYNAKLAR.md` güncellenir; tarama `anahtar`ı cevap cümlesinde aynen geçmeli.
- Yerel deneme: `npm run basla` (http://127.0.0.1:5180). Masaüstü: `src-tauri/`, derleme `.github/workflows/masaustu.yml`.

## Dosyalar
- `KURALLAR.md`: değişmez kurallar (iddia ve kanıt etiketi yok, sağlık uyarısı, telif).
- `docs/ARASTIRMA.md`: kaynaklı bulgular. Hangi yöntemin kanıtı var, hangisinin yok.
- `docs/PROGRAM-TASARIMI.md`: modüller, antrenman planı, ölçüm, teknik öneri, açık kararlar.
- `docs/CODEX-GORSEL.md`: görsel üretme kuralları.
- `calisma/vaulta-aktarim.md`: ikinci beyne aktarım özeti (aşağıya bakın).

## İkinci beyne aktarım
Her anlamlı iş parçasından sonra `calisma/vaulta-aktarim.md` dosyasının en üstüne tarihli bir bölüm ekle. Bölümde şunlar olsun: ne yaptık, bulgular (kaynak/dosya ile), kararlar (kullanıcı beyanı mı öneri mi), belirsizlikler, sonraki adım. Eski bölümleri silme. Ömer Bey'den istemeden yap.
