import { test, expect } from '@playwright/test';
import { JsonPlaceholderPage } from './pages/JsonPlaceholderPage';

test.describe('POM — JsonPlaceholder API & Mock', () => {
  let apiPage: JsonPlaceholderPage;

  test.beforeEach(async ({ page }) => {
    apiPage = new JsonPlaceholderPage(page);
  });

  test('post verisi doğru geliyor @smoke @network', async () => {
    const post = await apiPage.fetchPost(1);
    expect(post.id).toBe(1);
    expect(post.userId).toBeDefined();
    expect(typeof post.title).toBe('string');
  });

  test('kullanıcı verisi doğru geliyor @smoke @network', async () => {
    const user = await apiPage.fetchUser(1);
    expect(user.id).toBe(1);
    expect(user.name).toBe('Leanne Graham');
    expect(user.email).toBeDefined();
  });

  test('yeni post oluşturuluyor @regression @network', async () => {
    const { status, body } = await apiPage.createPost({
      title: 'POM Test Post',
      body: 'POM ile yazılan test.',
      userId: 1,
    });
    expect(status).toBe(201);
    expect(body.title).toBe('POM Test Post');
    expect(body.userId).toBe(1);
  });

  test('API yanıtı mock ediliyor @smoke @network', async ({ page }) => {
    await apiPage.mockGetPost(1, { id: 1, title: 'Mock Başlık', userId: 99 });
    await apiPage.goto();
    await page.goto('https://jsonplaceholder.typicode.com/posts/1');
    const body = await page.textContent('body');
    const data = JSON.parse(body!);
    expect(data.title).toBe('Mock Başlık');
    expect(data.userId).toBe(99);
  });
});
