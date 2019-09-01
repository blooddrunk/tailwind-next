import Axios from 'axios';
import consola from 'consola';

import { patchCancellable, setupDebugInterceptor } from './helpers';
import customizeAxios from './customize';

const isDev = process.env.NODE_ENV === 'development';
const apiRoot = process.env.API_ROOT;

const headers = {
  common: {
    Accept: 'application/json, text/plain, */*',
  },
};

const axios = Axios.create({
  baseURL: apiRoot,
  headers,
});

patchCancellable(axios, {
  debug: isDev,
  logger: consola.info,
});

if (isDev) {
  setupDebugInterceptor(axios);
}

customizeAxios(axios);

export default axios;
export * from './helpers';
export * from './RequestManager';
