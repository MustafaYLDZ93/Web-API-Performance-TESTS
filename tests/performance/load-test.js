/**
 * k6 Load Test - Temel Yük Testi
 * Çalıştır: k6 run tests/performance/load-test.js
 */
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';
import { generateSummary } from './summary.js';

export const handleSummary = generateSummary('load-test');

// Custom metrikler
const errorRate = new Rate('errors');
const responseTime = new Trend('response_time', true);

export const options = {
  tags: { testType: 'load', env: 'dev' },
  stages: [
    { duration: '10s', target: 5 },   // Ramping up
    { duration: '20s', target: 10 },  // Steady load
    { duration: '10s', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],  // %95 istek 500ms altında
    http_req_failed: ['rate<0.01'],    // %1 den az hata
    errors: ['rate<0.05'],
  },
};

const BASE_URL = 'https://jsonplaceholder.typicode.com';

export default function () {
  // GET posts
  const postsRes = http.get(`${BASE_URL}/posts/1`);
  const postsOk = check(postsRes, {
    'posts status 200': (r) => r.status === 200,
    'posts response time < 400ms': (r) => r.timings.duration < 400,
    'posts has id': (r) => JSON.parse(r.body).id === 1,
  });

  errorRate.add(!postsOk);
  responseTime.add(postsRes.timings.duration);

  sleep(1);

  // GET users
  const usersRes = http.get(`${BASE_URL}/users/1`);
  check(usersRes, {
    'users status 200': (r) => r.status === 200,
    'users has name': (r) => JSON.parse(r.body).name !== undefined,
  });

  sleep(0.5);
}
