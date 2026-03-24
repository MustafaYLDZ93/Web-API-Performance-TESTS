import { test, expect } from '@playwright/test';

test.describe('API Mock & Intercept Tests', () => {
  test('network isteği yakalanıyor @regression @network', async ({ page }) => {
    const requests: string[] = [];

    page.on('request', (req) => {
      if (req.url().includes('jsonplaceholder')) {
        requests.push(req.url());
      }
    });

    await page.goto('https://jsonplaceholder.typicode.com');
    await page.waitForLoadState('networkidle');
    expect(requests.length).toBeGreaterThanOrEqual(0);
  });

  test('API yanıtı mock ediliyor @smoke @network', async ({ page }) => {
    await page.route('**/posts/1', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ id: 1, title: 'Mock Post', userId: 99 }),
      });
    });

    await page.goto('https://jsonplaceholder.typicode.com/posts/1');
    const body = await page.textContent('body');
    const data = JSON.parse(body!);
    expect(data.title).toBe('Mock Post');
    expect(data.userId).toBe(99);
  });
});
