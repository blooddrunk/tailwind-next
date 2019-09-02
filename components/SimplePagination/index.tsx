import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Pagination } from '@/hooks/useList';

import './simple-pagination.scss';

export type SimplePaginationProps = {
  page: number;
  rowsPerPage: number;
  total: number;
  onUpdate: (payload: Pagination) => void;
};

export const SimplePagination = ({ page, rowsPerPage, total, onUpdate }: SimplePaginationProps) => {
  const pagesCount = Math.ceil(total / rowsPerPage);

  return (
    <nav>
      <ul className="tw-flex tw-py-3">
        <li className="tw-flex-grow tw-flex tw-text-center">
          <button
            className="SimplePagination__button"
            disabled={page <= 1}
            onClick={() => {
              onUpdate({
                page: page - 1,
              });
            }}
          >
            <FontAwesomeIcon icon="chevron-left"></FontAwesomeIcon>
          </button>
        </li>

        <li className="tw-flex-grow tw-flex tw-text-center">
          <button
            className="SimplePagination__button"
            disabled={page >= pagesCount}
            onClick={e => {
              onUpdate({
                page: page + 1,
              });
            }}
          >
            <FontAwesomeIcon icon="chevron-right"></FontAwesomeIcon>
          </button>
        </li>
      </ul>
    </nav>
  );
};
