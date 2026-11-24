'use strict';
// Anlama teknikleri: anahtar kelime seçme ve 5N1K (Kim, Ne, Nerede, Ne zaman, Nasıl, Neden).
(function () {
  const u = HO.u;
  const el = u.el;
  HO.egz = HO.egz || {};

  const TURLER = { anahtar: 'Anahtar kelime bulma', bes: '5N1K soruları' };
  const PARAGRAF_SINIR = 3;

  async function baslaEkrani(sahne, ctx, baslik, satirlar, ek) {
    const basla = el('button', { class: 'dugme ana buyuk', text: 'Metni aç' });
    sahne.replaceChildren(el('div', { class: 'kart' }, el('h2', { text: baslik }), satirlar.map((s) => el('p', { text: s })), ek || null, el('div', { class: 'dugmeler' }, basla)));
    window.scrollTo(0, 0);
    basla.focus();
    await ctx.click(basla);
  }

  async function anahtarModu(sahne, metin, ek, ctx, bilgi) {
    await baslaEkrani(sahne, ctx, metin.baslik, [
      'Metni okurken her paragrafta en önemli bulduğunuz kelimelere dokunun (paragraf başına en çok 3).',
      'Okuma bitince metin kapanacak; yalnız seçtiğiniz kelimelere bakarak soruları cevaplayacaksınız.',
    ]);
    sahne.replaceChildren();
    const { govde, kelimeler } = HO.ui.metinYerlestir(sahne, metin, 'anahtar-sec');
    const bitti = el('button', { class: 'dugme ana buyuk', text: 'Bitirdim' });
    sahne.append(el('div', { class: 'alt-sabit' }, bitti));
    window.scrollTo(0, 0);
    const secili = new Set();
    const yaz = (not) => (bilgi.textContent = `Seçilen: ${secili.size}${not ? ' · ' + not : ''}`);
    yaz();
    govde.addEventListener('click', (e) => {
      const k = e.target.closest('.k');
      if (!k) return;
      const i = kelimeler.indexOf(k);
      if (secili.has(i)) {
        secili.delete(i);
        k.classList.remove('secili');
      } else {
        const ayni = [...secili].filter((j) => kelimeler[j].dataset.p === k.dataset.p).length;
        if (ayni >= PARAGRAF_SINIR) return yaz(`Bu paragrafta en çok ${PARAGRAF_SINIR} kelime`);
        secili.add(i);
        k.classList.add('secili');
      }
      yaz();
    });
    const t0 = performance.now();
    await ctx.click(bitti);
    const sure = performance.now() - t0;

    // Yalnız seçilen kelimelerle hatırlama.
    const sirali = [...secili].sort((a, b) => a - b);
    const paragraflar = metin.paragraflar.map((_, pi) => sirali.filter((i) => Number(kelimeler[i].dataset.p) === pi).map((i) => kelimeler[i].textContent));
    const soruya = el('button', { class: 'dugme ana buyuk', text: 'Sorulara geç' });
    sahne.replaceChildren(
      el(
        'div',
        { class: 'kart' },
        el('h2', { text: 'Seçtiğiniz anahtar kelimeler' }),
        el('p', { class: 'soluk', text: 'Metni bu kelimelerle hatırlamaya çalışın. Hazır olunca sorulara geçin.' }),
        paragraflar.map((p, i) => el('p', { class: 'anahtar-liste' }, el('span', { class: 'soluk', text: `${i + 1}. paragraf: ` }), p.length ? p.join(' · ') : '(seçim yok)')),
        el('div', { class: 'dugmeler' }, soruya)
      )
    );
    window.scrollTo(0, 0);
    await ctx.click(soruya);
    const cevap = await HO.ui.sorular(sahne, metin.sorular, ctx);

    // Önerilen anahtar kelimelerle karşılaştırma.
    const oneri = new Set(ek.anahtar.map(u.norm));
    const secilenNorm = new Set(sirali.map((i) => u.norm(kelimeler[i].textContent)));
    const ortak = [...oneri].filter((w) => secilenNorm.has(w)).length;
    sahne.replaceChildren();
    const k2 = HO.ui.metinYerlestir(sahne, metin, 'anahtar-karsilastir');
    k2.kelimeler.forEach((k, i) => {
      const s = secili.has(i);
      const o = oneri.has(u.norm(k.textContent));
      if (s && o) k.classList.add('ikisi');
      else if (s) k.classList.add('secili');
      else if (o) k.classList.add('oneri');
    });
    const devam = el('button', { class: 'dugme ana buyuk', text: 'Devam' });
    sahne.prepend(
      el(
        'div',
        { class: 'kart' },
        el('h2', { text: 'Karşılaştırma' }),
        el('p', { text: `Önerilen ${oneri.size} anahtar kelimeden ${ortak} tanesini seçtiniz.` }),
        el('p', { class: 'anahtar-acik' }, el('span', { class: 'k ikisi', text: 'ikimiz de' }), ' ', el('span', { class: 'k secili', text: 'yalnız siz' }), ' ', el('span', { class: 'k oneri', text: 'öneri' })),
        el('p', { class: 'soluk', text: 'Anahtar kelime için tek doğru yoktur. Önerilenler; kişi, yer, zaman, sayı ve olayın özünü taşıyan kelimelerdir.' })
      )
    );
    sahne.append(el('div', { class: 'alt-sabit' }, devam));
    window.scrollTo(0, 0);
    await ctx.click(devam);
    return { tur2: 'anahtar', metin: metin.id, sure: Math.round(sure), secilen: secili.size, onerilen: oneri.size, ortak, dogru: cevap.dogru, toplam: cevap.toplam, oran: cevap.oran };
  }

  async function besModu(sahne, metin, ek, ctx) {
    await baslaEkrani(
      sahne,
      ctx,
      metin.baslik,
      ['Önce aşağıdaki soruları okuyun. Sonra metni bu soruların cevaplarını arayarak okuyun.', 'Okuma bitince metin kapanacak ve cevaplarınızı yazacaksınız.'],
      el('ul', { class: 'bes-liste' }, ek.bes.map((b) => el('li', null, el('strong', { text: b.tur + ': ' }), b.soru)))
    );
    sahne.replaceChildren();
    HO.ui.metinYerlestir(sahne, metin);
    const bitti = el('button', { class: 'dugme ana buyuk', text: 'Bitirdim' });
    sahne.append(el('div', { class: 'alt-sabit' }, bitti));
    window.scrollTo(0, 0);
    const t0 = performance.now();
    await ctx.click(bitti);
    const sure = performance.now() - t0;

    const alanlar = ek.bes.map((b, i) => el('textarea', { rows: 2, id: 'bes-' + i, placeholder: 'Cevabınız' }));
    const gonder = el('button', { class: 'dugme ana', type: 'submit', text: 'Cevapları karşılaştır' });
    const form = el(
      'form',
      { class: 'bes-form' },
      ek.bes.map((b, i) => el('label', { class: 'bes-soru', for: 'bes-' + i }, el('strong', { text: `${b.tur}? ` }), b.soru, alanlar[i])),
      el('div', { class: 'dugmeler' }, gonder)
    );
    sahne.replaceChildren(el('h2', { text: '5N1K: cevaplarınızı yazın' }), el('p', { class: 'soluk', text: 'Metne geri dönmeden, kısa cevaplar yazın.' }), form);
    window.scrollTo(0, 0);
    alanlar[0].focus();
    await ctx.promise((res) =>
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        res();
      })
    );

    // Örnek cevaplarla karşılaştırma ve kendi puanlama.
    const puanlar = ek.bes.map(() => null);
    const tamam = el('button', { class: 'dugme ana', text: 'Devam', disabled: true });
    const kartlar = ek.bes.map((b, i) => {
      const dugmeler = [
        ['Doğru', 1],
        ['Kısmen', 0.5],
        ['Yanlış', 0],
      ].map(([yazi, p]) => {
        const d = el('button', { class: 'dugme ikincil kucuk', type: 'button', text: yazi });
        d.addEventListener('click', () => {
          puanlar[i] = p;
          d.parentNode.querySelectorAll('button').forEach((x) => x.classList.toggle('secim', x === d));
          tamam.disabled = puanlar.some((x) => x === null);
        });
        return d;
      });
      return el(
        'div',
        { class: 'bes-karsilastir' },
        el('div', null, el('strong', { text: `${b.tur}? ` }), b.soru),
        el('div', { class: 'bes-cevap' }, el('span', { class: 'soluk', text: 'Sizin cevabınız: ' }), alanlar[i].value.trim() || '(boş)'),
        el('div', { class: 'bes-cevap' }, el('span', { class: 'soluk', text: 'Örnek cevap: ' }), b.cevap),
        el('div', { class: 'bes-puan' }, dugmeler)
      );
    });
    sahne.replaceChildren(el('h2', { text: 'Karşılaştırın ve puanlayın' }), el('p', { class: 'soluk', text: 'Cevabınız örnekle aynı anlamı taşıyorsa "Doğru" deyin; kelimelerin aynı olması gerekmez.' }), ...kartlar, el('div', { class: 'dugmeler' }, tamam));
    window.scrollTo(0, 0);
    await ctx.click(tamam);
    const puan = puanlar.reduce((a, b) => a + b, 0);
    const af = await HO.ui.sorular(sahne, [ek.anaFikir], ctx, 'Ana fikir');
    return { tur2: 'bes', metin: metin.id, sure: Math.round(sure), puan, toplam: ek.bes.length, oran: puan / ek.bes.length, anaFikir: af.dogru === 1 };
  }

  HO.egz.anlama = {
    id: 'anlama',
    ad: 'Anlama teknikleri',
    kisa: 'Anahtar kelime bulma ve 5N1K ile okuma.',
    sure: '4–6 dk',
    nasil: [
      'Anahtar kelime bulma: okurken her paragrafın en önemli kelimelerini seçersiniz, sonra yalnız onlara bakarak soruları cevaplarsınız.',
      '5N1K: okumadan önce Kim, Ne, Nerede, Ne zaman, Nasıl, Neden sorularını görürsünüz; metni bu cevapları arayarak okursunuz.',
      'Her iki türde de sonunda kendi seçimlerinizi örnek cevaplarla karşılaştırırsınız.',
    ],
    secenekler: [{ ad: 'tur', etiket: 'Teknik', degerler: Object.entries(TURLER), varsayilan: 'anahtar' }],
    async calistir(sahne, s, ctx, { bilgi }) {
      const havuz = HO.icerik.alistirma.filter((m) => HO.icerik.anlama[m.id]);
      const metin = HO.depo.metinSec(havuz);
      const ek = HO.icerik.anlama[metin.id];
      bilgi.textContent = TURLER[s.tur];
      return s.tur === 'bes' ? besModu(sahne, metin, ek, ctx) : anahtarModu(sahne, metin, ek, ctx, bilgi);
    },
    ozet: (r) =>
      r.tur2 === 'bes'
        ? [
            ['Teknik', TURLER.bes],
            ['5N1K puanı', `${String(r.puan).replace('.', ',')} / ${r.toplam}`],
            ['Ana fikir', r.anaFikir ? 'Doğru' : 'Yanlış'],
            ['Okuma süresi', u.fmtClock(r.sure)],
          ]
        : [
            ['Teknik', TURLER.anahtar],
            ['Seçilen kelime', String(r.secilen)],
            ['Önerilenlerle ortak', `${r.onerilen} kelimeden ${r.ortak}`],
            ['Anlama', `${u.pct(r.oran)} (${r.dogru}/${r.toplam})`],
            ['Okuma süresi', u.fmtClock(r.sure)],
          ],
  };
})();
