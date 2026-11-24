'use strict';
// Egzersiz kartlarındaki küçük hareketli simgeler (SVG). Kart üzerine gelince ya da odaklanınca
// canlanırlar (CSS: .egz-kart:hover .ik-*). Renkler CSS değişkenlerinden gelir.
(function () {
  const yol = {
    yataySonsuzluk: 'M24 24 C 30 14, 42 14, 42 24 C 42 34, 30 34, 24 24 C 18 14, 6 14, 6 24 C 6 34, 18 34, 24 24 Z',
    dikeySonsuzluk: 'M24 24 C 14 18, 14 6, 24 6 C 34 6, 34 18, 24 24 C 14 30, 14 42, 24 42 C 34 42, 34 30, 24 24 Z',
    yatayZigzag: 'M6 14 L 14 34 L 22 14 L 30 34 L 38 14 L 42 26 L 38 14 L 30 34 L 22 14 L 14 34 Z',
    dikeyZigzag: 'M14 6 L 34 14 L 14 22 L 34 30 L 14 38 L 26 42 L 14 38 L 34 30 L 14 22 L 34 14 Z',
    kumSaati: 'M10 8 L 38 8 L 10 40 L 38 40 Z',
  };
  const izliNokta = (d) => `<path d="${d}" class="ik-iz"/><circle r="3.6" class="ik-nokta ik-yol" style="offset-path:path('${d}')"/>`;
  const satirlar = (n, x = 8, w = 32, y0 = 12, ara = 7, sinif = 'ik-satir') =>
    Array.from({ length: n }, (_, i) => `<rect x="${x}" y="${y0 + i * ara}" width="${w - (i % 2) * 6}" height="3" rx="1.5" class="${sinif}" style="--i:${i}"/>`).join('');

  const IKON = {
    test: `<path d="M8 32 A16 16 0 0 1 40 32" class="ik-iz"/><path d="M12 32 A12 12 0 0 1 22 20.4" class="ik-vurgu-cizgi"/><line x1="24" y1="32" x2="24" y2="16" class="ik-ibre"/><circle cx="24" cy="32" r="3" class="ik-nokta"/>`,
    okuma: `<path d="M24 12 C 18 8, 10 8, 6 10 V 38 C 10 36, 18 36, 24 40 C 30 36, 38 36, 42 38 V 10 C 38 8, 30 8, 24 12 Z" class="ik-iz"/><line x1="24" y1="12" x2="24" y2="40" class="ik-iz"/>${satirlar(3, 10, 10, 16, 6)}`,
    schulte: Array.from({ length: 9 }, (_, i) => `<rect x="${8 + (i % 3) * 11}" y="${8 + Math.floor(i / 3) * 11}" width="9" height="9" rx="2" class="${i === 4 ? 'ik-hucre ik-hedef' : 'ik-hucre'}" style="--i:${(i * 5) % 9}"/>`).join(''),
    burdon: Array.from({ length: 12 }, (_, i) => `<circle cx="${10 + (i % 4) * 9.5}" cy="${13 + Math.floor(i / 4) * 11}" r="${i === 6 || i === 1 ? 3.5 : 2.2}" class="${i === 6 || i === 1 ? 'ik-nokta ik-sec' : 'ik-sonuk'}" style="--i:${i}"/>`).join('') + `<circle cx="29" cy="24" r="6.5" class="ik-halka"/>`,
    renk: `<circle cx="18" cy="20" r="9" class="ik-renk r1"/><circle cx="30" cy="20" r="9" class="ik-renk r2"/><circle cx="24" cy="30" r="9" class="ik-renk r3"/>`,
    kelimeavi: `${satirlar(4, 6, 36, 10, 8, 'ik-sonuk-satir')}<g class="ik-buyutec"><circle cx="20" cy="22" r="7" class="ik-iz"/><line x1="25" y1="27" x2="31" y2="33" class="ik-iz kalin"/></g>`,
    'takip-yatay-sonsuzluk': izliNokta(yol.yataySonsuzluk),
    'takip-dikey-sonsuzluk': izliNokta(yol.dikeySonsuzluk),
    'takip-yatay-zigzag': izliNokta(yol.yatayZigzag),
    'takip-dikey-zigzag': izliNokta(yol.dikeyZigzag),
    'takip-kum-saati': izliNokta(yol.kumSaati),
    'takip-sicrama': `<line x1="8" y1="10" x2="8" y2="38" class="ik-iz ince"/><line x1="40" y1="10" x2="40" y2="38" class="ik-iz ince"/><circle cx="8" cy="18" r="3.6" class="ik-nokta ik-sic sol"/><circle cx="40" cy="30" r="3.6" class="ik-nokta ik-sic sag"/>`,
    cevresel: `<circle cx="24" cy="24" r="6" class="ik-iz ince"/><circle cx="24" cy="24" r="12" class="ik-iz ince"/><circle cx="24" cy="24" r="18" class="ik-iz ince"/><circle cx="24" cy="24" r="2.5" class="ik-nokta"/><rect x="21" y="21" width="6" height="6" rx="1" class="ik-harf sol"/><rect x="21" y="21" width="6" height="6" rx="1" class="ik-harf sag"/>`,
    beliren: [
      [8, 10],
      [28, 14],
      [14, 26],
      [30, 32],
      [10, 38],
    ]
      .map(([x, y], i) => `<rect x="${x}" y="${y}" width="12" height="4" rx="2" class="ik-belir" style="--i:${i}"/>`)
      .join(''),
    flas: `<path d="M10 14 V 10 H 14 M34 10 H 38 V 14 M38 34 V 38 H 34 M14 38 H 10 V 34" class="ik-iz"/><text x="24" y="28" class="ik-flas-yazi">83</text><rect x="13" y="19" width="22" height="11" rx="2" class="ik-maske"/>`,
    'piramit-yukaridan': [0, 1, 2, 3].map((i) => `<rect x="${24 - (4 + i * 5)}" y="${10 + i * 8}" width="${8 + i * 10}" height="4" rx="2" class="ik-satir ik-sirali" style="--i:${i}"/>`).join(''),
    'piramit-asagidan': [0, 1, 2, 3].map((i) => `<rect x="${24 - (4 + i * 5)}" y="${34 - i * 8}" width="${8 + i * 10}" height="4" rx="2" class="ik-satir ik-sirali" style="--i:${i}"/>`).join(''),
    'rehber-soluk': `${satirlar(4, 8, 32, 12, 7, 'ik-sonuk-satir')}<rect x="8" y="12" width="10" height="3" rx="1.5" class="ik-isik yatay"/>`,
    'rehber-gizli': `${satirlar(4, 8, 32, 12, 7, 'ik-gizli-satir')}<rect x="8" y="12" width="10" height="3" rx="1.5" class="ik-isik yatay"/>`,
    'rehber-satir': `${satirlar(4, 8, 32, 12, 7, 'ik-sonuk-satir')}<rect x="6" y="10.5" width="36" height="6" rx="3" class="ik-isik dikey"/>`,
    'rehber-silinen': satirlar(4, 8, 32, 12, 7, 'ik-satir ik-sil'),
    'rehber-dar': `${satirlar(5, 17, 14, 9, 6.5, 'ik-sonuk-satir')}<rect x="15" y="7.5" width="18" height="6" rx="3" class="ik-isik dikey dar"/>`,
    rsvp: `<line x1="6" y1="18" x2="42" y2="18" class="ik-iz ince"/><line x1="6" y1="32" x2="42" y2="32" class="ik-iz ince"/><line x1="22" y1="12" x2="22" y2="18" class="ik-iz"/><line x1="22" y1="32" x2="22" y2="38" class="ik-iz"/><rect x="12" y="22" width="24" height="6" rx="3" class="ik-satir ik-kelime"/>`,
    tarama: `${satirlar(5, 8, 32, 9, 7, 'ik-sonuk-satir')}<rect x="6" y="6" width="36" height="2.5" rx="1.2" class="ik-tara"/>`,
    'anlama-anahtar': `<circle cx="16" cy="24" r="7" class="ik-iz"/><path d="M23 24 H 40 M34 24 V 30 M39 24 V 29" class="ik-iz"/><circle cx="16" cy="24" r="2.5" class="ik-nokta"/>`,
    'anlama-bes': [
      [24, 8],
      [38, 17],
      [34, 36],
      [14, 36],
      [10, 17],
      [24, 24],
    ]
      .map(([x, y], i, a) => (i < 5 ? `<line x1="24" y1="24" x2="${x}" y2="${y}" class="ik-iz ince"/>` : '') + `<circle cx="${x}" cy="${y}" r="${i === 5 ? 4 : 3}" class="ik-dugum" style="--i:${i}"/>`)
      .join(''),
  };

  HO.ikon = function (ex) {
    const anahtar = IKON[ex.id] ? ex.id : IKON[ex.ikon] ? ex.ikon : ex.taban && IKON[ex.taban] ? ex.taban : 'okuma';
    const kap = document.createElement('span');
    kap.className = 'egz-ikon';
    kap.setAttribute('aria-hidden', 'true');
    kap.innerHTML = `<svg viewBox="0 0 48 48" class="ik ik-${anahtar}">${IKON[anahtar]}</svg>`;
    return kap;
  };
})();
