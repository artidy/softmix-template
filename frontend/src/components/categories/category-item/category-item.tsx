import Products from "../../products";
import {Product} from "../../../types/product";

type CategoryItemProps = {
  dataSrc: string;
  src: string;
  alt: string;
  title: string;
  btnHref: string;
  products: Product[];
}

const CategoryItem = ({dataSrc, src, alt, title, btnHref, products}: CategoryItemProps): JSX.Element => {
  return (
    <div className="col-md-6 item">
      <div className="item-style catt-item">
        <div className="catt-item-img">
          <img data-src={dataSrc} className="lazy img-cover"
               src={src}
               alt={alt} />
        </div>
        <div className="catt-item-info">
          <div className="catt-item-heading item-heading item-heading-middle">{title}</div>
          <Products products={products} />
          <div className="wrapp-btn-link">
            <a href={btnHref} className="btn-link">
              <span>View more</span>
              <svg className="btn-link-ico btn-link-ico-right" viewBox="0 0 13 9" width="13" height="9">
                <use xlinkHref="assets/img/sprite.svg#arrow-right"></use>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoryItem;
