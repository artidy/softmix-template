import { FormEvent, memo, MouseEvent, ReactElement, useEffect, useState } from 'react';

import { Category } from '../../types/category';
import ModalComponent from '../modal/modal.component';
import CategoryAddComponent from './category-add.component';

import './categories-widget.css';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { getIsAuth } from '../../store/user-data/selectors';
import DeleteControlFormComponent from '../delete-control-form/delete-control-form.component';
import { deleteCategoryApi } from '../../store/categories-data/api-actions';
import CategoryEditComponent from './category-edit.component';
import CategoryBlock from './category-block';

type CategoriesWidgetComponentProps = {
  currentCategoryId: string;
  categories: Category[];
}

function CategoriesWidgetComponent({categories, currentCategoryId}: CategoriesWidgetComponentProps): ReactElement {
  const dispatch = useAppDispatch();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalDeleteIsOpen, setModalDeleteIsOpen] = useState(false);
  const [modalUpdateIsOpen, setModalUpdateIsOpen] = useState(false);
  const [modalAddCategoryIsOpen, setModalAddCategoryIsOpen] = useState(false);
  const [currentCategoryOwnerId, setCurrentCategoryOwnerId] = useState('');
  const [ownerIds, setOwnerIds] = useState([]);
  const [categoryOwnerPosition, setCategoryOwnerPosition] = useState(0);
  const [currentCategory, setCurrentCategory] = useState<Category>(null);
  const isAuth = useAppSelector(getIsAuth);

  useEffect(() => {
    findCategoryOwners();
  }, [currentCategoryId]);

  const onOpenModalHandler = (evt: MouseEvent) => {
    setModalIsOpen(true);
  }

  const onCloseModalAddCategoryHandler = (evt: MouseEvent) => {
    setModalAddCategoryIsOpen(false);
  }

  const addOwnerId = (ownerId: string, result: string[]) => {
    const category = categories.find((item) => item.id === ownerId);

    result.push(ownerId);

    if (category.ownerId) {
      addOwnerId(category.ownerId, result);
    }
  }

  const findCategoryOwners = () => {
    const result: string[] = [];
    const category = categories.find((category) => category.id === currentCategoryId);

    if (category?.ownerId) {
      addOwnerId(category.ownerId, result);
    }

    setOwnerIds(result);
  }

  const onOpenModalAddCategoryHandler = (categoryOwnerId: string, categoryPosition: number) => (evt: MouseEvent) => {


    setCurrentCategoryOwnerId(categoryOwnerId);
    setCategoryOwnerPosition(categoryPosition);
    setModalAddCategoryIsOpen(true);
  }

  const onCloseModalHandler = (evt: MouseEvent) => {
    setModalIsOpen(false);
  }

  const onOpenModalUpdateHandler = (category: Category) => (evt: MouseEvent) => {
    setCurrentCategory(category);
    setModalUpdateIsOpen(true);
  }

  const onCloseModalUpdateHandler = (evt: MouseEvent) => {
    setModalUpdateIsOpen(false);
  }

  const onActionDelete = (category: Category) => (evt: MouseEvent) => {
    setCurrentCategory(category);
    setModalDeleteIsOpen(true);
  }

  const onCancelDelete = (evt: MouseEvent) => {
    setModalDeleteIsOpen(false);
  }

  const onDeleteHandler = (evt: FormEvent) => {
    evt.preventDefault();

    dispatch(deleteCategoryApi(currentCategory.id));
  }

  const mainCategories = categories.filter(category => category.position === 0);

  const categoriesContent = mainCategories.map((category: Category) =>
    <CategoryBlock
      key={category.id}
      ownerIds={ownerIds}
      category={category}
      categories={categories}
      currentCategoryId={currentCategoryId}
      isAuth={isAuth}
      onOpenModalAddCategoryHandler={onOpenModalAddCategoryHandler}
      onOpenModalUpdateHandler={onOpenModalUpdateHandler}
      onActionDelete={onActionDelete}
    />
  );

  return (
    <div className="widget ltn__menu-widget">
      <h4 className="ltn__widget-title">Категории
        {isAuth ?
          <button className="widget-button" onClick={onOpenModalHandler}>
            <i className="fa fa-plus"></i>
          </button> : null
        }
      </h4>
      <ul>
        {categoriesContent}
      </ul>
      {isAuth ?
        <>
        <ModalComponent
          isOpen={modalIsOpen}
          onCloseHandler={onCloseModalHandler}
          children={<CategoryAddComponent onCloseHandler={onCloseModalHandler} ownerPosition={categoryOwnerPosition}/>}
        />
        <ModalComponent
          isOpen={modalUpdateIsOpen}
          onCloseHandler={onCloseModalUpdateHandler}
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
          children={<DeleteControlFormComponent
            onDeleteHandler={onDeleteHandler} onCancelHandler={onCancelDelete} />}
        />
        <ModalComponent
          isOpen={modalAddCategoryIsOpen}
          onCloseHandler={onCloseModalAddCategoryHandler}
          children={
            <CategoryAddComponent
              categoryOwnerId={currentCategoryOwnerId}
              onCloseHandler={onCloseModalAddCategoryHandler}
              ownerPosition={categoryOwnerPosition}
            />
          }
        />
        </> : null
      }
    </div>
  )
}

export default memo(CategoriesWidgetComponent);
