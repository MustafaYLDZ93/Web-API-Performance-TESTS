import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/web',
  // Tag ile çalıştırmak için:
  // npx playwright test --grep "@smoke"
  // npx playwright test --grep "@regression"
  // npx playwright test --grep-invert "@slow"
  outputDir: './reports/playwright-results',
  reporter: [
    ['list'],
    ['html', { outputFolder: './reports/playwright', open: 'never' }],
  ],
  use: {
    baseURL: 'https://jsonplaceholder.typicode.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
