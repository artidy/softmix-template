import {Product} from "../types/product";
import ProductApi from "../types/product-api";

const adaptProduct = ({id, title, preview, categoryId}: ProductApi) => {
  return {
    id,
    title,
    href: preview,
    categoryId,
    dataTitle: title
  }
}

const adaptProducts = (products: ProductApi[]): Product[] => {
  return products.map((product) => adaptProduct(product));
}

export {adaptProduct, adaptProducts};
