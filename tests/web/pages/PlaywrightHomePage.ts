import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class PlaywrightHomePage extends BasePage {
  readonly url = 'https://playwright.dev';

  readonly navbar: Locator;
  readonly docsLink: Locator;
  readonly apiLink: Locator;
  readonly searchButton: Locator;
  readonly heroTitle: Locator;
  readonly getStartedButton: Locator;

  constructor(page: Page) {
    super(page);
    this.navbar         = page.locator('nav');
    this.docsLink       = page.getByRole('link', { name: 'Docs' }).first();
    this.apiLink        = page.getByRole('link', { name: 'API' }).first();
    this.searchButton   = page.getByRole('button', { name: /search/i }).first();
    this.heroTitle      = page.locator('h1').first();
    this.getStartedButton = page.getByRole('link', { name: /get started/i }).first();
  }

  async goto() {
    await this.navigate(this.url);
  }

  async clickDocs() {
    await this.docsLink.click();
  }

  async clickAPI() {
    await this.apiLink.click();
  }

  async openSearch() {
    await this.searchButton.click();
  }

  async searchFor(term: string) {
    await this.openSearch();
    const input = this.page.getByPlaceholder(/search/i);
    await input.fill(term);
    return input;
  }

  async isNavbarVisible() {
    return this.navbar.isVisible();
  }
}
