'use strict';
// Flaş tanıma siluetleri (app/siluet/*.png). Görseller ChatGPT (Codex görsel aracı) ile üretildi;
// uçak ve gemiler kurgusaldır. Kaynak: varliklar/KAYNAKLAR.md
HO.icerik = HO.icerik || {};
HO.icerik.siluetGruplari = {"ucak":"Uçaklar","gemi":"Gemiler","hayvan":"Hayvanlar"};
HO.icerik.siluetler = [
  { id: 'ucak-01', grup: 'ucak', ad: 'düz kanatlı uçak' },
  { id: 'ucak-02', grup: 'ucak', ad: 'geriye süpürük uçak' },
  { id: 'ucak-03', grup: 'ucak', ad: 'üçgen kanatlı uçak' },
  { id: 'ucak-04', grup: 'ucak', ad: 'çift bomlu uçak' },
  { id: 'ucak-05', grup: 'ucak', ad: 'ön kanatlı uçak' },
  { id: 'ucak-06', grup: 'ucak', ad: 'dört motorlu uçak' },
  { id: 'ucak-07', grup: 'ucak', ad: 'kuyruksuz uçan kanat' },
  { id: 'ucak-08', grup: 'ucak', ad: 'uzun kanatlı planör' },
  { id: 'gemi-01', grup: 'gemi', ad: 'tek direkli yelkenli' },
  { id: 'gemi-02', grup: 'gemi', ad: 'üç direkli yelkenli' },
  { id: 'gemi-03', grup: 'gemi', ad: 'liman römorkörü' },
  { id: 'gemi-04', grup: 'gemi', ad: 'vinçli yük gemisi' },
  { id: 'gemi-05', grup: 'gemi', ad: 'kuleli denizaltı' },
  { id: 'gemi-06', grup: 'gemi', ad: 'çift gövdeli feribot' },
  { id: 'gemi-07', grup: 'gemi', ad: 'bomlu balıkçı teknesi' },
  { id: 'gemi-08', grup: 'gemi', ad: 'üç bacalı yolcu gemisi' },
  { id: 'hayvan-01', grup: 'hayvan', ad: 'at' },
  { id: 'hayvan-02', grup: 'hayvan', ad: 'kedi' },
  { id: 'hayvan-03', grup: 'hayvan', ad: 'tavşan' },
  { id: 'hayvan-04', grup: 'hayvan', ad: 'geyik' },
  { id: 'hayvan-05', grup: 'hayvan', ad: 'fil' },
  { id: 'hayvan-06', grup: 'hayvan', ad: 'zürafa' },
  { id: 'hayvan-07', grup: 'hayvan', ad: 'köpek' },
  { id: 'hayvan-08', grup: 'hayvan', ad: 'inek' },
];
