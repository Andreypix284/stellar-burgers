import path from 'path';
import { fileURLToPath } from 'url';

import { test, expect } from '@playwright/test';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mockOrderResponse = {
  success: true,
  name: 'Test Burger',
  order: {
    number: 12345,
    _id: 'order-123',
    status: 'done',
    name: 'Test Burger',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    ingredients: [],
  },
};

test.describe('Оформление заказа', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.addCookies([
      {
        name: 'accessToken',
        value: 'mock-access-token',
        domain: 'localhost',
        path: '/',
      },
    ]);

    await page.addInitScript(() => {
      window.localStorage.setItem('refreshToken', 'mock-refresh-token');
    });

    await page.routeFromHAR(path.join(__dirname, 'hars', 'ingredients.har'), {
      url: '**/api/ingredients',
      update: false,
    });
    await page.routeFromHAR(path.join(__dirname, 'hars', 'user.har'), {
      url: '**/api/auth/user',
      update: false,
    });

    await page.route('**/api/orders', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockOrderResponse),
        });
      } else {
        await route.continue();
      }
    });

    await page.goto('/');
    await page.waitForSelector('text=Краторная булка N-200i');
  });

  test('Успешное оформление заказа', async ({ page }) => {
    const bunCard = page.locator('li', { hasText: 'Краторная булка N-200i' });
    await bunCard.getByText('Добавить').click();

    const mainCard = page.locator('li', {
      hasText: 'Биокотлета из марсианской Магнолии',
    });
    await mainCard.getByText('Добавить').click();

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();
    await expect(modal.getByText('12345')).toBeVisible();

    // Проверяем, что конструктор пуст (обе булки и начинка)
    const constructor = page.getByTestId('constructor');
    await expect(constructor.getByText('Выберите булки')).toHaveCount(2);
    await expect(constructor.getByText('Выберите начинку')).toBeVisible();

    await modal.getByTestId('modal-close').click();
    await expect(modal).not.toBeVisible();
  });
});
