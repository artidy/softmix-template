import { memo, ReactElement } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { DEFAULT_LIMIT } from '@project-lib/shared-types';

import { Pagination } from '../../types/pagination';
import { AppRoute } from '../../const';
import { convertSearchParams, getQueryString } from '../../services/helpers';

type PaginationComponentProps = {
  appRoute: AppRoute
  pagination: Pagination;
}

function PaginationComponent({appRoute, pagination}: PaginationComponentProps): ReactElement {
  const [searchParams] = useSearchParams();
  const queryParams = convertSearchParams(searchParams);
  const pages = [];

  for (let page = 1; page <= pagination.totalPages; page++) {
    pages.push(page);
  }

  const paginationContent = pages.map((pageNumber) => {
    let queryString = getQueryString(queryParams, ['page', 'limit']);
    queryString += queryString === '' ? '?' : '&';

    return (<li key={pageNumber} className={`${pageNumber === pagination.page ? 'active' : ''}`}>
      <Link
        to={`${appRoute}${queryString}page=${pageNumber}&limit=${DEFAULT_LIMIT}`}
      >
        {pageNumber}
      </Link>
    </li>)
  });

  return (
    <div className="ltn__pagination-area text-center">
      <div className="ltn__pagination ltn__pagination-2">
        <ul>
          { pagination.prev ?
            <li>
              <Link to={pagination.prev}>
                <i className="icon-arrow-left"/>
              </Link>
            </li> : null
          }
          {paginationContent}
          { pagination.next ?
            <li>
              <Link to={pagination.next}>
                <i className="icon-arrow-right"/>
              </Link>
            </li> : null
          }
        </ul>
      </div>
    </div>
  )
}

export default memo(PaginationComponent);
