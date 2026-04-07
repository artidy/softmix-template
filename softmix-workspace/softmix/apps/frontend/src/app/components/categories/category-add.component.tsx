import { ChangeEvent, memo, MouseEvent, MouseEventHandler, ReactElement, useState } from 'react';
import { CategoryCreate } from '@project-lib/shared-types';

import { createCategoryApi } from '../../store/categories-data/api-actions';
import { useAppDispatch } from '../../hooks';

type CategoryAddComponentProps = {
  onCloseHandler: MouseEventHandler;
  categoryOwnerId?: string;
  ownerPosition: number;
}

function CategoryAddComponent({onCloseHandler, categoryOwnerId, ownerPosition}: CategoryAddComponentProps): ReactElement {
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState('');

  const onCreateHandler = (evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();

    if (title === '') return;

    const createCategory: CategoryCreate = {
      title,
    }

    if (categoryOwnerId) {
      createCategory.ownerId = categoryOwnerId;
      createCategory.position = ownerPosition + 1;
    }

    dispatch(createCategoryApi(createCategory));
    onCloseHandler(null);
  }

  const onChangeHandler = (evt: ChangeEvent<HTMLInputElement>) => {
    setTitle(evt.target.value);
  }

  return (
    <>
      <h5>Добавление категории</h5>
      <input
        type="text"
        name="title"
        placeholder="Название"
        value={title}
        onChange={onChangeHandler}
      />
      <div className="btn-wrapper">
        <button className="theme-btn-1 btn btn-effect-1" onClick={onCreateHandler}>
          Добавить
        </button>
        <button className="theme-btn-2 btn btn-effect-2" onClick={onCloseHandler}>
          Отменить
        </button>
      </div>
    </>
  )
}

export default memo(CategoryAddComponent);
