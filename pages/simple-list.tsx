import { useEffect } from 'react';
import { useAsyncFn } from 'react-use';

import { useAxios } from '@/context';
import { SimpleList, SimpleListItem } from '@/components/SimpleList';

export default () => {
  const axios = useAxios();

  const [state, fetchData] = useAsyncFn<SimpleListItem[]>(async () => {
    const { data } = await axios.get('https://hn.algolia.com/api/v1/search', {
      params: {
        query: '',
      },
      transformData: ({ hits }) => hits,
    });
    return data;
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return <SimpleList items={state.value} loading={state.loading}></SimpleList>;
};
