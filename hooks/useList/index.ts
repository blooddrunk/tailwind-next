import { DependencyList, useCallback, useReducer } from 'react';
import Axios, { AxiosRequestConfig } from 'axios';
import { useMountedState, useUpdateEffect } from 'react-use';

import { getDefaultRequestId } from '@/plugins/axios';
import { useAxios } from '@/context/axios';
import { useId } from '@/hooks/useId';
import { normalizeRequest, normalizeResponse } from './helpers';

export type Pagination = {
  page?: number;
  rowsPerPage?: number;
};

export type Filter = {
  [key: string]: any;
};

export type Payload = Pagination & Filter;

export type ListState<T = any> = {
  loading: boolean;
  error?: Error;
  items: T[];
  total: number;
  pagination: Pagination;
  filter: Filter;
};

export const defaultListState: ListState = {
  loading: false,
  items: [],
  total: 0,
  pagination: {
    page: 1,
    rowsPerPage: 20,
  },
  filter: {},
};

type Action =
  | { type: 'request' }
  | { type: 'success'; payload: Pick<ListState, 'items' | 'total'> }
  | { type: 'failure'; payload: Error }
  | { type: 'updatePagination'; payload: Partial<Pagination> }
  | { type: 'resetPagination' }
  | { type: 'updateFilter'; payload: Pagination }
  | { type: 'clearFilter' };

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
    case 'updatePagination':
      return {
        ...state,
        pagination: {
          ...state.pagination,
          ...action.payload,
        },
      };
    case 'resetPagination':
      return {
        ...state,
        pagination: {
          ...state.pagination,
          page: 1,
        },
      };
    case 'updateFilter':
      return {
        ...state,
        filter: {
          ...state.filter,
          ...action.payload,
        },
      };
    case 'clearFilter':
      return {
        ...state,
        filter: {},
      };
    default:
      throw new Error();
  }
};

export const useList = <Result extends any = any>(
  config: AxiosRequestConfig & { parseFilter?: (payload: Payload) => Payload },
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
      ...normalizeRequest(config, {
        filter: state.filter,
        pagination: state.pagination,
        parseFilter: config.parseFilter,
      }),
    };

    delete config.parseFilter;

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

  useUpdateEffect(() => {
    callback();
  }, [state.pagination]);

  return [state, callback, dispatch] as const;
};
