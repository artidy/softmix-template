import { memo, MouseEvent, MouseEventHandler, ReactElement, useState } from 'react';
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
  canManage: boolean;
  onOpenModalAddCategoryHandler: (id: string, position: number) => MouseEventHandler;
  onOpenModalUpdateHandler: (category: Category) => MouseEventHandler;
  onActionDelete: (category: Category) => MouseEventHandler;
};

function CategoryBlock({
  category,
  categories,
  currentCategoryId,
  ownerIds,
  isAuth,
  canManage,
  onOpenModalAddCategoryHandler,
  onOpenModalUpdateHandler,
  onActionDelete,
}: CategoryBlockProps): ReactElement {
  const categoryChildren = categories.filter((element) => element.ownerId === category.id);
  const hasChildren = categoryChildren.length > 0;
  const isActive = category.id === currentCategoryId;
  const isAncestor = ownerIds.includes(category.id);
  const isExpandedByPath = isActive || isAncestor;

  const [manuallyExpanded, setManuallyExpanded] = useState(false);
  const isExpanded = isExpandedByPath || manuallyExpanded;

  const onToggle = (evt: MouseEvent) => {
    evt.preventDefault();
    setManuallyExpanded((v) => !v);
  };

  return (
    <li
      className={`cat-item${isActive ? ' is-active' : ''}${isAncestor ? ' is-ancestor' : ''}${
        isExpanded ? ' is-expanded' : ''
      }`}
    >
      <div className="cat-item__row">
        <Link className="cat-item__link" to={`${AppRoute.Shop}/?categoryId=${category.id}`}>
          <span className="cat-item__title">{category.title}</span>
        </Link>
        <div className="cat-item__actions">
          {canManage && (
            <>
              <button
                type="button"
                className="cat-item__btn"
                onClick={onOpenModalAddCategoryHandler(category.id, category.position)}
                title="Добавить подкатегорию"
                aria-label="Добавить подкатегорию"
              >
                <i className="fa fa-plus"></i>
              </button>
              <button
                type="button"
                className="cat-item__btn"
                onClick={onOpenModalUpdateHandler(category)}
                title="Редактировать"
                aria-label="Редактировать"
              >
                <i className="fa fa-pen"></i>
              </button>
              <button
                type="button"
                className="cat-item__btn"
                onClick={onActionDelete(category)}
                title="Удалить"
                aria-label="Удалить"
              >
                <i className="fa fa-trash"></i>
              </button>
            </>
          )}
          {hasChildren && (
            <button
              type="button"
              className="cat-item__chevron"
              onClick={onToggle}
              aria-label={isExpanded ? 'Свернуть' : 'Развернуть'}
              aria-expanded={isExpanded}
            >
              <i className="fa fa-chevron-right" />
            </button>
          )}
        </div>
      </div>
      {hasChildren && isExpanded && (
        <CategoriesBlock
          categories={categoryChildren}
          currentCategoryId={currentCategoryId}
          ownerIds={ownerIds}
          allCategories={categories}
          isAuth={isAuth}
          canManage={canManage}
          onOpenModalAddCategoryHandler={onOpenModalAddCategoryHandler}
          onOpenModalUpdateHandler={onOpenModalUpdateHandler}
          onActionDelete={onActionDelete}
        />
      )}
    </li>
  );
}

export default memo(CategoryBlock);
