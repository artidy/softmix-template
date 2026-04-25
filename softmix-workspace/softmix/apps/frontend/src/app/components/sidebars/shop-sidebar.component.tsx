import { memo, ReactElement, useEffect } from 'react';

import CategoriesWidgetComponent from '../categories/categories-widget.component';
import { Category } from '../../types/category';
import { useAppSelector } from '../../hooks';
import { isLoading } from '../../store/categories-data/selectors';

type ShopSidebarComponentProps = {
  currentCategoryId: string;
  categories: Category[];
  isOpen?: boolean;
  onClose?: () => void;
};

function ShopSidebarComponent({
  currentCategoryId,
  categories,
  isOpen,
  onClose,
}: ShopSidebarComponentProps): ReactElement {
  const categoriesIsLoading = useAppSelector(isLoading);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) onClose();
    };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const content = (
    <aside className="shop-sidebar">
      <CategoriesWidgetComponent currentCategoryId={currentCategoryId} categories={categories} />
    </aside>
  );

  return (
    <>
      <div className="col-lg-3 d-none d-lg-block">{!categoriesIsLoading && content}</div>

      {isOpen && (
        <div className="shop-sidebar-backdrop d-lg-none" onClick={onClose} aria-hidden="true" />
      )}
      <div
        className={`shop-sidebar-drawer d-lg-none${isOpen ? ' is-open' : ''}`}
        role="dialog"
        aria-label="Категории"
      >
        <div className="shop-sidebar-drawer__head">
          <span className="shop-sidebar-drawer__title">Категории</span>
          <button
            type="button"
            className="btn-close"
            aria-label="Закрыть"
            onClick={onClose}
          />
        </div>
        <div className="shop-sidebar-drawer__body">
          {!categoriesIsLoading && content}
        </div>
      </div>
    </>
  );
}

export default memo(ShopSidebarComponent);
