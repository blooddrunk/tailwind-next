import { useState } from 'react';

export type SearchFormProps = {
  defaultQuery: string;
  onSearch: (search: string) => void;
};

export const SearchForm = ({ defaultQuery, onSearch }: SearchFormProps) => {
  const [search, setSearch] = useState(defaultQuery);

  return (
    <form
      className="tw-py-3"
      onSubmit={event => {
        event.preventDefault();
        onSearch(search);
      }}
    >
      <input
        className="tw-shadow tw-appearance-none tw-border tw-rounded tw-w-64 tw-py-2 tw-px-3 tw-text-gray-700 tw-leading-tight focus:tw-outline-none focus:tw-shadow-outline"
        value={search}
        onChange={event => setSearch(event.target.value)}
        type="text"
        placeholder="Search"
      />

      <button
        className="tw-ml-3 tw-bg-blue-500 hover:tw-bg-blue-700 tw-text-white tw-font-bold tw-py-2 tw-px-4 tw-rounded"
        type="submit"
      >
        Search
      </button>
    </form>
  );
};
