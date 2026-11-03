import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import {
  loginUserApi,
  registerUserApi,
  getUserApi,
  logoutApi,
  type TLoginData,
  type TRegisterData,
} from '../../utils/burger-api';
import { setCookie, deleteCookie, getCookie } from '../../utils/cookie';

import type { TUser } from '../../utils/types';

export type TUserState = {
  isAuthChecked: boolean;
  user: TUser | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: TUserState = {
  isAuthChecked: false,
  user: null,
  isLoading: false,
  error: null,
};

export const loginUser = createAsyncThunk('user/login', async (data: TLoginData) => {
  const res = await loginUserApi(data);
  setCookie('accessToken', res.accessToken);
  localStorage.setItem('refreshToken', res.refreshToken);
  return res.user;
});

export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => {
    const res = await registerUserApi(data);
    setCookie('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    return res.user;
  }
);

export const logoutUser = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

export const checkUserAuth = createAsyncThunk(
  'user/checkAuth',
  async (_, { dispatch }) => {
    if (getCookie('accessToken') || localStorage.getItem('refreshToken')) {
      try {
        const res = await getUserApi();
        dispatch(setUser(res.user));
      } catch (_error) {
        void dispatch(logoutUser());
      }
    }
    return null;
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload as TUser;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка входа';
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка регистрации';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(checkUserAuth.fulfilled, (state) => {
        state.isAuthChecked = true;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.isAuthChecked = true;
      });
  },
});

export const { setUser } = userSlice.actions;
export const userReducer = userSlice.reducer;
