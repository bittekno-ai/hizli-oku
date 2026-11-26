// Bağımlılıksız PNG okuma/yazma (8 bit, taramasız RGB/RGBA). ikon-uret.mjs ve siluet-isle.mjs kullanır.
import { readFileSync } from 'node:fs';
import { deflateSync, inflateSync } from 'node:zlib';

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
export function pngYaz(w, h, rgba) {
  const ham = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) rgba.copy(ham, y * (w * 4 + 1) + 1, y * w * 4, (y + 1) * w * 4);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), parca('IHDR', ihdr), parca('IDAT', deflateSync(ham, { level: 9 })), parca('IEND', Buffer.alloc(0))]);
}

// 8 bit, taramasız RGB ya da RGBA PNG okur; RGBA döndürür.
export function pngOku(dosya) {
  const b = readFileSync(dosya);
  let i = 8, w, h, tip, idat = [];
  while (i < b.length) {
    const n = b.readUInt32BE(i), tur = b.toString('ascii', i + 4, i + 8), v = b.subarray(i + 8, i + 8 + n);
    if (tur === 'IHDR') {
      w = v.readUInt32BE(0);
      h = v.readUInt32BE(4);
      if (v[8] !== 8 || v[12] !== 0 || (v[9] !== 2 && v[9] !== 6)) throw new Error('Desteklenmeyen PNG biçimi: ' + dosya);
      tip = v[9];
    } else if (tur === 'IDAT') idat.push(v);
    i += 12 + n;
  }
  const bpp = tip === 6 ? 4 : 3, satir = w * bpp, ham = inflateSync(Buffer.concat(idat));
  const out = Buffer.alloc(w * h * bpp);
  for (let y = 0; y < h; y++) {
    const f = ham[y * (satir + 1)], s = ham.subarray(y * (satir + 1) + 1, (y + 1) * (satir + 1)), o = y * satir;
    for (let x = 0; x < satir; x++) {
      const a = x >= bpp ? out[o + x - bpp] : 0, u = y ? out[o - satir + x] : 0, c = y && x >= bpp ? out[o - satir + x - bpp] : 0;
      let p = 0;
      if (f === 1) p = a;
      else if (f === 2) p = u;
      else if (f === 3) p = (a + u) >> 1;
      else if (f === 4) {
        const t = a + u - c, pa = Math.abs(t - a), pb = Math.abs(t - u), pc = Math.abs(t - c);
        p = pa <= pb && pa <= pc ? a : pb <= pc ? u : c;
      }
      out[o + x] = (s[x] + p) & 255;
    }
  }
  const rgba = Buffer.alloc(w * h * 4);
  for (let k = 0; k < w * h; k++) {
    rgba[k * 4] = out[k * bpp];
    rgba[k * 4 + 1] = out[k * bpp + 1];
    rgba[k * 4 + 2] = out[k * bpp + 2];
    rgba[k * 4 + 3] = bpp === 4 ? out[k * bpp + 3] : 255;
  }
  return { w, h, rgba };
}
