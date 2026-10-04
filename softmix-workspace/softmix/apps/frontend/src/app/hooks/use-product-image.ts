import { Product } from '../types/product';
import { DEFAULT_PRODUCT_IMG } from '../const';
import { getImageUrl } from '../services/helpers';
import { getImages } from '../store/products-data/selectors';
import { useAppSelector } from './index';

/** Фото, загруженное сотрудником, важнее картинки поставщика. */
export function useProductImage(product: Product): string {
  const images = useAppSelector(getImages);
  return getImageUrl(images, product.id, product.imageUrl) || DEFAULT_PRODUCT_IMG;
}
