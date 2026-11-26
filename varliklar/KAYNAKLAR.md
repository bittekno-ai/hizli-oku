# Görsel kaynakları

| Dosya | Araç | Tarih | İstek dosyası | Durum |
|---|---|---|---|---|
| `varliklar/ikon.png` → `app/ikonlar/ikon-*.png`, `src-tauri/icons/*` | ChatGPT görsel üretimi, Codex CLI (`codex exec -m gpt-6-luna`, image_gen aracı) üzerinden; boyutlar `araclar/ikon-uret.mjs` ile | 2026-11-26 | `istekler/ikon.md`, `istekler/ikon-codex-istem.txt` | Kullanımda (çam ağacı). Diğer iki öneri: `varliklar/ikon-alternatif/` |
| `app/siluet/*.png` (24 siluet) | ChatGPT görsel üretimi, Codex CLI üzerinden; zemin şeffaflaştırma ve ortalama `araclar/siluet-isle.mjs` ile. Uçak ve gemiler kurgusal | 2026-11-26 | `istekler/siluetler.md` | Kullanımda (Flaş: siluet tanıma). Adlar: `varliklar/siluet/adlar.md` |
| `app/ikonlar/bittekno-paylasim.jpg` | Bittekno logosu, `bittekno-ai` GitHub profil resmi (Ömer Bey'in isteği) | 2026-11-24 | - | Bağlantı paylaşım önizlemesinde (og:image) kullanılıyor |
| `varliklar/tasarim/TASARIM-YONU.md` | Codex CLI (gpt-6-luna), tasarım yönü belgesi ("Odak Akışı"): palet, tipografi, hareket dili, kategori görseli tarifleri | 2026-11-24 | `istekler/tasarim.md` | `app/css/tasarim.css` buna göre yazıldı |
| Kategori görselleri ve egzersiz simgeleri (`app/js/gorseller.js`, `app/js/ikonlar.js`) | Claude, SVG kodu (Codex tariflerinden esinlenerek); görsel üretme aracı Codex CLI'da ChatGPT hesabıyla kullanılamadı | 2026-11-24 | `istekler/tasarim.md` | Kullanımda |
| `app/yazitipi/*.woff2` | Noto Sans (The Noto Project Authors), @fontsource/noto-sans 5.3.0 paketinden | 2026-11-24 | - | SIL Open Font License 1.1, `app/yazitipi/OFL.txt` |

İkonu değiştirmek için: yeni görseli `varliklar/ikon.png` (kare, kenardan kenara zemin) olarak kaydedin, sonra `npm run ikon`.
Siluet eklemek için: `node araclar/siluet-isle.mjs <girdi.png> app/siluet/<grup>-NN.png`, ardından `app/icerik/siluetler.js` ve `app/sw.js` listesine ekleyin.

Not (2026-11-26): Codex CLI'da görsel üretimi artık ChatGPT hesabıyla çalışıyor (`image_generation` özelliği). 2026-11-24'te çalışmamıştı.
