import { FormEventHandler, memo, MouseEventHandler, ReactElement } from 'react';

type DeleteControlFormComponentProps = {
  onDeleteHandler: FormEventHandler;
  onCancelHandler: MouseEventHandler;
};

function DeleteControlFormComponent({
  onDeleteHandler,
  onCancelHandler,
}: DeleteControlFormComponentProps): ReactElement {
  return (
    <form className="app-form" onSubmit={onDeleteHandler}>
      <p className="mb-0">
        Это действие нельзя отменить. Удалить выбранный объект?
      </p>
      <div className="app-form__footer">
        <button type="button" className="btn btn-outline-secondary" onClick={onCancelHandler}>
          Отмена
        </button>
        <button type="submit" className="btn btn-danger">
          <i className="fa fa-trash me-1"></i> Удалить
        </button>
      </div>
    </form>
  );
}

export default memo(DeleteControlFormComponent);
