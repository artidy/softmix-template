import { memo, ReactElement } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { DEFAULT_LIMIT } from '@project-lib/shared-types';

import { Pagination } from '../../types/pagination';
import { AppRoute } from '../../const';
import { convertSearchParams, getQueryString } from '../../services/helpers';

type PaginationComponentProps = {
  appRoute: AppRoute;
  pagination: Pagination;
};

const SIBLINGS = 1; // сколько страниц показывать слева/справа от текущей
const BOUNDARIES = 1; // сколько страниц всегда показывать у начала и конца

function buildPageList(current: number, total: number): (number | 'dots')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = new Set<number>();
  for (let i = 1; i <= BOUNDARIES; i++) pages.add(i);
  for (let i = total - BOUNDARIES + 1; i <= total; i++) pages.add(i);
  for (let i = current - SIBLINGS; i <= current + SIBLINGS; i++) {
    if (i >= 1 && i <= total) pages.add(i);
  }

  const sorted = Array.from(pages).sort((a, b) => a - b);
  const result: (number | 'dots')[] = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
      result.push('dots');
    }
    result.push(sorted[i]);
  }
  return result;
}

function PaginationComponent({ appRoute, pagination }: PaginationComponentProps): ReactElement | null {
  const [searchParams] = useSearchParams();
  const queryParams = convertSearchParams(searchParams);

  if (!pagination.totalPages || pagination.totalPages <= 1) {
    return null;
  }

  const baseQs = getQueryString(queryParams, ['page', 'limit']);
  const separator = baseQs === '' ? '?' : '&';
  const pageHref = (page: number) =>
    `${appRoute}${baseQs}${separator}page=${page}&limit=${DEFAULT_LIMIT}`;

  const pages = buildPageList(pagination.page, pagination.totalPages);

  return (
    <div className="ltn__pagination-area text-center">
      <div className="ltn__pagination ltn__pagination-2">
        <ul>
          {pagination.prev && (
            <li>
              <Link to={pagination.prev} aria-label="Предыдущая страница">
                <i className="icon-arrow-left" />
              </Link>
            </li>
          )}
          {pages.map((page, idx) => {
            if (page === 'dots') {
              return (
                <li key={`dots-${idx}`} className="is-dots">
                  <span>…</span>
                </li>
              );
            }
            return (
              <li key={page} className={page === pagination.page ? 'active' : ''}>
                <Link to={pageHref(page)}>{page}</Link>
              </li>
            );
          })}
          {pagination.next && (
            <li>
              <Link to={pagination.next} aria-label="Следующая страница">
                <i className="icon-arrow-right" />
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default memo(PaginationComponent);
