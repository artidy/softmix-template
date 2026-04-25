import { ChangeEvent, FormEvent, memo, MouseEventHandler, ReactElement, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../hooks';
import { getCategories } from '../../store/categories-data/selectors';
import { createProductApi } from '../../store/products-data/api-actions';

type ProductAddComponentProp = {
  onCloseHandler: MouseEventHandler;
};

function ProductAddComponent({ onCloseHandler }: ProductAddComponentProp): ReactElement {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(getCategories);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [pricePrev, setPricePrev] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [categoryId, setCategoryId] = useState<string>(categories[0]?.id ?? '');
  const [isHot, setIsHot] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!title.trim()) next.title = 'Введите название товара';
    if (!description.trim()) next.description = 'Введите описание';
    if (!categoryId) next.categoryId = 'Выберите категорию';
    if (!price || price <= 0) next.price = 'Цена должна быть больше нуля';
    if (pricePrev < 0) next.pricePrev = 'Цена не может быть отрицательной';
    if (discount < 0 || discount > 100) next.discount = 'От 0 до 100';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (!validate()) return;

    dispatch(
      createProductApi({
        title: title.trim(),
        description: description.trim(),
        price,
        pricePrev,
        discount,
        categoryId,
        isHot,
      }),
    );
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
              placeholder="Например, Моноблок XG Crystal Desk GT40"
              value={title}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
              autoFocus
            />
            {errors.title && <div className="invalid-feedback">{errors.title}</div>}
          </div>
          <div className="col-12">
            <label className="form-label">Описание*</label>
            <textarea
              className={cls('description')}
              rows={4}
              placeholder="Краткое описание характеристик и особенностей"
              value={description}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
            />
            {errors.description && <div className="invalid-feedback">{errors.description}</div>}
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
            id="product-isHot"
            checked={isHot}
            onChange={(e) => setIsHot(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="product-isHot">
            Популярный товар (отображается с бейджем «Hot»)
          </label>
        </div>
      </div>

      <div className="app-form__footer">
        <button type="button" className="btn btn-outline-secondary" onClick={onCloseHandler}>
          Отмена
        </button>
        <button type="submit" className="btn btn-primary">
          <i className="fa fa-plus me-1"></i> Добавить товар
        </button>
      </div>
    </form>
  );
}

export default memo(ProductAddComponent);
