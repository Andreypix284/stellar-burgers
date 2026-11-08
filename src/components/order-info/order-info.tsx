import { Preloader, OrderInfoUI } from '@ui';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { fetchOrderByNumber } from '../../services/slices/orderInfoSlice';
import { useSelector, useDispatch } from '../../services/store';

import type { RootState } from '../../services/store';
import type { TIngredient } from '@utils-types';

export const OrderInfo = (): React.JSX.Element => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();

  const { order: orderInfoState, isLoading } = useSelector(
    (state: RootState) => state.orderInfo
  );
  const { ingredients } = useSelector((state: RootState) => state.ingredients);
  const { orders: feedOrders } = useSelector((state: RootState) => state.feed);
  const { orders: userOrders } = useSelector((state: RootState) => state.orders);

  // Ищем заказ в загруженных массивах (feed или orders) по номеру
  const orderFromStore = useMemo(() => {
    if (!number) return null;
    const num = Number(number);
    return (
      feedOrders.find((o) => o.number === num) ??
      userOrders.find((o) => o.number === num) ??
      null
    );
  }, [number, feedOrders, userOrders]);

  // Итоговый заказ: либо из стора, либо из orderInfoState (загруженный по API)
  const order = orderFromStore ?? orderInfoState;

  useEffect(() => {
    // Запрашиваем с сервера только если заказа нет в сторе
    if (number && !orderFromStore) {
      void dispatch(fetchOrderByNumber(Number(number)));
    }
  }, [dispatch, number, orderFromStore]);

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
