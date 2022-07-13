function Cart(): JSX.Element {
  return (
    <div className="item-style card">
      <header className="card-header">
        <a href="product-single.html" className="card-image">
          <img data-src="assets/img/shop/s-img1-d.jpg" className="lazy"
               src="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
               alt="" />
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
        <div className="card-badges">
          <div className="card-badge card-badge-sale">sale</div>
        </div>
      </header>
      <div className="card-info">
        <ul className="list-style-none card-rating">
          <li><i className="material-icons md-18">star</i></li>
          <li><i className="material-icons md-18">star</i></li>
          <li><i className="material-icons md-18">star</i></li>
          <li><i className="material-icons md-18">star</i></li>
          <li><i className="material-icons md-18">star</i></li>
        </ul>
        <div className="card-posted-in">
          <a href="#!" className="card-category" title="Food & Grocery">Food & Grocery</a>
        </div>
        <h3 className="item-heading card-heading">
          <a href="product-single.html" title="Green seedless grapes">Green seedless grapes</a>
        </h3>
        <div className="card-prices">
          <div className="card-price">$16.50</div>
        </div>
      </div>
      <footer className="card-footer card-footer-abs">
        <a href="#!" className="btn btn-small ripple" aria-label="Add 'Current title' to your cart" rel="nofollow">
          <span>Add to cart</span>
        </a>
      </footer>
    </div>
  )
}

export default Cart;
