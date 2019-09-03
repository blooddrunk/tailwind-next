import { useState, useEffect } from 'react';
import { Table } from 'antd';
import { ColumnProps } from 'antd/es/table';

import { useList } from '@/hooks/useList';
import { SimpleListItem } from '@/components/SimpleList';
import { SearchFormAntd } from '@/components/SearchFormAntd';

const defaultQuery = 'react';

const columns: ColumnProps<SimpleListItem>[] = [
  {
    title: 'Name',
    dataIndex: 'title',
    render: (text, record) => (
      <span>
        <a className="hover:tw-underline" href={record.url} target="_blank">
          {text}
        </a>
      </span>
    ),
  },
];

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
      <SearchFormAntd
        defaultQuery={defaultQuery}
        onSearch={search => {
          dispatch({
            type: 'resetPagination',
          });
          setQuery(search);
        }}
      ></SearchFormAntd>

      <Table
        rowKey="objectID"
        showHeader={false}
        columns={columns}
        dataSource={state.items}
        loading={state.loading}
        pagination={{
          total: state.total,
          current: pagination.page,
          pageSize: pagination.rowsPerPage,
          onChange: page => {
            dispatch({
              type: 'updatePagination',
              payload: {
                page,
              },
            });
          },
        }}
      ></Table>
    </section>
  );
};
