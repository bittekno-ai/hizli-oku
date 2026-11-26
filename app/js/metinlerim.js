'use strict';
// Metinlerim: kullanıcının kendi metinlerini ekleyip düzenlediği sayfa.
// Metinler yalnız bu cihazda saklanır ve yedeğe dahildir.
(function () {
  const u = HO.u;
  const el = u.el;
  const EN_COK_KELIME = 5000;

  const paragraflaraBol = (yazi) => {
    const t = yazi.replace(/\r/g, '').trim();
    const bloklar = /\n\s*\n/.test(t) ? t.split(/\n\s*\n/) : t.split(/\n/);
    return bloklar.map((p) => p.replace(/\s+/g, ' ').trim()).filter(Boolean);
  };

  function liste(kap) {
    const metinler = HO.depo.kendiMetinler();
    kap.replaceChildren(
      el('h1', { text: 'Metinlerim' }),
      el('p', { class: 'soluk', text: 'Kendi metinlerinizi (kitaptan bir bölüm, ders notu, makale) ekleyip onlarla çalışabilirsiniz. Okuma hızı, Rehberle okuma, Tek nokta okuma ve Çam ağacı egzersizlerinde "Metin" seçeneğinden seçilir. Metinler yalnız bu cihazda saklanır.' }),
      el('div', { class: 'dugmeler sola' }, el('a', { class: 'dugme ana', href: '#/metinlerim/yeni', text: '+ Yeni metin ekle' })),
      metinler.length
        ? el(
            'div',
            { class: 'egz-kartlar metin-kartlar' },
            metinler.map((m) =>
              el(
                'a',
                { class: 'egz-kart', href: '#/metinlerim/' + m.id },
                el('strong', { text: m.baslik }),
                el('span', { text: `${u.words(u.metinYazi(m)).length} kelime · ${m.sorular.length ? m.sorular.length + ' soru' : 'sorusuz'}` }),
                el('small', { text: 'Düzenle' })
              )
            )
          )
        : el('p', { class: 'kart', text: 'Henüz metin eklemediniz.' })
    );
  }

  function soruSatiri(s, i) {
    const secenekler = [0, 1, 2, 3].map((j) => el('input', { type: 'text', class: 'ms-secenek', placeholder: `${j + 1}. seçenek`, value: (s && s.secenekler[j]) || '' }));
    const dogruSec = el(
      'select',
      { class: 'ms-dogru', 'aria-label': 'Doğru seçenek' },
      [0, 1, 2, 3].map((j) => el('option', { value: j, text: `Doğru cevap: ${j + 1}. seçenek` }))
    );
    if (s) dogruSec.value = String(s.dogru);
    const sil = el('button', { type: 'button', class: 'dugme ikincil kucuk', text: 'Soruyu sil' });
    const kutu = el(
      'fieldset',
      { class: 'ms-soru' },
      el('legend', { text: `Soru ${i + 1}` }),
      el('input', { type: 'text', class: 'ms-soru-yazi', placeholder: 'Soru', value: (s && s.soru) || '' }),
      el('div', { class: 'ms-secenekler' }, secenekler),
      el('div', { class: 'ms-alt' }, dogruSec, sil)
    );
    sil.addEventListener('click', () => kutu.remove());
    return kutu;
  }

  function duzenle(kap, id) {
    const m = id === 'yeni' ? null : HO.depo.kendiMetin(id);
    if (id !== 'yeni' && !m) {
      location.hash = '#/metinlerim';
      return;
    }
    const baslik = el('input', { type: 'text', id: 'ms-baslik', placeholder: 'Örnek: Kitabımın 3. bölümü', value: m ? m.baslik : '', maxlength: 120 });
    const metin = el('textarea', { id: 'ms-metin', rows: 14, placeholder: 'Metni buraya yapıştırın. Paragrafları boş satırla ayırın.' });
    metin.value = m ? m.paragraflar.join('\n\n') : '';
    const sayac = el('div', { class: 'soluk' });
    const say = () => (sayac.textContent = `${u.words(metin.value).length} kelime`);
    metin.addEventListener('input', say);
    say();
    const sorular = el('div', { class: 'ms-sorular' }, (m ? m.sorular : []).map((s, i) => soruSatiri(s, i)));
    const soruEkle = el('button', { type: 'button', class: 'dugme ikincil', text: '+ Soru ekle' });
    soruEkle.addEventListener('click', () => sorular.append(soruSatiri(null, sorular.children.length)));
    const hata = el('p', { class: 'uyari' });
    const kaydet = el('button', { type: 'button', class: 'dugme ana', text: 'Kaydet' });
    const sil = m ? el('button', { type: 'button', class: 'dugme tehlike', text: 'Metni sil' }) : null;

    kaydet.addEventListener('click', () => {
      const p = paragraflaraBol(metin.value);
      const kelime = u.words(p.join(' ')).length;
      if (!baslik.value.trim()) return (hata.textContent = 'Bir başlık yazın.');
      if (kelime < 30) return (hata.textContent = 'Metin en az 30 kelime olmalı.');
      if (kelime > EN_COK_KELIME) return (hata.textContent = `Metin en çok ${EN_COK_KELIME} kelime olabilir. Uzun metinleri bölümlere ayırın.`);
      const soruListesi = [];
      for (const f of sorular.querySelectorAll('.ms-soru')) {
        const soru = f.querySelector('.ms-soru-yazi').value.trim();
        const secenekler = [...f.querySelectorAll('.ms-secenek')].map((x) => x.value.trim());
        const dogruI = Number(f.querySelector('.ms-dogru').value);
        if (!soru && secenekler.every((x) => !x)) continue; // boş soru: yok say
        if (!soru) return (hata.textContent = 'Bir sorunun metni boş.');
        if (!secenekler[dogruI]) return (hata.textContent = `"${soru}" sorusunda doğru seçenek boş.`);
        const dolu = secenekler.map((t, j) => ({ t, dogru: j === dogruI })).filter((x) => x.t);
        if (dolu.length < 2) return (hata.textContent = `"${soru}" sorusunda en az 2 seçenek olmalı.`);
        soruListesi.push({ soru, secenekler: dolu.map((x) => x.t), dogru: dolu.findIndex((x) => x.dogru) });
      }
      HO.depo.kendiMetinKaydet({
        id: m ? m.id : 'k-' + Date.now().toString(36),
        kendi: true,
        baslik: baslik.value.trim(),
        paragraflar: p,
        sorular: soruListesi,
        olusturma: m ? m.olusturma : Date.now(),
      });
      location.hash = '#/metinlerim';
    });
    if (sil)
      sil.addEventListener('click', async () => {
        if (await HO.ui.onay(`"${m.baslik}" silinecek. Bu metinle yaptığınız egzersiz sonuçları ilerlemenizde kalır. Emin misiniz?`, 'Sil')) {
          HO.depo.kendiMetinSil(m.id);
          location.hash = '#/metinlerim';
        }
      });

    kap.replaceChildren(
      el('h1', { text: m ? 'Metni düzenle' : 'Yeni metin' }),
      el(
        'section',
        { class: 'kart ms-form' },
        el('label', { for: 'ms-baslik' }, el('strong', { text: 'Başlık' })),
        baslik,
        el('label', { for: 'ms-metin' }, el('strong', { text: 'Metin' })),
        metin,
        sayac,
        el('p', { class: 'soluk', text: 'Telif hakkı olan bir kitaptan aldığınız metin yalnız sizin cihazınızda kalır; başkalarıyla paylaşılmaz.' })
      ),
      el(
        'section',
        { class: 'kart' },
        el('h2', { text: 'Anlama soruları (isteğe bağlı)' }),
        el('p', { class: 'soluk', text: 'Soru eklerseniz okuma sonunda anlama oranınız ve etkili hızınız ölçülür. Soru eklemezseniz yalnız okuma hızı ölçülür.' }),
        sorular,
        el('div', { class: 'dugmeler sola' }, soruEkle)
      ),
      hata,
      el('div', { class: 'dugmeler' }, sil, el('a', { class: 'dugme ikincil', href: '#/metinlerim', text: 'Vazgeç' }), kaydet)
    );
  }

  HO.sayfa.metinlerim = function (kap, id) {
    if (id) duzenle(kap, id);
    else liste(kap);
  };
})();
