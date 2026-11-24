# Görsel kaynakları

| Dosya | Araç | Tarih | İstek dosyası | Durum |
|---|---|---|---|---|
| `app/ikonlar/ikon-*.png`, `src-tauri/icons/*` | `araclar/ikon-uret.mjs` (kodla çizilmiş geçici ikon) | 2026-11-24 | - | Geçici. Codex ikonu gelince değiştirilecek. |
| `app/ikonlar/bittekno-paylasim.jpg` | Bittekno logosu, `bittekno-ai` GitHub profil resmi (Ömer Bey'in isteği) | 2026-11-24 | - | Bağlantı paylaşım önizlemesinde (og:image) kullanılıyor |
| (bekliyor) uygulama ikonu | Codex | - | `istekler/ikon.md` | İstek hazır |
| (bekliyor) siluetler | Codex | - | `istekler/siluetler.md` | İstek hazır |

Codex ikonu gelince: `varliklar/ikon.png` (1024×1024) olarak kaydedin, sonra
`cp varliklar/ikon.png app/ikonlar/ikon-1024.png && npx tauri icon app/ikonlar/ikon-1024.png -o src-tauri/icons`
ve `app/ikonlar/ikon-192.png`, `ikon-512.png` boyutlarını da güncelleyin (`sips -z 512 512 ...`).
