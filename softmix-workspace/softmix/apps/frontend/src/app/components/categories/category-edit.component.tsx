import { ChangeEvent, FormEvent, memo, MouseEventHandler, ReactElement, useState } from 'react';

import { updateCategoryApi } from '../../store/categories-data/api-actions';
import { useAppDispatch } from '../../hooks';

type CategoryEditComponentProps = {
  categoryId: string;
  categoryTitle: string;
  onCloseHandler: MouseEventHandler;
};

function CategoryEditComponent({
  categoryId,
  categoryTitle,
  onCloseHandler,
}: CategoryEditComponentProps): ReactElement {
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState(categoryTitle);
  const [error, setError] = useState('');

  const onSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    if (!title.trim()) {
      setError('Введите название категории');
      return;
    }
    setError('');

    if (categoryTitle !== title) {
      dispatch(updateCategoryApi({ id: categoryId, title: title.trim() }));
    }
    onCloseHandler({} as React.MouseEvent);
  };

  return (
    <form className="app-form" onSubmit={onSubmit}>
      <div className="form-section">
        <div className="row g-3">
          <div className="col-12">
            <label className="form-label">Название</label>
            <input
              type="text"
              className={`form-control${error ? ' is-invalid' : ''}`}
              value={title}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
              autoFocus
            />
            {error && <div className="invalid-feedback">{error}</div>}
          </div>
        </div>
      </div>
      <div className="app-form__footer">
        <button type="button" className="btn btn-outline-secondary" onClick={onCloseHandler}>
          Отмена
        </button>
        <button type="submit" className="btn btn-primary">
          Сохранить
        </button>
      </div>
    </form>
  );
}

export default memo(CategoryEditComponent);
