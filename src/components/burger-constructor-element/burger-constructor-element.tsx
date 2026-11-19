import { BurgerConstructorElementUI } from '@ui';
import { memo } from 'react';

import {
  removeIngredient,
  moveIngredient,
} from '../../services/slices/constructorSlice';
import { useDispatch } from '../../services/store';

import type { BurgerConstructorElementProps } from './type';

export const BurgerConstructorElement = memo(function BurgerConstructorElement({
  ingredient,
  index,
  totalItems,
}: BurgerConstructorElementProps): React.JSX.Element {
  const dispatch = useDispatch();

  const handleMoveDown = (): void => {
    // Перемещаем вниз (если не последний)
    if (index < totalItems - 1) {
      dispatch(moveIngredient({ dragIndex: index, hoverIndex: index + 1 }));
    }
  };

  const handleMoveUp = (): void => {
    // Перемещаем вверх (если не первый)
    if (index > 0) {
      dispatch(moveIngredient({ dragIndex: index, hoverIndex: index - 1 }));
    }
  };

  const handleClose = (): void => {
    // Удаляем ингредиент по его id
    dispatch(removeIngredient(ingredient.id));
  };

  return (
    <BurgerConstructorElementUI
      ingredient={ingredient}
      index={index}
      totalItems={totalItems}
      handleMoveUp={handleMoveUp}
      handleMoveDown={handleMoveDown}
      handleClose={handleClose}
    />
  );
});
