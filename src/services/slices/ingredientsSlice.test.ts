import { fetchIngredients, ingredientsReducer } from './ingredientsSlice';

import type { TIngredientsState } from './ingredientsSlice';

describe('Тестирование редьюсера ingredientsSlice', () => {
  const initialState: TIngredientsState = {
    ingredients: [],
    isLoading: false,
    error: null,
  };

  test('должен вернуть начальное состояние при неизвестном экшене', () => {
    const result = ingredientsReducer(undefined, { type: 'UNKNOWN' });
    expect(result).toEqual(initialState);
  });

  test('должен обработать экшен fetchIngredients.pending', () => {
    const action = { type: fetchIngredients.pending.type };
    const result = ingredientsReducer(initialState, action);
    expect(result.isLoading).toBe(true);
    expect(result.error).toBeNull();
  });

  test('должен обработать экшен fetchIngredients.fulfilled', () => {
    const mockIngredients = [
      { _id: '1', name: 'Булка', type: 'bun', price: 100 },
      { _id: '2', name: 'Начинка', type: 'main', price: 200 },
    ];
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients,
    };
    const result = ingredientsReducer(initialState, action);
    expect(result.isLoading).toBe(false);
    expect(result.ingredients).toEqual(mockIngredients);
  });

  test('должен обработать экшен fetchIngredients.rejected', () => {
    const action = {
      type: fetchIngredients.rejected.type,
      error: { message: 'Ошибка сети' },
    };
    const result = ingredientsReducer(initialState, action);
    expect(result.isLoading).toBe(false);
    expect(result.error).toBe('Ошибка сети');
  });
});
