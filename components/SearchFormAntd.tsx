import { useState } from 'react';
import { Form, Button, Input } from 'antd';

export type SearchFormProps = {
  defaultQuery: string;
  onSearch: (search: string) => void;
};

export const SearchFormAntd = ({ defaultQuery, onSearch }: SearchFormProps) => {
  const [search, setSearch] = useState(defaultQuery);

  return (
    <Form
      layout="inline"
      onSubmit={event => {
        event.preventDefault();
        onSearch(search);
      }}
    >
      <Form.Item>
        <Input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Search
        </Button>
      </Form.Item>
    </Form>
  );
};
