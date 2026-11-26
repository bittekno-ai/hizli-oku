'use strict';
// Çevrimdışı kullanım için önbellek. Yeni sürümde SURUM değiştirilir.
const SURUM = 'hizlioku-0.6.1';
const DOSYALAR = [
  './',
  'index.html',
  'manifest.webmanifest',
  'css/stil.css',
  'css/tasarim.css',
  'yazitipi/noto-sans-latin-400-normal.woff2',
  'yazitipi/noto-sans-latin-600-normal.woff2',
  'yazitipi/noto-sans-latin-700-normal.woff2',
  'yazitipi/noto-sans-latin-ext-400-normal.woff2',
  'yazitipi/noto-sans-latin-ext-600-normal.woff2',
  'yazitipi/noto-sans-latin-ext-700-normal.woff2',
  'ikonlar/ikon-192.png',
  'ikonlar/ikon-512.png',
  'ikonlar/ikon-maskeli-512.png',
  'ikonlar/ikon-apple-180.png',
  'icerik/kelimeler.js',
  'icerik/metinler.js',
  'icerik/metinler2.js',
  'icerik/anlama.js',
  'icerik/siluetler.js',
  'siluet/gemi-01.png',
  'siluet/gemi-02.png',
  'siluet/gemi-03.png',
  'siluet/gemi-04.png',
  'siluet/gemi-05.png',
  'siluet/gemi-06.png',
  'siluet/gemi-07.png',
  'siluet/gemi-08.png',
  'siluet/hayvan-01.png',
  'siluet/hayvan-02.png',
  'siluet/hayvan-03.png',
  'siluet/hayvan-04.png',
  'siluet/hayvan-05.png',
  'siluet/hayvan-06.png',
  'siluet/hayvan-07.png',
  'siluet/hayvan-08.png',
  'siluet/ucak-01.png',
  'siluet/ucak-02.png',
  'siluet/ucak-03.png',
  'siluet/ucak-04.png',
  'siluet/ucak-05.png',
  'siluet/ucak-06.png',
  'siluet/ucak-07.png',
  'siluet/ucak-08.png',
  'js/yardimci.js',
  'js/depo.js',
  'js/arayuz.js',
  'js/grafik.js',
  'js/ikonlar.js',
  'js/gorseller.js',
  'js/gunluk.js',
  'js/sayfalar.js',
  'js/uygulama.js',
  'js/egzersizler/schulte.js',
  'js/egzersizler/takip.js',
  'js/egzersizler/beliren.js',
  'js/egzersizler/flas.js',
  'js/egzersizler/piramit.js',
  'js/egzersizler/rehber.js',
  'js/egzersizler/tarama.js',
  'js/egzersizler/okuma.js',
  'js/egzersizler/rsvp.js',
  'js/egzersizler/burdon.js',
  'js/egzersizler/anlama.js',
  'js/egzersizler/renk.js',
  'js/egzersizler/kelimeavi.js',
  'js/egzersizler/cevresel.js',
  'js/metinlerim.js',
  'js/egzersizler/turevler.js',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(SURUM).then((c) => c.addAll(DOSYALAR)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((ks) => Promise.all(ks.filter((k) => k !== SURUM).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Önce ağ, olmazsa önbellek: güncellemeler hemen gelir, internetsiz de çalışır.
// cache: 'no-cache' tarayıcının HTTP önbelleğindeki eski dosyayı kullanmadan sunucuya sorar.
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request, { cache: 'no-cache' })
      .then((r) => {
        const kopya = r.clone();
        caches.open(SURUM).then((c) => c.put(e.request, kopya));
        return r;
      })
      .catch(() => caches.match(e.request).then((r) => r || caches.match('index.html')))
  );
});
