import { memo, ReactElement } from 'react';
import Slider from "react-slick";

import SliderArrowComponentNext from './slider-arrow-next.component';
import SliderArrowComponentPrev from './slider-arrow-prev.component';
import { Product } from '../../types/product';
import ProductComponent from '../shop/product.component';
import { useAppSelector } from '../../hooks';
import { getIsHotProductsLoading } from '../../store/main-data/selectors';
import LoaderComponent from '../loader/loader.component';

type SliderAreaComponentProps = {
  products: Product[]
}

function SliderAreaComponent({products}: SliderAreaComponentProps): ReactElement {
  const isLoading = useAppSelector(getIsHotProductsLoading);

  if (isLoading) {
    return <LoaderComponent />
  }

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    className: 'row ltn__product-slider-item-four-active slick-arrow-1',
    autoplay: true,
    nextArrow: <SliderArrowComponentNext />,
    prevArrow: <SliderArrowComponentPrev />,
  }

  const productsContent = products.map((product) =>
    <ProductComponent
      key={product.id}
      className="col-12"
      imageUrl={product.imageUrl}
      product={product}
    />)

  return (
    <div className="slider-container ltn__product-slider-area ltn__product-gutter pt-60 pb-40">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="section-title-area text-center">
              <h2 className="section-title section-title-border">Популярное</h2>
            </div>
          </div>
        </div>
        <Slider {...settings}>
          {productsContent}
        </Slider>
      </div>
    </div>
  )
}

export default memo(SliderAreaComponent);
