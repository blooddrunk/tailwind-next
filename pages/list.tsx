import { useState, useEffect } from 'react';

import { useList, Payload } from '@/hooks/useList';
import { SimpleList, SimpleListItem } from '@/components/SimpleList';
import { SearchForm } from '@/components/SearchForm';
import { SimplePagination } from '@/components/SimplePagination';

export default () => {
  const [query, setQuery] = useState('react');

  const [state, fetchData, dispatch] = useList<SimpleListItem[]>(
    {
      url: 'https://hn.algolia.com/api/v1/search',
      params: {
        query,
      },
      transformData: ({ hits }) => hits,
      parseFilter: ({ rowsPerPage, ...rest }) => {
        const payload: Payload = {
          hitsPerPage: rowsPerPage,
          ...rest,
        };

        delete payload.rowsPerPage;

        return payload;
      },
    },
    [query]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const { pagination } = state;

  return (
    <section>
      <SearchForm query={query} setQuery={setQuery} onSearch={fetchData}></SearchForm>

      <SimpleList items={state.items} loading={state.loading} error={state.error}></SimpleList>

      <SimplePagination
        page={pagination.page}
        rowsPerPage={pagination.rowsPerPage}
        onUpdate={payload => {
          dispatch({ type: 'updatePagination', payload });
        }}
      ></SimplePagination>
    </section>
  );
};
