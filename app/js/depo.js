'use strict';
// Yerel veri deposu. Tüm sonuçlar yalnız bu cihazda (localStorage) tutulur.
(function () {
  const u = HO.u;
  const ANAHTAR = 'hizlioku.v1';

  const varsayilan = () => ({
    surum: 1,
    olusturma: Date.now(),
    ayarlar: {
      yaziBoyu: 19,
      satirAraligi: 1.7,
      tema: 'sistem',
      gozMolasi: true,
      hareket: 'sistem', // sistem | acik | az
      epilepsiGizle: false,
      egz: {}, // egzersiz başına son seçilen seçenekler
    },
    sonuclar: [],
    metinKullanim: {}, // metin kimliği -> son kullanım zamanı
    kendiMetinler: [], // kullanıcının eklediği metinler
  });

  let veri = varsayilan();
  let kalici = true;

  function yukle() {
    try {
      const s = localStorage.getItem(ANAHTAR);
      if (s) {
        const o = JSON.parse(s);
        const v = varsayilan();
        veri = { ...v, ...o, ayarlar: { ...v.ayarlar, ...(o.ayarlar || {}) } };
        if (!Array.isArray(veri.sonuclar)) veri.sonuclar = [];
      }
    } catch (e) {
      console.warn('Kayıt okunamadı', e);
      kalici = false;
    }
  }

  function kaydet() {
    try {
      localStorage.setItem(ANAHTAR, JSON.stringify(veri));
      kalici = true;
    } catch (e) {
      console.warn('Kayıt yazılamadı', e);
      kalici = false;
    }
  }

  const depo = {
    yukle,
    kaydet,
    get kalici() {
      return kalici;
    },
    get ayarlar() {
      return veri.ayarlar;
    },
    ayarla(k, v) {
      veri.ayarlar[k] = v;
      kaydet();
    },
    egzSecenek(id) {
      return veri.ayarlar.egz[id] || {};
    },
    egzSecenekKaydet(id, s) {
      veri.ayarlar.egz[id] = s;
      kaydet();
    },

    sonucEkle(tur, r) {
      const kayit = { ...r, tur, zaman: Date.now(), gun: u.dayKey() }; // tur, zaman, gun ezilemez
      veri.sonuclar.push(kayit);
      kaydet();
      return kayit;
    },
    sonuclar(tur) {
      return tur ? veri.sonuclar.filter((r) => r.tur === tur) : veri.sonuclar.slice();
    },
    son(tur, filtre) {
      for (let i = veri.sonuclar.length - 1; i >= 0; i--) {
        const r = veri.sonuclar[i];
        if (r.tur === tur && (!filtre || filtre(r))) return r;
      }
      return null;
    },

    // En son ölçülen etkili hız (seviye testi ya da okuma egzersizi).
    sonEtkiliHiz() {
      for (let i = veri.sonuclar.length - 1; i >= 0; i--) {
        const r = veri.sonuclar[i];
        if ((r.tur === 'test' || r.tur === 'okuma') && r.etkili > 0) return r.etkili;
      }
      return null;
    },

    // Rehberle okuma hedef hızı: son etkili hızın %12 üstü.
    // Son rehberli okumada anlama %70'in altındaysa bir basamak (%10) geri çekilir.
    rehberHedef() {
      const taban = depo.sonEtkiliHiz();
      let h = taban ? taban * 1.12 : 200;
      const sonR = depo.son('rehber', (r) => typeof r.oran === 'number');
      if (sonR && sonR.oran < 0.7) h = Math.min(h, sonR.kdk * 0.9);
      // (anlama sorusu olmayan kendi metinlerle yapılan okumalar hedefi etkilemez)
      return u.clamp(u.round5(h), 80, 1500);
    },

    // Az kullanılan metni seç; hiç okunmamışlar önce gelir.
    metinSec(havuz, haric = []) {
      const aday = havuz.filter((m) => !haric.includes(m.id));
      const liste = aday.length ? aday : havuz;
      const zaman = (m) => veri.metinKullanim[m.id] || 0;
      const enAz = Math.min(...liste.map(zaman));
      const secim = u.pick(liste.filter((m) => zaman(m) === enAz));
      veri.metinKullanim[secim.id] = Date.now();
      kaydet();
      return secim;
    },

    // Kullanıcının kendi metinleri
    kendiMetinler() {
      if (!Array.isArray(veri.kendiMetinler)) veri.kendiMetinler = [];
      return veri.kendiMetinler;
    },
    kendiMetin(id) {
      return depo.kendiMetinler().find((m) => m.id === id) || null;
    },
    kendiMetinKaydet(m) {
      const liste = depo.kendiMetinler();
      const i = liste.findIndex((x) => x.id === m.id);
      if (i >= 0) liste[i] = m;
      else liste.push(m);
      kaydet();
    },
    kendiMetinSil(id) {
      veri.kendiMetinler = depo.kendiMetinler().filter((m) => m.id !== id);
      kaydet();
    },
    // Egzersiz seçeneklerindeki "Metin" seçimine göre metin döndürür.
    metinKaynak(kaynak, havuz) {
      if (kaynak && kaynak !== 'program') {
        const m = depo.kendiMetin(kaynak);
        if (m) return m;
      }
      return depo.metinSec(havuz);
    },

    metinKullanildi(id) {
      return !!veri.metinKullanim[id];
    },

    aktifGunler() {
      return new Set(veri.sonuclar.map((r) => r.gun));
    },
    seri() {
      const gunler = depo.aktifGunler();
      let k = u.dayKey();
      if (!gunler.has(k)) k = u.addDays(k, -1);
      let n = 0;
      while (gunler.has(k)) {
        n++;
        k = u.addDays(k, -1);
      }
      return n;
    },
    planBaslangic() {
      if (!veri.sonuclar.length) return null;
      return veri.sonuclar.reduce((a, r) => (r.gun < a ? r.gun : a), veri.sonuclar[0].gun);
    },
    testGerekli() {
      const t = depo.son('test');
      return !t || u.dayDiff(t.gun, u.dayKey()) >= 7;
    },

    disaAktar() {
      const blob = new Blob([JSON.stringify(veri, null, 2)], { type: 'application/json' });
      const a = u.el('a', { href: URL.createObjectURL(blob), download: `hizli-oku-yedek-${u.dayKey()}.json` });
      document.body.append(a);
      a.click();
      setTimeout(() => {
        URL.revokeObjectURL(a.href);
        a.remove();
      }, 1000);
    },
    async iceAktar(dosya) {
      const o = JSON.parse(await dosya.text());
      if (!o || !Array.isArray(o.sonuclar)) throw new Error('Bu dosya bir Hızlı Oku yedeği değil.');
      const v = varsayilan();
      veri = { ...v, ...o, ayarlar: { ...v.ayarlar, ...(o.ayarlar || {}) } };
      kaydet();
    },
    sifirla() {
      veri = varsayilan();
      try {
        localStorage.removeItem(ANAHTAR);
      } catch (e) {
        /* yok say */
      }
      kaydet();
    },
  };

  HO.depo = depo;
})();
