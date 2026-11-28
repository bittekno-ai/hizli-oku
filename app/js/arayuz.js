'use strict';
// Ortak arayüz parçaları: pencere, uyarılar, geri sayım, sorular, egzersiz çalıştırıcı.
(function () {
  const u = HO.u;
  const el = u.el;
  const ui = {};

  ui.ayarlariUygula = function () {
    const a = HO.depo.ayarlar;
    const kok = document.documentElement;
    kok.style.setProperty('--okuma-boyu', 'calc(' + a.yaziBoyu + 'px * var(--olcek, 1))');
    kok.style.setProperty('--okuma-aralik', a.satirAraligi);
    kok.dataset.tema = a.tema;
    kok.dataset.hareket = a.hareket || 'sistem';
    const sistemAz = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    kok.classList.toggle('hareket-yok', a.hareket === 'az' || ((a.hareket || 'sistem') === 'sistem' && sistemAz));
  };

  // Basit pencere (modal). dugmeler: [{yazi, deger, tur:'ana'|'ikincil'|'tehlike'}]
  ui.pencere = function (icerik, dugmeler, ctx) {
    const katman = document.getElementById('katman');
    let kapat;
    const p = new Promise((res) => {
      const kutu = el('div', { class: 'pencere', role: 'dialog', 'aria-modal': 'true' }, icerik);
      const satir = el('div', { class: 'dugmeler' });
      dugmeler.forEach((d) => {
        satir.append(
          el('button', {
            class: 'dugme ' + (d.tur || 'ikincil'),
            text: d.yazi,
            onclick: () => kapat(typeof d.deger === 'function' ? d.deger() : d.deger),
          })
        );
      });
      kutu.append(satir);
      const arka = el('div', { class: 'pencere-arka' }, kutu);
      katman.append(arka);
      kapat = (v) => {
        arka.remove();
        res(v);
      };
      const ilk = satir.querySelector('.ana') || satir.querySelector('button');
      if (ilk) ilk.focus();
    });
    if (ctx) ctx.onAbort(() => kapat && kapat(null));
    return p;
  };

  // Sonuç sayılarını sıfırdan sayarak gösterir (hareket kapalıysa doğrudan yazar).
  ui.sayarakGoster = function (dd, yazi) {
    const m = /^(\d{1,3}(?:\.\d{3})*|\d+)(,\d+)?/.exec(yazi);
    if (!m || /^[:/]/.test(yazi.slice(m[0].length)) || document.documentElement.classList.contains('hareket-yok')) {
      dd.textContent = yazi;
      return;
    }
    const hedef = Number(m[1].replace(/\./g, '') + (m[2] ? '.' + m[2].slice(1) : ''));
    const ondalik = m[2] ? m[2].length - 1 : 0;
    const kuyruk = yazi.slice(m[0].length);
    const t0 = performance.now();
    const adim = (t) => {
      const k = Math.min(1, (t - t0) / 700);
      const v = hedef * (1 - Math.pow(1 - k, 3));
      dd.textContent = v.toLocaleString('tr-TR', { minimumFractionDigits: ondalik, maximumFractionDigits: ondalik }) + kuyruk;
      if (k < 1) requestAnimationFrame(adim);
      else dd.textContent = yazi;
    };
    requestAnimationFrame(adim);
  };

  ui.onay = (soru, evet = 'Evet', hayir = 'Vazgeç') =>
    ui.pencere(el('p', { text: soru }), [
      { yazi: hayir, deger: false },
      { yazi: evet, deger: true, tur: 'tehlike' },
    ]);

  // Işığa duyarlı epilepsi uyarısı (KURALLAR madde 3).
  ui.epilepsiUyarisi = async function (ctx) {
    if (HO.depo.ayarlar.epilepsiGizle) return true;
    const kutu = el('input', { type: 'checkbox', id: 'epi-gizle' });
    const icerik = el(
      'div',
      null,
      el('h2', { text: 'Sağlık uyarısı' }),
      el('p', {
        text:
          'Bu egzersizde sayılar ve kelimeler ekranda kısa süre belirip kaybolur. Işığa duyarlı epilepsiniz varsa ya da daha önce yanıp sönen görüntüler size nöbet, baş dönmesi veya rahatsızlık verdiyse bu egzersizi yapmayın.',
      }),
      el('p', {
        text:
          'Egzersiz sırasında baş dönmesi, görme bozukluğu, göz ya da kas seğirmesi, bilinç bulanıklığı olursa hemen durun ve bir doktora başvurun.',
      }),
      el('label', { class: 'onay-kutu' }, kutu, ' Bu uyarıyı bir daha gösterme')
    );
    const sonuc = await ui.pencere(
      icerik,
      [
        { yazi: 'Vazgeç', deger: false },
        { yazi: 'Anladım, başla', deger: true, tur: 'ana' },
      ],
      ctx
    );
    if (sonuc && kutu.checked) HO.depo.ayarla('epilepsiGizle', true);
    return !!sonuc;
  };

  // Göz molası: 20 dakikalık kullanımda bir, 20 saniye uzağa bakma (KURALLAR madde 3).
  let aktifSure = 0;
  let aktif = false;
  setInterval(() => {
    if (aktif && document.visibilityState === 'visible') aktifSure += 1000;
  }, 1000);
  ui.aktiflik = (v) => (aktif = v);
  ui.gozMolasiGerekirse = async function (ctx) {
    if (!HO.depo.ayarlar.gozMolasi || aktifSure < 20 * 60 * 1000) return;
    aktifSure = 0;
    const sayac = el('div', { class: 'mola-sayac', text: '20' });
    const icerik = el(
      'div',
      { class: 'mola' },
      el('h2', { text: 'Göz molası' }),
      el('p', { text: '20 dakikadır çalışıyorsunuz. 20 saniye boyunca en az 6 metre uzaktaki bir noktaya bakın.' }),
      sayac
    );
    let kalan = 20;
    const id = setInterval(() => {
      kalan--;
      sayac.textContent = String(Math.max(0, kalan));
      if (kalan <= 0) {
        clearInterval(id);
        sayac.textContent = 'Tamam';
      }
    }, 1000);
    await ui.pencere(icerik, [{ yazi: 'Devam et', deger: true, tur: 'ana' }], ctx);
    clearInterval(id);
  };

  // Metronom sesi (Web Audio). Telefonlarda ses yalnız bir dokunuşla açılabildiği için
  // sesAc() "Başla" tıklamasında çağrılır.
  let sesBaglami = null;
  ui.sesAc = function () {
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      if (!sesBaglami) sesBaglami = new AC();
      if (sesBaglami.state === 'suspended') sesBaglami.resume();
    } catch (e) {
      /* ses desteklenmiyor */
    }
  };
  ui.tik = function (vurgulu) {
    if (!sesBaglami) return;
    const c = sesBaglami;
    const o = c.createOscillator();
    const g = c.createGain();
    const t = c.currentTime;
    o.frequency.value = vurgulu ? 1500 : 1100;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.3, t + 0.003);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
    o.connect(g).connect(c.destination);
    o.start(t);
    o.stop(t + 0.06);
  };

  ui.geriSayim = async function (sahne, ctx, yazi) {
    const kutu = el('div', { class: 'geri-sayim' });
    sahne.replaceChildren(el('div', { class: 'ortala' }, yazi ? el('p', { class: 'soluk', text: yazi }) : null, kutu));
    for (const n of ['3', '2', '1']) {
      kutu.textContent = n;
      await ctx.wait(700);
    }
    sahne.replaceChildren();
  };

  // Metni kelime kelime <span> olarak yerleştirir. Paragraflar korunur.
  ui.metinYerlestir = function (kap, metin, sinif = '') {
    const kelimeler = [];
    const govde = el('div', { class: 'okuma-metni ' + sinif });
    if (metin.baslik) govde.append(el('h2', { class: 'metin-baslik', text: metin.baslik }));
    metin.paragraflar.forEach((p, pi) => {
      const pEl = el('p');
      u.words(p).forEach((w, i) => {
        if (i) pEl.append(' ');
        const s = el('span', { class: 'k', text: w });
        s.dataset.p = pi;
        pEl.append(s);
        kelimeler.push(s);
      });
      govde.append(pEl);
    });
    kap.append(govde);
    return { govde, kelimeler };
  };

  // Anlama soruları. Döndürür: {dogru, toplam, oran}
  ui.sorular = async function (sahne, sorular, ctx, baslik = 'Anlama soruları') {
    const form = el('form', { class: 'sorular' });
    const kayit = sorular.map((s, si) => {
      const sira = u.shuffle(s.secenekler.map((t, i) => ({ t, dogru: i === s.dogru })));
      const grup = el('fieldset', { class: 'soru' }, el('legend', { text: `${si + 1}. ${s.soru}` }));
      sira.forEach((sec, i) => {
        const id = `s${si}-${i}`;
        grup.append(
          el('label', { class: 'secenek', for: id }, el('input', { type: 'radio', name: 's' + si, id, value: i }), ' ', sec.t)
        );
      });
      form.append(grup);
      return { grup, sira };
    });
    const gonder = el('button', { class: 'dugme ana', type: 'submit', text: 'Cevapları gönder', disabled: true });
    form.append(el('div', { class: 'dugmeler' }, gonder));
    form.addEventListener('change', () => {
      gonder.disabled = kayit.some((_, si) => !form.querySelector(`input[name="s${si}"]:checked`));
    });
    sahne.replaceChildren(el('h2', { text: baslik }), el('p', { class: 'soluk', text: 'Metne geri dönmeden cevaplayın.' }), form);
    window.scrollTo(0, 0);
    await ctx.promise((res) =>
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        res();
      })
    );
    let dogru = 0;
    kayit.forEach(({ grup, sira }, si) => {
      const secili = form.querySelector(`input[name="s${si}"]:checked`);
      const i = Number(secili.value);
      if (sira[i].dogru) dogru++;
      grup.querySelectorAll('label').forEach((lab, li) => {
        if (sira[li].dogru) lab.classList.add('dogru');
        else if (li === i) lab.classList.add('yanlis');
      });
      grup.disabled = true;
    });
    gonder.remove();
    const devam = el('button', { class: 'dugme ana', type: 'button', text: 'Devam' });
    form.append(el('p', { class: 'ozet-satir', text: `${sorular.length} sorudan ${dogru} doğru.` }), el('div', { class: 'dugmeler' }, devam));
    devam.focus();
    await ctx.click(devam);
    return { dogru, toplam: sorular.length, oran: dogru / sorular.length };
  };

  // Seçenek formu. secenekler: [{ad, etiket, degerler:[[deger, yazi]], varsayilan}]
  function secenekFormu(ex, baslangic) {
    const deger = { ...baslangic };
    const kap = el('div', { class: 'secenekler' });
    (ex.secenekler || []).forEach((s) => {
      const vars = typeof s.varsayilan === 'function' ? s.varsayilan() : s.varsayilan;
      const degerler = typeof s.degerler === 'function' ? s.degerler() : s.degerler;
      if (deger[s.ad] === undefined || !degerler.some(([v]) => v === deger[s.ad])) deger[s.ad] = vars;
      const sec = el('select', { id: 'sec-' + s.ad });
      degerler.forEach(([v, yazi]) => {
        const o = el('option', { value: String(v), text: typeof yazi === 'function' ? yazi() : yazi });
        if (v === deger[s.ad]) o.selected = true;
        sec.append(o);
      });
      sec.addEventListener('change', () => {
        const bul = degerler.find(([v]) => String(v) === sec.value);
        deger[s.ad] = bul[0];
      });
      kap.append(el('label', { class: 'secenek-satir', for: 'sec-' + s.ad }, el('span', { text: s.etiket }), sec));
    });
    return { kap, deger };
  }

  // Bir egzersizi baştan sona çalıştırır: tanıtım, uyarı, egzersiz, sonuç.
  // Döndürür: {durum: 'bitti'|'atlandi'|'iptal', sonuc}
  // ---------- Ekran modu: normal | genis (pencereyi kaplar) | tam (tüm ekran) ----------
  // Egzersiz çalışırken uygulanır. Büyük modlarda kök yazı boyu (--olcek) ekrana göre büyür,
  // böylece rem ile ölçülen her şey (harfler, kutular, ızgaralar) birlikte büyür.
  const ekran = { aktif: false, tauriTam: false, bilgiKap: null, guncelle: null };
  const tamEkranAcikMi = () => !!(document.fullscreenElement || document.webkitFullscreenElement || ekran.tauriTam);
  const tauriPencere = () => {
    const t = window.__TAURI__;
    return t && t.window && t.window.getCurrentWindow ? t.window.getCurrentWindow() : null;
  };
  async function tamEkranAc() {
    const k = document.documentElement;
    const istek = k.requestFullscreen || k.webkitRequestFullscreen;
    if (istek && (document.fullscreenEnabled || document.webkitFullscreenEnabled)) {
      try {
        await istek.call(k);
        return true;
      } catch (e) {
        /* tarayıcı izin vermedi; aşağıdaki yolu dene */
      }
    }
    const w = tauriPencere();
    if (w) {
      try {
        await w.setFullscreen(true);
        ekran.tauriTam = true;
        return true;
      } catch (e) {
        /* masaüstü penceresi tam ekrana geçemedi */
      }
    }
    return false;
  }
  async function tamEkranKapat() {
    if (ekran.tauriTam) {
      ekran.tauriTam = false;
      const w = tauriPencere();
      if (w) await w.setFullscreen(false).catch(() => {});
    }
    if (document.fullscreenElement && document.exitFullscreen) await document.exitFullscreen().catch(() => {});
    else if (document.webkitFullscreenElement && document.webkitExitFullscreen) document.webkitExitFullscreen();
  }
  ui.ekranModu = () => HO.depo.ayarlar.ekranModu || 'normal';
  ui.olcek = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--olcek')) || 1;

  // Sınıfları, ölçeği ve sahne yüksekliğini o anki moda göre yeniden hesaplar.
  function ekranUygula() {
    const kok = document.documentElement;
    const b = document.body;
    const mod = ekran.aktif ? ui.ekranModu() : 'normal';
    const tam = mod === 'tam' && tamEkranAcikMi();
    const buyuk = mod === 'genis' || tam;
    b.classList.toggle('ekran-buyuk', buyuk);
    b.classList.toggle('ekran-tam', tam);
    if (!buyuk) {
      kok.style.removeProperty('--olcek');
      kok.style.removeProperty('--sahne-h');
    } else {
      // Normal görünüm yaklaşık 900×700 piksellik bir alana göre tasarlandı.
      const olcek = Math.max(1, Math.min((window.innerWidth - 48) / 900, window.innerHeight / 760, 2.4));
      kok.style.setProperty('--olcek', olcek.toFixed(3));
      const sahne = document.querySelector('.sahne');
      const ust = sahne ? sahne.getBoundingClientRect().top + window.scrollY : 0;
      kok.style.setProperty('--sahne-h', Math.max(320, window.innerHeight - ust - 12) + 'px');
    }
    if (ekran.guncelle) ekran.guncelle();
    // Tuval gibi boyutunu kendi ölçen egzersizler yeniden ölçsün.
    window.dispatchEvent(new Event('resize'));
  }
  let olcuyor = false;
  const yenidenOlc = () => {
    if (olcuyor) return;
    olcuyor = true;
    requestAnimationFrame(() => {
      olcuyor = false;
      ekranUygula();
    });
  };
  window.addEventListener('resize', (e) => {
    if (e.isTrusted && ekran.aktif) yenidenOlc();
  });
  const tamDegisti = () => {
    // Esc ile tam ekrandan çıkıldıysa bir önceki moda dön.
    if (!tamEkranAcikMi() && ui.ekranModu() === 'tam') HO.depo.ayarla('ekranModu', HO.depo.ayarlar.oncekiEkranModu || 'normal');
    yenidenOlc();
  };
  document.addEventListener('fullscreenchange', tamDegisti);
  document.addEventListener('webkitfullscreenchange', tamDegisti);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && ekran.tauriTam) tamEkranKapat().then(tamDegisti);
  });

  async function modSec(yeni) {
    const eski = ui.ekranModu();
    if (yeni === eski) yeni = eski === 'tam' ? HO.depo.ayarlar.oncekiEkranModu || 'normal' : 'normal';
    if (yeni === 'tam') {
      HO.depo.ayarla('oncekiEkranModu', eski === 'tam' ? 'normal' : eski);
      HO.depo.ayarla('ekranModu', 'tam');
      if (!(await tamEkranAc())) {
        HO.depo.ayarla('ekranModu', 'genis');
        if (ekran.bilgiKap) ekran.bilgiKap.textContent = 'Tam ekran açılamadı; geniş görünüm kullanılıyor.';
      }
    } else {
      HO.depo.ayarla('ekranModu', yeni);
      if (tamEkranAcikMi()) await tamEkranKapat();
    }
    ekranUygula();
  }

  const IKON_GENIS = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="6" width="19" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
  const IKON_TAM = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function ekranDugmeleri() {
    const genis = el('button', { class: 'dugme ikincil kucuk ekran-dugme ekran-genis-dugme', type: 'button' });
    const tam = el('button', { class: 'dugme ikincil kucuk ekran-dugme', type: 'button' });
    genis.innerHTML = IKON_GENIS + '<span>Geniş</span>';
    tam.innerHTML = IKON_TAM + '<span>Tam ekran</span>';
    genis.addEventListener('click', () => modSec('genis'));
    tam.addEventListener('click', () => modSec('tam'));
    const tamVar = !!(document.fullscreenEnabled || document.webkitFullscreenEnabled || tauriPencere());
    if (!tamVar) tam.hidden = true;
    ekran.guncelle = () => {
      const m = ui.ekranModu();
      const tamAcik = m === 'tam' && tamEkranAcikMi();
      genis.setAttribute('aria-pressed', String(m === 'genis'));
      tam.setAttribute('aria-pressed', String(tamAcik));
      genis.title = m === 'genis' ? 'Normal görünüme dön' : 'Egzersizi pencerenin tamamına yay';
      tam.title = tamAcik ? 'Tam ekrandan çık (Esc)' : 'Egzersizi tüm ekranda aç';
      tam.querySelector('span').textContent = tamAcik ? 'Tam ekrandan çık' : 'Tam ekran';
    };
    return [genis, tam];
  }
  // Egzersiz başlarken (Başla tıklaması sırasında çağrılır; tarayıcı tam ekranı yalnız tıklamayla açar).
  function ekranBasla() {
    if (ui.ekranModu() === 'tam' && !tamEkranAcikMi()) {
      tamEkranAc().then((ok) => {
        if (!ok) HO.depo.ayarla('ekranModu', 'genis');
        if (ekran.aktif) ekranUygula();
      });
    }
  }

  ui.egzersizCalistir = async function (kap, ex, ctx, o = {}) {
    const gunluk = !!o.gunluk;
    while (true) {
      // 1. Tanıtım
      const kayitli = { ...HO.depo.egzSecenek(ex.id), ...(o.secenek || {}) };
      const form = secenekFormu(ex, kayitli);
      const basla = el('button', { class: 'dugme ana buyuk', text: 'Başla' });
      const atla = gunluk ? el('button', { class: 'dugme ikincil', text: 'Bu adımı atla' }) : null;
      kap.replaceChildren(
        el(
          'section',
          { class: 'kart tanitim' + (HO.kategoriBul && HO.kategoriBul(ex.id) ? ' kat-' + HO.kategoriBul(ex.id).id : '') },
          HO.ikon ? HO.ikon(ex) : null,
          o.adimYazi ? el('div', { class: 'adim-yazi', text: o.adimYazi }) : null,
          el('h1', { text: ex.ad }),
          el('ol', { class: 'nasil' }, ex.nasil.map((n) => el('li', { text: n }))),
          form.kap,
          el('div', { class: 'dugmeler' }, atla, basla)
        )
      );
      window.scrollTo(0, 0);
      basla.focus();
      const secim = await ctx.promise((res) => {
        basla.addEventListener('click', () => {
          ui.sesAc();
          ekranBasla();
          res('basla');
        });
        if (atla) atla.addEventListener('click', () => res('atla'));
      });
      if (secim === 'atla') return { durum: 'atlandi' };
      const s = form.deger;
      if (!gunluk) HO.depo.egzSecenekKaydet(ex.id, s);

      // 2. Sağlık uyarısı
      if (ex.flas && !(await ui.epilepsiUyarisi(ctx))) continue;

      // 3. Egzersiz
      const exCtx = ctx.child();
      const bitir = el('button', { class: 'dugme ikincil kucuk', text: 'Bitir' });
      const bilgi = el('div', { class: 'ust-bilgi' });
      const sahne = el('div', { class: 'sahne sahne-' + ex.id });
      const ekranBilgi = el('div', { class: 'ekran-bilgi', role: 'status' });
      kap.replaceChildren(
        el('div', { class: 'egz-ekran' }, el('div', { class: 'egz-ust' }, el('strong', { text: ex.ad }), bilgi, ...ekranDugmeleri(), bitir), ekranBilgi, sahne)
      );
      bitir.addEventListener('click', () => exCtx.abort());
      ekran.aktif = true;
      ekran.bilgiKap = ekranBilgi;
      ekranUygula();
      ui.aktiflik(true);
      let sonuc = null;
      try {
        sonuc = await ex.calistir(sahne, s, exCtx, { bilgi });
      } catch (e) {
        if (!HO.iptalMi(e)) throw e;
      } finally {
        ui.aktiflik(false);
        ekran.aktif = false;
        ekran.guncelle = null;
        ekran.bilgiKap = null;
        ekranUygula();
        // Egzersiz bitti ya da durdu: alan artık tıklanamaz (yarım kalan egzersiz çalışıyor gibi görünmesin).
        sahne.inert = true;
        sahne.classList.add('durdu');
      }
      ctx.check();
      if (!sonuc) {
        if (gunluk) {
          const ne = await ui.pencere(el('p', { text: 'Egzersiz yarıda bırakıldı.' }), [
            { yazi: 'Tekrar dene', deger: 'tekrar' },
            { yazi: 'Sonraki adıma geç', deger: 'atla', tur: 'ana' },
          ], ctx);
          if (ne === 'tekrar') continue;
          return { durum: 'atlandi' };
        }
        // Tek başına açılan egzersiz yarıda bitirildi: kategorisine dön.
        const k = HO.kategoriBul && HO.kategoriBul(ex.id);
        location.hash = k ? '#/kategori/' + k.id : '#/egzersizler';
        return { durum: 'iptal' };
      }

      // 4. Kayıt ve sonuç
      const kayit = HO.depo.sonucEkle(ex.kayitId || ex.id, sonuc);
      const satirlar = ex.ozet(kayit);
      const notlar = ex.notlar ? ex.notlar(kayit) : [];
      const devam = el('button', { class: 'dugme ana buyuk', text: gunluk ? 'Sonraki adım' : 'Egzersizlere dön' });
      const tekrar = el('button', { class: 'dugme ikincil', text: 'Tekrar' });
      kap.replaceChildren(
        el(
          'section',
          { class: 'kart sonuc' },
          el('div', { class: 'sonuc-isaret', 'aria-hidden': 'true', text: '✓' }),
          el('h1', { text: ex.ad + ': sonuç' }),
          el(
            'dl',
            { class: 'olcumler' },
            satirlar.map(([k, v], i) => {
              const dd = el('dd');
              ui.sayarakGoster(dd, v);
              return el('div', { class: 'olcum', style: { '--sira': i } }, el('dt', { text: k }), dd);
            })
          ),
          notlar.map((n) => el('p', { class: 'not', text: n })),
          el('div', { class: 'dugmeler' }, tekrar, devam)
        )
      );
      window.scrollTo(0, 0);
      devam.focus();
      const ne = await ctx.promise((res) => {
        devam.addEventListener('click', () => res('devam'));
        tekrar.addEventListener('click', () => res('tekrar'));
      });
      await ui.gozMolasiGerekirse(ctx);
      if (ne === 'tekrar') continue;
      if (!gunluk) {
        const k = HO.kategoriBul && HO.kategoriBul(ex.id);
        location.hash = k ? '#/kategori/' + k.id : '#/egzersizler';
      }
      return { durum: 'bitti', sonuc: kayit };
    }
  };

  // Okuma testi akışı (seviye testi ve okuma egzersizi ortak).
  // soruSor false ise yalnız hız ölçülür; metnin soruları hafta sonundaki anlama testine kalır.
  ui.okumaTesti = async function (sahne, metin, ctx, soruSor = true) {
    const basla = el('button', { class: 'dugme ana buyuk', text: 'Başla' });
    sahne.replaceChildren(
      el(
        'div',
        { class: 'kart' },
        el('h2', { text: 'Hazır olduğunuzda başlayın' }),
        el('p', { text: 'Başla düğmesine basınca metin görünür ve süre başlar. Metni her zamanki gibi, anlayarak okuyun.' }),
        el('p', { text: soruSor ? 'Bitirince alttaki "Bitirdim" düğmesine basın. Ardından metinle ilgili sorular gelecek.' : 'Bitirince alttaki "Bitirdim" düğmesine basın. Bu metnin soruları hafta sonundaki anlama testinde sorulacak.' }),
        el('div', { class: 'dugmeler' }, basla)
      )
    );
    basla.focus();
    await ctx.click(basla);
    sahne.replaceChildren();
    ui.metinYerlestir(sahne, metin);
    const bitti = el('button', { class: 'dugme ana buyuk', text: 'Bitirdim' });
    sahne.append(el('div', { class: 'alt-sabit' }, bitti));
    window.scrollTo(0, 0);
    const yazi = u.metinYazi(metin);
    const kelime = u.words(yazi).length;
    const t0 = performance.now();
    let sure;
    while (true) {
      await ctx.click(bitti);
      sure = performance.now() - t0;
      // Yanlışlıkla basılmasın: 1500 kelime/dk'dan hızlıysa sor.
      if (kelime / (sure / 60000) <= 1500) break;
      const evet = await ui.pencere(el('p', { text: 'Metni çok kısa sürede geçtiniz. Okumayı bitirdiniz mi?' }), [
        { yazi: 'Okumaya devam et', deger: false },
        { yazi: 'Evet, bitirdim', deger: true, tur: 'ana' },
      ], ctx);
      if (evet) break;
    }
    const karakter = u.charCount(yazi);
    const kdk = kelime / (sure / 60000);
    const soruVar = soruSor && ui.soruluMu(metin);
    const cevap = soruVar ? await ui.sorular(sahne, metin.sorular, ctx) : { dogru: null, toplam: 0, oran: null };
    return {
      metin: metin.id,
      sure: Math.round(sure),
      kelime,
      kdk: Math.round(kdk),
      kardk: Math.round(karakter / (sure / 60000)),
      dogru: cevap.dogru,
      toplam: cevap.toplam,
      oran: cevap.oran,
      etkili: soruVar ? Math.round(kdk * cevap.oran) : null,
      kendi: metin.kendi || undefined,
      soruBekliyor: !soruSor && ui.soruluMu(metin) ? true : undefined,
    };
  };

  // Kullanıcının kendi metinlerini de içeren "Metin" seçeneği (Metinlerim sayfası).
  ui.metinSecenegi = () => ({
    ad: 'kaynak',
    etiket: 'Metin',
    degerler: () => [['program', 'Program metinleri (sırayla)'], ...HO.depo.kendiMetinler().map((m) => [m.id, 'Metinlerim: ' + m.baslik])],
    varsayilan: 'program',
  });
  ui.anlamaYazi = (r) => (typeof r.oran === 'number' ? `${u.pct(r.oran)} (${r.dogru}/${r.toplam})` : 'Sorusuz metin');

  ui.okumaOzet = (r) => [
    ['Süre', u.fmtClock(r.sure)],
    ['Okuma hızı', u.num(r.kdk) + ' kelime/dk'],
    ['Karakter hızı', u.num(r.kardk) + ' karakter/dk'],
    ...(r.soruBekliyor
      ? []
      : [
          ['Anlama', ui.anlamaYazi(r)],
          ['Etkili hız', typeof r.etkili === 'number' ? u.num(r.etkili) + ' kelime/dk' : '-'],
        ]),
  ];
  ui.okumaNotlar = (r) => {
    if (r.soruBekliyor) return ['Bu okumada yalnız hız ölçüldü. Metnin anlama soruları hafta sonundaki anlama testinde sorulacak.'];
    if (typeof r.oran !== 'number') return ['Bu metnin anlama sorusu olmadığı için yalnız hız ölçüldü. Metinlerim sayfasından metne soru ekleyebilirsiniz.'];
    const n = ['Etkili hız = okuma hızı × anlama oranı.'];
    if (r.oran < 0.7) n.push('Anlama %70’in altında. Rehberle okumanın hedef hızı bu sonuçla artırılmayacak.');
    return n;
  };

  ui.soruluMu = (metin) => !!(metin && metin.sorular && metin.sorular.length);

  // Okuma egzersizlerinin hız seçeneği: Otomatik ya da 1x–10x.
  ui.hizSecenegi = () => ({
    ad: 'hiz',
    etiket: 'Hız',
    degerler: () => [['oto', `Otomatik (${u.hizAdi(u.kdkHiz(HO.depo.rehberHedef()))})`], ...u.HIZLAR],
    varsayilan: 'oto',
  });
  ui.okumaHizi = (secim) => (secim === 'oto' ? u.kdkHiz(HO.depo.rehberHedef()) : secim);
  ui.hizYazi = (r) => (r.hiz ? `${u.hizAdi(r.hiz)} (${r.kdk} kelime/dk)` : r.kdk + ' kelime/dk');
  ui.okumaEgzNotlar = (r) => [
    r.soruBekliyor ? 'Bu metnin anlama soruları hafta sonundaki anlama testinde sorulacak.' : null,
    `Otomatik hız şu an: ${u.hizAdi(u.kdkHiz(HO.depo.rehberHedef()))}.`,
  ].filter(Boolean);

  // Haftalık anlama testi: hafta boyunca okunan metinlerin soruları (metin başına en çok 2, toplam en çok 20).
  ui.haftalikTest = async function (kap, ctx) {
    const bekleyen = HO.depo.bekleyenMetinler();
    const metinBul = (id) => HO.icerik.alistirma.find((m) => m.id === id) || HO.depo.kendiMetin(id);
    const metinler = bekleyen.map(metinBul).filter(ui.soruluMu).slice(0, 10);
    if (!metinler.length) {
      HO.depo.sonucEkle('haftalik', { metinler: [], dogru: 0, toplam: 0, oran: null, bos: true });
      return null;
    }
    const sorular = metinler.flatMap((m) => u.shuffle(m.sorular).slice(0, 2).map((s) => ({ ...s, soru: `“${m.baslik}”: ${s.soru}` })));
    const basla = el('button', { class: 'dugme ana buyuk', text: 'Teste başla' });
    kap.replaceChildren(
      el(
        'section',
        { class: 'kart tanitim kat-anlama' },
        el('div', { class: 'adim-yazi', text: 'Haftanın sonu' }),
        el('h1', { text: 'Haftalık anlama testi' }),
        el('p', { text: `Bu hafta okuduğunuz ${metinler.length} metinden ${sorular.length} soru gelecek. Metinlere geri dönülemez; hatırladığınız kadarıyla cevaplayın.` }),
        el('div', { class: 'dugmeler' }, basla)
      )
    );
    window.scrollTo(0, 0);
    basla.focus();
    await ctx.click(basla);
    const sahne = el('div', { class: 'sahne' });
    kap.replaceChildren(sahne);
    const cevap = await ui.sorular(sahne, sorular, ctx, 'Haftalık anlama testi');
    const kayit = HO.depo.sonucEkle('haftalik', { metinler: metinler.map((m) => m.id), dogru: cevap.dogru, toplam: cevap.toplam, oran: cevap.oran });
    const devam = el('button', { class: 'dugme ana buyuk', text: 'Devam' });
    kap.replaceChildren(
      el(
        'section',
        { class: 'kart sonuc' },
        el('div', { class: 'sonuc-isaret', 'aria-hidden': 'true', text: '✓' }),
        el('h1', { text: 'Haftalık anlama testi: sonuç' }),
        el('dl', { class: 'olcumler' }, el('div', { class: 'olcum' }, el('dt', { text: 'Anlama' }), el('dd', { text: ui.anlamaYazi(kayit) })), el('div', { class: 'olcum' }, el('dt', { text: 'Metin' }), el('dd', { text: String(metinler.length) }))),
        el('p', { class: 'not', text: cevap.oran < 0.7 ? 'Anlama %70’in altında. Rehberli okumaların otomatik hızı bir basamak düşürüldü.' : `Rehberli okumaların otomatik hızı: ${u.hizAdi(u.kdkHiz(HO.depo.rehberHedef()))}.` }),
        el('div', { class: 'dugmeler' }, devam)
      )
    );
    window.scrollTo(0, 0);
    devam.focus();
    await ctx.click(devam);
    return kayit;
  };

  HO.ui = ui;
})();
