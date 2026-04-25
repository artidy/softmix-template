import { FormEvent, memo, MouseEvent, ReactElement, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Category } from '../../types/category';
import ModalComponent from '../modal/modal.component';
import CategoryAddComponent from './category-add.component';

import './categories-widget.css';
import { AppRoute } from '../../const';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { getCanManageProducts, getIsAuth } from '../../store/user-data/selectors';
import DeleteControlFormComponent from '../delete-control-form/delete-control-form.component';
import { deleteCategoryApi } from '../../store/categories-data/api-actions';
import CategoryEditComponent from './category-edit.component';
import CategoryBlock from './category-block';

type CategoriesWidgetComponentProps = {
  currentCategoryId: string;
  categories: Category[];
};

function CategoriesWidgetComponent({
  categories,
  currentCategoryId,
}: CategoriesWidgetComponentProps): ReactElement {
  const dispatch = useAppDispatch();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalDeleteIsOpen, setModalDeleteIsOpen] = useState(false);
  const [modalUpdateIsOpen, setModalUpdateIsOpen] = useState(false);
  const [modalAddCategoryIsOpen, setModalAddCategoryIsOpen] = useState(false);
  const [currentCategoryOwnerId, setCurrentCategoryOwnerId] = useState('');
  const [ownerIds, setOwnerIds] = useState<string[]>([]);
  const [categoryOwnerPosition, setCategoryOwnerPosition] = useState(0);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const isAuth = useAppSelector(getIsAuth);
  const canManage = useAppSelector(getCanManageProducts);

  useEffect(() => {
    findCategoryOwners();
  }, [currentCategoryId, categories]);

  const onOpenModalHandler = (_evt: MouseEvent) => {
    setModalIsOpen(true);
  };

  const onCloseModalAddCategoryHandler = (_evt: MouseEvent) => {
    setModalAddCategoryIsOpen(false);
  };

  const addOwnerId = (ownerId: string, result: string[]) => {
    const category = categories.find((item) => item.id === ownerId);
    if (!category) return;
    result.push(ownerId);
    if (category.ownerId) {
      addOwnerId(category.ownerId, result);
    }
  };

  const findCategoryOwners = () => {
    const result: string[] = [];
    const category = categories.find((c) => c.id === currentCategoryId);
    if (category?.ownerId) {
      addOwnerId(category.ownerId, result);
    }
    setOwnerIds(result);
  };

  const onOpenModalAddCategoryHandler =
    (categoryOwnerId: string, categoryPosition: number) => (_evt: MouseEvent) => {
      setCurrentCategoryOwnerId(categoryOwnerId);
      setCategoryOwnerPosition(categoryPosition);
      setModalAddCategoryIsOpen(true);
    };

  const onCloseModalHandler = (_evt: MouseEvent) => {
    setModalIsOpen(false);
  };

  const onOpenModalUpdateHandler = (category: Category) => (_evt: MouseEvent) => {
    setCurrentCategory(category);
    setModalUpdateIsOpen(true);
  };

  const onCloseModalUpdateHandler = (_evt: MouseEvent) => {
    setModalUpdateIsOpen(false);
  };

  const onActionDelete = (category: Category) => (_evt: MouseEvent) => {
    setCurrentCategory(category);
    setModalDeleteIsOpen(true);
  };

  const onCancelDelete = (_evt: MouseEvent) => {
    setModalDeleteIsOpen(false);
  };

  const onDeleteHandler = (evt: FormEvent) => {
    evt.preventDefault();
    if (currentCategory) {
      dispatch(deleteCategoryApi(currentCategory.id));
    }
  };

  const mainCategories = categories.filter((category) => category.position === 0);

  return (
    <div className="cat-widget">
      <div className="cat-widget__head">
        <h4 className="cat-widget__title">Категории</h4>
        {canManage && (
          <button
            type="button"
            className="cat-widget__add-btn"
            onClick={onOpenModalHandler}
            title="Добавить категорию"
            aria-label="Добавить категорию"
          >
            <i className="fa fa-plus"></i>
          </button>
        )}
      </div>
      <ul className="cat-list">
        <li className={`cat-item${!currentCategoryId ? ' is-active' : ''}`}>
          <div className="cat-item__row">
            <Link className="cat-item__link" to={AppRoute.Shop}>
              <span className="cat-item__title">Все товары</span>
            </Link>
          </div>
        </li>
        {mainCategories.map((category: Category) => (
          <CategoryBlock
            key={category.id}
            ownerIds={ownerIds}
            category={category}
            categories={categories}
            currentCategoryId={currentCategoryId}
            isAuth={isAuth}
            canManage={canManage}
            onOpenModalAddCategoryHandler={onOpenModalAddCategoryHandler}
            onOpenModalUpdateHandler={onOpenModalUpdateHandler}
            onActionDelete={onActionDelete}
          />
        ))}
      </ul>
      {canManage && (
        <>
          <ModalComponent
            isOpen={modalIsOpen}
            onCloseHandler={onCloseModalHandler}
            title="Добавить категорию"
            size="sm"
            children={
              <CategoryAddComponent
                onCloseHandler={onCloseModalHandler}
                ownerPosition={categoryOwnerPosition}
              />
            }
          />
          <ModalComponent
            isOpen={modalUpdateIsOpen}
            onCloseHandler={onCloseModalUpdateHandler}
            title="Редактировать категорию"
            size="sm"
            children={
              <CategoryEditComponent
                categoryId={currentCategory?.id}
                categoryTitle={currentCategory?.title}
                onCloseHandler={onCloseModalUpdateHandler}
              />
            }
          />
          <ModalComponent
            isOpen={modalDeleteIsOpen}
            onCloseHandler={onCancelDelete}
            title="Подтверждение удаления"
            size="sm"
            children={
              <DeleteControlFormComponent
                onDeleteHandler={onDeleteHandler}
                onCancelHandler={onCancelDelete}
              />
            }
          />
          <ModalComponent
            isOpen={modalAddCategoryIsOpen}
            onCloseHandler={onCloseModalAddCategoryHandler}
            title="Добавить подкатегорию"
            size="sm"
            children={
              <CategoryAddComponent
                categoryOwnerId={currentCategoryOwnerId}
                onCloseHandler={onCloseModalAddCategoryHandler}
                ownerPosition={categoryOwnerPosition}
              />
            }
          />
        </>
      )}
    </div>
  );
}

export default memo(CategoriesWidgetComponent);
