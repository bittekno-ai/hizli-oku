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

    // Rehberle okuma hedef hızı (kelime/dk): son etkili hızın %12 üstü.
    // Son haftalık anlama testinde anlama %70'in altındaysa, o haftaki son rehberli hızın bir basamak altına iner.
    rehberHedef() {
      const taban = depo.sonEtkiliHiz();
      let h = taban ? taban * 1.12 : 200;
      const hafta = depo.son('haftalik', (r) => typeof r.oran === 'number');
      if (hafta && hafta.oran < 0.7) {
        const sonR = depo.son('rehber', (r) => r.zaman <= hafta.zaman && r.kdk > 0);
        if (sonR) h = Math.min(h, sonR.kdk - 50);
      }
      return u.clamp(u.round5(h), 80, 1500);
    },

    // Haftalık plan: plan başlangıcından itibaren 7 günlük haftalar, 4 haftalık turlar.
    planDurumu(gun = u.dayKey()) {
      const bas = depo.planBaslangic();
      if (!bas) return null;
      const fark = u.dayDiff(bas, gun);
      const dongu = Math.floor(fark / 28);
      const donguBas = u.addDays(bas, dongu * 28);
      const hafta = Math.floor((fark - dongu * 28) / 7) + 1;
      const haftaBas = u.addDays(donguBas, (hafta - 1) * 7);
      const gunlukGunler = new Set(depo.sonuclar('gunluk').map((r) => r.gun));
      let buHafta = 0;
      for (let i = 0; i < 7; i++) if (gunlukGunler.has(u.addDays(haftaBas, i))) buHafta++;
      return { bas, dongu, donguBas, hafta, haftaBas, buHafta, gunlukGunler };
    },

    // Soruları hafta sonuna bırakılmış, henüz sorulmamış okumalar (en yeni önce, tekrarsız metin kimlikleri).
    bekleyenOkumalar() {
      const sonTest = depo.son('haftalik');
      const sinir = sonTest ? sonTest.zaman : 0;
      return veri.sonuclar.filter((r) => r.soruBekliyor && r.zaman > sinir);
    },
    bekleyenMetinler() {
      return [...new Set(depo.bekleyenOkumalar().map((r) => r.metin).reverse())];
    },
    // Haftalık anlama testi zamanı mı? (a) bu hafta 5. antrenman günü tamamlandıysa,
    // (b) geçmiş bir haftadan sorusu sorulmamış okuma kaldıysa.
    haftalikTestZamani() {
      const bekleyen = depo.bekleyenOkumalar();
      if (!bekleyen.length) return false;
      const plan = depo.planDurumu();
      if (!plan) return false;
      const buHaftaYapildi = !!depo.son('haftalik', (r) => r.gun >= plan.haftaBas);
      if (plan.buHafta >= 5 && !buHaftaYapildi) return true;
      return bekleyen.some((r) => r.gun < plan.haftaBas);
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
