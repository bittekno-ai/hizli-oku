'use strict';
// Çevresel harf görme: göz ortadayken ortada ve iki yanda aynı anda beliren harfleri tanıma.
// Doğru cevapta harfler bir sonraki denemede merkezden daha uzağa konur, yanlışta yaklaşır.
(function () {
  const u = HO.u;
  const el = u.el;
  HO.egz = HO.egz || {};

  const YONLER = { yatay: 'Yatay (sol, orta, sağ)', dikey: 'Dikey (üst, orta, alt)', capraz: 'Çapraz (sol üst, orta, sağ alt)' };
  const HARFLER = 'ABCÇDEFGHJKLMNPRSŞTUÜVYZ';
  const ADIM = 0.08;

  HO.egz.cevresel = {
    id: 'cevresel',
    ad: 'Çevresel harf görme',
    kisa: 'Göz ortadayken iki yanda beliren harfleri tanıyın.',
    sure: '2–3 dk',
    flas: true,
    nasil: [
      'Gözünüzü ekranın ortasındaki + işaretinde tutun. Başınızı ve gözünüzü oynatmayın.',
      'Ortada ve iki yanda aynı anda üç harf çok kısa süre görünür.',
      'Gördüğünüz üç harfi sırayla yazın (yatayda soldan sağa, dikeyde yukarıdan aşağı) ve Enter’a basın.',
      'Doğru cevapta yandaki harfler bir sonraki denemede daha uzağa konur, yanlışta yaklaşır. Sonuç, ne kadar geniş görebildiğinizi gösterir.',
    ],
    secenekler: [
      { ad: 'yon', etiket: 'Yön', degerler: Object.entries(YONLER), varsayilan: 'yatay' },
      { ad: 'hiz', etiket: 'Hız', degerler: u.HIZLAR, varsayilan: 2 },
      { ad: 'deneme', etiket: 'Deneme sayısı', degerler: [[15, '15'], [20, '20'], [30, '30']], varsayilan: 20 },
    ],
    async calistir(sahne, s, ctx, { bilgi }) {
      const gosterim = u.hizSure(s.hiz, 250, 120); // 1x = 250 ms, 5x = 120 ms
      const alan = el('div', { class: 'cevre-alan' });
      const merkez = el('div', { class: 'cevre-harf' });
      const h1 = el('div', { class: 'cevre-harf' });
      const h2 = el('div', { class: 'cevre-harf' });
      alan.append(h1, merkez, h2);
      const giris = el('input', { class: 'flas-giris', type: 'text', autocomplete: 'off', autocapitalize: 'characters', spellcheck: 'false', maxlength: 3, placeholder: '3 harf' });
      const form = el('form', { class: 'flas-form' }, giris);
      const geri = el('div', { class: 'flas-geri' });
      sahne.replaceChildren(alan, el('div', { class: 'cevre-alt' }, form, geri));
      form.style.visibility = 'hidden';

      const yerles = (d) => {
        const [dx, dy] = s.yon === 'yatay' ? [d, 0] : s.yon === 'dikey' ? [0, d] : [d, d];
        h1.style.left = 50 - dx * 47 + '%';
        h1.style.top = 50 - dy * 45 + '%';
        h2.style.left = 50 + dx * 47 + '%';
        h2.style.top = 50 + dy * 45 + '%';
        merkez.style.left = '50%';
        merkez.style.top = '50%';
      };
      const goster = (a, b, c) => {
        h1.textContent = a;
        merkez.textContent = b;
        h2.textContent = c;
      };

      const onceki = HO.depo.son('cevresel', (r) => r.yon === s.yon);
      let d = onceki ? u.clamp(onceki.genislik / 100 - 0.15, 0.15, 0.9) : 0.25;
      const denemeler = [];
      for (let n = 0; n < s.deneme; n++) {
        bilgi.textContent = `Deneme ${n + 1}/${s.deneme} · Uzaklık: %${Math.round(d * 100)}`;
        geri.textContent = '';
        yerles(d);
        goster('', '+', '');
        await ctx.wait(800);
        const harf = () => HARFLER[u.randInt(0, HARFLER.length - 1)];
        const hedef = [harf(), harf(), harf()];
        // Kare tabanlı gösterim.
        await ctx.frame();
        goster(...hedef);
        const t0 = await ctx.frame();
        while ((await ctx.frame()) - t0 < gosterim - 8);
        goster('#', '#', '#');
        await ctx.wait(200);
        goster('', '', '');

        form.style.visibility = 'visible';
        giris.value = '';
        giris.focus();
        const cevap = await ctx.promise((res) => {
          form.onsubmit = (e) => {
            e.preventDefault();
            res(giris.value);
          };
        });
        form.style.visibility = 'hidden';
        const c = u.norm(cevap).replace(/\s/g, '');
        const h = hedef.map((x) => x.toLocaleLowerCase('tr'));
        const yanDogru = c[0] === h[0] && c[2] === h[2];
        const dogru = yanDogru && c[1] === h[1];
        denemeler.push({ d, dogru });
        geri.textContent = dogru ? 'Doğru' : `Gösterilen: ${hedef.join(' ')}`;
        geri.className = 'flas-geri ' + (dogru ? 'dogru' : 'yanlis');
        d = dogru ? Math.min(0.95, d + ADIM) : Math.max(0.1, d - ADIM);
        await ctx.wait(dogru ? 600 : 1300);
      }
      const son6 = denemeler.slice(-6);
      const dogrular = denemeler.filter((x) => x.dogru);
      return {
        yon: s.yon,
        hiz: s.hiz,
        gosterim: Math.round(gosterim),
        deneme: denemeler.length,
        dogru: dogrular.length,
        genislik: Math.round((son6.reduce((a, b) => a + b.d, 0) / son6.length) * 100),
        enGenis: dogrular.length ? Math.round(Math.max(...dogrular.map((x) => x.d)) * 100) : null,
      };
    },
    ozet: (r) => [
      ['Yön', YONLER[r.yon]],
      ['Hız', r.hiz ? u.hizAdi(r.hiz) : r.gosterim + ' ms'],
      ['Doğru', `${r.deneme} denemede ${r.dogru}`],
      ['Görüş genişliği', '%' + r.genislik],
      ['En uzak doğru', r.enGenis ? '%' + r.enGenis : '-'],
    ],
    notlar: () => ['Görüş genişliği: son 6 denemede yandaki harflerin merkeze uzaklığının ortalaması (%100 = ekranın kenarı).'],
  };
})();
