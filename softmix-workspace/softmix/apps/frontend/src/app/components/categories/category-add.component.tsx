import { ChangeEvent, FormEvent, memo, MouseEventHandler, ReactElement, useState } from 'react';
import { CategoryCreate } from '@project-lib/shared-types';

import { createCategoryApi } from '../../store/categories-data/api-actions';
import { useAppDispatch } from '../../hooks';

type CategoryAddComponentProps = {
  onCloseHandler: MouseEventHandler;
  categoryOwnerId?: string;
  ownerPosition: number;
};

function CategoryAddComponent({
  onCloseHandler,
  categoryOwnerId,
  ownerPosition,
}: CategoryAddComponentProps): ReactElement {
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  const onSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    if (!title.trim()) {
      setError('Введите название категории');
      return;
    }
    setError('');

    const create: CategoryCreate = { title: title.trim() };
    if (categoryOwnerId) {
      create.ownerId = categoryOwnerId;
      create.position = ownerPosition + 1;
    }

    dispatch(createCategoryApi(create));
    onCloseHandler({} as React.MouseEvent);
  };

  return (
    <form className="app-form" onSubmit={onSubmit}>
      <div className="form-section">
        <div className="row g-3">
          <div className="col-12">
            <label className="form-label">
              Название{' '}
              {categoryOwnerId && (
                <small className="text-muted">(подкатегория)</small>
              )}
            </label>
            <input
              type="text"
              className={`form-control${error ? ' is-invalid' : ''}`}
              placeholder="Например, Видеокарты"
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
          <i className="fa fa-plus me-1"></i> Добавить
        </button>
      </div>
    </form>
  );
}

export default memo(CategoryAddComponent);
