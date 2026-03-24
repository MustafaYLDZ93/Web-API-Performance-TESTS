/**
 * k6 Spike Test - Ani trafik artışı simülasyonu
 * Çalıştır: k6 run tests/performance/spike-test.js
 */
import http from 'k6/http';
import { check, sleep } from 'k6';
import { generateSummary } from './summary.js';

export const handleSummary = generateSummary('spike-test');

export const options = {
  tags: { testType: 'spike', env: 'dev' },
  stages: [
    { duration: '5s', target: 2 },    // Normal trafik
    { duration: '2s', target: 100 },  // ANİ SPIKE
    { duration: '5s', target: 100 },  // Spike sürer
    { duration: '2s', target: 2 },    // Hızlı düşüş
    { duration: '5s', target: 0 },    // Recovery
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'],
    http_req_failed: ['rate<0.10'],
  },
};

export default function () {
  const res = http.get('https://jsonplaceholder.typicode.com/posts/1');
  check(res, {
    'status ok': (r) => r.status === 200,
  });
  sleep(0.1);
}
