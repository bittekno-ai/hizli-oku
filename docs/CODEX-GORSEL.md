# Codex ile görsel üretme

- Görseller Ömer Bey'in ChatGPT aboneliğiyle üretilir. İki yol var: Mac'teki ChatGPT uygulaması ya da Codex CLI. Diğer projelerde Codex CLI kullanılıyor.
- Her görsel isteği `varliklar/istekler/<ad>.md` dosyasına yazılır. Dosyada şunlar olur: amaç, boyut, stil, renkler, yasaklar.
- Üretilen görsel `varliklar/<ad>.png` olarak kaydedilir. Kaynağı da `varliklar/KAYNAKLAR.md` dosyasına not edilir: araç, tarih, istek dosyası.
- **Yasaklar:**
  - Gerçek marka, logo ya da uçak modeli kopyalanmaz. Siluetler kurgusaldır.
  - Görselde yazı varsa Türkçe karakterler kontrol edilir.
  - Uygulama içindeki yazılar görsele gömülmez, HTML ile yazılır.
- **Stil önerisi:** Sade, düz renkli, yüksek kontrastlı. Siluetler beyaz zemin üzerinde siyah, en az 512×512, PNG ve şeffaf arka plan.
