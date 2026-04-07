import { memo, ReactElement } from 'react';

type SliderAreaItemComponentProps = {
  title: string;
  link: string;
  image: string;
  alt: string;
  discount: number;
  price: number;
  prevPrice: number;
}

function SliderAreaItemComponent({title, link, image, alt, discount, price, prevPrice}: SliderAreaItemComponentProps): ReactElement {
  const discountContent = discount > 0 ? (
    <div className="product-badge">
      <ul>
        <li className="badge-2">${discount}%</li>
      </ul>
    </div>) : null;

  const prevPriceContent = prevPrice > 0 ? <del>{prevPrice} тг</del> : null;

  return (
    <div className="col-12">
      <div className="ltn__product-item text-center">
        <div className="product-img">
          <a href={link}><img src={image} alt={alt}/></a>
          {discountContent}
          <div className="product-hover-action product-hover-action-2">
            <ul>
              <li>
                <a href="#" title="Quick View" data-bs-toggle="modal" data-bs-target="#quick_view_modal">
                  <i className="icon-magnifier"></i>
                </a>
              </li>
              <li className="add-to-cart">
                <a href="#" title="Add to Cart" data-bs-toggle="modal" data-bs-target="#add_to_cart_modal">
                  <span className="cart-text d-none d-xl-block">В корзину</span>
                  <span className="d-block d-xl-none"><i className="icon-handbag"></i></span>
                </a>
              </li>
              <li>
                <a href="#" title="Quick View" data-bs-toggle="modal" data-bs-target="#quick_view_modal">
                  <i className="icon-shuffle"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="product-info">
          <h2 className="product-title"><a href={link}>{title}</a></h2>
          <div className="product-price">
            <span>{price} тг</span>
            {prevPriceContent}
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(SliderAreaItemComponent);
