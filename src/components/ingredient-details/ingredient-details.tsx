import { Preloader, IngredientDetailsUI } from '@ui';
import { useParams } from 'react-router-dom';

import { useSelector } from '../../services/store';

import type { RootState } from '../../services/store';

export const IngredientDetails = (): React.JSX.Element => {
  // Получаем id ингредиента из адресной строки (из роута /ingredients/:id)
  const { id } = useParams<{ id: string }>();

  // Достаем все ингредиенты из Redux
  const { ingredients, isLoading } = useSelector(
    (state: RootState) => state.ingredients
  );

  // Ищем нужный ингредиент по id
  const ingredientData = ingredients.find((item) => item._id === id);

  // Если данные еще грузятся, показываем прелоадер
  if (isLoading) {
    return <Preloader />;
  }

  // Если ингредиент не найден (например, неверный id), ничего не рендерим
  if (!ingredientData) {
    return <p className="text text_type_main-medium">Ингредиент не найден</p>;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
