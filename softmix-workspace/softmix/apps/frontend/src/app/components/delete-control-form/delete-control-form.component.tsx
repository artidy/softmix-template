import { FormEventHandler, memo, MouseEventHandler, ReactElement } from 'react';

type DeleteControlFormComponentProps = {
  onDeleteHandler: FormEventHandler;
  onCancelHandler: MouseEventHandler;
}

function DeleteControlFormComponent({onDeleteHandler, onCancelHandler}: DeleteControlFormComponentProps): ReactElement {
  return (
    <form method="post" action="#" onSubmit={onDeleteHandler}>
      <h5>Вы действительно хотите удалить?</h5>
      <div className="btn-wrapper">
        <button className="theme-btn-1 btn btn-effect-1" type="submit">
          Удалить
        </button>
        <button className="theme-btn-2 btn btn-effect-2" onClick={onCancelHandler}>
          Отменить
        </button>
      </div>
    </form>
  )
}

export default memo(DeleteControlFormComponent);
