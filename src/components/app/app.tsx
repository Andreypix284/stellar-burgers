import {
  AppHeader,
  Modal,
  OrderInfo,
  IngredientDetails,
  ProtectedRoute,
} from '@components';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404,
} from '@pages';
import { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom'; // <--- Добавили useNavigate

import { checkUserAuth } from '../../services/slices/userSlice';
import { useSelector, useDispatch } from '../../services/store';

import '../../index.css';

import styles from './app.module.css';

const App = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // <--- Хук для навигации
  const { isAuthChecked } = useSelector((state) => state.user);

  useEffect(() => {
    void dispatch(checkUserAuth());
  }, [dispatch]);

  if (!isAuthChecked) {
    return <div className={styles.app} />;
  }

  // Функция закрытия модалки
  const closeModal = (): void => {
    void navigate(-1);
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes>
        <Route path="/" element={<ConstructorPage />} />
        <Route path="/feed" element={<Feed />} />

        <Route
          path="/feed/:number"
          element={
            <Modal title="Информация о заказе" onClose={closeModal}>
              {' '}
              {/* <--- Заменили */}
              <OrderInfo />
            </Modal>
          }
        />
        <Route
          path="/ingredients/:id"
          element={
            <Modal title="Детали ингредиента" onClose={closeModal}>
              {' '}
              {/* <--- Заменили */}
              <IngredientDetails />
            </Modal>
          }
        />

        {/* Публичные страницы (только для гостей) */}
        <Route
          path="/login"
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />

        {/* Защищенные страницы (только для авторизованных) */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/orders"
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/orders/:number"
          element={
            <ProtectedRoute>
              <Modal title="Информация о заказе" onClose={closeModal}>
                {' '}
                {/* <--- Заменили */}
                <OrderInfo />
              </Modal>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound404 />} />
      </Routes>
    </div>
  );
};

export default App;
