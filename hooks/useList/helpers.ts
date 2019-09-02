import merge from 'lodash/merge';
import { AxiosRequestConfig } from 'axios';

import { Pagination, Filter, Payload } from '.';

export const normalizeRequest = (
  config: AxiosRequestConfig,
  {
    filter,
    pagination,
    parseFilter,
  }: { filter?: Filter; pagination?: Pagination; parseFilter?: (payload: Payload) => Payload }
) => {
  config.method = config.method || 'get';

  let payload: Payload = {
    ...pagination,
    ...filter,
  };
  if (typeof parseFilter === 'function') {
    payload = parseFilter(payload);
  }

  let payloadWrapper: { params?: Payload; data?: Payload };
  if (config.method.toLowerCase() === 'get') {
    payloadWrapper = { params: payload };
  } else {
    payloadWrapper = { data: payload };
  }

  config = merge(payloadWrapper, config);

  return config;
};

export const normalizeResponse = response => {
  const error = new Error(
    `[fetchList] expects response to be an array or object with both 'items' and 'total' key, check your api and data transformer`
  );

  if (!response) {
    throw error;
  }

  let items: any[];
  let total: number;

  if (Array.isArray(response)) {
    items = response;
    total = items.length;
  } else {
    ({ items, total = 0 } = response);
  }

  if (!items) {
    throw error;
  }

  return {
    items,
    total,
  };
};
