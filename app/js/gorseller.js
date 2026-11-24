'use strict';
// Kategori görselleri (SVG). Renkler kategoriye göre CSS değişkenlerinden (--kat, --kat-acik) gelir.
// Hareketler yavaş ve sürekli; hiçbir öğe yanıp sönmez. "Hareketi azalt" açıkken CSS durdurur.
(function () {
  const G = {
    olcum: `
      <g class="g-yumusak">
        <path d="M70 150 A90 90 0 0 1 250 150" class="g-cizgi g-ince"/>
        <path d="M90 150 A70 70 0 0 1 230 150" class="g-cizgi g-soluk"/>
        ${Array.from({ length: 11 }, (_, i) => {
          const a = Math.PI + (i * Math.PI) / 10;
          const x1 = 160 + Math.cos(a) * 100, y1 = 150 + Math.sin(a) * 100, x2 = 160 + Math.cos(a) * (i % 5 ? 92 : 86), y2 = 150 + Math.sin(a) * (i % 5 ? 92 : 86);
          return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" class="g-cizgi g-ince"/>`;
        }).join('')}
        <path d="M70 150 A90 90 0 0 1 199 69" class="g-vurgu-yay"/>
      </g>
      <g class="g-ibre"><line x1="160" y1="150" x2="160" y2="72" class="g-vurgu-cizgi"/></g>
      <circle cx="160" cy="150" r="9" class="g-dolgu"/>
      <rect x="120" y="166" width="80" height="10" rx="5" class="g-soluk-dolgu"/>`,
    dikkat: `
      ${Array.from({ length: 24 }, (_, i) => {
        const x = 64 + (i % 6) * 34, y = 30 + Math.floor(i / 6) * 36;
        const h = i === 15;
        return `<rect x="${x}" y="${y}" width="26" height="26" rx="7" class="${h ? 'g-dolgu' : 'g-soluk-dolgu g-tara'}" style="--i:${i}"/>`;
      }).join('')}
      <circle cx="${64 + 3 * 34 + 13}" cy="${30 + 2 * 36 + 13}" r="24" class="g-halka"/>`,
    goz: `
      <path d="M40 150 L80 60 L120 150 L160 60 L200 150 L240 60 L280 150" class="g-cizgi g-soluk"/>
      <path id="g-sonsuz" d="M160 100 C 190 55, 250 55, 250 100 C 250 145, 190 145, 160 100 C 130 55, 70 55, 70 100 C 70 145, 130 145, 160 100 Z" class="g-cizgi g-kesik"/>
      <circle r="11" class="g-dolgu g-yolda" style="offset-path:path('M160 100 C 190 55, 250 55, 250 100 C 250 145, 190 145, 160 100 C 130 55, 70 55, 70 100 C 70 145, 130 145, 160 100 Z')"/>
      <circle r="18" class="g-halka-ince g-yolda" style="offset-path:path('M160 100 C 190 55, 250 55, 250 100 C 250 145, 190 145, 160 100 C 130 55, 70 55, 70 100 C 70 145, 130 145, 160 100 Z')"/>`,
    gorus: `
      <circle cx="160" cy="100" r="30" class="g-dalga" style="--i:0"/>
      <circle cx="160" cy="100" r="30" class="g-dalga" style="--i:1"/>
      <circle cx="160" cy="100" r="30" class="g-dalga" style="--i:2"/>
      <circle cx="160" cy="100" r="62" class="g-cizgi g-soluk"/>
      <circle cx="160" cy="100" r="94" class="g-cizgi g-soluk"/>
      <line x1="160" y1="20" x2="160" y2="180" class="g-cizgi g-ince"/>
      <line x1="40" y1="100" x2="280" y2="100" class="g-cizgi g-ince"/>
      <circle cx="160" cy="100" r="7" class="g-dolgu"/>
      <rect x="74" y="88" width="24" height="24" rx="6" class="g-dolgu g-yana sol"/>
      <rect x="222" y="88" width="24" height="24" rx="6" class="g-dolgu g-yana sag"/>`,
    okuma: `
      ${Array.from({ length: 6 }, (_, i) => `<rect x="50" y="${30 + i * 24}" width="${220 - (i % 3) * 30}" height="9" rx="4.5" class="g-soluk-dolgu"/>`).join('')}
      <rect x="44" y="24" width="96" height="21" rx="10.5" class="g-isik"/>
      <line x1="36" y1="20" x2="36" y2="176" class="g-cizgi g-vurgu-ince"/>`,
    anlama: (() => {
      const n = [
        [80, 60],
        [160, 40],
        [240, 70],
        [110, 140],
        [210, 150],
        [160, 100],
      ];
      const k = [
        [0, 5],
        [1, 5],
        [2, 5],
        [3, 5],
        [4, 5],
        [0, 1],
        [1, 2],
        [3, 4],
      ];
      return (
        k.map(([a, b], i) => `<line x1="${n[a][0]}" y1="${n[a][1]}" x2="${n[b][0]}" y2="${n[b][1]}" class="g-bag" style="--i:${i}"/>`).join('') +
        n.map(([x, y], i) => `<g class="g-dugum" style="--i:${i}"><rect x="${x - (i === 5 ? 30 : 22)}" y="${y - 10}" width="${i === 5 ? 60 : 44}" height="20" rx="10" class="${i === 5 ? 'g-dolgu' : 'g-yuzey'}"/></g>`).join('')
      );
    })(),
  };

  HO.katGorsel = function (id, sinif = '') {
    const s = document.createElement('span');
    s.className = 'kat-svg ' + sinif;
    s.setAttribute('aria-hidden', 'true');
    s.innerHTML = `<svg viewBox="0 0 320 200" class="g g-${id}">${G[id] || ''}</svg>`;
    return s;
  };
})();
