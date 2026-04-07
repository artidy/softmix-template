export interface ProductAlStyleApi {
  article: number,
  name: string,
  full_name: string,
  categoryId: number,
  sort: number,
  price1: number,
  price2: number,
  quantity: number,
  isnew: number,
  article_pn: string,
  images: string[],
}

export interface ProductAlStylePaginationApi {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  offset: number;
}

export interface ProductsAlStyleWithPaginationApi {
  elements: ProductAlStyleApi[];
  pagination: ProductAlStylePaginationApi;
}
