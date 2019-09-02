import isPlainObject from 'lodash/isPlainObject';
import { AxiosInstance } from 'axios';

const isDev = process.env.NODE_ENV === 'development';

const defaultDataTransformer = data => data;

// TODO: deal with response
const validateResponse = response => {
  if (!isPlainObject(response)) {
    return response;
  }

  const { code = 0, message = '未知错误', ...rest } = response;
  switch (`${code}`) {
    case '0':
      return rest;

    default: {
      throw new Error(message);
    }
  }
};

// TODO: default with status
const validateStatus = ({ status }) => {
  return `服务异常: ${status}`;
};

export default (axiosInstance: AxiosInstance) => {
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
    const { transformPayload } = config;

    if (typeof transformPayload === 'function') {
      config = {
        ...config,
        ...transformPayload(config),
      };
    }

    config = {
      ...config,
      method: 'get',
    };

    if (!config.url) {
      throw new Error('URL is missing in request!');
    }

    config.url = config.url.replace(/(?<=[^:\s])[\/]{2,}/, '/');

    if (isDev) {
      const mockApiPrefx = process.env.MOCK_API_PREFIX;

      // it is a mock api call
      if (config.url.startsWith(`${mockApiPrefx}`)) {
        config.baseURL = '/';
      }
    }

    return config;
  }, onError);

  axiosInstance.interceptors.response.use(response => {
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
