import { memo, ReactElement } from 'react';

type MainSliderItemComponentProps = {
  imageUrl: string;
  title: string;
  label: string;
  description: string;
  link: string;
}

function MainSliderItemComponent({imageUrl, title, label, description, link}: MainSliderItemComponentProps): ReactElement {
  return (
    <div className="ltn__slide-item ltn__slide-item-8 text-color-white---- bg-image bg-overlay-theme-black-80---" style={{backgroundImage: `url(${imageUrl})`}}>
      <div className="ltn__slide-item-inner">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 align-self-center">
              <div className="slide-item-info">
                <div className="slide-item-info-inner ltn__slide-animation">
                  <h3 className="slide-title animated">{title}</h3>
                  <h6 className="slide-sub-title ltn__body-color slide-title-line animated">
                    {label}
                  </h6>
                  <div className="slide-brief animated">
                    <p>{description}</p>
                  </div>
                  <div className="btn-wrapper animated">
                    <a href={link} className="theme-btn-1 btn btn-round">Купить</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(MainSliderItemComponent);
