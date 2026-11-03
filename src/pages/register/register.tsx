import { RegisterUI } from '@ui-pages';
import { type SyntheticEvent, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { registerUser } from '../../services/slices/userSlice';
import { useSelector, useDispatch } from '../../services/store';

import type { RootState } from '../../services/store';

export const Register = (): React.JSX.Element => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Достаем состояние из Redux
  const { error, user } = useSelector((state: RootState) => state.user);

  // Если регистрация прошла успешно (user появился), редиректим на главную
  useEffect(() => {
    if (user) {
      void navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    // Отправляем данные на сервер через Redux
    void dispatch(registerUser({ name: userName, email, password }));
  };

  return (
    <RegisterUI
      errorText={error ?? ''}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
