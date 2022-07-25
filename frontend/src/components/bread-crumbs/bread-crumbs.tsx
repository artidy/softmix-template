import BreadCrumb from "../../types/bread-crumb";

type BreadCrumbsProps = {
  elements: BreadCrumb[];
}

const BreadCrumbs = ({elements}: BreadCrumbsProps): JSX.Element => {
  const content = elements.map((breadCrumb) => <li><a href={breadCrumb.link}>{breadCrumb.title}</a></li>);

  return (
    <nav className="bread-crumbs">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <ul className="bread-crumbs-list">
              <li>
                <a href="/">Главная</a>
                <i className="material-icons md-18">chevron_right</i>
              </li>
              {content}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default BreadCrumbs;
