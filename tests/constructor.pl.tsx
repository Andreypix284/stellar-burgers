import path from 'path';
import { fileURLToPath } from 'url';

import { test, expect } from '@playwright/test';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test.describe('Страница конструктора бургера', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR(path.join(__dirname, 'hars', 'ingredients.har'), {
      url: '**/api/ingredients',
      update: false,
    });
    await page.routeFromHAR(path.join(__dirname, 'hars', 'user.har'), {
      url: '**/api/auth/user',
      update: false,
    });

    await page.goto('/');
    await page.waitForSelector('text=Краторная булка N-200i');
  });

  test('Добавление ингредиента из списка в конструктор', async ({ page }) => {
    const bunCard = page.locator('li', { hasText: 'Краторная булка N-200i' });
    await bunCard.getByText('Добавить').click();

    const constructor = page.getByTestId('constructor');
    await expect(constructor.getByText('Краторная булка N-200i (верх)')).toBeVisible();
    await expect(constructor.getByText('Краторная булка N-200i (низ)')).toBeVisible();

    const mainCard = page.locator('li', {
      hasText: 'Биокотлета из марсианской Магнолии',
    });
    await mainCard.getByText('Добавить').click();

    await expect(
      constructor.getByText('Биокотлета из марсианской Магнолии')
    ).toBeVisible();
  });

  test('Работа модальных окон ингредиента', async ({ page }) => {
    await page.getByText('Краторная булка N-200i').click();

    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();
    await expect(modal.getByText('Детали ингредиента')).toBeVisible();
    await expect(modal.getByText('Краторная булка N-200i')).toBeVisible();
    // Проверяем калории (значение 420 из моковых данных)
    await expect(modal.getByText('420')).toBeVisible();

    // Закрываем по крестику
    await modal.getByTestId('modal-close').click();
    await expect(modal).not.toBeVisible();

    // Открываем снова
    await page.getByText('Краторная булка N-200i').click();
    await expect(modal).toBeVisible();

    // Закрываем по клику на оверлей (в угол)
    await page.getByTestId('modal-overlay').click({ position: { x: 10, y: 10 } });
    await expect(modal).not.toBeVisible();
  });
});
