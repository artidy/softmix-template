import { memo, MouseEventHandler, ReactElement } from 'react';

import CategoryBlock from './category-block';
import { Category } from '../../types/category';

type CategoriesBlockProps = {
  categories: Category[];
  allCategories: Category[];
  currentCategoryId: string;
  ownerIds: string[];
  isAuth: boolean;
  onOpenModalAddCategoryHandler: (id: string, position: number) => MouseEventHandler;
  onOpenModalUpdateHandler: (category: Category) => MouseEventHandler;
  onActionDelete: (category: Category) => MouseEventHandler;
}

function CategoriesBlock(
  {
    categories,
    allCategories,
    currentCategoryId,
    ownerIds,
    onOpenModalAddCategoryHandler,
    onOpenModalUpdateHandler,
    isAuth,
    onActionDelete,
  }: CategoriesBlockProps): ReactElement {
  const categoryContent = categories.map((category: Category) =>
    <CategoryBlock
      key={category.id}
      category={category}
      ownerIds={ownerIds}
      categories={allCategories}
      currentCategoryId={currentCategoryId}
      onOpenModalAddCategoryHandler={onOpenModalAddCategoryHandler}
      isAuth={isAuth}
      onActionDelete={onActionDelete}
      onOpenModalUpdateHandler={onOpenModalUpdateHandler}
    />
  )

  return (
    <ul className="children">
      {categoryContent}
    </ul>
  )
}

export default memo(CategoriesBlock);
