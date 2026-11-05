import { BurgerConstructorUI } from '@ui';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { createOrder, clearConstructor } from '../../services/slices/constructorSlice';
import { useSelector, useDispatch } from '../../services/store';

import type { RootState } from '../../services/store';
import type { TConstructorIngredient } from '@utils-types';

export const BurgerConstructor = (): React.JSX.Element | null => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Достаем всё из Redux
  const { bun, ingredients, orderRequest, orderModalData } = useSelector(
    (state: RootState) => state.burgerConstructor
  );

  // Собираем в один объект для UI, так как он этого ждет
  const constructorItems = {
    bun: bun ?? null,
    ingredients: ingredients || [],
  };
  const { user } = useSelector((state: RootState) => state.user);

  const onOrderClick = (): void => {
    if (!constructorItems.bun || orderRequest) return;

    // Если не авторизован — на логин
    if (!user) {
      void navigate('/login');
      return;
    }

    // Собираем ID ингредиентов для заказа
    const ingredientsId = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item: TConstructorIngredient) => item._id),
      constructorItems.bun._id, // Булка в начале и в конце
    ];

    // Отправляем заказ
    void dispatch(createOrder(ingredientsId));
  };

  const closeOrderModal = (): void => {
    dispatch(clearConstructor(undefined));
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
