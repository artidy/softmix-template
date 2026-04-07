import { AppRoute } from '../../const';
import { createPaginationLinks } from '../helpers';
import { Pagination } from '../../types/pagination';
import { QueryParams } from '../../types/product';

export function paginationAdapt(appRoute: AppRoute, queryParams: QueryParams, total: number, count: number): Pagination {
  return createPaginationLinks(appRoute, queryParams, total, count);
}
