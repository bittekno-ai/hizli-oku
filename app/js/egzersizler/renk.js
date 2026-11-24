'use strict';
// Renk egzersizi (Stroop): yazının anlamını değil, yazıldığı rengi seçme.
(function () {
  const u = HO.u;
  const el = u.el;
  HO.egz = HO.egz || {};

  const RENKLER = [
    { ad: 'KIRMIZI', css: '#d62728' },
    { ad: 'MAVİ', css: '#1f6fd1' },
    { ad: 'YEŞİL', css: '#24903a' },
    { ad: 'SARI', css: '#c99400' },
  ];

  HO.egz.renk = {
    id: 'renk',
    ad: 'Renk egzersizi',
    kisa: 'Kelimeyi değil, yazıldığı rengi seçin.',
    sure: '1–2 dk',
    nasil: [
      'Ekranda bir renk adı görünür; ama farklı bir renkte yazılmış olabilir. Örneğin "MAVİ" kelimesi kırmızı renkte yazılabilir.',
      'Kelimeyi okumayın; yazının RENGİNE ait düğmeye basın. Klavyede 1, 2, 3, 4 tuşlarını da kullanabilirsiniz.',
      'Hızlı ve doğru olmaya çalışın. Renkleri ayırt etmekte zorlanıyorsanız bu egzersizi atlayabilirsiniz.',
    ],
    secenekler: [
      { ad: 'sure', etiket: 'Süre', degerler: [[45, '45 saniye'], [60, '1 dakika'], [90, '1,5 dakika']], varsayilan: 60 },
      { ad: 'uyumsuz', etiket: 'Zorluk', degerler: [[0.5, 'Normal (yarısı karışık)'], [0.8, 'Zor (çoğu karışık)']], varsayilan: 0.5 },
    ],
    async calistir(sahne, s, ctx, { bilgi }) {
      await HO.ui.geriSayim(sahne, ctx);
      const kelime = el('div', { class: 'renk-kelime' });
      const geri = el('div', { class: 'renk-geri' });
      const dugmeler = RENKLER.map((r, i) => el('button', { class: 'dugme ikincil renk-dugme', type: 'button', text: `${i + 1}. ${r.ad.charAt(0) + r.ad.slice(1).toLocaleLowerCase('tr')}` }));
      sahne.replaceChildren(el('div', { class: 'renk-alan' }, kelime, geri, el('div', { class: 'renk-dugmeler' }, dugmeler)));

      let secim = null;
      const sec = (i) => secim && secim(i);
      dugmeler.forEach((d, i) => d.addEventListener('click', () => sec(i)));
      ctx.listen(window, 'keydown', (e) => {
        const n = Number(e.key);
        if (n >= 1 && n <= RENKLER.length) sec(n - 1);
      });

      const sureMs = s.sure * 1000;
      const t0 = performance.now();
      const kayit = [];
      bilgi.textContent = `Kalan: ${u.fmtClock(sureMs)} · Doğru: 0`;
      let son = -1;
      while (performance.now() - t0 < sureMs) {
        const uyumsuz = Math.random() < s.uyumsuz;
        let anlam = u.randInt(0, RENKLER.length - 1);
        let renk = anlam;
        if (uyumsuz) while (renk === anlam) renk = u.randInt(0, RENKLER.length - 1);
        if (anlam === son && !uyumsuz) continue;
        son = anlam;
        kelime.textContent = RENKLER[anlam].ad;
        kelime.style.color = RENKLER[renk].css;
        geri.textContent = '';
        const ta = performance.now();
        const cevap = await ctx.promise((res) => {
          secim = res;
          const kalan = sureMs - (performance.now() - t0);
          const id = setTimeout(() => res(null), Math.max(0, kalan));
          const eski = res;
          secim = (v) => {
            clearTimeout(id);
            eski(v);
          };
        });
        secim = null;
        if (cevap === null) break;
        const tepki = performance.now() - ta;
        const dogru = cevap === renk;
        kayit.push({ uyumsuz, dogru, tepki });
        geri.textContent = dogru ? '✓' : '✗';
        geri.className = 'renk-geri ' + (dogru ? 'dogru' : 'yanlis');
        bilgi.textContent = `Kalan: ${u.fmtClock(Math.max(0, sureMs - (performance.now() - t0)))} · Doğru: ${kayit.filter((k) => k.dogru).length}`;
        await ctx.wait(dogru ? 150 : 500);
      }
      const ort = (liste) => (liste.length ? Math.round(liste.reduce((a, b) => a + b.tepki, 0) / liste.length) : null);
      const dogrular = kayit.filter((k) => k.dogru);
      const uyumlu = ort(dogrular.filter((k) => !k.uyumsuz));
      const uyumsuzOrt = ort(dogrular.filter((k) => k.uyumsuz));
      return {
        toplam: kayit.length,
        dogru: dogrular.length,
        yanlis: kayit.length - dogrular.length,
        ortTepki: ort(dogrular),
        uyumlu,
        uyumsuz: uyumsuzOrt,
        fark: uyumlu && uyumsuzOrt ? uyumsuzOrt - uyumlu : null,
      };
    },
    ozet: (r) => [
      ['Cevap', `${r.toplam} kelimede ${r.dogru} doğru, ${r.yanlis} yanlış`],
      ['Ortalama tepki', r.ortTepki ? r.ortTepki + ' ms' : '-'],
      ['Renk ile anlam aynıyken', r.uyumlu ? r.uyumlu + ' ms' : '-'],
      ['Renk ile anlam farklıyken', r.uyumsuz ? r.uyumsuz + ' ms' : '-'],
    ],
    notlar: (r) => (r.fark != null ? [`Renk ile anlam farklı olduğunda ${r.fark > 0 ? r.fark + ' ms daha yavaş' : 'daha yavaş değil'} cevap verdiniz. Bu fark ne kadar küçükse dikkatinizi okumaya karşı o kadar iyi yönettiniz.`] : []),
  };
})();
