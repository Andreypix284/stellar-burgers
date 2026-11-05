import { Preloader } from '@ui';
import { Navigate, useLocation } from 'react-router-dom';

import { useSelector } from '../../services/store';

import type { ReactElement } from 'react';

type ProtectedRouteProps = {
  children: ReactElement;
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({
  children,
  onlyUnAuth,
}: ProtectedRouteProps): ReactElement => {
  const { user, isAuthChecked } = useSelector((state) => state.user);
  const location = useLocation();

  // Пока проверяем токен при загрузке, показываем лоадер
  if (!isAuthChecked) {
    return <Preloader />;
  }

  // Если страница только для авторизованных (профиль, заказы)
  if (!onlyUnAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Если страница только для НЕавторизованных (логин, регистрация)
  if (onlyUnAuth && user) {
    return <Navigate to="/" replace />;
  }

  return children;
};
