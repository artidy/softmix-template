import Brand from "../../../types/brand";

const CustomersItem = ({title, logo}: Brand): JSX.Element => {
  return (
    <div className="col-lg-3 col-md-4 col-sm-4 col-6 item">
      <div className="brands-item item-style">
        <img data-src={logo} className="lazy"
             src="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
             alt={title} />
      </div>
    </div>
  )
}

export default CustomersItem;
