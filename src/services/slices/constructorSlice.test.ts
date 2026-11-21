import {
  addIngredient,
  removeIngredient,
  clearConstructor,
  moveIngredient,
  createOrder,
  constructorReducer,
} from './constructorSlice';

import type { TConstructorIngredient, TIngredient, TOrder } from '../../utils/types';
import type { TConstructorSliceState } from './constructorSlice';

describe('Тестирование редьюсера constructorSlice', () => {
  const initialState: TConstructorSliceState = {
    bun: null,
    ingredients: [],
    orderRequest: false,
    orderModalData: null,
    error: null,
  };

  const mockBun: TIngredient = {
    _id: '1',
    name: 'Булка',
    type: 'bun',
    price: 100,
    proteins: 10,
    fat: 10,
    carbohydrates: 10,
    calories: 100,
    image: 'image.png',
    image_mobile: 'image_mobile.png',
    image_large: 'image_large.png',
  };

  const mockMain: TIngredient = {
    _id: '2',
    name: 'Начинка',
    type: 'main',
    price: 200,
    proteins: 20,
    fat: 20,
    carbohydrates: 20,
    calories: 200,
    image: 'image.png',
    image_mobile: 'image_mobile.png',
    image_large: 'image_large.png',
  };

  const mockConstructorMain: TConstructorIngredient = {
    ...mockMain,
    id: 'main-1',
  };

  // ИСПРАВЛЕНО: приведение типа для неполного объекта
  const mockOrder = {
    number: 12345,
  } as unknown as TOrder;

  test('должен вернуть начальное состояние при неизвестном экшене', () => {
    const result = constructorReducer(undefined, { type: 'UNKNOWN' });
    expect(result).toEqual(initialState);
  });

  test('должен обработать экшен addIngredient (добавление булки)', () => {
    const action = addIngredient(mockBun);
    const result = constructorReducer(initialState, action);
    expect(result.bun).toBeDefined();
    expect(result.bun?.name).toBe('Булка');
    expect(result.ingredients).toEqual([]);
  });

  test('должен обработать экшен addIngredient (добавление начинки)', () => {
    const action = addIngredient(mockMain);
    const result = constructorReducer(initialState, action);
    expect(result.bun).toBeNull();
    expect(result.ingredients.length).toBe(1);
    expect(result.ingredients[0].name).toBe('Начинка');
  });

  test('должен обработать экшен removeIngredient', () => {
    const stateWithMain: TConstructorSliceState = {
      ...initialState,
      ingredients: [mockConstructorMain],
    };
    const action = removeIngredient('main-1');
    const result = constructorReducer(stateWithMain, action);
    expect(result.ingredients.length).toBe(0);
  });

  test('должен обработать экшен clearConstructor', () => {
    const stateWithModal: TConstructorSliceState = {
      ...initialState,
      orderModalData: mockOrder,
    };
    const action = clearConstructor();
    const result = constructorReducer(stateWithModal, action);
    expect(result.orderModalData).toBeNull();
  });

  test('должен обработать экшен moveIngredient', () => {
    const stateWithTwo: TConstructorSliceState = {
      ...initialState,
      ingredients: [mockConstructorMain, { ...mockConstructorMain, id: 'main-2' }],
    };
    const action = moveIngredient({ dragIndex: 0, hoverIndex: 1 });
    const result = constructorReducer(stateWithTwo, action);
    expect(result.ingredients[0].id).toBe('main-2');
  });

  test('должен обработать экшен createOrder.pending', () => {
    const action = { type: createOrder.pending.type };
    const result = constructorReducer(initialState, action);
    expect(result.orderRequest).toBe(true);
    expect(result.error).toBeNull();
  });

  test('должен обработать экшен createOrder.fulfilled', () => {
    const action = {
      type: createOrder.fulfilled.type,
      payload: mockOrder,
    };
    const result = constructorReducer(initialState, action);
    expect(result.orderRequest).toBe(false);
    expect(result.orderModalData).toEqual(mockOrder);
    expect(result.bun).toBeNull();
    expect(result.ingredients).toEqual([]);
  });

  test('должен обработать экшен createOrder.rejected', () => {
    const action = {
      type: createOrder.rejected.type,
      error: { message: 'Ошибка заказа' },
    };
    const result = constructorReducer(initialState, action);
    expect(result.orderRequest).toBe(false);
    expect(result.error).toBe('Ошибка заказа');
  });
});
