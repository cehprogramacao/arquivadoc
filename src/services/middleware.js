import axios from 'axios';
import ServiceError from './service.error';
import { isLoggedIn } from '@/utils/auth'; // importa sua função isLoggedIn

const customAxios = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BASE_URL}`,
  timeout: 20000,
});

const setClientCredentials = async () => {
  const {
    data: { data },
  } = await axios.post(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/connect/token`,
    {
      client_id: process.env.REACT_APP_CLIENT_ID,
    }
  );
  localStorage.setItem('clientCredentials', data.client_token);
};

let isClientCredentialsRefreshed = false;

customAxios.interceptors.response.use(
  (response) => {
    if (response.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('redirectUrl');
      localStorage.removeItem('isAdmin');
      window.location.href = '/';
    } else if (response.status === 402) {
      window.location.href = '/pagamento';
    }

    return response;
  },
  async (error) => {
    const status = error.response?.status;
    const code = error.response?.data?.code;
    const data = error.response?.data?.data;

    if (status === 500 && !isLoggedIn()) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('redirectUrl');
      localStorage.removeItem('isAdmin');
      window.location.href = '/';
      return Promise.reject(
        new ServiceError('Sessão expirada, faça login novamente.', 'not_auth')
      );
    }

    if (code === 401 && data?.error === 'invalid client_token') {
      if (!isClientCredentialsRefreshed) {
        isClientCredentialsRefreshed = true;
        await setClientCredentials();
        const originalRequest = error.config;
        originalRequest.headers.Authorization = `Bearer ${localStorage.getItem('clientCredentials')}`;
        return customAxios.request(originalRequest);
      }
      isClientCredentialsRefreshed = false;
    }

    if (code === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.setItem('redirectUrl', window.location.pathname);
      window.location.href = '/';
      return Promise.reject(
        new ServiceError('Sessão expirada, faça login novamente.', 'not_auth')
      );
    }

    return Promise.reject(error.response?.data);
  }
);

customAxios.interceptors.request.use(
  async (request) => {
    if (request.headers.isAuth) {
      delete request.headers.isAuth;
      const accessToken = localStorage.getItem('accessToken');

      if (!accessToken) {
        localStorage.setItem('redirectUrl', window.location.pathname);
        window.location.href = '/';
        throw new ServiceError('Usuário não autenticado', 'not_auth');
      }

      request.headers.Authorization = `Bearer ${accessToken}`;
    }

    return request;
  },
  (error) => Promise.reject(error)
);

export default customAxios;
