import { memo, ReactElement } from 'react';

function BannerAreaComponent(): ReactElement {
  return (
    <div className="ltn__banner-area mt-80">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-4 col-md-6">
            <div className="ltn__banner-item">
              <div className="ltn__banner-img">
                <a href="shop.html">
                  <img src="assets/img/banner/1.jpg" alt="Banner" />
                </a>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6">
            <div className="ltn__banner-item">
              <div className="ltn__banner-img">
                <a href="shop.html">
                  <img src="assets/img/banner/2.jpg" alt="Banner" />
                </a>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6">
            <div className="ltn__banner-item">
              <div className="ltn__banner-img">
                <a href="shop.html">
                  <img src="assets/img/banner/3.jpg" alt="Banner" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(BannerAreaComponent);
