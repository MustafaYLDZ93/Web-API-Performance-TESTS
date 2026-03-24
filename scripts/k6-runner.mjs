#!/usr/bin/env node
/**
 * k6 Test Runner - npm run test:perf ile tüm perf testleri çalıştırır
 */
import { execSync } from 'child_process';
import { readdirSync } from 'fs';
import { join } from 'path';

const PERF_DIR = 'tests/performance';
const files = readdirSync(PERF_DIR).filter((f) => f.endsWith('.js'));

let passed = 0;
let failed = 0;

for (const file of files) {
  const filePath = join(PERF_DIR, file);
  console.log(`\n▶ Running: ${filePath}`);
  try {
    execSync(`k6 run ${filePath}`, { stdio: 'inherit' });
    passed++;
  } catch {
    failed++;
    console.error(`✗ FAILED: ${filePath}`);
  }
}

console.log(`\n────────────────────────────`);
console.log(`Performance Tests: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
