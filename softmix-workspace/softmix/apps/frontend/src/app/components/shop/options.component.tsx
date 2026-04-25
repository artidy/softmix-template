import { ChangeEvent, memo, ReactElement, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useAppSelector } from '../../hooks';
import { getCategories } from '../../store/categories-data/selectors';
import { getProductsPagination } from '../../store/products-data/selectors';

const SORT_OPTIONS = [
  { value: 'oldest', label: 'По умолчанию' },
  { value: 'newest', label: 'Сначала новые' },
  { value: 'price_asc', label: 'По цене: дешевле' },
  { value: 'price_desc', label: 'По цене: дороже' },
  { value: 'title_asc', label: 'По названию (А-Я)' },
  { value: 'discount', label: 'Сначала со скидкой' },
];

type OptionsComponentProps = {
  view: 'grid' | 'list';
  onChangeView: (view: 'grid' | 'list') => void;
  onOpenSidebar?: () => void;
  onAddProduct?: () => void;
};

function OptionsComponent({ view, onChangeView, onOpenSidebar, onAddProduct }: OptionsComponentProps): ReactElement {
  const pagination = useAppSelector(getProductsPagination);
  const categories = useAppSelector(getCategories);
  const [searchParams, setSearchParams] = useSearchParams();

  const currentCategoryId = searchParams.get('categoryId');
  const sortBy = searchParams.get('sortBy') ?? 'oldest';

  const currentCategoryTitle = useMemo(() => {
    if (!currentCategoryId) return null;
    return categories.find((c) => c.id === currentCategoryId)?.title ?? null;
  }, [categories, currentCategoryId]);

  const handleSortChange = (evt: ChangeEvent<HTMLSelectElement>) => {
    const next = new URLSearchParams(searchParams);
    if (evt.target.value === 'oldest') {
      next.delete('sortBy');
    } else {
      next.set('sortBy', evt.target.value);
    }
    next.delete('page');
    setSearchParams(next);
  };

  const total = pagination.total ?? 0;

  return (
    <div className="shop-toolbar">
      <div className="shop-toolbar__info">
        <h2 className="shop-toolbar__title">
          {currentCategoryTitle ?? 'Все товары'}
        </h2>
        <div className="shop-toolbar__counter">
          {total === 0
            ? 'Нет товаров'
            : `${total} ${pluralize(total, ['товар', 'товара', 'товаров'])}`}
        </div>
      </div>
      <div className="shop-toolbar__controls">
        {onOpenSidebar && (
          <button
            type="button"
            className="btn btn-outline-secondary d-lg-none shop-toolbar__filters-btn"
            onClick={onOpenSidebar}
          >
            <i className="icon-menu me-1"></i> Категории
          </button>
        )}
        {onAddProduct && (
          <button
            type="button"
            className="shop-toolbar__add-btn"
            onClick={onAddProduct}
          >
            <i className="fa fa-plus"></i>
            <span>Добавить товар</span>
          </button>
        )}
        <select
          className="form-select shop-toolbar__sort"
          value={sortBy}
          onChange={handleSortChange}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="shop-toolbar__view">
          <button
            type="button"
            className={`shop-toolbar__view-btn${view === 'grid' ? ' is-active' : ''}`}
            onClick={() => onChangeView('grid')}
            aria-label="Сеткой"
            title="Сеткой"
          >
            <i className="icon-grid"></i>
          </button>
          <button
            type="button"
            className={`shop-toolbar__view-btn${view === 'list' ? ' is-active' : ''}`}
            onClick={() => onChangeView('list')}
            aria-label="Списком"
            title="Списком"
          >
            <i className="icon-menu"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

function pluralize(n: number, forms: [string, string, string]): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms[1];
  return forms[2];
}

export default memo(OptionsComponent);
