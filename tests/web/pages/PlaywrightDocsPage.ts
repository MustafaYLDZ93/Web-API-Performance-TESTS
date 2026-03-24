import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class PlaywrightDocsPage extends BasePage {
  readonly url = 'https://playwright.dev/docs/intro';

  readonly sidebar: Locator;
  readonly mainContent: Locator;
  readonly pageTitle: Locator;
  readonly nextButton: Locator;
  readonly breadcrumb: Locator;
  readonly codeBlocks: Locator;

  constructor(page: Page) {
    super(page);
    this.sidebar     = page.locator('aside, nav[aria-label*="docs"], .theme-doc-sidebar-container').first();
    this.mainContent = page.locator('article, main').first();
    this.pageTitle   = page.locator('article h1, main h1').first();
    this.nextButton  = page.getByRole('link', { name: /next/i }).last();
    this.breadcrumb  = page.locator('nav[aria-label*="breadcrumb"]').first();
    this.codeBlocks  = page.locator('pre');
  }

  async goto() {
    await this.navigate(this.url);
  }

  async getPageTitle() {
    return this.pageTitle.textContent();
  }

  async getCodeBlockCount() {
    return this.codeBlocks.count();
  }

  async goToNextPage() {
    await this.nextButton.click();
    await this.waitForNetworkIdle();
  }

  async isSidebarVisible() {
    return this.sidebar.isVisible();
  }
}
