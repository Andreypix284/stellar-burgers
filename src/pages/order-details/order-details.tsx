import { OrderInfo } from '@components';

import styles from './order-details.module.css';
export const OrderDetailsPage = (): React.JSX.Element => (
  <div className={styles.container}>
    <OrderInfo />
  </div>
);
