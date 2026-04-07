import { ChangeEvent, memo, MouseEvent, MouseEventHandler, ReactElement, useState } from 'react';
import { ProductUpdate } from '@project-lib/shared-types';

import { useAppDispatch, useAppSelector } from '../../hooks';
import { getCategories } from '../../store/categories-data/selectors';
import { updateProductApi } from '../../store/products-data/api-actions';
import { Product } from '../../types/product';

type ProductAddComponentProp = {
  product: Product;
  onCloseHandler: MouseEventHandler;
}

function ProductEditComponent({product, onCloseHandler}: ProductAddComponentProp): ReactElement {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(getCategories);
  const [title, setTitle] = useState(product.title);
  const [description, setDescription] = useState(product.description);
  const [price, setPrice] = useState(product.price);
  const [discount, setDiscount] = useState(product.discount);
  const [categoryId, setCategoryId] = useState(product.categoryId);
  const [isHot, setIsHot] = useState(product.isHot);

  const onEditHandler = (evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();

    const editProduct: ProductUpdate = {
      id: product.id,
    };

    if (title !== product.title) {
      editProduct.title = title;
    }

    if (description !== product.description) {
      editProduct.description = description;
    }

    if (description !== product.description) {
      editProduct.description = description;
    }

    if (price !== product.price) {
      editProduct.price = price;
    }

    if (categoryId !== product.categoryId) {
      editProduct.categoryId = categoryId;
    }

    if (discount !== product.discount) {
      editProduct.discount = discount;
    }

    if (isHot !== product.isHot) {
      editProduct.isHot = isHot;
    }

    const updatedFieldsCount = Object.keys(editProduct).length;

    if (updatedFieldsCount > 1) {
      dispatch(updateProductApi(editProduct));
    }

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
    <option key={category.id} value={category.id}>{category.title}</option>)

  return (
    <>
      <h5>Редактирование товара</h5>
      <div className="row m-2 product">
        <label>Категория</label>
        <select className="nice-select mb-3 w-100" value={categoryId} onChange={onChangeCategoryIdHandler}>
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
            checked={isHot}
            onChange={onChangeIsHotHandler}
          />
        </div>
      </div>
      <div className="btn-wrapper">
        <button className="theme-btn-1 btn btn-effect-1" onClick={onEditHandler}>
          Добавить
        </button>
        <button className="theme-btn-2 btn btn-effect-2" onClick={onCloseHandler}>
          Отменить
        </button>
      </div>
    </>
  )
}

export default memo(ProductEditComponent);
