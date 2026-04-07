import { memo, ReactElement, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { getCategoryApi } from '../../store/categories-data/api-actions';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { getCategoryEdit, isLoading } from '../../store/categories-data/selectors';

type ProductDetailsComponentProps = {
  id: string;
  imgUrl: string;
  title: string;
  price: number;
  description: string;
  prevPrice: number;
  categoryId: string;
}

function ProductDetailsComponent(
  {id, imgUrl, categoryId, price, prevPrice, description, title}: ProductDetailsComponentProps): ReactElement {
  const dispatch = useAppDispatch();
  const category = useAppSelector(getCategoryEdit);
  const categoryIsLoading = useAppSelector(isLoading);

  useEffect(() => {
    dispatch(getCategoryApi(categoryId));
  }, []);

  const prevPriceContent = prevPrice > 0 ? <del>{prevPrice} тг</del> : null;
  const categoryContent = categoryIsLoading || !category ? null : (
    <div className="modal-product-meta ltn__product-details-menu-1 mb-30">
      <ul>
        <li>
          <strong>Категория:</strong>
          <span>
            <Link to="#">{category.title}</Link>
          </span>
        </li>
      </ul>
    </div>
  );

  return (
    <div className="ltn__shop-details-inner">
      <div className="row">
        <div className="col-md-6">
          <div className="ltn__shop-details-img-gallery ltn__shop-details-img-gallery-2">
            <div className="ltn__shop-details-large-img">
              <div className="single-large-img">
              <img src={imgUrl} alt={title} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="modal-product-info shop-details-info pl-0">
            <h3>{title}</h3>
            <div className="product-price-ratting mb-20">
              <ul>
                <li>
                  <div className="product-price">
                    <span>{price} тг</span>
                    {prevPriceContent}
                  </div>
                </li>
              </ul>
            </div>
            <div className="modal-product-brief">
              <p>{description}</p>
            </div>
            <div className="ltn__social-media mb-30">
              <ul>
                <li className="d-meta-title">Поделиться:</li>
                <li><Link to="#" title="Facebook"><i className="icon-social-facebook"></i></Link></li>
                <li><Link to="#" title="Twitter"><i className="icon-social-twitter"></i></Link></li>
                <li><Link to="#" title="Pinterest"><i className="icon-social-pinterest"></i></Link></li>
                <li><Link to="#" title="Instagram"><i className="icon-social-instagram"></i></Link></li>
              </ul>
            </div>
            {categoryContent}
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(ProductDetailsComponent);
