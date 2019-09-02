export const SearchForm = ({ query, setQuery, onSearch }) => {
  return (
    <form
      className="tw-py-3"
      onSubmit={event => {
        event.preventDefault();
        onSearch();
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
        type="submit"
      >
        Search
      </button>
    </form>
  );
};
