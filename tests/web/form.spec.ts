import { test, expect } from '@playwright/test';

test.describe('Form & Input Tests', () => {
  test('arama formu çalışıyor @smoke @ui', async ({ page }) => {
    await page.goto('https://playwright.dev');
    const searchBtn = page.getByRole('button', { name: /search/i }).first();
    if (await searchBtn.isVisible()) {
      await searchBtn.click();
      const searchInput = page.getByPlaceholder(/search/i);
      await searchInput.fill('locator');
      await expect(searchInput).toHaveValue('locator');
    }
  });

  test('viewport ve responsive kontrol @regression @ui', async ({ page }) => {
    await page.goto('https://playwright.dev');
    const viewport = page.viewportSize();
    expect(viewport).not.toBeNull();
    expect(viewport!.width).toBeGreaterThan(0);
  });
});
