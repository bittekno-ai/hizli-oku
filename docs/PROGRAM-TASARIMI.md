# Program tasarımı (öneri, Ömer Bey onayına açık)

## Teknik öneri: tarayıcıda çalışan uygulama
- **Öneri (Claude):** Saf HTML, CSS ve JavaScript ile yazılmış, kurulum gerektirmeyen bir web uygulaması (PWA).
  - **Neden:** Mac, Windows, hatta telefonda aynı kod çalışır.
  - **Paylaşım:** GitHub Pages ile tek linkten açılır, arkadaşların bir şey kurması gerekmez. İnternetsiz kullanım için "uygulamayı yükle" seçeneği de olur.
  - **Kayıt:** Sonuçlar tarayıcının yerel deposunda (localStorage/IndexedDB) tutulur. JSON olarak dışa ve içe aktarılabilir.
- **Alternatif:** Masaüstü uygulaması isteniyorsa aynı web kodu sonradan Tauri ile Mac (.dmg) ve Windows (.exe) paketine çevrilebilir. Electron'a göre çok daha küçük olur. Ancak imzasız uygulamalarda Mac ve Windows güvenlik uyarısı verir; bu yüzden ilk sürüm için web daha pratik.
- Derleme aracı gerekmez ya da Vite gibi tek bir hafif araç yeter. Dış servis kullanılmaz.

## Modüller (MVP)
1. **Seviye testi (ilk açılışta ve her hafta):**
   - Yaklaşık 400 kelimelik Türkçe metin, kullanıcı kendi hızında okur, ardından 5 anlama sorusu.
   - Sonuçlar: kelime/dk, karakter/dk, anlama %, etkili hız (kelime/dk × anlama).
2. **Günlük antrenman (15–20 dk, otomatik sıralı):**
   - Isınma (2 dk): Schulte tablosu 5×5. Ardından süre ve hata sayısı.
   - Pilot flaş eğitimi (3 dk), Renshaw tarzı takistoskop:
     - Ekranın ortasında rakam dizisi, kelime ve 2–4 kelimelik grup kısa süre görünür, sonra maske gelir. Kullanıcı gördüğünü yazar.
     - Doğru cevapta süre kısalır (örn. 300 ms'den 50 ms'ye), yanlışta uzar (uyarlamalı merdiven).
     - Sonraki aşama: siluet tanıma. Görselleri Codex üretebilir.
   - Göz sıçrama ve göz açıklığı (2 dk):
     - 2–3 sütun arasında atlayan noktalar ya da kelimeler.
     - Sayfa kenarlarına gittikçe genişleyen "piramit" kelime grupları.
   - Rehberle okuma (5 dk): metin satır satır vurgulanır, işaretçi hedef hızda ilerler. Hedef hız, kullanıcının son etkili hızının %10–15 üstüne ayarlanır.
   - Akıllı tarama (3 dk): bir soru verilir, kullanıcı metni tarayıp cevabı bulur. Süre tutulur.
   - Normal okuma ve anlama (5 dk): kendi hızında okuma, ardından 3 soru. Bu, ilerlemenin asıl ölçüsü.
3. **RSVP modu (isteğe bağlı):**
   - Kelimeler tek tek, ayarlanabilir hızda gösterilir.
   - Geri sarma tuşu vardır, sonunda anlama soruları sorulur.
4. **İlerleme ekranı:**
   - Grafikler: etkili hız, anlama, Schulte süresi ve flaş eşiği (ms).
   - Seri (streak) ve rozetler gösterilir.
   - 4 haftalık plan takvimi.
5. **Ayarlar:**
   - Yazı boyutu, satır aralığı ve tema (açık/koyu).
   - Dil: önce Türkçe, sonra İngilizce.
   - Epilepsi uyarısını yeniden gösterme seçeneği.
   - Verileri dışa aktarma ve silme.

## Antrenman planı (öneri)
- 4 hafta, haftada 5 gün, günde 15–20 dakika. Her haftanın başında seviye testi.
- Kural: Anlama %70'in altına düşerse hedef hız bir basamak geri çekilir.
- Uygulamada kanıt düzeyi, beklenti uyarısı ya da "kanıtı zayıf" gibi notlar yer almaz (Ömer Bey kararı, 2026-11-24). Program bir iddiada bulunmaz; egzersizler sade adlarıyla sunulur.

