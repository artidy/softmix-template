const SORTING = [
  "По популярности",
  "По новизне",
  "По рейтингу"
]

const Filters = (): JSX.Element => {
  return (
    <div className="row gutters-20 align-items-center shop-sorting">
      <div className="col-lg-4 col-md-6 col-auto">
        <div className="shop-sorting-items">
          <div className="shop-sorting-item shop-filter-toggle d-lg-none">
            <a className="btn btn-with-icon btn-border btn-small ripple side-open" data-side=".sidebar-filters">
              <i className="material-icons btn-icon-left md-22">filter_list</i>
              <span>Фильтры</span>
            </a>
          </div>
          <div className="shop-sorting-item shop-result-count d-none d-md-block">Showing 1–12 of 44 results</div>
        </div>
      </div>
      <div className="col-lg-8 col-md-6 col">
        <div className="shop-sorting-items justify-content-end">
          <div className="d-none d-lg-block">
            <ul className="shop-sorting-item list-style-none orderby-list hl-list">
              {SORTING.map((sort) => {
                return (<li key={sort}>
                          <a className="hover-link" href="#!" data-title={sort}><span>{sort}</span></a>
                        </li>)
              })}
            </ul>
          </div>
          <div className="d-none d-md-block shop-sorting-item">
            <ul className="list-style-none shop-gridlist-toggle">
              <li className="active">
                <a href="shop.html">
                  <i className="material-icons md-20">grid_view</i>
                </a>
              </li>
              <li>
                <a href="shop-list.html">
                  <i className="material-icons md-20">format_list_bulleted</i>
                </a>
              </li>
            </ul>
          </div>
          <form className="shop-sorting-item shop-ordering d-lg-none" action="#!" method="get">
            <div className="form-field form-field-small form-field-m0">
              <div className="select">
                <select name="orderby" className="shop-orderby" aria-label="Shop order">
                  <option value="menu_order" selected={true}>По умолчанию</option>
                  <option value="popularity">По популярности</option>
                  <option value="rating">По рейтингу</option>
                  <option value="date">По новизне</option>
                </select>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Filters;
