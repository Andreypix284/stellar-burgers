import { IngredientDetails } from '@components';

import styles from './ingredient-details.module.css';
export const IngredientDetailsPage = (): React.JSX.Element => (
  <div className={styles.container}>
    <h1 className="text text_type_main-large mt-10 mb-5">Детали ингредиента</h1>
    <IngredientDetails />
  </div>
);
