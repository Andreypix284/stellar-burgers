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

  const { bun, ingredients, orderRequest, orderModalData } = useSelector(
    (state: RootState) => state.burgerConstructor
  );

  const constructorItems = {
    bun: bun ?? null,
    ingredients: ingredients || [],
  };
  const { user } = useSelector((state: RootState) => state.user);

  const onOrderClick = (): void => {
    if (!constructorItems.bun || orderRequest) return;

    if (!user) {
      void navigate('/login');
      return;
    }

    const ingredientsId = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item: TConstructorIngredient) => item._id),
      constructorItems.bun._id,
    ];

    void dispatch(createOrder(ingredientsId));
  };

  const closeOrderModal = (): void => {
    dispatch(clearConstructor(undefined)); // Закрывает модалку (orderModalData = null)
  };

  const price = useMemo(
    () =>
      (bun ? bun.price * 2 : 0) +
      ingredients.reduce((s: number, v: TConstructorIngredient) => s + v.price, 0),
    [bun, ingredients] // ЗАВИСИМОСТИ ОТ ЗНАЧЕНИЙ ИЗ REDUX
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
