type SortBy = 'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'title_asc' | 'discount';

interface ProductQuery {
  limit?: number;
  page?: number;
  isNew?: boolean;
  isHot?: boolean;
  categoryId?: string;
  categoryIds?: string[];
  sortBy?: SortBy;
}

export default ProductQuery;
