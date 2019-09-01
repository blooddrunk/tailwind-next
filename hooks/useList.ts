import { DependencyList, useCallback, useReducer } from 'react';
import Axios, { AxiosRequestConfig } from 'axios';
import { useMountedState } from 'react-use';

import { getDefaultRequestId } from '@/plugins/axios';
import { useAxios } from '@/context/axios';
import { useId } from './useId';

export type Pagination = {
  page: number;
  rowsPerPage: number;
};

export type ListState<T = any> = {
  loading: boolean;
  error?: Error;
  items: T[];
  total: number;
  pagination?: Pagination;
};

export const defaultListState: ListState = {
  loading: false,
  items: [],
  total: 0,
  pagination: {
    page: 1,
    rowsPerPage: 20,
  },
};

type Action =
  | { type: 'request' }
  | { type: 'success'; payload: Pick<ListState, 'items' | 'total'> }
  | { type: 'failure'; payload: Error };

const reducer = (state: ListState, action: Action): ListState => {
  switch (action.type) {
    case 'request':
      return {
        ...state,
        loading: true,
      };
    case 'success':
      return {
        ...state,
        ...action.payload,
        loading: false,
      };
    case 'failure':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      throw new Error();
  }
};

const normalizeResponse = response => {
  const error = new Error(
    `[fetchList] expects response to be an array or object with both 'items' and 'total' key, check your api and data transformer`
  );

  if (!response) {
    throw error;
  }

  let items, total;

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

export const useList = <Result extends any = any>(
  config: AxiosRequestConfig,
  deps: DependencyList = [],
  initialState: ListState<Result> = defaultListState
) => {
  const id = useId();
  const [state, dispatch] = useReducer(reducer, initialState);
  const axios = useAxios();
  const isMounted = useMountedState();

  const callback = useCallback(async () => {
    dispatch({ type: 'request' });
    config = {
      cancellable: `${getDefaultRequestId(config)}_${id}`,
      ...config,
    };

    try {
      const { data } = await axios.request<Result>(config);
      if (isMounted()) {
        dispatch({ type: 'success', payload: normalizeResponse(data) });
      }
    } catch (error) {
      if (!Axios.isCancel(error)) {
        console.error(error);

        if (isMounted()) {
          dispatch({ type: 'failure', payload: error });
        }
      }

      return error;
    }
  }, deps);

  return [state, callback] as const;
};
