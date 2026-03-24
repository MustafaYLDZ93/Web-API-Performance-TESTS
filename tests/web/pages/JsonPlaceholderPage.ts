import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class JsonPlaceholderPage extends BasePage {
  readonly url = 'https://jsonplaceholder.typicode.com';

  readonly heading: Locator;
  readonly resourceLinks: Locator;

  constructor(page: Page) {
    super(page);
    this.heading      = page.locator('h1').first();
    this.resourceLinks = page.locator('a[href*="/posts"], a[href*="/users"], a[href*="/todos"]');
  }

  async goto() {
    await this.navigate(this.url);
  }

  async fetchPost(id: number) {
    const response = await this.page.request.get(`${this.url}/posts/${id}`);
    return response.json();
  }

  async fetchUser(id: number) {
    const response = await this.page.request.get(`${this.url}/users/${id}`);
    return response.json();
  }

  async createPost(payload: { title: string; body: string; userId: number }) {
    const response = await this.page.request.post(`${this.url}/posts`, {
      data: payload,
    });
    return { status: response.status(), body: await response.json() };
  }

  async mockGetPost(id: number, mockedData: object) {
    await this.page.route(`**/posts/${id}`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockedData),
      });
    });
  }
}
