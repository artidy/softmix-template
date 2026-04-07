interface ProductQuery {
  limit?: number;
  page?: number;
  isNew?: boolean;
  isHot?: boolean;
  categoryId?: string;
}

export default ProductQuery;
