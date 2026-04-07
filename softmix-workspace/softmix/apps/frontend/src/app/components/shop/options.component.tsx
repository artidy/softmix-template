import { memo, ReactElement } from 'react';

import { useAppSelector } from '../../hooks';
import { getProductsPagination } from '../../store/products-data/selectors';

function OptionsComponent(): ReactElement {
  const pagination = useAppSelector(getProductsPagination);

  return (
    <div className="ltn__shop-options">
      <ul>
        <li>
          <div className="showing-product-number text-right">
            <span>Товары {pagination.offset} из {pagination.total}</span>
          </div>
        </li>
        <li>
          <div className="short-by text-center">
            <select className="nice-select">
              <option>Без сортировки</option>
              <option>Сортировка по популярности</option>
              <option>Сортировка по дате поступления</option>
              <option>Сортировка по цене: сначала самая низкая</option>
              <option>Сортировка по цене: сначала самая высокая</option>
            </select>
          </div>
          <div className="ltn__grid-list-tab-menu ">
            <div className="nav">
              <a className="active show" data-bs-toggle="tab" href="#liton_product_grid">
                <i className="icon-grid"></i>
              </a>
              <a data-bs-toggle="tab" href="#liton_product_list"><i className="icon-menu"></i></a>
            </div>
          </div>
        </li>
      </ul>
    </div>
  )
}

export default memo(OptionsComponent);
