// ChatGPT ile üretilen siyah-beyaz siluetleri uygulamaya hazırlar (bağımlılık yok):
// beyaz zemini şeffaf yapar, şekli kırpar, ortalar ve 512×512 PNG olarak yazar (en uzun kenar %80).
// Kullanım:
//   node araclar/siluet-isle.mjs <girdi.png> <cikti.png> [x y g y]   (isteğe bağlı: önce bu dikdörtgeni kes)
//   node araclar/siluet-isle.mjs --pano <klasör> <cikti.png>          (gözden geçirmek için hepsini tek resimde)
import { writeFileSync, readdirSync } from 'node:fs';
import { pngOku, pngYaz } from './png.mjs';

const N = 512, ORAN = 0.8;

// Koyuluktan örtücülük: beyaz → 0, siyah → 255 (gri kenarlar yumuşak kalır).
function ortucu({ w, h, rgba }, kx = 0, ky = 0, kw = w, kh = h) {
  const a = new Uint8Array(kw * kh);
  for (let y = 0; y < kh; y++)
    for (let x = 0; x < kw; x++) {
      const k = ((y + ky) * w + x + kx) * 4;
      const lum = 0.2126 * rgba[k] + 0.7152 * rgba[k + 1] + 0.0722 * rgba[k + 2];
      a[y * kw + x] = Math.max(0, Math.min(255, Math.round(((235 - lum) / 205) * 255)));
    }
  return { w: kw, h: kh, a };
}

function isle(o) {
  let x0 = o.w, y0 = o.h, x1 = -1, y1 = -1;
  for (let y = 0; y < o.h; y++)
    for (let x = 0; x < o.w; x++)
      if (o.a[y * o.w + x] > 128) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
  if (x1 < 0) throw new Error('Şekil bulunamadı');
  const bw = x1 - x0 + 1, bh = y1 - y0 + 1, olcek = (N * ORAN) / Math.max(bw, bh);
  const ox = (N - bw * olcek) / 2, oy = (N - bh * olcek) / 2;
  const out = Buffer.alloc(N * N * 4);
  for (let py = 0; py < N; py++)
    for (let px = 0; px < N; px++) {
      const sx0 = x0 + (px - ox) / olcek, sx1 = x0 + (px + 1 - ox) / olcek, sy0 = y0 + (py - oy) / olcek, sy1 = y0 + (py + 1 - oy) / olcek;
      let t = 0, n = 0;
      for (let y = Math.floor(sy0); y < Math.ceil(sy1); y++)
        for (let x = Math.floor(sx0); x < Math.ceil(sx1); x++) {
          n++;
          if (x >= x0 && x <= x1 && y >= y0 && y <= y1) t += o.a[y * o.w + x];
        }
      out[(py * N + px) * 4 + 3] = n ? Math.round(t / n) : 0;
    }
  return pngYaz(N, N, out);
}

function pano(klasor, cikti) {
  const dosyalar = readdirSync(klasor).filter((f) => /^[a-z]+-\d+\.png$/.test(f)).sort();
  const H = 128, sut = 8, sat = Math.ceil(dosyalar.length / sut);
  const out = Buffer.alloc(sut * H * sat * H * 4, 255);
  dosyalar.forEach((f, i) => {
    const { w, rgba } = pngOku(klasor + '/' + f), k = w / H;
    for (let y = 0; y < H; y++)
      for (let x = 0; x < H; x++) {
        const a = rgba[(Math.floor(y * k) * w + Math.floor(x * k)) * 4 + 3] / 255;
        const j = (((Math.floor(i / sut) * H + y) * sut * H) + (i % sut) * H + x) * 4;
        const v = Math.round(255 * (1 - a) - (x === 0 || y === 0 ? 40 : 0));
        out[j] = out[j + 1] = out[j + 2] = Math.max(0, v);
      }
  });
  writeFileSync(cikti, pngYaz(sut * H, sat * H, out));
}

const [, , g, c, ...kes] = process.argv;
if (g === '--pano') pano(c, kes[0]);
else {
  const r = pngOku(g);
  const [x, y, w, h] = kes.length ? kes.map(Number) : [0, 0, r.w, r.h];
  writeFileSync(c, isle(ortucu(r, x, y, w, h)));
  console.log(c);
}
