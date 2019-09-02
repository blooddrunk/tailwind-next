import { useState, useEffect } from 'react';

import { useAsyncData } from '@/hooks/useAsyncData';
import { SimpleList, SimpleListItem } from '@/components/SimpleList';
import { SearchForm } from '@/components/SearchForm';

export default () => {
  const [query, setQuery] = useState('react');

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
      <SearchForm query={query} setQuery={setQuery} onSearch={fetchData}></SearchForm>

      <SimpleList items={state.value} loading={state.loading} error={state.error}></SimpleList>
    </section>
  );
};
