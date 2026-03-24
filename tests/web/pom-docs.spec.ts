import { test, expect } from '@playwright/test';
import { PlaywrightDocsPage } from './pages/PlaywrightDocsPage';

test.describe('POM — Playwright Docs', () => {
  let docsPage: PlaywrightDocsPage;

  test.beforeEach(async ({ page }) => {
    docsPage = new PlaywrightDocsPage(page);
    await docsPage.goto();
  });

  test('docs sayfası yükleniyor @smoke @ui', async ({ page }) => {
    await expect(page).toHaveURL(/docs/);
  });

  test('sayfa başlığı mevcut @smoke @ui', async () => {
    const title = await docsPage.getPageTitle();
    expect(title).toBeTruthy();
    expect(title!.length).toBeGreaterThan(0);
  });

  test('sidebar görünür @regression @ui', async () => {
    const visible = await docsPage.isSidebarVisible();
    expect(visible).toBe(true);
  });

  test('sayfada kod bloğu var @regression', async () => {
    const count = await docsPage.getCodeBlockCount();
    expect(count).toBeGreaterThan(0);
  });

  test('ana içerik alanı mevcut @smoke', async () => {
    await expect(docsPage.mainContent).toBeVisible();
  });
});
