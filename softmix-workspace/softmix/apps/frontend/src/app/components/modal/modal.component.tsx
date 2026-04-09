import { memo, MouseEventHandler, ReactElement, useEffect } from 'react';

type ModalProps = {
  isOpen: boolean;
  onCloseHandler: MouseEventHandler;
  children: ReactElement;
}

function ModalComponent({isOpen, onCloseHandler, children}: ModalProps): ReactElement {
  useEffect(() => {
    const scrollbarWidth = getScrollbarWidth();

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    }

    // Возврат к первоначальному состоянию при размонтировании компонента
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    };
  }, [isOpen]);

  const getScrollbarWidth = () => {
    // Создаем блок с прокруткой
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll';
    document.body.appendChild(outer);

    // Создаем внутренний блок
    const inner = document.createElement('div');
    outer.appendChild(inner);

    // Вычисляем ширину полосы прокрутки
    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;

    // Удаляем временные блоки
    outer.parentNode.removeChild(outer);

    return scrollbarWidth;
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="ltn__modal-area ltn__add-to-cart-modal-area">
      <div
        className={`modal ${isOpen ? 'show': 'fade'}`}
        id="add_to_cart_modal"
        tabIndex={-1}
        aria-modal={true}
        role={'dialog'}
        style={{ display: isOpen ? 'block' : '' }}
      >
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close" onClick={onCloseHandler}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="ltn__quick-view-modal-inner">
                <div className="modal-product-item">
                  <div className="row">
                    <div className="col-12">
                      <div className="modal-add-to-cart-content clearfix">
                        <div className="modal-product-info">
                          {children}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(ModalComponent);
