import ObjectUtil from '../utils/object-util';
import customAxios from './middleware';
import ServiceError from './service.error';

export default class ServiceBase {
  constructor(authenticationType = 'user', config = {}) {
    if (authenticationType !== 'noAuth') {
      this.defaultConfig = { headers: { isAuth: true }, ...config };
    } else {
      this.defaultConfig = config;
    }
  }

  get(url, config = {}) {
    return this.request('get', url, undefined, config);
  }

  post(url, payload, config = {}) {
    return this.request('post', url, payload, config);
  }

  put(url, payload, config = {}) {
    return this.request('put', url, payload, config);
  }

  patch(url, payload, config = {}) {
    return this.request('patch', url, payload, config);
  }

  delete(url, config = {}) {
    return this.request('delete', url, config);
  }


  async request(method, url, payload, config) {
    try {
      let response;
      const requestConfig = ObjectUtil.mergeDeep(
        {},
        config,
        this.defaultConfig
      );
      if (['post', 'put', 'patch'].includes(method)) {
        response = await customAxios[method](url, payload, requestConfig);
      } else {
        response = await customAxios[method](url, requestConfig);
      }
      let data;
      if (!response?.data?.data) {
        data = response.data;
      } else {
        data = response.data.data;
      }
      console.log(data, 33);
      if (requestConfig.getWPPageCount)
        data = {
          data,
          pagesInfo: {
            count: response.headers.get('X-WP-Total'),
            WPTotal: response.headers.get('WP-Total'),
          },
        };

      return data;
    } catch (error) {
      process.env.NODE_ENV !== 'production' && console.error(3030, error);
      if (error?.response?.data) {
        const { data } = error.response;
        process.env.NODE_ENV !== 'production' && console.log(data, 'hm2');
        if (data?.message && data?.type) {
          if (data.type === 'PAYMENT_REQUIRED') {
            console.log(737373);
            window.location = '/pagamento';
          }
          throw new ServiceError(data.message, data.type);
        }
      }
      if (error?.message && error?.type) {
        if (error.type === 'PAYMENT_REQUIRED') {
          console.log(737373);
          window.location = '/pagamento?atualizar=true';
        }
        throw new ServiceError(error.message, error.type);
      }

      throw new ServiceError(
        'Não foi possível realizar a operação, por favor tente novamente',
        'UNKNOW'
      );
    }
  }
}
