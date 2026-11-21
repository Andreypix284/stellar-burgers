import path from 'path';
import { fileURLToPath } from 'url';

import { test, expect } from '@playwright/test';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

    // Все запросы через HAR
    await page.routeFromHAR(path.join(__dirname, 'hars', 'ingredients.har'), {
      url: '**/api/ingredients',
      update: false,
    });
    await page.routeFromHAR(path.join(__dirname, 'hars', 'user.har'), {
      url: '**/api/auth/user',
      update: false,
    });
    await page.routeFromHAR(path.join(__dirname, 'hars', 'orders.har'), {
      url: '**/api/orders',
      update: false,
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

    const constructor = page.getByTestId('constructor');
    await expect(constructor.getByText('Выберите булки')).toHaveCount(2);
    await expect(constructor.getByText('Выберите начинку')).toBeVisible();

    await modal.getByTestId('modal-close').click();
    await expect(modal).not.toBeVisible();
  });
});
