import { memo, ReactElement } from 'react';
import Slider from 'react-slick';

import SliderArrowComponentNext from '../slider/slider-arrow-next.component';
import SliderArrowComponentPrev from '../slider/slider-arrow-prev.component';
import NewsItemComponent from './news-item.component';

function NewsAreaComponent(): ReactElement {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    className: 'row ltn__blog-slider-one-active slick-arrow-1',
    autoplay: true,
    nextArrow: <SliderArrowComponentNext />,
    prevArrow: <SliderArrowComponentPrev />,
  }

  return (
    <div className="slider-container ltn__blog-area pt-60 pb-30">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="section-title-area text-center">
              <h2 className="section-title section-title-border">Новости</h2>
            </div>
          </div>
        </div>
        <Slider {...settings}>
          <NewsItemComponent
            href="blog-details.html"
            title="Вышло обновление на 1С:Бухгалтерия"
            imageUrl="assets/img/blog/1.jpg"
            author="Админ"
            date="Ноя 18, 2020"
          />
          <NewsItemComponent
            href="blog-details.html"
            title="Компания NVIDIA выпустила новую мощную видеокарту скоро у нас в продаже"
            imageUrl="assets/img/blog/2.jpg"
            author="Админ"
            date="Ноя 18, 2020"
          />
          <NewsItemComponent
            href="blog-details.html"
            title="В декабре планируем повышение цен на наши услуги"
            imageUrl="assets/img/blog/3.jpg"
            author="Админ"
            date="Авг 10, 2024"
          />
          <NewsItemComponent
            href="blog-details.html"
            title="В декабре планируем повышение цен на наши услуги"
            imageUrl="assets/img/blog/3.jpg"
            author="Админ"
            date="Авг 10, 2024"
          />
          <NewsItemComponent
            href="blog-details.html"
            title="Скоро поступление новых серверов от HP"
            imageUrl="assets/img/blog/4.jpg"
            author="Админ"
            date="Июл 13, 2024"
          />
          <NewsItemComponent
            href="blog-details.html"
            title="Добавили новые продукты 1С"
            imageUrl="assets/img/blog/5.jpg"
            author="Админ"
            date="Апр 30, 2024"
          />
        </Slider>
      </div>
    </div>
  )
}

export default memo(NewsAreaComponent);
