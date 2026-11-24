'use strict';
// Burdon dikkat testi: harf tablosunda belirlenen harfleri sırayla tarayıp işaretleme.
(function () {
  const u = HO.u;
  const el = u.el;
  HO.egz = HO.egz || {};

  const HARFLER = 'abcçdefghıijklmnoöprsştuüvyz'.split('');
  // Hedefler birbirine çok benzemeyen harflerden seçilir.
  const HEDEF_ADAY = ['a', 'b', 'd', 'e', 'k', 'm', 'p', 'r', 's', 't', 'y', 'z'];
  const ADET = 480;

  function tabloUret(hedefler) {
    const digerleri = HARFLER.filter((h) => !hedefler.includes(h));
    const out = [];
    for (let i = 0; i < ADET; i++) out.push(Math.random() < 0.2 ? u.pick(hedefler) : u.pick(digerleri));
    return out;
  }

  HO.egz.burdon = {
    id: 'burdon',
    ad: 'Burdon dikkat testi',
    kisa: 'Harf tablosunda istenen harfleri bulup işaretleyin.',
    sure: '1–3 dk',
    nasil: [
      'Ekranda karışık harflerden oluşan bir tablo görünür. Üstte aramanız gereken harfler yazar.',
      'Tabloyu soldan sağa, satır satır tarayın. Aranan harflerin her birine dokunarak işaretleyin.',
      'Yanlış işaretlediğiniz harfe yeniden dokunursanız işaret kalkar. Geri dönüp atladığınız harfleri de işaretleyebilirsiniz.',
      'Süre bitince ya da "Bitirdim"e basınca, son işaretlediğiniz harfe kadar olan bölüm değerlendirilir.',
    ],
    secenekler: [
      { ad: 'hedef', etiket: 'Aranan harf sayısı', degerler: [[2, '2 harf'], [3, '3 harf'], [4, '4 harf']], varsayilan: 3 },
      { ad: 'sure', etiket: 'Süre', degerler: [[60, '1 dakika'], [120, '2 dakika'], [180, '3 dakika']], varsayilan: 120 },
    ],
    async calistir(sahne, s, ctx, { bilgi }) {
      const hedefler = u.shuffle(HEDEF_ADAY).slice(0, s.hedef).sort((a, b) => a.localeCompare(b, 'tr'));
      const tablo = tabloUret(hedefler);
      const isaretli = new Set();

      const bitir = el('button', { class: 'dugme ana', text: 'Bitirdim' });
      const ust = el('div', { class: 'burdon-ust' }, el('span', { text: 'Aranan harfler:' }), hedefler.map((h) => el('strong', { class: 'burdon-hedef', text: h })), bitir);
      const izgara = el('div', { class: 'burdon' });
      tablo.forEach((h, i) => izgara.append(el('button', { class: 'burdon-harf', text: h, 'data-i': i, type: 'button' })));
      await HO.ui.geriSayim(sahne, ctx, 'Aranan harfler: ' + hedefler.join(', '));
      sahne.replaceChildren(ust, izgara);

      izgara.addEventListener('click', (e) => {
        const b = e.target.closest('.burdon-harf');
        if (!b) return;
        const i = Number(b.dataset.i);
        if (isaretli.has(i)) isaretli.delete(i);
        else isaretli.add(i);
        b.classList.toggle('isaretli');
      });

      const sureMs = s.sure * 1000;
      const t0 = performance.now();
      await ctx.promise((bitti) => {
        bitir.addEventListener('click', bitti);
        const id = setInterval(() => {
          const kalan = sureMs - (performance.now() - t0);
          bilgi.textContent = `Kalan: ${u.fmtClock(Math.max(0, kalan))}`;
          if (kalan <= 0) {
            clearInterval(id);
            bitti();
          }
        }, 250);
        ctx.onAbort(() => clearInterval(id));
      });
      const sure = Math.min(sureMs, performance.now() - t0);

      // Değerlendirme: son işaretlenen harfe kadar taranan bölüm.
      const son = isaretli.size ? Math.max(...isaretli) : -1;
      let dogru = 0;
      let yanlis = 0;
      let atlanan = 0;
      for (let i = 0; i <= son; i++) {
        const hedefMi = hedefler.includes(tablo[i]);
        if (isaretli.has(i)) hedefMi ? dogru++ : yanlis++;
        else if (hedefMi) atlanan++;
      }
      // Sonuç ekranında hataları göster.
      izgara.querySelectorAll('.burdon-harf').forEach((b, i) => {
        b.disabled = true;
        if (i > son) b.classList.add('taranmadi');
        else if (isaretli.has(i) && !hedefler.includes(tablo[i])) b.classList.add('yanlis');
        else if (!isaretli.has(i) && hedefler.includes(tablo[i])) b.classList.add('atlandi');
      });
      bitir.remove();
      const devam = el('button', { class: 'dugme ana', text: 'Sonucu gör' });
      ust.append(el('span', { class: 'burdon-acik' }, el('span', { class: 'burdon-harf atlandi', text: 'a' }), ' atlanan  ', el('span', { class: 'burdon-harf yanlis', text: 'a' }), ' yanlış'), devam);
      await ctx.click(devam);

      const taranan = son + 1;
      const toplamHedef = dogru + atlanan;
      return {
        hedefler: hedefler.join(''),
        sure: Math.round(sure),
        taranan,
        dogru,
        yanlis,
        atlanan,
        dakikadaHarf: Math.round(taranan / (sure / 60000)),
        dikkat: toplamHedef + yanlis ? dogru / (toplamHedef + yanlis) : 0,
      };
    },
    ozet: (r) => [
      ['Aranan harfler', r.hedefler.split('').join(', ')],
      ['Taranan harf', `${r.taranan} (${u.num(r.dakikadaHarf)} harf/dk)`],
      ['Doğru işaret', String(r.dogru)],
      ['Atlanan', String(r.atlanan)],
      ['Yanlış işaret', String(r.yanlis)],
      ['Dikkat oranı', u.pct(r.dikkat)],
    ],
    notlar: () => ['Dikkat oranı = doğru işaret ÷ (doğru + atlanan + yanlış). Taranan harf, hızınızı gösterir.'],
  };
})();
