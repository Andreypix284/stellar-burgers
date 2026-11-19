import path from 'path';
import { fileURLToPath } from 'url';

import { test, expect } from '@playwright/test';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test.describe('Страница конструктора бургера', () => {
  test.beforeEach(async ({ page }) => {
    // Перехватываем запросы с помощью HAR-файла
    await page.routeFromHAR(path.join(__dirname, 'hars', 'ingredients.har'), {
      url: '**/api/ingredients',
      update: false,
    });

    await page.goto('/');
    await page.waitForSelector('text=Краторная булка N-200i');
  });

  test('Добавление ингредиента из списка в конструктор', async ({ page }) => {
    const bunCard = page.locator('li', { hasText: 'Краторная булка N-200i' });
    await bunCard.getByText('Добавить').click();

    await expect(page.getByText('Краторная булка N-200i (верх)')).toBeVisible();
    await expect(page.getByText('Краторная булка N-200i (низ)')).toBeVisible();

    const mainCard = page.locator('li', {
      hasText: 'Биокотлета из марсианской Магнолии',
    });
    await mainCard.getByText('Добавить').click();

    const constructorSection = page.locator('section', {
      has: page.getByRole('button', { name: 'Оформить заказ' }),
    });

    await expect(
      constructorSection.getByText('Биокотлета из марсианской Магнолии')
    ).toBeVisible();
  });

  test('Работа модальных окон ингредиента', async ({ page }) => {
    await page.getByText('Краторная булка N-200i').click();
    await expect(page.getByText('Детали ингредиента')).toBeVisible();

    // Дополнительная проверка: в модалке именно та булка
    await expect(page.getByText('Краторная булка N-200i').last()).toBeVisible();

    await page.getByLabel('Закрыть').click();
    await expect(page.getByText('Детали ингредиента')).not.toBeVisible();

    await page.getByText('Краторная булка N-200i').click();
    await expect(page.getByText('Детали ингредиента')).toBeVisible();

    await page.mouse.click(10, 10);
    await expect(page.getByText('Детали ингредиента')).not.toBeVisible();
  });
});
