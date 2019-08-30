import { useState, useEffect } from 'react';

import useAsyncData from '@/hooks/useAsyncData';
import { SimpleList, SimpleListItem } from '@/components/SimpleList';

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
    []
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <section>
      <form
        className="tw-py-3"
        onSubmit={event => {
          event.preventDefault();
        }}
      >
        <input
          className="tw-shadow tw-appearance-none tw-border tw-rounded tw-w-64 tw-py-2 tw-px-3 tw-text-gray-700 tw-leading-tight focus:tw-outline-none focus:tw-shadow-outline"
          value={query}
          onChange={event => setQuery(event.target.value)}
          type="text"
          placeholder="Query"
        />

        <button
          className="tw-ml-3 tw-bg-blue-500 hover:tw-bg-blue-700 tw-text-white tw-font-bold tw-py-2 tw-px-4 tw-rounded"
          onClick={fetchData}
        >
          Search
        </button>
      </form>

      <SimpleList items={state.value} loading={state.loading} error={state.error}></SimpleList>
    </section>
  );
};
