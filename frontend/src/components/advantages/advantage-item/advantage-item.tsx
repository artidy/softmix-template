type AdvantageItemProps = {
  materialIcon: string;
  title: string;
  description: string;
}

const AdvantageItem = ({materialIcon, title, description}: AdvantageItemProps): JSX.Element => {
  return (
    <div className="col-xl-3 col-md-6 col-12 item">
      <div className="ini-min">
        <div className="aim-icon">
          <i className="material-icons material-icons-outlined md-40">{materialIcon}</i>
        </div>
        <div className="aim-info">
          <h3 className="item-heading aim-heading">{title}</h3>
          <div className="aim-desc"><p>{description}</p></div>
        </div>
      </div>
    </div>
  )
}

export default AdvantageItem;
