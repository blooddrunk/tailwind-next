import { DependencyList, useCallback, useState, useRef } from 'react';
import Axios, { AxiosRequestConfig } from 'axios';
import { useMountedState } from 'react-use';
import nanoid from 'nanoid';

import { getDefaultRequestId } from '@/plugins/axios';
import { useAxios } from '@/context/axios';

export type AsyncState<T> =
  | {
      loading: boolean;
      error?: undefined;
      value?: undefined;
    }
  | {
      loading: false;
      error: Error;
      value?: undefined;
    }
  | {
      loading: false;
      error?: undefined;
      value: T;
    };

export default <Result extends any = any>(
  config: AxiosRequestConfig,
  deps: DependencyList = [],
  initialState: AsyncState<Result> = { loading: false }
) => {
  const scope = useRef<string>(nanoid());
  const [state, set] = useState<AsyncState<Result>>(initialState);
  const axios = useAxios();
  const isMounted = useMountedState();

  const callback = useCallback(async () => {
    set({ loading: true });
    config = {
      cancellable: `${getDefaultRequestId(config)}_${scope.current}`,
      ...config,
    };

    try {
      const { data } = await axios.request<Result>(config);
      if (isMounted()) {
        set({ value: data, loading: false });
      }
    } catch (error) {
      if (!Axios.isCancel(error)) {
        console.error(error);

        if (isMounted()) {
          set({ error, loading: false });
        }
      }

      return error;
    }
  }, deps);

  return [state, callback] as const;
};
