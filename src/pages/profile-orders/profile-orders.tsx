import { ProfileOrdersUI } from '@ui-pages';
import { useEffect } from 'react';

import { fetchUserOrders } from '../../services/slices/ordersSlice';
import { useSelector, useDispatch } from '../../services/store';

import type { RootState } from '../../services/store';

export const ProfileOrders = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const { orders, isLoading } = useSelector((state: RootState) => state.orders);
  const { isAuthChecked, user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    // Запрашиваем заказы только один раз, если пользователь авторизован и заказов еще нет
    if (isAuthChecked && user && orders.length === 0) {
      void dispatch(fetchUserOrders());
    }
  }, [dispatch, isAuthChecked, user, orders.length]);

  if (isLoading) {
    return <p className="text text_type_main-medium mt-10">Загрузка...</p>;
  }

  return <ProfileOrdersUI orders={orders} />;
};
