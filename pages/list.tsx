import { useState, useEffect } from 'react';

import { useList } from '@/hooks/useList';
import { SimpleList, SimpleListItem } from '@/components/SimpleList';
import { SearchForm } from '@/components/SearchForm';
import { SimplePagination } from '@/components/SimplePagination';

const defaultQuery = 'react';

export default () => {
  const [query, setQuery] = useState(defaultQuery);

  const [state, fetchData, dispatch] = useList<SimpleListItem[]>(
    {
      url: 'https://hn.algolia.com/api/v1/search',
      params: {
        query,
      },
      transformData: ({ hits, nbHits }) => ({
        items: hits,
        total: nbHits,
      }),
      transformPayload: ({ params }) => {
        const newParams = {
          ...params,
          hitsPerPage: params.rowsPerPage,
        };

        delete newParams.rowsPerPage;

        return {
          params: newParams,
        };
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
      <SearchForm defaultQuery={defaultQuery} setQuery={setQuery}></SearchForm>

      <SimpleList items={state.items} loading={state.loading} error={state.error}></SimpleList>

      <SimplePagination
        page={pagination.page}
        rowsPerPage={pagination.rowsPerPage}
        total={state.total}
        onUpdate={payload => {
          dispatch({ type: 'updatePagination', payload });
        }}
      ></SimplePagination>
    </section>
  );
};
