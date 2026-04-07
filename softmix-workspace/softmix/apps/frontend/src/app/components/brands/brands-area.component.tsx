import { memo, ReactElement } from 'react';
import Slider from 'react-slick';

import BrandItemComponent from './brand-item.component';

function BrandsAreaComponent(): ReactElement {
  const settings = {
    dots: false,
    infinite: true,
    className: 'row ltn__brand-logo-active"',
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    arrows: false,
  };

  return (
    <div className="slider-container ltn__brand-logo-area ltn__brand-logo-1 section-bg-1 pt-35 pb-35 plr--5">
      <div className="container-fluid">
        <Slider {...settings}>
          <BrandItemComponent imageUrl="assets/img/brands/1.png" name="Brand Logo" />
          <BrandItemComponent imageUrl="assets/img/brands/2.png" name="Brand Logo" />
          <BrandItemComponent imageUrl="assets/img/brands/3.png" name="Brand Logo" />
          <BrandItemComponent imageUrl="assets/img/brands/4.png" name="Brand Logo" />
          <BrandItemComponent imageUrl="assets/img/brands/5.png" name="Brand Logo" />
          <BrandItemComponent imageUrl="assets/img/brands/6.png" name="Brand Logo" />
          <BrandItemComponent imageUrl="assets/img/brands/1.png" name="Brand Logo" />
        </Slider>
      </div>
    </div>
  )
}

export default memo(BrandsAreaComponent);
