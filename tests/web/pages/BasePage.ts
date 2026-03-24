import { Page, Locator } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate(path = '') {
    await this.page.goto(path);
  }

  async getTitle() {
    return this.page.title();
  }

  async waitForNetworkIdle() {
    await this.page.waitForLoadState('networkidle');
  }

  async getURL() {
    return this.page.url();
  }
}
