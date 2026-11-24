// Geçici uygulama ikonu üretir (bağımlılık yok). Codex ile kalıcı ikon gelince bu dosya gerekmez.
// Kullanım: node araclar/ikon-uret.mjs
import { writeFileSync, mkdirSync } from 'node:fs';
import { deflateSync } from 'node:zlib';

const CRC = new Int32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c;
});
const crc32 = (buf) => {
  let c = -1;
  for (const b of buf) c = CRC[(c ^ b) & 255] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
};
const parca = (tur, veri) => {
  const b = Buffer.alloc(12 + veri.length);
  b.writeUInt32BE(veri.length, 0);
  b.write(tur, 4, 'ascii');
  veri.copy(b, 8);
  b.writeUInt32BE(crc32(b.subarray(4, 8 + veri.length)), 8 + veri.length);
  return b;
};
function png(w, h, rgba) {
  const ham = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) {
    ham[y * (w * 4 + 1)] = 0;
    rgba.copy(ham, y * (w * 4 + 1) + 1, y * w * 4, (y + 1) * w * 4);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), parca('IHDR', ihdr), parca('IDAT', deflateSync(ham, { level: 9 })), parca('IEND', Buffer.alloc(0))]);
}

// Şekiller 0..1 koordinatlarda. Mavi yuvarlak kare, üstte turuncu odak noktası,
// altında çam ağacı gibi genişleyen üç beyaz satır.
const MAVI = [26, 111, 176];
const BEYAZ = [255, 255, 255];
const TURUNCU = [240, 135, 79];
const icindeYuvarlakKare = (x, y, x0, y0, x1, y1, r) => {
  if (x < x0 || x > x1 || y < y0 || y > y1) return false;
  const cx = Math.min(Math.max(x, x0 + r), x1 - r);
  const cy = Math.min(Math.max(y, y0 + r), y1 - r);
  return (x - cx) ** 2 + (y - cy) ** 2 <= r * r;
};
const satirlar = [
  [0.4, 0.6, 0.49],
  [0.31, 0.69, 0.62],
  [0.22, 0.78, 0.75],
];
function renk(x, y) {
  if (!icindeYuvarlakKare(x, y, 0.04, 0.04, 0.96, 0.96, 0.2)) return null;
  if ((x - 0.5) ** 2 + (y - 0.3) ** 2 <= 0.075 ** 2) return TURUNCU;
  for (const [a, b, yy] of satirlar) if (icindeYuvarlakKare(x, y, a, yy - 0.035, b, yy + 0.035, 0.035)) return BEYAZ;
  return MAVI;
}
function ciz(n) {
  const buf = Buffer.alloc(n * n * 4);
  const S = 4;
  for (let py = 0; py < n; py++) {
    for (let px = 0; px < n; px++) {
      let r = 0, g = 0, b = 0, a = 0;
      for (let sy = 0; sy < S; sy++) {
        for (let sx = 0; sx < S; sx++) {
          const c = renk((px + (sx + 0.5) / S) / n, (py + (sy + 0.5) / S) / n);
          if (c) {
            r += c[0];
            g += c[1];
            b += c[2];
            a++;
          }
        }
      }
      const i = (py * n + px) * 4;
      if (a) {
        buf[i] = Math.round(r / a);
        buf[i + 1] = Math.round(g / a);
        buf[i + 2] = Math.round(b / a);
      }
      buf[i + 3] = Math.round((a / (S * S)) * 255);
    }
  }
  return png(n, n, buf);
}

mkdirSync('app/ikonlar', { recursive: true });
for (const n of [192, 512, 1024]) {
  writeFileSync(`app/ikonlar/ikon-${n}.png`, ciz(n));
  console.log(`app/ikonlar/ikon-${n}.png`);
}
