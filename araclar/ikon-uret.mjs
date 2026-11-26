// Uygulama ikonlarını varliklar/ikon.png'den üretir (bağımlılık yok).
// Kaynak: ChatGPT (Codex görsel aracı) ile üretilmiş, kenardan kenara mavi zeminli kare görsel.
// Çıktılar:
//   app/ikonlar/ikon-{192,512,1024}.png  köşeleri yuvarlatılmış, kenarda %4 şeffaf boşluk (Mac, tarayıcı sekmesi)
//   app/ikonlar/ikon-maskeli-512.png      kenardan kenara (Android "maskable")
//   app/ikonlar/ikon-apple-180.png        kenardan kenara (iPhone ana ekran; köşeyi iOS yuvarlatır)
// Kullanım: node araclar/ikon-uret.mjs  (masaüstü ikonları için: npm run ikon)
import { writeFileSync, mkdirSync } from 'node:fs';
import { pngOku, pngYaz } from './png.mjs';

// Kaynağı n×n'ye alan ortalamasıyla küçültür. bosluk: her kenarda bırakılan pay (0..1),
// yaricap: köşe yarıçapı (0..1, ikon genişliğine göre). Yuvarlak köşe kenarları kenar yumuşatmalı.
function uret(kaynak, n, bosluk = 0, yaricap = 0) {
  const { w, h, rgba } = kaynak;
  const out = Buffer.alloc(n * n * 4);
  const ic = n * (1 - 2 * bosluk), ofs = n * bosluk, r = yaricap * ic, S = 4;
  const icerde = (x, y) => {
    if (x < ofs || y < ofs || x > ofs + ic || y > ofs + ic) return false;
    if (!r) return true;
    const cx = Math.min(Math.max(x, ofs + r), ofs + ic - r), cy = Math.min(Math.max(y, ofs + r), ofs + ic - r);
    return (x - cx) ** 2 + (y - cy) ** 2 <= r * r;
  };
  for (let py = 0; py < n; py++) {
    for (let px = 0; px < n; px++) {
      let kapsam = 0;
      for (let sy = 0; sy < S; sy++) for (let sx = 0; sx < S; sx++) if (icerde(px + (sx + 0.5) / S, py + (sy + 0.5) / S)) kapsam++;
      if (!kapsam) continue;
      // Hedef pikselin kaynakta kapladığı alan
      const x0 = ((px - ofs) / ic) * w, x1 = ((px + 1 - ofs) / ic) * w, y0 = ((py - ofs) / ic) * h, y1 = ((py + 1 - ofs) / ic) * h;
      let R = 0, G = 0, B = 0, A = 0, say = 0;
      for (let y = Math.max(0, Math.floor(y0)); y < Math.min(h, Math.ceil(y1)); y++) {
        for (let x = Math.max(0, Math.floor(x0)); x < Math.min(w, Math.ceil(x1)); x++) {
          const k = (y * w + x) * 4;
          R += rgba[k];
          G += rgba[k + 1];
          B += rgba[k + 2];
          A += rgba[k + 3];
          say++;
        }
      }
      if (!say) continue;
      const i = (py * n + px) * 4;
      out[i] = Math.round(R / say);
      out[i + 1] = Math.round(G / say);
      out[i + 2] = Math.round(B / say);
      out[i + 3] = Math.round((A / say) * (kapsam / (S * S)));
    }
  }
  return pngYaz(n, n, out);
}

const kaynak = pngOku('varliklar/ikon.png');
mkdirSync('app/ikonlar', { recursive: true });
const yaz = (ad, veri) => {
  writeFileSync('app/ikonlar/' + ad, veri);
  console.log('app/ikonlar/' + ad);
};
for (const n of [192, 512, 1024]) yaz(`ikon-${n}.png`, uret(kaynak, n, 0.04, 0.2));
yaz('ikon-maskeli-512.png', uret(kaynak, 512));
yaz('ikon-apple-180.png', uret(kaynak, 180));
