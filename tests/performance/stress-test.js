/**
 * k6 Stress Test - Sistemin limitini bulmak için
 * Çalıştır: k6 run tests/performance/stress-test.js
 */
import http from 'k6/http';
import { check, sleep } from 'k6';
import { generateSummary } from './summary.js';

export const handleSummary = generateSummary('stress-test');

export const options = {
  tags: { testType: 'stress', env: 'dev' },
  stages: [
    { duration: '10s', target: 10 },
    { duration: '10s', target: 25 },
    { duration: '10s', target: 50 },
    { duration: '10s', target: 25 },
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(99)<1000'],
    http_req_failed: ['rate<0.05'],
  },
};

const BASE_URL = 'https://jsonplaceholder.typicode.com';

export default function () {
  const responses = http.batch([
    ['GET', `${BASE_URL}/posts/${Math.floor(Math.random() * 100) + 1}`],
    ['GET', `${BASE_URL}/users/${Math.floor(Math.random() * 10) + 1}`],
    ['GET', `${BASE_URL}/todos/${Math.floor(Math.random() * 200) + 1}`],
  ]);

  responses.forEach((res) => {
    check(res, {
      'status is 200': (r) => r.status === 200,
    });
  });

  sleep(0.3);
}
