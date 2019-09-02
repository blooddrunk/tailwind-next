import merge from 'lodash/merge';
import { AxiosRequestConfig } from 'axios';

import { Pagination } from '.';

export const defaultPayloadTransformer = payload => payload;

export const normalizeRequest = (config: AxiosRequestConfig, { pagination }: { pagination?: Pagination }) => {
  config.method = config.method || 'get';

  let payloadWrapper: { params?: Pagination } | { data?: Pagination };
  if (config.method.toLowerCase() === 'get') {
    payloadWrapper = { params: pagination };
  } else {
    payloadWrapper = { data: pagination };
  }

  if (!config.transformPayload) {
    config.transformPayload = defaultPayloadTransformer;
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
