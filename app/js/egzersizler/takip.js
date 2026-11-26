'use strict';
// Göz takibi: sonsuzluk işareti (yatay/dikey), kum saati ve kayan nokta (sıçrama).
(function () {
  const u = HO.u;
  const el = u.el;
  HO.egz = HO.egz || {};

  const DESENLER = {
    'yatay-sonsuzluk': 'Yatay sonsuzluk (∞)',
    'dikey-sonsuzluk': 'Dikey sonsuzluk (8)',
    'kum-saati': 'Kum saati (⧗)',
    'yatay-zigzag': 'Yatay zigzag (⩘⩗)',
    'dikey-zigzag': 'Dikey zigzag',
    sicrama: 'Kayan noktalar (sıçrama)',
  };

  // Zigzag: ileri gidip aynı yoldan geri dönen kırık çizgi (0..1 koordinatlarda).
  function zigzag(yatay) {
    const ileri = [];
    const n = 8;
    for (let i = 0; i < n; i++) {
      const a = 0.08 + (0.84 * i) / (n - 1);
      const b = i % 2 ? 0.82 : 0.18;
      ileri.push(yatay ? [a, b] : [b, a]);
    }
    return ileri.concat(ileri.slice(1, -1).reverse());
  }
  const YOLLAR = { 'yatay-zigzag': zigzag(true), 'dikey-zigzag': zigzag(false) };

  // Bernoulli lemniskatı: t ∈ [0, 2π)
  function lemniskat(t) {
    const s = Math.sin(t);
    const c = Math.cos(t);
    const d = 1 + s * s;
    return [c / d, (s * c) / d]; // x ∈ [-1,1], y ∈ [-0.35, 0.35]
  }

  // Kum saati köşeleri (0..1 koordinatlarda): sol üst → sağ üst → sol alt → sağ alt → sol üst
  const KUM = [
    [0.15, 0.1],
    [0.85, 0.1],
    [0.15, 0.9],
    [0.85, 0.9],
  ];

  function kumNokta(f, w, h, koseler = KUM) {
    // f ∈ [0,1): kapalı yol boyunca konum. Köşelerde kısa duraklama.
    const p = koseler.map(([x, y]) => [x * w, y * h]);
    const seg = [];
    let top = 0;
    const n = p.length;
    for (let i = 0; i < n; i++) {
      const a = p[i];
      const b = p[(i + 1) % n];
      const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
      seg.push({ a, b, L });
      top += L;
    }
    const DURAK = 0.16 / n; // köşelerde toplam sürenin %16'sı kadar bekleme
    const hareket = 1 - DURAK * n;
    let kalan = f;
    for (const s of seg) {
      const pay = (s.L / top) * hareket;
      if (kalan < DURAK) return s.a;
      kalan -= DURAK;
      if (kalan < pay) {
        const k = kalan / pay;
        return [s.a[0] + (s.b[0] - s.a[0]) * k, s.a[1] + (s.b[1] - s.a[1]) * k];
      }
      kalan -= pay;
    }
    return p[0];
  }

  HO.egz.takip = {
    id: 'takip',
    ad: 'Göz takibi',
    kisa: 'Sonsuzluk, kum saati ve kayan noktalar.',
    sure: '1–2 dk',
    nasil: [
      'Başınızı oynatmadan, yalnız gözlerinizle hareket eden noktayı izleyin.',
      'Ekrandan yaklaşık bir kol boyu uzakta oturun.',
      'Gözleriniz yorulursa durup birkaç kez göz kırpın.',
    ],
    secenekler: [
      { ad: 'desen', etiket: 'Desen', degerler: Object.entries(DESENLER), varsayilan: 'yatay-sonsuzluk' },
      { ad: 'hiz', etiket: 'Hız', degerler: u.HIZLAR, varsayilan: 3 },
      { ad: 'sure', etiket: 'Süre', degerler: [[30, '30 saniye'], [60, '1 dakika'], [90, '1,5 dakika'], [120, '2 dakika']], varsayilan: 60 },
      { ad: 'iz', etiket: 'Yol çizgisi', degerler: [['evet', 'Göster'], ['hayir', 'Gizle']], varsayilan: 'evet' },
    ],
    async calistir(sahne, s, ctx, { bilgi }) {
      const tuval = el('canvas', { class: 'takip-tuval' });
      sahne.replaceChildren(tuval);
      const c2 = tuval.getContext('2d');
      let w = 0;
      let h = 0;
      const boyutla = () => {
        const r = tuval.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        w = r.width;
        h = r.height;
        tuval.width = Math.round(w * dpr);
        tuval.height = Math.round(h * dpr);
        c2.setTransform(dpr, 0, 0, dpr, 0, 0);
      };
      boyutla();
      ctx.listen(window, 'resize', boyutla);

      const stil = getComputedStyle(document.documentElement);
      const renkNokta = stil.getPropertyValue('--odak').trim() || '#e0702e';
      const renkIz = stil.getPropertyValue('--cizgi').trim() || '#ccc';

      // 1x = eski yavaş, 5x = eski hızlı ayar.
      const periyot = u.hizSure(s.hiz, 9000, 3800) * (YOLLAR[s.desen] ? 2 : 1);
      const sicramaAralik = u.hizSure(s.hiz, 1000, 450);
      const sureMs = s.sure * 1000;

      const konum = (t) => {
        const f = (t % periyot) / periyot;
        if (s.desen === 'yatay-sonsuzluk' || s.desen === 'dikey-sonsuzluk') {
          const [x, y] = lemniskat(f * Math.PI * 2);
          if (s.desen === 'yatay-sonsuzluk') {
            const A = Math.min(w * 0.44, h * 1.1);
            return [w / 2 + x * A, h / 2 + y * A * 1.6];
          }
          const A = Math.min(h * 0.44, w * 1.1);
          return [w / 2 + y * A * 1.6, h / 2 + x * A];
        }
        return kumNokta(f, w, h, YOLLAR[s.desen] || KUM);
      };

      const izCiz = () => {
        if (s.iz !== 'evet' || s.desen === 'sicrama') return;
        c2.strokeStyle = renkIz;
        c2.lineWidth = 2;
        c2.beginPath();
        if (s.desen === 'kum-saati' || YOLLAR[s.desen]) {
          (YOLLAR[s.desen] || KUM).forEach(([x, y], i) => (i ? c2.lineTo(x * w, y * h) : c2.moveTo(x * w, y * h)));
          if (!YOLLAR[s.desen]) c2.closePath();
        } else {
          for (let i = 0; i <= 200; i++) {
            const [x, y] = konum((i / 200) * periyot);
            i ? c2.lineTo(x, y) : c2.moveTo(x, y);
          }
        }
        c2.stroke();
      };

      const noktaCiz = (x, y) => {
        c2.fillStyle = renkNokta;
        c2.beginPath();
        c2.arc(x, y, 12, 0, Math.PI * 2);
        c2.fill();
      };

      // Sıçrama deseni: sol ve sağ sütun arasında, rastgele satırlarda.
      const sutunlar = [0.12, 0.5, 0.88];
      let sicramaNokta = null;
      let sicramaSon = -Infinity;
      let sutunSira = 0;

      const t0 = performance.now();
      while (true) {
        const now = await ctx.frame();
        const t = now - t0;
        if (t >= sureMs) break;
        c2.clearRect(0, 0, w, h);
        izCiz();
        if (s.desen === 'sicrama') {
          if (t - sicramaSon >= sicramaAralik) {
            sicramaSon = t;
            // sol → sağ → sol ... arada bazen orta sütun
            const yol = [0, 2, 0, 2, 1, 0, 2];
            const sx = sutunlar[yol[sutunSira++ % yol.length]];
            sicramaNokta = [sx * w, (0.12 + Math.random() * 0.76) * h];
          }
          noktaCiz(...sicramaNokta);
        } else {
          noktaCiz(...konum(t));
        }
        bilgi.textContent = `Kalan: ${u.fmtClock(sureMs - t)}`;
      }
      return { desen: s.desen, hiz: s.hiz, saniye: s.sure };
    },
    ozet: (r) => [
      ['Desen', DESENLER[r.desen]],
      ['Hız', typeof r.hiz === 'number' ? u.hizAdi(r.hiz) : { yavas: 'Yavaş', orta: 'Orta', hizli: 'Hızlı' }[r.hiz]],
      ['Süre', r.saniye + ' saniye'],
    ],
  };
})();
