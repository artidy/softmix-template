import { ReactElement, useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '../hooks';
import MainSliderComponent from '../components/slider/main-slider.component';
import FeatureAreaComponent from '../components/feature-area/feature-area.component';
import ProductsAreaComponent from '../components/products/products-area.component';
import SliderAreaComponent from '../components/slider/slider-area.component';
import NewsAreaComponent from '../components/news/news-area.component';
import BrandsAreaComponent from '../components/brands/brands-area.component';
import { getHotProducts, getNewProducts } from '../store/main-data/selectors';
import { getHotProductsApi, getNewProductsApi } from '../store/main-data/api-actions';
import { setHotProducts, setNewProducts } from '../store/main-data/main-data';
import { getCategoriesApi } from '../store/categories-data/api-actions';
import { setCategories } from '../store/categories-data/categories-data';

function MainPage(): ReactElement {
  const dispatch = useAppDispatch();
  const newProducts = useAppSelector(getNewProducts);
  const hotProducts = useAppSelector(getHotProducts);

  useEffect(() => {
    dispatch(getCategoriesApi());
    dispatch(getNewProductsApi());
    dispatch(getHotProductsApi());

    return () => {
      dispatch(setCategories([]));
      dispatch(setNewProducts([]));
      dispatch(setHotProducts([]));
    }
  }, []);

  return (
    <>
      <MainSliderComponent />
      <FeatureAreaComponent />
      <ProductsAreaComponent products={newProducts} />
      <SliderAreaComponent products={hotProducts} />
      <NewsAreaComponent />
      <BrandsAreaComponent />
    </>
  )
}

export default MainPage;
