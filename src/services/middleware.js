import axios from 'axios';
import { isLoggedIn, isclientCredentialsExpired } from '../utils/auth';
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
    process.env.NODE_ENV !== 'production' && console.log('kkk2');
    if (response.status === 401) {
      window.location = '/login';
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
    } else if (response.status === 402) {
      console.log(767676);
      window.location = '/pagamento';
    }

    return response;
  },
  async (error) => {
    if (error.response?.data.code === 401) {
      process.env.NODE_ENV !== 'production' && console.log('kkk');
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
    if (request.headers.isAuth) {
      process.env.NODE_ENV !== 'production' && console.log('kkk34');
      if (!isLoggedIn('accessToken')) {
        process.env.NODE_ENV !== 'production' && console.log('kkk35');
        const refreshToken = sessionStorage.getItem('refreshToken');
        if (refreshToken) {
          try {
            const { data } = await customAxios.post(
              'auth/refresh-token',
              { refreshToken: refreshToken },
              { headers: { isClientCredentials: true } }
            );
            process.env.NODE_ENV !== 'production' &&
              console.log(refreshToken, 1);
            process.env.NODE_ENV !== 'production' && console.log(data, 'data');
            process.env.NODE_ENV !== 'production' &&
              console.log(data.accessToken, 100);
            process.env.NODE_ENV !== 'production' &&
              console.log(data.refreshToken, 200);
            sessionStorage.setItem('accessToken', data.accessToken);
            sessionStorage.setItem('refreshToken', data.refreshToken);
          } catch (e) {
            process.env.NODE_ENV !== 'production' &&
              console.log('erro refreshtoken', e);
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
      process.env.NODE_ENV !== 'production' && console.log('kkk19');
      request.headers.Authorization = `Bearer ${sessionStorage.getItem(
        'accessToken'
      )}`;
      return request;
    }
    return request;
  },
  (error) => Promise.reject(error)
);

export default customAxios;