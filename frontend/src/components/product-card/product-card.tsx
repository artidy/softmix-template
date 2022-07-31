import {Product} from "../../types/product";

const ProductCard = ({href, dataTitle, title, categoryId}: Product): JSX.Element => {
  return (
    <div className="col-xl-4 col-sm-6 card-item" data-category={categoryId}>
      <div className="card card4">
        <header className="card-header">
          <a href="product-single.html" className="card-image img-style">
            <img data-src={href} className="lazy"
                 src="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                 alt={title} />
          </a>
          <div className="card-actions">
            <button className="card-action-btn el-ripple card-action-wishlist">
              <i className="material-icons md-22">favorite_border</i>
            </button>
            <button className="card-action-btn el-ripple card-action-compare">
              <i className="material-icons md-22">compare_arrows</i>
            </button>
            <button className="card-action-btn el-ripple card-action-preview card_preview_popup_open">
              <i className="material-icons material-icons-outlined md-22">remove_red_eye</i>
            </button>
          </div>
        </header>
        <div className="card-info">
          <h3 className="item-heading card-heading">
            <a href="product-single.html" title={dataTitle}>{title}</a>
          </h3>
          <div className="card-prices">
            <div className="card-price">$32.50</div>
          </div>
        </div>
        <footer className="card-footer">
          <a href="#!" className="btn btn-small ripple" aria-label="Add 'Current title' to your cart" rel="nofollow">
            <span>Добавить в корзину</span>
          </a>
        </footer>
      </div>
    </div>
  )
}

export default ProductCard;
