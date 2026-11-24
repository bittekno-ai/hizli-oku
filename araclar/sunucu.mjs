// Yerel deneme sunucusu (bağımlılık yok). Kullanım: npm run basla  →  http://127.0.0.1:5180
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';

const KOK = resolve('app');
const PORT = Number(process.env.PORT) || 5180;
const TURLER = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.md': 'text/markdown; charset=utf-8',
};

createServer(async (istek, yanit) => {
  try {
    let yol = decodeURIComponent(new URL(istek.url, 'http://x').pathname);
    if (yol.endsWith('/')) yol += 'index.html';
    const dosya = normalize(join(KOK, yol));
    if (!dosya.startsWith(KOK)) throw new Error('yasak');
    if (!(await stat(dosya)).isFile()) throw new Error('yok');
    yanit.writeHead(200, { 'Content-Type': TURLER[extname(dosya)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    yanit.end(await readFile(dosya));
  } catch {
    yanit.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    yanit.end('Bulunamadı');
  }
}).listen(PORT, '127.0.0.1', () => console.log(`Hızlı Oku: http://127.0.0.1:${PORT}`));
