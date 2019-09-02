import { useState, useEffect } from 'react';

import { useAsyncData } from '@/hooks/useAsyncData';
import { SimpleList, SimpleListItem } from '@/components/SimpleList';
import { SearchForm } from '@/components/SearchForm';

const defaultQuery = 'react';

export default () => {
  const [query, setQuery] = useState(defaultQuery);

  const [state, fetchData] = useAsyncData<SimpleListItem[]>(
    {
      url: 'https://hn.algolia.com/api/v1/search',
      params: {
        query,
      },
      transformData: ({ hits }) => hits,
    },
    [query],
    []
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <section>
      <SearchForm defaultQuery={query} setQuery={setQuery}></SearchForm>

      <SimpleList items={state.value} loading={state.loading} error={state.error}></SimpleList>
    </section>
  );
};
