import axios, { AxiosInstance, AxiosRequestConfig, CancelTokenSource, AxiosPromise, Canceler } from 'axios';
import consola from 'consola';

import { RequestManager } from './RequestManager';

type CancellableFnType = {
  (config: any): AxiosPromise;
} & {
  cancel?: Canceler;
};

export const takeLatest = (axiosInstance: AxiosInstance) => {
  let source: CancelTokenSource;

  const cancellableCall: CancellableFnType = config => {
    if (source) {
      source.cancel(`[${config.url}]: Only one request allowed at a time.`);
    }

    source = axios.CancelToken.source();
    cancellableCall.cancel = source.cancel;

    return axiosInstance({
      ...config,
      cancelToken: source.token,
    });
  };

  return cancellableCall;
};

export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  cancellable?: true | string;
}

export interface CustomAxiosInstance extends AxiosInstance {
  cancel?: (requestId: string, reason: string) => void;
  cancelAll?: (reason: string) => void;
}

export const patchCancellable = (axiosInstance: CustomAxiosInstance, { debug = false, logger = console.log } = {}) => {
  const requestManager = new RequestManager({ debug, logger });

  const getRequestId = ({ cancellable, method, url }: CustomAxiosRequestConfig) => {
    let requestId;
    if (cancellable === true) {
      // auto-set requestId
      requestId = `${method}_${url}`;
    } else if (typeof cancellable === 'string') {
      requestId = cancellable;
    }

    return requestId;
  };

  axiosInstance.interceptors.request.use((config: CustomAxiosRequestConfig) => {
    const requestId = getRequestId(config);

    if (requestId) {
      const source = axios.CancelToken.source();
      config.cancelToken = source.token;
      requestManager.add(requestId, source.cancel);
    }

    return config;
  });

  axiosInstance.interceptors.response.use(response => {
    const requestId = getRequestId(response.config);
    if (requestId) {
      requestManager.remove(requestId);
    }

    return response;
  });

  axiosInstance.cancel = (requestId, reason) => {
    requestManager.cancel(requestId, reason);
  };

  axiosInstance.cancelAll = reason => {
    requestManager.cancelAll(reason);
  };
};

export const setupDebugInterceptor = async (axiosInstance: AxiosInstance) => {
  axiosInstance.onError(error => {
    consola.error(error);
  });

  axiosInstance.onResponse(res => {
    consola.success(
      `[${res.status}${res.statusText ? res.statusText : ''}]`,
      `[${res.config.method.toUpperCase()}]`,
      res.config.url
    );

    if (process.browser) {
      consola.info(res);
    } else {
      consola.log(JSON.stringify(res.data, undefined, 2));
    }

    return res;
  });
};
