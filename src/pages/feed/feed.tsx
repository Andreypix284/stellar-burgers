import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useEffect } from 'react';

import { fetchFeeds } from '../../services/slices/feedSlice';
import { useSelector, useDispatch } from '../../services/store';

import type { RootState } from '../../services/store';

export const Feed = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const { orders, isLoading } = useSelector((state: RootState) => state.feed);

  // Загружаем ленту при первом рендере
  useEffect(() => {
    void dispatch(fetchFeeds());
  }, [dispatch]);

  // Функция для кнопки «Обновить»
  const handleGetFeeds = (): void => {
    void dispatch(fetchFeeds());
  };

  if (isLoading && !orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
