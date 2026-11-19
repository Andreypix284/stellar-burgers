import { FeedInfoUI } from '@ui';

import { useSelector } from '../../services/store';

import type { RootState } from '../../services/store';
import type { TOrder } from '@utils-types';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo = (): React.JSX.Element => {
  // Берем данные из Redux
  const feed = useSelector((state: RootState) => state.feed);
  const { orders } = feed;

  const readyOrders = getOrders(orders, 'done');
  const pendingOrders = getOrders(orders, 'created');

  return (
    <FeedInfoUI readyOrders={readyOrders} pendingOrders={pendingOrders} feed={feed} />
  );
};
