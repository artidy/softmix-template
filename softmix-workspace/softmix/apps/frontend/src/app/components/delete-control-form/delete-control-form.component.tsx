import { FormEventHandler, memo, MouseEventHandler, ReactElement, ReactNode } from 'react';

type DeleteControlFormComponentProps = {
  onDeleteHandler: FormEventHandler;
  onCancelHandler: MouseEventHandler;
  message?: ReactNode;
  confirmLabel?: string;
};

function DeleteControlFormComponent({
  onDeleteHandler,
  onCancelHandler,
  message = 'Это действие нельзя отменить. Удалить выбранный объект?',
  confirmLabel = 'Удалить',
}: DeleteControlFormComponentProps): ReactElement {
  return (
    <form className="app-form" onSubmit={onDeleteHandler}>
      <p className="mb-0">
        {message}
      </p>
      <div className="app-form__footer">
        <button type="button" className="btn btn-outline-secondary" onClick={onCancelHandler}>
          Отмена
        </button>
        <button type="submit" className="btn btn-danger">
          <i className="fa fa-trash me-1"></i> {confirmLabel}
        </button>
      </div>
    </form>
  );
}

export default memo(DeleteControlFormComponent);
