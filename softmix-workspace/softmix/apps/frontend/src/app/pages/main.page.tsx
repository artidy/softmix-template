import { useEffect, useMemo, useState } from 'react';
import { skipToken } from '@reduxjs/toolkit/query';
import { Flame, Sparkles } from 'lucide-react';

import { AppRoute } from '../const';
import { useAppDispatch, useAppSelector } from '../hooks';
import { useDocumentTitle } from '../lib/use-document-title';
import { collectCategoryIds, getDirections } from '../lib/catalog';
import { getHotProducts, getIsHotProductsLoading, getIsNewProductsLoading, getNewProducts } from '../store/main-data/selectors';
import { getHotProductsApi, getNewProductsApi } from '../store/main-data/api-actions';
import { setHotProducts, setNewProducts } from '../store/main-data/main-data';
import { getCategoriesApi } from '../store/categories-data/api-actions';
import { getImagesApi } from '../store/products-data/api-actions';
import { setCategories } from '../store/categories-data/categories-data';
import { getCategories, getIsCategoriesLoading } from '../store/categories-data/selectors';
import { useGetCatalogTotalQuery, useGetShowcaseQuery } from '../store/shop-api';
import { ProductGrid } from '../components/product/product-card';
import { Hero } from '../components/home/hero';
import { Benefits } from '../components/home/benefits';
import { Directions } from '../components/home/directions';
import { Promo } from '../components/home/promo';
import { ContactCta } from '../components/home/contact-cta';
import { Container, SectionHeading } from '../ui/layout';

function MainPage() {
  const dispatch = useAppDispatch();
  const newProducts = useAppSelector(getNewProducts);
  const hotProducts = useAppSelector(getHotProducts);
  const isNewLoading = useAppSelector(getIsNewProductsLoading);
  const isHotLoading = useAppSelector(getIsHotProductsLoading);
  const categories = useAppSelector(getCategories);
  const isCategoriesLoading = useAppSelector(getIsCategoriesLoading);
  const { data: total } = useGetCatalogTotalQuery();
  const [isCategoriesSettled, setIsCategoriesSettled] = useState(false);

  useDocumentTitle('Компьютеры, серверы и ПО для бизнеса');

  const directions = useMemo(() => getDirections(categories), [categories]);
  // Каждое направление вместе с подкатегориями — из него витрина возьмёт один товар с фото.
  const showcaseGroups = useMemo(
    () => directions.map((direction) => collectCategoryIds(direction.id, categories)),
    [directions, categories],
  );
  const { currentData: showcase, isError: isShowcaseFailed } = useGetShowcaseQuery(
    showcaseGroups.length > 0 ? showcaseGroups : skipToken,
  );

  // Витрину показываем сразу целиком, когда известны направления, — без подмены карточек на глазах.
  const isShowcaseReady =
    isCategoriesSettled && (showcaseGroups.length === 0 || showcase !== undefined || isShowcaseFailed);
  const heroProducts = useMemo(() => {
    if (!isShowcaseReady) {
      return [];
    }
    // Если в каких-то направлениях нет товаров с фото, добираем витрину новинками.
    const picked = showcase ?? [];
    const extra = newProducts.filter((product) => !picked.some((item) => item.id === product.id));
    return [...picked, ...extra];
  }, [isShowcaseReady, showcase, newProducts]);

  useEffect(() => {
    dispatch(getCategoriesApi()).finally(() => setIsCategoriesSettled(true));
    dispatch(getNewProductsApi());
    dispatch(getHotProductsApi());
    // Фото, загруженные сотрудниками, — как в каталоге.
    dispatch(getImagesApi());

    return () => {
      dispatch(setCategories([]));
      dispatch(setNewProducts([]));
      dispatch(setHotProducts([]));
    };
  }, [dispatch]);

  return (
    <>
      <Hero
        products={heroProducts}
        loading={!isShowcaseReady || (isNewLoading && heroProducts.length < 4)}
        total={total}
        directionsCount={directions.length}
      />
      <Benefits />
      <Directions categories={categories} loading={isCategoriesLoading} />

      <section className="py-12 sm:py-16">
        <Container>
          <SectionHeading
            eyebrow={
              <span className="inline-flex items-center gap-1.5">
                <Sparkles className="size-3.5" aria-hidden="true" />
                Новинки
              </span>
            }
            title="Новые поступления"
            action={{ to: AppRoute.Shop, label: 'Смотреть все' }}
          />
          <ProductGrid products={newProducts} loading={isNewLoading} />
        </Container>
      </section>

      <Promo categories={categories} />

      {(isHotLoading || hotProducts.length > 0) && (
        <section className="py-12 sm:py-16">
          <Container>
            <SectionHeading
              eyebrow={
                <span className="inline-flex items-center gap-1.5">
                  <Flame className="size-3.5" aria-hidden="true" />
                  Популярное
                </span>
              }
              title="Хиты продаж"
              action={{ to: AppRoute.Shop, label: 'Весь каталог' }}
            />
            <ProductGrid products={hotProducts} loading={isHotLoading} />
          </Container>
        </section>
      )}

      <ContactCta />
    </>
  );
}

export default MainPage;
