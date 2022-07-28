import Service from "../../types/service";

type ServiceElementProps = {
  service: Service;
}

const ServiceElement = ({service}: ServiceElementProps): JSX.Element => {
  return (
    <div className="col-lg-4 col-sm-6 col-sm-6 col-12 item">
      <a href="single-services.html" className="pitem item-square pitem-flip">
        <div className="pitem-card pitem-card-front">
          <img data-src={service.preview}
               className="lazy"
               src="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAw
               CAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
               alt="" />
        </div>
        <div className="pitem-card pitem-card-details pitem-card-back">
          <div className="pitem-card-center">
            <h5 className="pitem-heading">{service.title}</h5>
            <div className="pitem-desc">
              <p>{service.description}</p>
            </div>
            <div className="pitem-btns wrapp-btn-circl-arrow justify-content-center">
              <div className="btn-circl-arrow btn-circl-arrow-white">
                <svg viewBox="0 0 13 9" width="13" height="9">
                  <use xlinkHref="assets/img/sprite.svg#arrow-right"></use>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </a>
    </div>
  )
}

export default ServiceElement;

