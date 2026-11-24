'use strict';
// Tek serili çizgi grafiği (SVG). Fareyle üzerine gelince değer gösterir, altında tablo görünümü vardır.
(function () {
  const u = HO.u;
  const el = u.el;
  const NS = 'http://www.w3.org/2000/svg';
  const s = (tag, attrs) => {
    const e = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs || {})) e.setAttribute(k, v);
    return e;
  };

  // Eksen üst sınırı: 4 aralığa bölündüğünde yuvarlak sayılar verecek biçimde.
  function guzelUst(x) {
    const adim = x / 4;
    if (adim <= 0) return 4;
    const us = Math.pow(10, Math.floor(Math.log10(adim)));
    for (const m of [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]) if (m * us >= adim) return m * us * 4;
    return 40 * us;
  }

  // noktalar: [{gun, deger, etiket?}]  bicim: değer -> yazı
  HO.grafik = function (baslik, noktalar, bicim, o = {}) {
    const kap = el('figure', { class: 'grafik' }, el('figcaption', { text: baslik }));
    if (!noktalar.length) {
      kap.append(el('p', { class: 'soluk bos', text: o.bos || 'Henüz veri yok.' }));
      return kap;
    }
    const W = 560;
    const H = 220;
    const P = { sol: 48, sag: 16, ust: 14, alt: 28 };
    const iw = W - P.sol - P.sag;
    const ih = H - P.ust - P.alt;
    const enBuyuk = Math.max(...noktalar.map((n) => n.deger));
    const ust = o.ust || guzelUst(enBuyuk * 1.1);
    const xi = (i) => P.sol + (noktalar.length === 1 ? iw / 2 : (i / (noktalar.length - 1)) * iw);
    const yv = (v) => P.ust + ih - (v / ust) * ih;

    const svg = s('svg', { viewBox: `0 0 ${W} ${H}`, class: 'grafik-svg', role: 'img', 'aria-label': baslik });
    // Izgara ve eksen yazıları
    for (let k = 0; k <= 4; k++) {
      const v = (ust / 4) * k;
      const y = yv(v);
      svg.append(s('line', { x1: P.sol, x2: W - P.sag, y1: y, y2: y, class: k ? 'izgara' : 'taban' }));
      const t = s('text', { x: P.sol - 8, y: y + 4, 'text-anchor': 'end', class: 'eksen' });
      t.textContent = bicim(v, true);
      svg.append(t);
    }
    const tarihYaz = (i, anchor) => {
      const t = s('text', { x: xi(i), y: H - 8, 'text-anchor': anchor, class: 'eksen' });
      t.textContent = u.fmtDate(noktalar[i].gun);
      svg.append(t);
    };
    tarihYaz(0, noktalar.length === 1 ? 'middle' : 'start');
    if (noktalar.length > 1) tarihYaz(noktalar.length - 1, 'end');

    if (noktalar.length > 1) {
      const d = noktalar.map((n, i) => `${i ? 'L' : 'M'}${xi(i).toFixed(1)},${yv(n.deger).toFixed(1)}`).join(' ');
      svg.append(s('path', { d, class: 'seri-cizgi' }));
    }
    noktalar.forEach((n, i) => svg.append(s('circle', { cx: xi(i), cy: yv(n.deger), r: 4, class: 'seri-nokta' })));

    // Son değeri doğrudan etiketle.
    const sonI = noktalar.length - 1;
    const sonEt = s('text', { x: Math.min(xi(sonI), W - P.sag), y: Math.max(11, yv(noktalar[sonI].deger) - 10), 'text-anchor': noktalar.length === 1 ? 'middle' : 'end', class: 'deger-et' });
    sonEt.textContent = bicim(noktalar[sonI].deger);
    svg.append(sonEt);

    // Üzerine gelme katmanı: dikey çizgi + ipucu.
    const capraz = s('line', { y1: P.ust, y2: P.ust + ih, class: 'capraz', visibility: 'hidden' });
    const vurgu = s('circle', { r: 6, class: 'seri-vurgu', visibility: 'hidden' });
    svg.append(capraz, vurgu);
    const ipucu = el('div', { class: 'ipucu', hidden: true });
    const alan = s('rect', { x: P.sol - 10, y: 0, width: iw + 20, height: H, fill: 'transparent' });
    svg.append(alan);
    const goster = (e) => {
      const r = svg.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * W;
      let en = 0;
      noktalar.forEach((_, i) => {
        if (Math.abs(xi(i) - x) < Math.abs(xi(en) - x)) en = i;
      });
      const n = noktalar[en];
      capraz.setAttribute('x1', xi(en));
      capraz.setAttribute('x2', xi(en));
      vurgu.setAttribute('cx', xi(en));
      vurgu.setAttribute('cy', yv(n.deger));
      capraz.setAttribute('visibility', 'visible');
      vurgu.setAttribute('visibility', 'visible');
      ipucu.hidden = false;
      ipucu.replaceChildren(el('strong', { text: bicim(n.deger) }), el('span', { text: u.fmtDate(n.gun) + (n.etiket ? ' · ' + n.etiket : '') }));
      const px = (xi(en) / W) * r.width;
      const py = (yv(n.deger) / H) * r.height;
      ipucu.style.left = px + 'px';
      ipucu.style.top = py + 'px';
      ipucu.classList.toggle('sola', px > r.width * 0.6);
    };
    const gizle = () => {
      capraz.setAttribute('visibility', 'hidden');
      vurgu.setAttribute('visibility', 'hidden');
      ipucu.hidden = true;
    };
    svg.addEventListener('pointermove', goster);
    svg.addEventListener('pointerleave', gizle);

    const tablo = el(
      'table',
      { class: 'veri-tablo' },
      el('thead', null, el('tr', null, el('th', { text: 'Tarih' }), el('th', { text: baslik }))),
      el('tbody', null, noktalar.slice().reverse().map((n) => el('tr', null, el('td', { text: u.fmtDate(n.gun) + (n.etiket ? ' · ' + n.etiket : '') }), el('td', { text: bicim(n.deger) }))))
    );
    kap.append(el('div', { class: 'grafik-kap' }, svg, ipucu), el('details', { class: 'tablo-ac' }, el('summary', { text: 'Tablo olarak göster' }), tablo));
    return kap;
  };
})();
