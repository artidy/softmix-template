import Advantages from "../components/advantages";
import Categories from "../components/categories";

const Main = (): JSX.Element => {
  return (
    <>
      <div className="intro-grid">
        <div className="container">
          <div className="row ig-items">
            <div className="col-lg-8">
              <div className="item-border-radius ig-item ig-large ig-center">
                <div className="ig-item-bg lazy"
                     data-background-image-set="url('assets/img/shop/intro/ig1.jpg') 1x, url('assets/img/shop/intro/ig1@2x.jpg') 2x"></div>
                <div className="section-heading shm-none">
                  <div className="section-subheading">Entertainment</div>
                  <h1>Entertainment for your family</h1>
                </div>
                <div className="btn-group intro-btns">
                  <a href="shop.html" className="btn btn-with-icon btn-small ripple">
                    <span>Shop Now</span>
                    <svg className="btn-icon-right" viewBox="0 0 13 9" width="13" height="9">
                      <use xlinkHref="assets/img/sprite.svg#arrow-right"></use>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="row">
                <div className="col-lg-12 col-md-6">
                  <div className="item-border-radius ig-item ig-item-small">
                    <div>
                      <div className="ig-item-bg lazy"
                           data-background-image-set="url('assets/img/shop/intro/ig2.jpg') 1x, url('assets/img/shop/intro/ig2@2x.jpg') 2x"></div>
                      <div className="section-heading shm-none">
                        <div className="section-subheading">Appliances</div>
                        <h2>All for your <br /> kitchen</h2>
                      </div>
                      <div className="wrapp-btn-link">
                        <a href="shop.html" className="btn-link">
                          <span>Shop Now</span>
                          <svg className="btn-link-ico btn-link-ico-right" viewBox="0 0 13 9" width="13" height="9">
                            <use xlinkHref="assets/img/sprite.svg#arrow-right"></use>
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-12 col-md-6">
                  <div className="item-border-radius ig-item ig-item-small">
                    <div>
                      <div className="ig-item-bg lazy"
                           data-background-image-set="url('assets/img/shop/intro/ig3.jpg') 1x, url('assets/img/shop/intro/ig3@2x.jpg') 2x"></div>
                      <div className="section-heading shm-none">
                        <div className="section-subheading">Tech</div>
                        <h2>The best <br /> deals</h2>
                      </div>
                      <div className="wrapp-btn-link">
                        <a href="shop.html" className="btn-link">
                          <span>Shop Now</span>
                          <svg className="btn-link-ico btn-link-ico-right" viewBox="0 0 13 9" width="13" height="9">
                            <use xlinkHref="assets/img/sprite.svg#arrow-right"></use>
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Advantages />
      <Categories />
    </>
  )
}

export default Main;
