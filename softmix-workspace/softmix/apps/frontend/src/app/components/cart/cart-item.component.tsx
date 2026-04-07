import { memo, ReactElement } from 'react';
import { Link } from 'react-router-dom';

import { AppRoute } from '../../const';

type CartItemComponentProps = {
  id: string;
  imgUrl: string;
  title: string;
  price: number;
  count: number;
}

function CartItemComponent({id, imgUrl, title, price, count}: CartItemComponentProps): ReactElement {
  return (
    <div className="mini-cart-item clearfix">
      <div className="mini-cart-img">
        <Link to={`${AppRoute.Shop}/${id}`}>
          <img src={imgUrl} alt={title} />
        </Link>
        <span className="mini-cart-item-delete">
          <i className="icon-trash"></i>
        </span>
      </div>
      <div className="mini-cart-info">
        <h6><Link to={`${AppRoute.Shop}/${id}`}>{title}</Link></h6>
        <span className="mini-cart-quantity">{`${count} x ${price} тг`}</span>
      </div>
    </div>
  )
}

export default memo(CartItemComponent);
