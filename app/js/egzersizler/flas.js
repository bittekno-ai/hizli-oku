'use strict';
// Pilot flaş eğitimi (Renshaw tarzı takistoskop): kısa süre görünen sayı, kelime ya da
// kelime grubunu tanıma. Süre uyarlamalıdır: doğruda kısalır, yanlışta uzar.
(function () {
  const u = HO.u;
  const el = u.el;
  HO.egz = HO.egz || {};

  const TURLER = { rakam: 'Rakam dizisi', harf: 'Harf dizisi', kelime: 'Kelime', grup: 'Kelime grubu', siluet: 'Siluet' };
  // Birbirine benzeyen ve klavyede karışan harfler (I, İ, Ğ, O, Ö) çıkarıldı.
  const HARFLER = 'ABCÇDEFGHJKLMNPRSŞTUÜVYZ';
  const DIZILI = (tur) => tur === 'rakam' || tur === 'harf';
  const EN_KISA = 17; // yaklaşık bir ekran karesi
  const EN_UZUN = 1000;

  function uyaran(tur, uzunluk) {
    if (tur === 'rakam') {
      let s = String(u.randInt(1, 9));
      while (s.length < uzunluk) s += u.randInt(0, 9);
      return s;
    }
    if (tur === 'harf') {
      let s = '';
      while (s.length < uzunluk) s += HARFLER[u.randInt(0, HARFLER.length - 1)];
      return s;
    }
    if (tur === 'kelime') return u.pick(HO.icerik.kelimeler);
    return u.pick(HO.icerik.gruplar);
  }

  // Siluet: aynı gruptan rastgele biri ve 3 çeldirici. Görseller önceden yüklenir ki ilk gösterim gecikmesin.
  function siluetHavuzu(grup) {
    const t = HO.icerik.siluetler;
    return grup && grup !== 'karisik' ? t.filter((x) => x.grup === grup) : t;
  }
  function siluetResmi(x) {
    return el('img', { class: 'flas-siluet', src: 'siluet/' + x.id + '.png', alt: '', draggable: 'false' });
  }
  async function siluetleriYukle(liste) {
    const resimler = {};
    await Promise.all(
      liste.map((x) => {
        resimler[x.id] = siluetResmi(x);
        return resimler[x.id].decode().catch(() => {});
      })
    );
    return resimler;
  }
  // Gözde kalan izi silen rastgele siyah lekeler (siluetle aynı boyutta).
  function siluetMaskesi() {
    const c = el('canvas', { class: 'flas-siluet flas-siluet-maske', width: 256, height: 256 });
    const g = c.getContext('2d');
    g.fillStyle = '#000';
    for (let i = 0; i < 70; i++) {
      const w = u.randInt(10, 60), h = u.randInt(6, 40);
      g.fillRect(u.randInt(0, 256 - w), u.randInt(20, 236 - h), w, h);
    }
    return c;
  }

  function maske(n) {
    const k = '#%&@$#&%@$';
    let s = '';
    for (let i = 0; i < n; i++) s += k[i % k.length];
    return s;
  }

  function baslangicSure(tur, uzunluk) {
    const son = HO.depo.son('flas', (r) => r.tur2 === tur && (!DIZILI(tur) || r.uzunluk === uzunluk));
    if (!son) return tur === 'grup' ? 400 : 300;
    return u.clamp(Math.round(son.esik * 1.3), 50, 500);
  }

  async function kareSuresiOlc(ctx) {
    const d = [];
    let onceki = await ctx.frame();
    for (let i = 0; i < 20; i++) {
      const t = await ctx.frame();
      d.push(t - onceki);
      onceki = t;
    }
    d.sort((a, b) => a - b);
    return d[10] || 16.7;
  }

  HO.egz.flas = {
    id: 'flas',
    ad: 'Pilot flaş eğitimi',
    kisa: 'Kısa süre görünen sayı ve kelimeleri tanıyın.',
    sure: '3 dk',
    flas: true,
    nasil: [
      'Ekranın ortasındaki + işaretine bakın.',
      'Bir sayı, kelime ya da kelime grubu çok kısa süre görünür. Hemen ardından yerine #%&@ gibi karışık işaretler gelir. Bu işaretler gözde kalan izi siler; böylece yalnız gösterilen süre içinde gördüğünüz sayılır.',
      'Gördüğünüzü yazıp Enter’a basın. Doğru cevapta gösterim süresi kısalır, yanlışta uzar.',
      'İkinci Dünya Savaşı’nda pilotlara uçak ve gemi tanıma için uygulanan Renshaw yöntemine dayanır.',
    ],
    secenekler: [
      { ad: 'tur', etiket: 'Ne gösterilsin', degerler: Object.entries(TURLER), varsayilan: 'rakam' },
      { ad: 'siluetGrup', etiket: 'Siluetler', degerler: [['karisik', 'Karışık'], ...Object.entries(HO.icerik.siluetGruplari)], varsayilan: 'karisik' },
      { ad: 'uzunluk', etiket: 'Dizi uzunluğu (rakam/harf)', degerler: [[3, '3'], [4, '4'], [5, '5'], [6, '6'], [7, '7'], [8, '8'], [9, '9']], varsayilan: 4 },
      { ad: 'deneme', etiket: 'Deneme sayısı', degerler: [[10, '10'], [20, '20'], [30, '30']], varsayilan: 20 },
    ],
    async calistir(sahne, s, ctx, { bilgi }) {
      const tur = s.tur;
      const uzunluk = s.uzunluk;
      const siluet = tur === 'siluet';
      let ms = baslangicSure(tur, uzunluk);
      const kutu = el('div', { class: 'flas-kutu' + (siluet ? ' siluetli' : ''), 'aria-live': 'off' });
      const havuz = siluet ? siluetHavuzu(s.siluetGrup) : null;
      const resimler = siluet ? await ctx.promise((res) => siluetleriYukle(havuz).then(res)) : null;
      const secimler = el('div', { class: 'flas-secimler' });
      const giris = el('input', {
        class: 'flas-giris',
        type: 'text',
        autocomplete: 'off',
        spellcheck: 'false',
        inputmode: tur === 'rakam' ? 'numeric' : 'text',
        autocapitalize: tur === 'harf' ? 'characters' : 'off',
        placeholder: 'Gördüğünüzü yazın',
      });
      const geri = el('div', { class: 'flas-geri' });
      const form = el('form', { class: 'flas-form' }, giris);
      sahne.replaceChildren(el('div', { class: 'flas-alan' }, kutu, siluet ? secimler : form, geri));
      form.style.visibility = 'hidden';
      secimler.style.visibility = 'hidden';
      let onceki = null;

      const kare = await kareSuresiOlc(ctx);
      const denemeler = [];
      for (let d = 0; d < s.deneme; d++) {
        bilgi.textContent = `Deneme ${d + 1}/${s.deneme} · Süre: ${Math.round(ms)} ms`;
        let hedef, hedefSiluet;
        if (siluet) {
          // Aynı siluet arka arkaya gelmesin.
          do hedefSiluet = u.pick(havuz);
          while (havuz.length > 1 && hedefSiluet === onceki);
          onceki = hedefSiluet;
          hedef = hedefSiluet.ad;
        } else hedef = uyaran(tur, uzunluk);
        geri.textContent = '';
        kutu.className = 'flas-kutu' + (siluet ? ' siluetli' : '');
        kutu.textContent = '+';
        await ctx.wait(700);
        kutu.textContent = '';
        await ctx.wait(200);

        // Gösterim: kare sayısıyla.
        const kareSayisi = Math.max(1, Math.round(ms / kare));
        await ctx.frame();
        if (siluet) kutu.replaceChildren(resimler[hedefSiluet.id]);
        else kutu.textContent = hedef;
        const ilk = await ctx.frame(); // bu karede ekrana çizildi
        let son = ilk;
        for (let k = 1; k < kareSayisi; k++) son = await ctx.frame();
        if (siluet) kutu.replaceChildren(siluetMaskesi());
        else kutu.textContent = maske(Math.max(4, hedef.length));
        const gercek = Math.max(kare, son - ilk + kare);
        await ctx.wait(250);
        kutu.textContent = '';

        let cevap;
        if (siluet) {
          // 4 seçenek: doğru cevap ve aynı gruptan 3 çeldirici. 1-4 tuşlarıyla da seçilebilir.
          const ayni = HO.icerik.siluetler.filter((x) => x.grup === hedefSiluet.grup && x !== hedefSiluet);
          const sik = u.shuffle([hedefSiluet, ...u.shuffle(ayni).slice(0, 3)]);
          const dugmeler = sik.map((x, i) => el('button', { class: 'dugme ikincil', type: 'button', text: `${i + 1}. ${x.ad}` }));
          secimler.replaceChildren(...dugmeler);
          secimler.style.visibility = 'visible';
          dugmeler[0].focus();
          cevap = await ctx.promise((res) => {
            const tus = (e) => {
              const n = Number(e.key);
              if (n >= 1 && n <= sik.length) sec(n - 1);
            };
            const kaldir = () => document.removeEventListener('keydown', tus);
            const iptal = ctx.onAbort(kaldir);
            const sec = (i) => {
              kaldir();
              iptal();
              res(sik[i].ad);
            };
            dugmeler.forEach((d, i) => (d.onclick = () => sec(i)));
            document.addEventListener('keydown', tus);
          });
          secimler.style.visibility = 'hidden';
        } else {
          form.style.visibility = 'visible';
          giris.value = '';
          giris.focus();
          cevap = await ctx.promise((res) => {
            form.onsubmit = (e) => {
              e.preventDefault();
              res(giris.value);
            };
          });
          form.style.visibility = 'hidden';
        }
        const dogru = u.norm(cevap) === u.norm(hedef);
        denemeler.push({ ms: Math.round(ms), gercek: Math.round(gercek), dogru });
        geri.textContent = dogru ? 'Doğru' : `Gösterilen: ${hedef}`;
        geri.className = 'flas-geri ' + (dogru ? 'dogru' : 'yanlis');
        ms = dogru ? Math.max(EN_KISA, ms * 0.8) : Math.min(EN_UZUN, ms * 1.25);
        await ctx.wait(dogru ? 600 : 1300);
      }
      const son6 = denemeler.slice(-6);
      const esik = Math.round(son6.reduce((a, b) => a + b.ms, 0) / son6.length);
      const dogruSay = denemeler.filter((x) => x.dogru).length;
      const enKisaDogru = denemeler.filter((x) => x.dogru).reduce((a, b) => Math.min(a, b.ms), Infinity);
      return {
        tur2: tur,
        siluetGrup: siluet ? s.siluetGrup : null,
        uzunluk: DIZILI(tur) ? uzunluk : null,
        deneme: denemeler.length,
        dogru: dogruSay,
        esik,
        enKisa: isFinite(enKisaDogru) ? enKisaDogru : null,
        kare: Math.round(kare * 10) / 10,
      };
    },
    ozet: (r) => [
      ['Tür', TURLER[r.tur2] + (r.siluetGrup ? ` (${r.siluetGrup === 'karisik' ? 'karışık' : HO.icerik.siluetGruplari[r.siluetGrup].toLocaleLowerCase('tr')})` : '') + (r.uzunluk ? ` (${r.uzunluk} ${r.tur2 === 'harf' ? 'harf' : 'rakam'})` : '')],
      ['Doğru', `${r.deneme} denemede ${r.dogru}`],
      ['Flaş eşiği', r.esik + ' ms'],
      ['En kısa doğru', r.enKisa ? r.enKisa + ' ms' : '-'],
    ],
    notlar: (r) => ['Flaş eşiği, son 6 denemedeki ortalama gösterim süresidir.'],
  };
})();
