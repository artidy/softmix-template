import { memo, ReactElement } from 'react';

import CategoriesWidgetComponent from '../categories/categories-widget.component';
import { Category } from '../../types/category';
import { useAppSelector } from '../../hooks';
import { isLoading } from '../../store/categories-data/selectors';
import LoaderComponent from '../loader/loader.component';

type ShopSidebarComponentProps = {
  currentCategoryId: string;
  categories: Category[];
}

function ShopSidebarComponent({currentCategoryId, categories}: ShopSidebarComponentProps): ReactElement {
  const categoriesIsLoading = useAppSelector(isLoading);

  if (categoriesIsLoading) {
    return <LoaderComponent />
  }

  return (
    <div className="col-lg-3 mb-100">
      <aside className="sidebar ltn__shop-sidebar">
        <CategoriesWidgetComponent currentCategoryId={currentCategoryId} categories={categories} />
      </aside>
    </div>
  )
}

export default memo(ShopSidebarComponent);
