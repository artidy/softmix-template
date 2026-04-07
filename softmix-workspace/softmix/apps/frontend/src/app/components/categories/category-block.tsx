import { memo, MouseEventHandler, ReactElement } from 'react';
import { Link } from 'react-router-dom';

import { AppRoute } from '../../const';
import { Category } from '../../types/category';
import CategoriesBlock from './categories-block';

type CategoryBlockProps = {
  category: Category;
  categories: Category[];
  currentCategoryId: string;
  ownerIds: string[];
  isAuth: boolean;
  onOpenModalAddCategoryHandler: (id: string, position: number) => MouseEventHandler;
  onOpenModalUpdateHandler: (category: Category) => MouseEventHandler;
  onActionDelete: (category: Category) => MouseEventHandler;
}

function CategoryBlock(
  {
    category,
    categories,
    currentCategoryId,
    ownerIds,
    isAuth,
    onOpenModalAddCategoryHandler,
    onOpenModalUpdateHandler,
    onActionDelete,
  }: CategoryBlockProps): ReactElement {
  const categoryChildren = categories.filter((element) => element.ownerId === category.id);

  return (
    <li className={`category-area${ownerIds.includes(category.id) ? ' expanded' : ''}`}>
      <div className={`category-block${category.id === currentCategoryId ? ' active' : ''}`}>
        <Link to={`${AppRoute.Shop}/?categoryId=${category.id}`}>{category.title}</Link>
        <div className="d-flex">
          {isAuth ?
            <div className="category-block-btn">
              <button className="widget-button" onClick={onOpenModalAddCategoryHandler(category.id, category.position)}>
                <i className="fa fa-plus"></i>
              </button>
              <button className="widget-button" onClick={onOpenModalUpdateHandler(category)}>
                <i className="fa fa-pen"></i>
              </button>
              <button className="widget-button" onClick={onActionDelete(category)}>
                <i className="fa fa-trash"></i>
              </button>
            </div> : null
          }
          <i className="fa fa-chevron-right"/>
        </div>
      </div>
      { categoryChildren.length > 0 ?
        <CategoriesBlock
          categories={categoryChildren}
          currentCategoryId={currentCategoryId}
          ownerIds={ownerIds}
          allCategories={categories}
          onOpenModalAddCategoryHandler={onOpenModalAddCategoryHandler}
          onOpenModalUpdateHandler={onOpenModalUpdateHandler}
          isAuth={isAuth}
          onActionDelete={onActionDelete}
        /> : null
      }
    </li>
  )
}

export default memo(CategoryBlock);
