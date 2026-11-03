import { LoginUI } from '@ui-pages';
import { type SyntheticEvent, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { loginUser } from '../../services/slices/userSlice';
import { useSelector, useDispatch } from '../../services/store';

import type { RootState } from '../../services/store';

export const Login = (): React.JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // ЯВНО УКАЗЫВАЕМ ТИП RootState
  const { error, user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (user) {
      // Безопасно достаем pathname
      const state = location.state as { from?: { pathname: string } } | null;
      const from = state?.from?.pathname ?? '/'; // Используем ?? вместо ||

      void navigate(from, { replace: true }); // void для navigate
    }
  }, [user, navigate, location]);

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    void dispatch(loginUser({ email, password })); // void для dispatch
  };

  return (
    <LoginUI
      errorText={error ?? ''} // Используем ?? вместо ||
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
