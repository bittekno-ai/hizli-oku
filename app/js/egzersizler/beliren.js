'use strict';
// Ekranın farklı yerlerinde beliren ve kaybolan kelimeler (yatay, çapraz, rastgele).
(function () {
  const u = HO.u;
  const el = u.el;
  HO.egz = HO.egz || {};

  const DESENLER = { yatay: 'Yatay (satır satır)', capraz: 'Çapraz', rastgele: 'Rastgele' };

  function konumlar(desen, adet) {
    const out = [];
    if (desen === 'yatay') {
      const xs = [0.12, 0.5, 0.88];
      const ys = [0.12, 0.31, 0.5, 0.69, 0.88];
      for (let i = 0; out.length < adet; i++) {
        const satir = Math.floor(i / xs.length) % ys.length;
        out.push([xs[i % xs.length], ys[satir]]);
      }
    } else if (desen === 'capraz') {
      const adim = [0.1, 0.3, 0.5, 0.7, 0.9];
      for (let i = 0; out.length < adet; i++) {
        const k = i % 10;
        const j = k % 5;
        // önce sol üstten sağ alta, sonra sağ üstten sol alta
        out.push(k < 5 ? [adim[j], adim[j]] : [adim[4 - j], adim[j]]);
      }
    } else {
      let son = [0.5, 0.5];
      while (out.length < adet) {
        const p = [0.1 + Math.random() * 0.8, 0.1 + Math.random() * 0.8];
        if (Math.hypot(p[0] - son[0], p[1] - son[1]) < 0.3) continue;
        out.push(p);
        son = p;
      }
    }
    return out;
  }

  HO.egz.beliren = {
    id: 'beliren',
    ad: 'Beliren kelimeler',
    kisa: 'Ekranın farklı yerlerinde çıkan kelimeleri yakalayın.',
    sure: '1–2 dk',
    flas: true,
    nasil: [
      'Kelimeler ekranın farklı yerlerinde kısa süre belirip kaybolur.',
      'Başınızı oynatmadan gözlerinizle her kelimeyi yakalayıp okuyun.',
      'Sonunda size gördüğünüz kelimeler sorulacak.',
    ],
    secenekler: [
      { ad: 'desen', etiket: 'Desen', degerler: Object.entries(DESENLER), varsayilan: 'yatay' },
      { ad: 'gosterim', etiket: 'Görünme süresi', degerler: [[800, '800 ms'], [600, '600 ms'], [450, '450 ms'], [300, '300 ms']], varsayilan: 600 },
      { ad: 'adet', etiket: 'Kelime sayısı', degerler: [[30, '30'], [50, '50'], [80, '80']], varsayilan: 50 },
    ],
    async calistir(sahne, s, ctx, { bilgi }) {
      const havuz = u.shuffle(HO.icerik.kelimeler);
      const kelimeler = havuz.slice(0, s.adet);
      const gorulmeyen = havuz.slice(s.adet, s.adet + 4);
      const yer = konumlar(s.desen, s.adet);
      await HO.ui.geriSayim(sahne, ctx);
      const alan = el('div', { class: 'beliren-alan' });
      const k = el('div', { class: 'beliren-kelime' });
      alan.append(k);
      sahne.replaceChildren(alan);
      for (let i = 0; i < kelimeler.length; i++) {
        const [x, y] = yer[i];
        k.style.left = x * 100 + '%';
        k.style.top = y * 100 + '%';
        k.textContent = kelimeler[i];
        k.style.visibility = 'visible';
        bilgi.textContent = `${i + 1} / ${kelimeler.length}`;
        await ctx.wait(s.gosterim);
        k.style.visibility = 'hidden';
        await ctx.wait(150);
      }

      // Kısa kontrol: 4 görülen + 4 görülmeyen kelime.
      const gorulen = u.shuffle(kelimeler).slice(0, 4);
      const secenek = u.shuffle([...gorulen.map((w) => [w, true]), ...gorulmeyen.map((w) => [w, false])]);
      const form = el('div', { class: 'kelime-sec' });
      secenek.forEach(([w], i) =>
        form.append(el('label', { class: 'secenek' }, el('input', { type: 'checkbox', value: i }), ' ', w))
      );
      const tamam = el('button', { class: 'dugme ana', text: 'Kontrol et' });
      sahne.replaceChildren(
        el('div', { class: 'kart' }, el('h2', { text: 'Hangi kelimeleri gördünüz?' }), el('p', { class: 'soluk', text: 'Gördüğünüzü düşündüğünüz kelimeleri işaretleyin.' }), form, el('div', { class: 'dugmeler' }, tamam))
      );
      await ctx.click(tamam);
      let dogru = 0;
      form.querySelectorAll('input').forEach((inp, i) => {
        if (inp.checked === secenek[i][1]) dogru++;
      });
      return { desen: s.desen, gosterim: s.gosterim, adet: s.adet, dogru, toplam: secenek.length };
    },
    ozet: (r) => [
      ['Desen', DESENLER[r.desen]],
      ['Görünme süresi', r.gosterim + ' ms'],
      ['Kelime sayısı', String(r.adet)],
      ['Kontrol', `${r.toplam} işaretten ${r.dogru} doğru`],
    ],
  };
})();
