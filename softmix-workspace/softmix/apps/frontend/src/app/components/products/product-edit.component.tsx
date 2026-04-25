import { ChangeEvent, FormEvent, memo, MouseEventHandler, ReactElement, useState } from 'react';
import { ProductUpdate } from '@project-lib/shared-types';

import { useAppDispatch, useAppSelector } from '../../hooks';
import { getCategories } from '../../store/categories-data/selectors';
import { updateProductApi } from '../../store/products-data/api-actions';
import { Product } from '../../types/product';

type ProductEditComponentProps = {
  product: Product;
  onCloseHandler: MouseEventHandler;
};

function ProductEditComponent({ product, onCloseHandler }: ProductEditComponentProps): ReactElement {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(getCategories);
  const [title, setTitle] = useState(product.title);
  const [description, setDescription] = useState(product.description);
  const [price, setPrice] = useState<number>(product.price);
  const [pricePrev, setPricePrev] = useState<number>(product.pricePrev ?? 0);
  const [discount, setDiscount] = useState<number>(product.discount);
  const [categoryId, setCategoryId] = useState(product.categoryId);
  const [isHot, setIsHot] = useState(product.isHot);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!title.trim()) next.title = 'Введите название';
    if (!categoryId) next.categoryId = 'Выберите категорию';
    if (!price || price <= 0) next.price = 'Цена должна быть больше нуля';
    if (pricePrev < 0) next.pricePrev = 'Не может быть отрицательной';
    if (discount < 0 || discount > 100) next.discount = 'От 0 до 100';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (!validate()) return;

    const update: ProductUpdate = { id: product.id };
    if (title !== product.title) update.title = title;
    if (description !== product.description) update.description = description;
    if (price !== product.price) update.price = price;
    if (pricePrev !== product.pricePrev) update.pricePrev = pricePrev;
    if (categoryId !== product.categoryId) update.categoryId = categoryId;
    if (discount !== product.discount) update.discount = discount;
    if (isHot !== product.isHot) update.isHot = isHot;

    if (Object.keys(update).length > 1) {
      dispatch(updateProductApi(update));
    }

    onCloseHandler({} as React.MouseEvent);
  };

  const cls = (key: string) => `form-control${errors[key] ? ' is-invalid' : ''}`;

  return (
    <form className="app-form" onSubmit={onSubmit}>
      <div className="form-section">
        <h6 className="form-section__title">Основное</h6>
        <div className="row g-3">
          <div className="col-12">
            <label className="form-label">Название*</label>
            <input
              type="text"
              className={cls('title')}
              value={title}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            />
            {errors.title && <div className="invalid-feedback">{errors.title}</div>}
          </div>
          <div className="col-12">
            <label className="form-label">Описание</label>
            <textarea
              className={cls('description')}
              rows={4}
              value={description}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
            />
          </div>
          <div className="col-12">
            <label className="form-label">Категория*</label>
            <select
              className={`form-select${errors.categoryId ? ' is-invalid' : ''}`}
              value={categoryId}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setCategoryId(e.target.value)}
            >
              <option value="">— Выберите категорию —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
            {errors.categoryId && <div className="invalid-feedback">{errors.categoryId}</div>}
          </div>
        </div>
      </div>

      <div className="form-section">
        <h6 className="form-section__title">Цены</h6>
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">Цена, ₸*</label>
            <input
              type="number"
              min={0}
              className={cls('price')}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
            {errors.price && <div className="invalid-feedback">{errors.price}</div>}
          </div>
          <div className="col-md-4">
            <label className="form-label">Старая цена, ₸</label>
            <input
              type="number"
              min={0}
              className={cls('pricePrev')}
              value={pricePrev}
              onChange={(e) => setPricePrev(Number(e.target.value))}
            />
            {errors.pricePrev && <div className="invalid-feedback">{errors.pricePrev}</div>}
          </div>
          <div className="col-md-4">
            <label className="form-label">Скидка, %</label>
            <input
              type="number"
              min={0}
              max={100}
              className={cls('discount')}
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
            />
            {errors.discount && <div className="invalid-feedback">{errors.discount}</div>}
          </div>
        </div>
      </div>

      <div className="form-section">
        <h6 className="form-section__title">Дополнительно</h6>
        <div className="form-check form-switch">
          <input
            type="checkbox"
            role="switch"
            className="form-check-input"
            id="product-edit-isHot"
            checked={isHot}
            onChange={(e) => setIsHot(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="product-edit-isHot">
            Популярный товар (отображается с бейджем «Hot»)
          </label>
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

export default memo(ProductEditComponent);
