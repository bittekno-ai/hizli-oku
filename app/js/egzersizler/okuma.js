'use strict';
// Seviye testi (uzun metin, 5 soru) ve okuma-anlama egzersizi (kısa metin, 4 soru).
(function () {
  HO.egz = HO.egz || {};

  HO.egz.test = {
    id: 'test',
    ad: 'Seviye testi',
    kisa: 'Okuma hızınızı ve anlamanızı ölçün.',
    sure: '3–5 dk',
    nasil: [
      'Yaklaşık 300 kelimelik bir metni kendi hızınızda, anlayarak okuyun.',
      'Ardından 5 soru gelir. Metne geri dönülemez.',
      'Sonuçta dakikada kelime, dakikada karakter, anlama oranı ve etkili hız gösterilir.',
      'Test her hafta başında tekrarlanır.',
    ],
    async calistir(sahne, s, ctx) {
      const metin = HO.depo.metinSec(HO.icerik.testler);
      return HO.ui.okumaTesti(sahne, metin, ctx);
    },
    ozet: (r) => HO.ui.okumaOzet(r),
    notlar: (r) => HO.ui.okumaNotlar(r),
  };

  HO.egz.okuma = {
    id: 'okuma',
    ad: 'Okuma ve anlama',
    kisa: 'Kendi hızınızda okuyup soruları cevaplayın.',
    sure: '3–5 dk',
    nasil: [
      'Kısa bir metni her zamanki gibi, anlayarak okuyun.',
      'Ardından 4 soru gelir. Metne geri dönülemez.',
      'Etkili hız (okuma hızı × anlama) ilerleme grafiğinize eklenir.',
      'Metinlerim sayfasından eklediğiniz kendi metninizi de seçebilirsiniz.',
    ],
    secenekler: [HO.ui.metinSecenegi()],
    async calistir(sahne, s, ctx) {
      const metin = HO.depo.metinKaynak(s.kaynak, HO.icerik.alistirma);
      return HO.ui.okumaTesti(sahne, metin, ctx);
    },
    ozet: (r) => HO.ui.okumaOzet(r),
    notlar: (r) => HO.ui.okumaNotlar(r),
  };
})();
