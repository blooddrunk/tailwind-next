import { DependencyList, useCallback, useState } from 'react';
import Axios, { AxiosRequestConfig } from 'axios';
import { useMountedState } from 'react-use';

import { getDefaultRequestId } from '@/plugins/axios';
import { useAxios } from '@/context/axios';
import { useId } from './useId';

export type AsyncState<T> = {
  loading: boolean;
  error?: undefined;
  value?: T;
};

export const useAsyncData = <Result extends any = any>(
  config: AxiosRequestConfig,
  deps: DependencyList = [],
  initialValue?: Result
) => {
  const id = useId();
  const [state, set] = useState<AsyncState<Result>>({
    loading: false,
    value: initialValue,
  });
  const axios = useAxios();
  const isMounted = useMountedState();

  const callback = useCallback(async () => {
    set(prev => ({
      ...prev,
      loading: true,
    }));

    config = {
      cancellable: `${getDefaultRequestId(config)}_${id}`,
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

  const clear = useCallback(() => {
    set({ loading: false, value: initialValue });
  }, [initialValue]);

  return [state, callback, clear] as const;
};
