import { MouseEvent, memo, ReactElement, useState } from 'react';

import { Product } from '../../types/product';
import { DEFAULT_PRODUCT_IMG } from '../../const';

import './downloads.css';
import { useAppDispatch } from '../../hooks';
import { deleteNewProduct, addNewProduct } from '../../store/downloads-data/downloads-data';

type ProductDownloadComponentProps = {
  product: Product;
}

function ProductDownloadComponent({product}: ProductDownloadComponentProps): ReactElement {
  const dispatch = useAppDispatch();
  const [isChosen, setChoose] = useState(false);

  const onChooseHandler = (evt: MouseEvent<HTMLDivElement>) => {
    const result = !isChosen;

    setChoose(result);

    if (result) {
      dispatch(addNewProduct(product));

      return;
    }

    dispatch(deleteNewProduct(product.id));
  }

  return (
    <div className="col-xl-3 col-sm-6 col-12">
      <div className={`ltn__product-item text-center${isChosen ? ' downloads-chosen' : ''}`} onClick={onChooseHandler}>
        <div className="product-img">
          <img src={product.imageUrl ? product.imageUrl : DEFAULT_PRODUCT_IMG} alt={product.title} />
        </div>
        <div className="product-info">
          <h2 className="product-title">{product.title}</h2>
          <div className="product-price">
            <span>{product.price}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(ProductDownloadComponent);
