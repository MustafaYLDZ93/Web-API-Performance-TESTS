import http from 'k6/http';
import { check, sleep } from 'k6';
import { generateSummary } from './summary.js';

export const handleSummary = generateSummary('stress-test');

export const options = {
  // LOAD TEST: Yavaşça yük ekle, kararlı yükte tut, yavaşça azalt
  // Amaç: Normal trafik altında sistemin davranışını ölçmek
  stages: [
    { duration: '30s', target: 10 }, // 30 saniyede 10 kullanıcıya çık
    { duration: '1m', target: 10 },  // 1 dakika boyunca stabil devam et
    { duration: '30s', target: 0 },  // Yavaşça kapat
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // İsteklerin %95'i 500ms altında olmalı
    http_req_failed: ['rate<0.01'],   // Hata oranı %1'den az olmalı
  },
};

export default function () {
  // Gerçekçi Header Tanımı
  const params = {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      'Accept': 'application/json',
    },
  };

  // Güvenli test adresi: httpbin.test.k6.io/get
  // Bu adres header'ları JSON olarak geri döner.
  let res = http.get('https://httpbin.test.k6.io/get', params);

  // Kontroller
  check(res, {
    'bağlantı başarılı (200)': (r) => r.status === 200,
    'sunucu yanıt verdi mi?': (r) => r.body.length > 0,
  });

  // İnsan davranışını taklit etmek için rastgele bekleme
  sleep(Math.random() * 2 + 1);
}