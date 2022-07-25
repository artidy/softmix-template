import AdvantageNumber from "../../../types/advantage-number";

const AdvantagesNumberItem = ({position, title, description}: AdvantageNumber): JSX.Element => {
  return (
    <div className="col-lg-4 col-md-6 col-12 litem">
      <div className="ini">
        <div className="ini-count">{position}</div>
        <div className="ini-info">
          <h3 className="ini-heading item-heading-large">{title}</h3>
          <div className="ini-desc">
            <p>{description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdvantagesNumberItem;
