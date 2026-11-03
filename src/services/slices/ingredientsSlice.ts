import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { getIngredientsApi } from '../../utils/burger-api';

import type { TIngredient } from '../../utils/types';

// Описываем типы для нашего состояния
export type TIngredientsState = {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
};

// Начальное состояние
const initialState: TIngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null,
};

// Создаем Thunk для асинхронного запроса
export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  async () => {
    const data = await getIngredientsApi();
    return data;
  }
);

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    // Если понадобятся синхронные экшены (например, очистка), добавим их тут
  },
  extraReducers: (builder) => {
    builder
      // Запрос начался
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // Запрос успешно завершен
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
      })
      // Произошла ошибка
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка загрузки ингредиентов';
      });
  },
});

export const ingredientsReducer = ingredientsSlice.reducer;
