import { memo, ReactElement } from 'react';

type BadgeDiscountComponentProps = {
  discount: number;
}

function BadgeDiscountComponent({discount}: BadgeDiscountComponentProps): ReactElement {
  return (
    <div className="product-badge">
      <ul>
        <li className="badge-2">{discount}%</li>
      </ul>
    </div>
  )
}

export default memo(BadgeDiscountComponent);