## İçerik
- Seviyelere göre (kolay, orta, zor) 30+ özgün Türkçe metin. Her birinde 3–5 çoktan seçmeli soru. Metinleri Claude yazar, telif sorunu olmaz.
- Takistoskop için rakam dizileri, sık kullanılan Türkçe kelimeler ve kelime grupları.
- Kaynaklar ve lisanslar `icerik/KAYNAKLAR.md` dosyasına yazılır.

## Görsel ihtiyacı (Codex)
- Uygulama ikonu ve logo.
- Pilot flaş eğitiminin ikinci aşaması için siluetler. Gerçek uçak modelleri yerine özgün, kurgusal uçak, gemi ve hayvan siluetleri kullanılır. Marka ya da telif sorunu olmaması için gerçek model kopyalanmaz.
- Açılış ekranı illüstrasyonu (isteğe bağlı).

## 0.1.0 sürümünde yapılanlar ve tasarımdan farklar (2026-11-24)
- Tüm MVP modülleri ve kurs egzersizleri kodlandı (bkz. README).
- Seviye testi metinleri 270–330 kelime oldu (Türkçede kelimeler uzun olduğu için 400 yerine). Alıştırma metinleri 160–180 kelime, 4 soru (%70 eşiği 3 soruyla ölçülemediği için 4).
- İçerik: 4 test + 10 alıştırma + 3 serbest metin. 30+ hedefi sonraki iş.
- Rehber hedef hızı: son etkili hız × 1,12, en yakın hız basamağına (1x–10x) yuvarlanır. Son haftalık anlama testi %70 altıysa, o haftaki son rehberli hızın bir basamak (50 kelime/dk) altı.
- 2026-11-26 (Ömer Bey'in isteği, 0.6.0): günlük antrenman 13 adım ve ağırlık göz egzersizlerinde; okuma egzersizlerinin sonundaki anlama soruları kaldırıldı, sorular haftanın 5. antrenman gününün sonunda haftalık anlama testinde soruluyor (seviye testi sorularıyla kaldı); tüm hız ayarları 1x–10x (1x = eski yavaş, 5x = eski hızlı).
- Flaş: kare sayısıyla gösterim (requestAnimationFrame), doğruda süre ×0,8, yanlışta ×1,25, alt sınır 1 kare. Eşik = son 6 denemenin ortalaması. Ekranın tamamı yanıp sönmez; yalnız ortadaki kutu.
- Siluet aşaması Codex görselleri gelince eklenecek (`varliklar/istekler/siluetler.md`).

## Kararlar (Ömer Bey, 2026-11-24)
1. **Ad:** "Hızlı Oku".
2. **Platform:** İkisi birden. Web/PWA (GitHub Pages) + aynı koddan Tauri masaüstü paketi (Mac .dmg, Windows .exe). Paketler GitHub Actions'ta derlenir (bu Mac'te Rust kurulu değil).
3. **Lisans:** MIT (Ömer Bey, 2026-11-24).
4. **Dil:** İlk sürüm Türkçe (önerim, sorulmadı). Metin içerikleri ayrı dosyada, İngilizce sonra eklenebilir.
5. **Kurstaki programdan hatırlananlar (kullanıcı beyanı):**
   - Yatay ve dikey sonsuzluk işareti üzerinde hareket eden objeyi gözle takip.
   - Kum saati biçimli çizginin köşelerine giden objeyi takip.
   - Çam ağacı: tek kelimeyle başlayıp aşağı doğru kelime sayısı artan satırlar; tersi (aşağıdan yukarı) de var.
   - Ekranın farklı yerlerinde (yatay ve çapraz) rastgele beliren ve kaybolan kelimeleri takip.
   - Metinde seçili kelimeyi belirlenen hızda takip. İki tür: tüm metin gri ve silik, okunan kelime/grup renkli; ya da tüm metin gizli, yalnız okunan kısım görünür.
   - Kayan noktalar ve yanıp sönen kelimeler de vardı.
   - Bunların hepsi 1. sürüme alındı.
6. **GitHub:** `bittekno-ai/hizli-oku`, herkese açık; web sürümü GitHub Pages (Ömer Bey, 2026-11-24). `calisma/` repoya konmaz (kişisel notlar).
