import React from 'react';
import axios, { AxiosError } from 'axios';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { NavigateFunction } from 'react-router-dom';

import { LoginResponseDto, RefreshTokenDto, TokenData } from '../helpers/dto';

type UserAction = 'LOGIN_SUCCESS' | 'REFRESH_TOKEN_SUCCESS' | 'SIGN_OUT_SUCCESS' | 'AUTH_FAILURE';

interface Action {
  type: UserAction;
  payload?: any;
}

interface UserState {
  isFetching: boolean;
  errorMessage: string;
  token: string | null;
  refreshToken: string | null;
  currentUser: TokenData | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  isFetching: false,
  errorMessage: '',
  token: localStorage.getItem('token'),
  refreshToken: localStorage.getItem('refreshToken'),
  currentUser: (() => {
    const raw = localStorage.getItem('user');
    return raw ? (JSON.parse(raw) as TokenData) : null;
  })(),
  isAuthenticated: false
};

const userReducer = (state: UserState, action: Action): UserState => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return { ...state, ...action.payload, isAuthenticated: true, isFetching: false, errorMessage: '' };
    case 'REFRESH_TOKEN_SUCCESS':
      return { ...state, ...action.payload };
    case 'SIGN_OUT_SUCCESS':
      return { ...initialState, token: null, refreshToken: null, currentUser: null, isAuthenticated: false };
    case 'AUTH_FAILURE':
      return { ...state, isFetching: false, errorMessage: action.payload ?? 'Auth error' };
    default:
      return state;
  }
};

type UserDispatch = React.Dispatch<Action>;
const noopDispatch: UserDispatch = () => null;

const UserContext = React.createContext<{ state: UserState; dispatch: UserDispatch }>({
  state: initialState,
  dispatch: noopDispatch
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = React.useReducer(userReducer, {
    ...initialState,
    isAuthenticated: hasValidRefreshToken()
  });

  // установить axios-интерсепторы один раз
  React.useEffect(() => setInterceptor(dispatch), []);

  return <UserContext.Provider value={{ state, dispatch }}>{children}</UserContext.Provider>;
};

export const useUserState = (): UserState => React.useContext(UserContext).state;
export const useUserDispatch = (): UserDispatch => React.useContext(UserContext).dispatch;

/** ====== AUTH API (login / refresh / logout) ====== **/

export async function loginUser(
  dispatch: UserDispatch,
  email: string,
  password: string,
  setLoading: (v: boolean) => void,
  setError: (v: string) => void,
  navigate: NavigateFunction
): Promise<void> {
  setError('');
  setLoading(true);
  if (!email || !password) {
    setLoading(false);
    dispatch({ type: 'AUTH_FAILURE', payload: 'Введите email и пароль' });
    return;
  }

  try {
    const { data } = await axios.post('/auth/login', { email, password });
    const loginResponse = data as LoginResponseDto;

    const { token, refreshToken, user } = receiveToken(loginResponse);

    // при желании можно ограничить вход только для ролей
    if (user.role === 'Admin') {
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { token, refreshToken, currentUser: user }
      });
      setLoading(false);
      navigate('/');
    } else {
      setLoading(false);
      setError('Недопустимая роль пользователя');
    }
  } catch (err) {
    setLoading(false);
    if (err instanceof AxiosError && err.response?.status === 401) {
      setError('Неверный email или пароль');
    } else {
      setError((err as any)?.response?.data?.message ?? 'Ошибка сервера');
    }
  }
}

export async function signOut(dispatch: UserDispatch, navigate: NavigateFunction): Promise<void> {
  try {
    await axios.post('/auth/logout');
  } catch {
    // игнорируем сетевую ошибку на логаут
  }
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  dispatch({ type: 'SIGN_OUT_SUCCESS' });
  navigate('/login');
}

async function refreshToken(dispatch: UserDispatch, rToken: string) {
  const { data } = await axios.post('/auth/refreshToken', { refreshToken: rToken });
  const refreshResponse = data as RefreshTokenDto;
  const { token, refreshToken: newRefresh, user } = receiveToken(refreshResponse);
  dispatch({
    type: 'REFRESH_TOKEN_SUCCESS',
    payload: { token, refreshToken: newRefresh, currentUser: user }
  });
}

/** ====== Axios interceptors & helpers ====== **/

function setInterceptor(dispatch: UserDispatch) {
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) config.headers['Authorization'] = `Bearer ${token}`;
      return config;
    },
    (error) => Promise.reject(error)
  );

  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalConfig = error.config || {};
      const rToken = localStorage.getItem('refreshToken');

      if (
        error?.response?.status === 401 &&
        !originalConfig._retry &&
        rToken &&
        !(String(originalConfig.url) || '').endsWith('/auth/refreshToken')
      ) {
        originalConfig._retry = true;
        try {
          await refreshToken(dispatch, rToken);
          return axios(originalConfig);
        } catch (e) {
          // если рефреш провалился — чистим сторедж и перезагружаем
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return Promise.reject(e);
        }
      }
      return Promise.reject(error);
    }
  );
}

function hasValidRefreshToken(): boolean {
  const r = localStorage.getItem('refreshToken');
  const u = localStorage.getItem('user');
  if (!r || !u) return false;
  try {
    const decoded = jwtDecode(r) as JwtPayload | null;
    if (!decoded?.exp) return false;
    const now = Date.now() / 1000;
    const user: TokenData = JSON.parse(u);
    // базовая проверка роли из твоей схемы
    const roleOk = user.role === 'User' || user.role === 'Admin';
    return roleOk && now < decoded.exp;
  } catch {
    return false;
  }
}

function receiveToken(data: LoginResponseDto | RefreshTokenDto): {
  token: string;
  refreshToken: string;
  user: TokenData;
} {
  const { authToken, refreshToken } = data;
  const user = jwtDecode(authToken) as TokenData;

  localStorage.setItem('token', authToken);
  localStorage.setItem('refreshToken', refreshToken);
  localStorage.setItem('user', JSON.stringify(user));

  return { token: authToken, refreshToken, user };
}
