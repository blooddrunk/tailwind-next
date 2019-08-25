export type SimpleListItem = {
  objectID: string | number;
  title: string;
  url: string;
};

export type SimpleListProps = {
  items?: SimpleListItem[];
  loading?: boolean;
  error?: Error | null;
};

export const SimpleList = ({ items = [], loading = false, error }: SimpleListProps) => {
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Something went wrong...</div>;
  }

  return (
    <ul>
      {items.map(item => {
        return (
          <li key={item.objectID}>
            <a className="hover:tw-underline" href={item.url} target="_blank">
              {item.title}
            </a>
          </li>
        );
      })}
    </ul>
  );
};
