import {
  ChangeEvent,
  ChangeEventHandler,
  FormEventHandler,
  memo,
  MouseEventHandler,
  ReactElement,
  useEffect
} from 'react';

import { useAppDispatch, useAppSelector } from '../../hooks';
import { getCategories, isLoading as isLoadingCategories } from '../../store/categories-data/selectors';
import { getCategoriesApi } from '../../store/categories-data/api-actions';
import { setCategories } from '../../store/categories-data/categories-data';
import LoaderComponent from '../loader/loader.component';

type CategoryPickComponentProps = {
  onCloseHandler: MouseEventHandler;
  setCategoryId: (id: string) => void;
  categoryId: string;
  onSaveProducts: FormEventHandler;
}

function CategoryPickComponent({onCloseHandler, setCategoryId, categoryId, onSaveProducts}: CategoryPickComponentProps): ReactElement {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(getCategories);
  const categoriesIsLoading = useAppSelector(isLoadingCategories);

  useEffect(() => {
    dispatch(getCategoriesApi());

    return () => {
      dispatch(setCategories([]));
    }
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      setCategoryId(categories[0].id);
    }
  }, [categories]);

  if (categoriesIsLoading) {
    return <LoaderComponent />
  }

  const onChangeCategoryHandler = (evt: ChangeEvent<HTMLSelectElement>) => {
    setCategoryId(evt.target.value);
  }

  const categoriesContent = categories.map((category) =>
    <option key={category.id} value={category.id}>{category.title}</option>
  );

  return (
    <form method="post" action="#" onSubmit={onSaveProducts} >
      <h5>Выбор категории</h5>
      <div className="category-pick">
        <select className="nice-select" value={categoryId} onChange={onChangeCategoryHandler}>
          {categoriesContent}
        </select>
      </div>
      <div className="ltn__grid-list-tab-menu">
        <button type="submit" className="theme-btn-1 btn btn-effect-1">
          Сохранить
        </button>
        <button className="theme-btn-2 btn btn-effect-2" onClick={onCloseHandler}>
          Отменить
        </button>
      </div>
    </form>
  )
}

export default memo(CategoryPickComponent);
