import { memo, ReactElement, MouseEvent, useState, ChangeEvent, FormEvent, ChangeEventHandler } from 'react';
import { ProductCreate } from '@project-lib/shared-types';

import { DownloadOptions } from '../../const';
import { useAppDispatch, useAppSelector } from '../../hooks';
import ModalComponent from '../modal/modal.component';
import CategoryPickComponent from './category-pick.component';
import { getNewProducts, getCategories, getPagination } from '../../store/downloads-data/selectors';
import { Product } from '../../types/product';
import { createProductManyApi } from '../../store/products-data/api-actions';

type PanelDownloadComponentProps = {
  currentCategoryId: number;
  onChangeCurrentCategoryHandler: ChangeEventHandler<HTMLSelectElement>;
  loadProducts: (pageNumber: number) => void;
}

function PanelDownloadComponent({currentCategoryId, onChangeCurrentCategoryHandler, loadProducts}: PanelDownloadComponentProps): ReactElement {
  const dispatch = useAppDispatch();
  const options = Object.keys(DownloadOptions);
  const categories = useAppSelector(getCategories);
  const newProducts = useAppSelector(getNewProducts);
  const pagination = useAppSelector(getPagination);
  const [currentOption, setCurrentOptions] = useState<string>(DownloadOptions.AlStyle);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [categoryId, setCategoryId] = useState<string>('');

  const downloadOptionsContent = options.map((option: DownloadOptions) =>
    <option key={option} value={option}>
      {DownloadOptions[option]}
    </option>
  );

  const downloadCategoriesContent = categories.map((category) =>
    <option key={category.id} value={category.id}>
      {category.title}
    </option>
  );

  const onClickDownload = (evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();

    if (currentCategoryId === 0) {
      return;
    }

    if (currentOption === DownloadOptions.AlStyle) {
      loadProducts(1);

      return;
    }
  }

  const onChangeHandler = (evt: ChangeEvent<HTMLSelectElement>) => {
    setCurrentOptions(DownloadOptions[evt.target.value]);
  }

  const onOpenModalHandler = (evt: MouseEvent<HTMLButtonElement>) => {
    setModalIsOpen(true);
  }

  const onCloseModalHandler = (evt: MouseEvent<HTMLButtonElement>) => {
    setModalIsOpen(false);
  }

  const onSaveNewProducts = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    if (categoryId === '') {
      return;
    }

    const products: ProductCreate[] = newProducts.map((product: Product) => {
      return {
        title: product.title,
        price: product.price,
        pricePrev: 0,
        imageUrl: product.imageUrl,
        description: product.description,
        categoryId: categoryId,
        isHot: false,
        downloadId: product.downloadId,
        downloadCompany: product.downloadCompany,
      }
    });

    if (products.length > 0) {
      dispatch(createProductManyApi(products));
    }

    setModalIsOpen(false);
  }

  return (
    <div className="ltn__shop-options">
      <ul>
        <li>
          <div className="showing-product-number text-right">
            <span>Товары: {
              Math.min(pagination.offset, pagination.total)
            }/{pagination.total}</span>
          </div>
        </li>
        <li>
          <div className="short-by text-center row">
            <select className="nice-select col-xl-2" value={currentOption} onChange={onChangeHandler}>
              {downloadOptionsContent}
            </select>
            <select className="nice-select col-xl-8" value={currentCategoryId} onChange={onChangeCurrentCategoryHandler}>
              <option key={0} value={0}>Выберите категорию</option>
              {downloadCategoriesContent}
            </select>
          </div>
          <div className="ltn__grid-list-tab-menu">
          <button className="theme-btn-1 btn btn-effect-1" onClick={onClickDownload}>
              Загрузить
            </button>
            <button className="theme-btn-2 btn btn-effect-2" onClick={onOpenModalHandler}>
              Добавить на сайт
            </button>
          </div>
        </li>
      </ul>
      <ModalComponent
        isOpen={modalIsOpen}
        onCloseHandler={onCloseModalHandler}
        children={
        <CategoryPickComponent
          onCloseHandler={onCloseModalHandler}
          setCategoryId={setCategoryId}
          categoryId={categoryId}
          onSaveProducts={onSaveNewProducts}
        />}
      />
    </div>
  )
}

export default memo(PanelDownloadComponent);
