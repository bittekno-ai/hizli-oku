# İstek: Hızlı Oku görsel tasarımı (tasarım yönü + görseller)

## Ürün
"Hızlı Oku": ücretsiz, açık kaynak, tarayıcıda çalışan bir okuma antrenman programı (Türkçe). Telefon, tablet ve bilgisayarda açılır. Saf HTML/CSS/JS, derleme yok, dış servis yok (yazı tipi ya da kütüphane internetten yüklenmez; gerekirse dosya olarak projeye konur).

Egzersiz kategorileri:
1. Ölçüm: seviye testi, okuma ve anlama
2. Dikkat: Schulte tablosu, Burdon dikkat testi, renk egzersizi (Stroop), kelime avı
3. Göz hareketleri: nokta takibi (sonsuzluk, zigzag, kum saati), kayan noktalar
4. Görüş alanı ve flaş: çevresel harf görme, beliren kelimeler, pilot flaş eğitimi (takistoskop; İkinci Dünya Savaşı pilot eğitimi kökenli)
5. Okuma teknikleri: rehberle okuma (5 ayrı egzersiz), çam ağacı, tek nokta okuma, akıllı tarama
6. Anlama: anahtar kelime, 5N1K

## Hedef kitle ve ton
- Lise öğrencileri ve yetişkinlerin ortak noktası. Çocuksu OLMAMALI (çizgi film karakteri, baykuş maskotu, parlak oyuncak renkleri, cartoon font yok).
- Hissi: odaklı, modern, enerjik ama sakin; "spor uygulaması + iyi tasarlanmış bir çalışma aracı" arası. Pilot/kokpit fikrinden hafif ilham alınabilir (ölçü göstergeleri, radar, odak çizgileri) ama askerî görünmemeli.
- Hareketli ve etkileşimli: düğmeler ve kartlar canlı olmalı (üzerine gelince kalkma, ışık süzülmesi, hafif eğilme, dokunma dalgası vb.), sayfa geçişleri yumuşak. Ama okuma ekranında dikkat dağıtmamalı ve hiçbir şey yanıp sönmemeli (ışığa duyarlı epilepsi kuralı). Açık ve koyu tema ikisi de olacak.

## Senden istenenler (Codex)

### A. Tasarım yönü: `varliklar/tasarim/TASARIM-YONU.md`
Kısa ve uygulanabilir bir tasarım belgesi yaz:
- Stil adı ve 3-4 cümlelik özet.
- Renk paleti: açık ve koyu tema için hex kodlarıyla (zemin, yüzey, yazı, soluk yazı, çizgi, ana vurgu, ikinci vurgu, başarı, hata) ve 6 kategori rengi. Kategori renkleri hem açık hem koyu zeminde okunur olmalı, renk körlüğünde birbirinden ayırt edilmeye çalışılmalı.
- Yazı tipi önerisi: açık lisanslı (OFL) ve projeye dosya olarak konabilecek 1-2 font (başlık + metin). Türkçe karakterleri (ğ, ş, ı, İ, ç, ö, ü) desteklemeli.
- Bileşenler: ana sayfa düzeni, kategori kartı, egzersiz kartı, ana düğme, ikincil düğme, egzersiz üst çubuğu, sonuç ekranı için kısa tarifler.
- Hareketler: her bileşen için hangi animasyon (süre, eğri), arka plan hareketi (yavaş, düşük kontrastlı). `prefers-reduced-motion` açıkken ne kapanacak.

### B. Görseller: `varliklar/tasarim/` klasörüne PNG
Ortak stil: modern, düz ya da hafif derinlikli vektör illüstrasyon; çocuksu değil; tutarlı renk paleti (yukarıdaki palet); yazı yok; gerçek marka ya da logo yok; şeffaf arka plan.
1. `ikon.png` 1024×1024: uygulama ikonu. Yuvarlatılmış kare. Okuma + odak + hız fikri (ör. odak halkası, satırlar, ileri hareket). Küçük boyutta da seçilebilir, sade.
2. `ana-gorsel.png` 1600×900 civarı: ana sayfa üst görseli. Soyut: odak noktasına doğru akan kelime satırları/ışık çizgileri, göz hareketini çağrıştıran yollar. İnsan yüzü yok. Şeffaf ya da koyu-açık temada çalışacak yumuşak zemin.
3. Kategori görselleri, her biri 800×600, aynı stil serisi:
   - `kategori-olcum.png` (gösterge/ibre, hız ve anlama ölçümü)
   - `kategori-dikkat.png` (ızgara içinde vurgulanan hedef)
   - `kategori-goz.png` (eğri yol üzerinde hareket eden nokta, sonsuzluk/zigzag)
   - `kategori-gorus.png` (merkezden dışa genişleyen görüş halkaları, flaş/radar hissi; yanıp sönen ışık değil)
   - `kategori-okuma.png` (vurgulanan satırlar, rehber çizgi)
   - `kategori-anlama.png` (anahtar kelimeler arasında bağlantılar, soru işaretleri yerine düğümler)

### Yasaklar
- Çizgi film karakteri, maskot, hayvan yok. İnsan yüzü yok.
- Görselde yazı/harf yok (uygulama yazıları HTML ile yazılır).
- Gerçek marka, logo, uçak modeli yok.
- Başka bir hızlı okuma sitesinin tasarımını kopyalama.
