import axios from 'axios';
import { isLoggedIn } from '../utils/auth';
import ServiceError from './service.error';

const customAxios = axios.create({
  baseURL: `${process.env.BACKEND_BASE_URL}`,
  timeout: 20000,
});

const setclientCredentials = async () => {
  const {
    data: { data },
  } = await axios.post(
    `${process.env.BACKEND_BASE_URL}/api/v1/connect/token`,
    {
      client_id: process.env.REACT_APP_CLIENT_ID,
    }
  );
  sessionStorage.setItem('clientCredentials', data.client_token);
};

let isclientCredentialsRefreshed = false;

customAxios.interceptors.response.use(
  (response) => {
    if (response.status === 401) {
      window.location = '/login';
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
    } else if (response.status === 402) {
      console.log(767676);
      window.location = '/';
    }

    return response;
  },
  async (error) => {
    if (error.response?.data.code === 401) {
      if (error.response?.data.data.error === 'invalid client_token') {
        if (!isclientCredentialsRefreshed) {
          await setclientCredentials();
          isclientCredentialsRefreshed = true;
          const { request } = error;
          request.config.headers.Authorization = `Bearer ${sessionStorage.getItem(
            'clientCredentials'
          )}`;
          const ret = await customAxios.request(request.config);
          return ret;
        }
        isclientCredentialsRefreshed = false;
      }
    } else if (error.response?.data.code === 402) {
      console.log(787878);
    }
    return Promise.reject(error.response?.data);
  }
);

customAxios.interceptors.request.use(
  async (request) => {
    if (request.headers.auth) {
      if (!isLoggedIn('accessToken')) {
        const refreshToken = sessionStorage.getItem('refreshToken');
        if (refreshToken) {
          try {
            const { data } = await customAxios.post(
              'auth/refresh-token',
              { refreshToken: refreshToken },
              { headers: { isClientCredentials: true } }
            );
            sessionStorage.setItem('accessToken', data.accessToken);
          } catch (e) {
            console.error('Erro ao renovar o token:', e, '88888888888888llllllllllllllll');
            sessionStorage.removeItem('accessToken');
            sessionStorage.removeItem('refreshToken');
            sessionStorage.setItem('redirectUrl', window.location.pathname);
            window.location = '/login';
            throw new ServiceError('Usuário não autenticado', 'not_auth');
          }
        } else {
          sessionStorage.setItem('redirectUrl', window.location.pathname);
          window.location = '/login';
          throw new ServiceError('Usuário não autenticado', 'not_auth');
        }
      }

      request.headers.Authorization = `Bearer ${sessionStorage.getItem('accessToken')}`;
      return request;
    }
    return request;
  },
  (error) => Promise.reject(error)
);

export default customAxios; 
