import { ChangeEvent, memo, MouseEvent, MouseEventHandler, ReactElement, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../hooks';
import { getCategories } from '../../store/categories-data/selectors';
import { createProductApi } from '../../store/products-data/api-actions';

type ProductAddComponentProp = {
  onCloseHandler: MouseEventHandler;
}

function ProductAddComponent({onCloseHandler}: ProductAddComponentProp): ReactElement {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(getCategories);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [categoryId, setCategoryId] = useState(categories[0].id);
  const [isHot, setIsHot] = useState(false);

  const onCreateHandler = (evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();

    if (title === '' ||
    description === '' ||
    price === 0 ||
    categoryId === '') return;

    dispatch(createProductApi({
      title,
      description,
      price,
      discount,
      pricePrev: 0,
      categoryId,
      isHot
    }));
    onCloseHandler(null);
  }

  const onChangeTitleHandler = (evt: ChangeEvent<HTMLInputElement>) => {
    setTitle(evt.target.value);
  }

  const onChangeDescriptionHandler = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(evt.target.value);
  }

  const onChangePriceHandler = (evt: ChangeEvent<HTMLInputElement>) => {
    setPrice(+evt.target.value);
  }

  const onChangeDiscountHandler = (evt: ChangeEvent<HTMLInputElement>) => {
    setDiscount(+evt.target.value);
  }

  const onChangeCategoryIdHandler = (evt: ChangeEvent<HTMLSelectElement>) => {
    setCategoryId(evt.target.value);
  }

  const onChangeIsHotHandler = (evt: ChangeEvent<HTMLInputElement>) => {
    setIsHot(Boolean(evt.target.value));
  }

  const categoriesContent = categories.map((category) =>
    <option value={category.id}>{category.title}</option>)

  return (
    <>
      <h5>Добавление нового товара</h5>
      <div className="row m-2 product">
        <label>Категория</label>
        <select className="nice-select mb-3 w-100" onChange={onChangeCategoryIdHandler}>
          {categoriesContent}
        </select>
        <label>Наименование товара</label>
        <input
          type="text"
          name="title"
          placeholder="введите наименование"
          value={title}
          onChange={onChangeTitleHandler}
        />
        <label>Описание товара</label>
        <textarea
          name="description"
          placeholder="введите описание"
          value={description}
          onChange={onChangeDescriptionHandler}
        />
        <div className="col-md-6">
          <label>Цена товара</label>
          <input
            type="number"
            name="price"
            placeholder="введите цену"
            value={price}
            onChange={onChangePriceHandler}
          />
        </div>
        <div className="col-md-6 mb-2">
          <label>Скидка на товар</label>
          <input
            type="number"
            name="discount"
            placeholder="введите скидку"
            value={discount}
            onChange={onChangeDiscountHandler}
          />
        </div>
        <div className="col-md-12">
          <label>Популярный товар</label>
          <input
            className="ml-2"
            type="checkbox"
            name="is-hot"
            placeholder="Скидка"
            value={String(isHot)}
            onChange={onChangeIsHotHandler}
          />
        </div>
      </div>
      <div className="btn-wrapper">
        <button className="theme-btn-1 btn btn-effect-1" onClick={onCreateHandler}>
          Добавить
        </button>
        <button className="theme-btn-2 btn btn-effect-2" onClick={onCloseHandler}>
          Отменить
        </button>
      </div>
    </>
  )
}

export default memo(ProductAddComponent);
