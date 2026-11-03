import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { orderBurgerApi } from '../../utils/burger-api';

import type { TConstructorIngredient, TOrder } from '../../utils/types';

export type TConstructorSliceState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: string | null;
};

const initialState: TConstructorSliceState = {
  bun: null,
  ingredients: [],
  orderRequest: false,
  orderModalData: null,
  error: null,
};

export const createOrder = createAsyncThunk(
  'constructor/createOrder',
  async (ingredientsId: string[]) => {
    const data = await orderBurgerApi(ingredientsId);
    return data.order;
  }
);

export const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addIngredient: (state, action) => {
      // Генерируем ID прямо здесь, но безопасно
      const uniqueId = `${Date.now()}-${Math.random()}`;
      const ingredient = action.payload as TConstructorIngredient;

      if (ingredient.type === 'bun') {
        state.bun = { ...ingredient, id: uniqueId };
      } else {
        // Самая главная защита
        if (!Array.isArray(state.ingredients)) {
          state.ingredients = [];
        }
        state.ingredients.push({ ...ingredient, id: uniqueId });
      }
    },
    removeIngredient: (state, action) => {
      state.ingredients = state.ingredients.filter((item) => item.id !== action.payload);
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
      state.orderModalData = null;
    },
    moveIngredient: (state, action) => {
      const { dragIndex, hoverIndex } = action.payload as {
        dragIndex: number;
        hoverIndex: number;
      };
      const dragItem = state.ingredients[dragIndex];
      if (dragItem) {
        state.ingredients.splice(dragIndex, 1);
        state.ingredients.splice(hoverIndex, 0, dragItem);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message ?? 'Ошибка оформления заказа';
      });
  },
});

export const { addIngredient, removeIngredient, clearConstructor, moveIngredient } =
  constructorSlice.actions;
export const constructorReducer = constructorSlice.reducer;
