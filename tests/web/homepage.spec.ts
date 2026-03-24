import { test, expect } from '@playwright/test';

test.describe('Homepage Tests', () => {
  test('sayfa başlığı doğru yükleniyor @smoke @critical', async ({ page }) => {
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
  });

  test('ana navigasyon görünür @smoke @ui', async ({ page }) => {
    await page.goto('https://playwright.dev');
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
  });

  test('docs linkine tıklanabiliyor @regression @ui', async ({ page }) => {
    await page.goto('https://playwright.dev');
    await page.getByRole('link', { name: 'Docs' }).first().click();
    await expect(page).toHaveURL(/docs/);
  });
});
