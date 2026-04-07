import { memo, ReactElement } from 'react';
import Slider from 'react-slick';

import MainSliderItemComponent from './main-slider-item.component';
import SliderArrowComponentPrev from './slider-arrow-prev.component';
import SliderArrowComponentNext from './slider-arrow-next.component';

function MainSliderComponent(): ReactElement {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    nextArrow: <SliderArrowComponentNext />,
    prevArrow: <SliderArrowComponentPrev />,
    pauseOnHover: true,
  };

  return (
    <div className="slider-container ltn__slider-area ltn__slider-3 ltn__slider-6 section-bg-1">
      <div className="ltn__slide-one-active slick-slide-arrow-1 slick-slide-dots-1 arrow-white---">
        <Slider {...settings}>
          <MainSliderItemComponent
            imageUrl="assets/img/slider/1c_slide.png"
            title="Бизнес-аналитика"
            label="Гарантированные преимущества"
            description="Статистика продаж и прибыльность по заказам, товарам, направлениям деятельности."
            link="service.html"
          />
          <MainSliderItemComponent
            imageUrl="assets/img/slider/dell_slide.jpg"
            title="Сервер Dell EMC PowerEdge R250"
            label="Неподвижные направляющие ReadyRails для стоек с четырьмя и двумя опорами."
            description="Выберите Dell ProSupport Plus для критически важных систем или аппаратную и программную поддержку Dell ProSupport класса Premium для решения PowerEdge."
            link="service.html"
          />
        </Slider>
      </div>
    </div>
  )
}

export default memo(MainSliderComponent);
