import { Preloader, OrderInfoUI } from '@ui';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { fetchOrderByNumber } from '../../services/slices/orderInfoSlice';
import { useSelector, useDispatch } from '../../services/store';

import type { RootState } from '../../services/store';
import type { TIngredient } from '@utils-types';

export const OrderInfo = (): React.JSX.Element => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();

  const { order, isLoading } = useSelector((state: RootState) => state.orderInfo);
  const { ingredients } = useSelector((state: RootState) => state.ingredients);

  useEffect(() => {
    if (number) {
      void dispatch(fetchOrderByNumber(Number(number)));
    }
  }, [dispatch, number]);

  // ДОБАВЛЕНО: Загружаем ингредиенты, если их нет
  useEffect(() => {
    if (!ingredients.length) {
      void dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients.length]);

  const orderInfo = useMemo(() => {
    if (!order || !ingredients.length) return null;

    const ingredientsInfo = order.ingredients.reduce(
      (acc: Record<string, TIngredient & { count: number }>, item) => {
        const ingredient = ingredients.find((ing) => ing._id === item);
        if (ingredient) {
          if (!acc[item]) {
            acc[item] = { ...ingredient, count: 1 };
          } else {
            acc[item].count += 1;
          }
        }
        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...order,
      ingredientsInfo,
      total,
      date: new Date(order.createdAt),
    };
  }, [order, ingredients]);

  if (isLoading || !orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
