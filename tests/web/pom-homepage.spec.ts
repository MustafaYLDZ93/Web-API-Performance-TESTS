import { test, expect } from '@playwright/test';
import { PlaywrightHomePage } from './pages/PlaywrightHomePage';

test.describe('POM — Playwright Homepage', () => {
  let homePage: PlaywrightHomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new PlaywrightHomePage(page);
    await homePage.goto();
  });

  test('sayfa başlığı doğru @smoke @critical', async () => {
    const title = await homePage.getTitle();
    expect(title).toMatch(/Playwright/);
  });

  test('navbar görünür @smoke @ui', async () => {
    const visible = await homePage.isNavbarVisible();
    expect(visible).toBe(true);
  });

  test('docs sayfasına yönlendiriyor @regression @ui', async ({ page }) => {
    await homePage.clickDocs();
    await expect(page).toHaveURL(/docs/);
  });

  test('arama inputu açılıyor ve yazı girilebiliyor @smoke @ui', async () => {
    const input = await homePage.searchFor('locator');
    await expect(input).toHaveValue('locator');
  });
});
