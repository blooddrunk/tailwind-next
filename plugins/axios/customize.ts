import isPlainObject from 'lodash/isPlainObject';

import { CustomAxiosInstance, CustomAxiosResponse } from './helpers';

const isDev = process.env.NODE_ENV === 'development';

const defaultDataTransformer = data => data;

// TODO: deal with response
const validateResponse = response => {
  if (!isPlainObject(response)) {
    return response;
  }

  const { errcode = 0, errmsg = '未知错误', ...rest } = response;
  switch (`${errcode}`) {
    case '0':
      return rest;

    default: {
      throw new Error(errmsg);
    }
  }
};

// TODO: default with status
const validateStatus = ({ status }) => {
  return `服务异常: ${status}`;
};

export default (axiosInstance: CustomAxiosInstance) => {
  const onError = error => {
    let handled: boolean | string = false;
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      handled = validateStatus(error.response);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js

      // TODO: request error
      console.error('Request Error');
    }

    error.handled = handled;
    if (typeof handled === 'string') {
      error.message = handled;
    }
    return Promise.reject(error);
  };

  axiosInstance.interceptors.request.use(config => {
    config = {
      ...config,
      method: 'get',
    };

    // FIXME: this will cause bug if url starts with http:// or https://
    config.url = config.url.replace(/[/]{2,}/g, '/');

    if (isDev) {
      const mockApiPrefx = process.env.MOCK_API_PREFIX;

      // it is a mock api call
      if (config.url.startsWith(`${mockApiPrefx}`)) {
        config.baseURL = '/';
      }
    }

    return config;
  }, onError);

  axiosInstance.interceptors.response.use((response: CustomAxiosResponse) => {
    const {
      config: { __needValidation = true, transformData = true },
    } = response;

    if (__needValidation) {
      try {
        response.data = validateResponse(response.data);

        if (typeof transformData === 'function') {
          response.data = transformData(response.data);
        } else if (transformData === true) {
          response.data = defaultDataTransformer(response.data);
        }
      } catch (error) {
        error.config = response.config;
        throw error;
      }
    }

    return response;
  }, onError);
};
