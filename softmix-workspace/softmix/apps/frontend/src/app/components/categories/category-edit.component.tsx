import { ChangeEvent, memo, MouseEvent, MouseEventHandler, ReactElement, useState } from 'react';

import { updateCategoryApi } from '../../store/categories-data/api-actions';
import { useAppDispatch } from '../../hooks';

type CategoryEditComponentProps = {
  categoryId: string;
  categoryTitle: string;
  onCloseHandler: MouseEventHandler;
}

function CategoryEditComponent({categoryId, categoryTitle, onCloseHandler}: CategoryEditComponentProps): ReactElement {
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState(categoryTitle);

  const onCreateHandler = (evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();

    if (title === '' || categoryTitle === title) return;

    dispatch(updateCategoryApi({ id: categoryId, title }));
    onCloseHandler(null);
  }

  const onChangeHandler = (evt: ChangeEvent<HTMLInputElement>) => {
    setTitle(evt.target.value);
  }

  return (
    <>
      <h5>Изменение категории</h5>
      <input
        type="text"
        name="title"
        placeholder="Название"
        value={title}
        onChange={onChangeHandler}
      />
      <div className="btn-wrapper">
        <button className="theme-btn-1 btn btn-effect-1" onClick={onCreateHandler}>
          Сохранить
        </button>
        <button className="theme-btn-2 btn btn-effect-2" onClick={onCloseHandler}>
          Отменить
        </button>
      </div>
    </>
  )
}

export default memo(CategoryEditComponent);
