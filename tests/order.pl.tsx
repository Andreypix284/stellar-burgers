import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { test, expect } from '@playwright/test';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mockIngredientsResponse = JSON.parse(
  readFileSync(path.join(__dirname, 'mocks', 'ingredients.json'), 'utf-8')
) as { success: boolean; data: Record<string, unknown>[] };

// Моковые данные пользователя
const mockUserResponse = {
  success: true,
  user: {
    email: 'test@example.com',
    name: 'Test User',
  },
};

// Моковые данные заказа
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
    // 1. Подставляем токены авторизации
    await context.addCookies([
      {
        name: 'accessToken',
        value: 'mock-access-token',
        domain: 'localhost',
        path: '/',
      },
    ]);

    // Добавляем refreshToken в localStorage через initScript
    await page.addInitScript(() => {
      window.localStorage.setItem('refreshToken', 'mock-refresh-token');
    });

    // 2. Мокаем запросы
    // Ингредиенты
    await page.route('**/api/ingredients', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockIngredientsResponse),
      });
    });

    // Пользователь
    await page.route('**/api/auth/user', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockUserResponse),
      });
    });

    // Заказ
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

    // Переходим на главную
    await page.goto('/');
    await page.waitForSelector('text=Краторная булка N-200i');
  });

  test('Успешное оформление заказа', async ({ page }) => {
    // 3. Собираем бургер: добавляем булку
    const bunCard = page.locator('li', { hasText: 'Краторная булка N-200i' });
    await bunCard.getByText('Добавить').click();

    // Добавляем начинку
    const mainCard = page.locator('li', {
      hasText: 'Биокотлета из марсианской Магнолии',
    });
    await mainCard.getByText('Добавить').click();

    // 4. Кликаем "Оформить заказ"
    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    // 5. Проверяем, что модалка открылась и номер заказа верный
    // Ищем номер заказа в модалке (обычно это текст с числом)
    await expect(page.getByText('12345')).toBeVisible();

    // Проверяем, что конструктор пуст (появились заглушки "Выберите булки" и "Выберите начинку")
    await expect(page.getByText('Выберите булки').first()).toBeVisible();
    await expect(page.getByText('Выберите начинку')).toBeVisible();

    // 6. Закрываем модалку и проверяем, что она закрылась
    await page.getByLabel('Закрыть').click();
    await expect(page.getByText('12345')).not.toBeVisible();
  });
});
