import { memo, MouseEventHandler, ReactElement, useEffect } from 'react';

type ModalProps = {
  isOpen: boolean;
  onCloseHandler: MouseEventHandler;
  children: ReactElement;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
};

function ModalComponent({
  isOpen,
  onCloseHandler,
  children,
  title,
  size = 'lg',
}: ModalProps): ReactElement | null {
  useEffect(() => {
    const scrollbarWidth = getScrollbarWidth();

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseHandler({} as React.MouseEvent);
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onCloseHandler]);

  const getScrollbarWidth = () => {
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll';
    document.body.appendChild(outer);

    const inner = document.createElement('div');
    outer.appendChild(inner);

    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;

    outer.parentNode!.removeChild(outer);

    return scrollbarWidth;
  };

  if (!isOpen) {
    return null;
  }

  const sizeClass =
    size === 'sm' ? 'app-modal__dialog--sm'
    : size === 'md' ? 'app-modal__dialog--md'
    : size === 'xl' ? 'app-modal__dialog--xl'
    : 'app-modal__dialog--lg';

  return (
    <div className="app-modal" role="dialog" aria-modal="true">
      <div className="app-modal__backdrop" onClick={onCloseHandler} />
      <div className={`app-modal__dialog ${sizeClass}`}>
        <div className="app-modal__content">
          {title && (
            <div className="app-modal__header">
              <h5 className="app-modal__title">{title}</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onCloseHandler}
                aria-label="Закрыть"
              />
            </div>
          )}
          {!title && (
            <button
              type="button"
              className="btn-close app-modal__close-floating"
              onClick={onCloseHandler}
              aria-label="Закрыть"
            />
          )}
          <div className="app-modal__body">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default memo(ModalComponent);
