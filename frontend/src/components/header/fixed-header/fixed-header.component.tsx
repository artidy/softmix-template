import Logo from '../../logo';
import Menu from '../../menu';
import SocialLinks from '../../social-links';
import {AppRoutes} from '../../../const';
import {MutableRefObject, useRef, useState} from 'react';

const MAIN_MENU = {
  navClass: 'main-mnu',
  listClass: 'main-mnu-list main-mnu-list-min',
  elements: [
    {
      title: 'Главная',
      dataTitle: 'Главная',
      link: AppRoutes.Main,
      className: ''
    },
    {
      title: 'О компании',
      dataTitle: 'О компании',
      link: AppRoutes.About,
      className: ''
    },
    {
      title: 'Услуги',
      dataTitle: 'Услуги',
      link: AppRoutes.Services,
      className: ''
    },
    {
      title: 'Товары',
      dataTitle: 'Товары',
      link: AppRoutes.Products,
      className: ''
    },
    {
      title: 'Контакты',
      dataTitle: 'Контакты',
      link: AppRoutes.Contacts,
      className: ''
    }
  ]
}

const FIXED_STYLES = {
  zIndex: 1000,
  position: 'fixed',
  top: 0,
  marginLeft: 0,
  width: '100%',
  left: 0
}

const FixedHeaderComponent = (): JSX.Element => {
  const headerFixed: MutableRefObject<HTMLElement | null> = useRef(null);
  const [fixed, setFixed] = useState(false);

  const changeFixed = () => {
    if (headerFixed.current) {
      const currentValue = window.scrollY > headerFixed.current?.offsetTop;
      if (currentValue !== fixed) {
        setFixed(currentValue);
      }
    }
  }

  window.addEventListener('scroll', changeFixed);
  changeFixed();

  return (
    <>
      <nav className="header-fixed" ref={headerFixed} style={fixed ? Object.assign(FIXED_STYLES) : {} }>
        <div className="container">
          <div className="row flex-nowrap align-items-center justify-content-between">
            <div className="col-auto d-block d-lg-none header-fixed-col">
              <div className="main-mnu-btn">
                <span className="bar bar-1"></span>
                <span className="bar bar-2"></span>
                <span className="bar bar-3"></span>
                <span className="bar bar-4"></span>
              </div>
            </div>
            <div className="col-auto header-fixed-col">
              <Logo title="Soft Mix" src="assets/img/logo.png" />
            </div>
            <div className="col-lg col-auto col-static header-fixed-col">
              <div className="row flex-nowrap align-items-center justify-content-end">
                <div className="col-auto header-fixed-col d-none d-lg-block col-static">
                  <Menu {...MAIN_MENU} />
                </div>
                <div className="col-auto header-fixed-col col-static">
                  <ul className="header-actions">
                    <li className="d-none d-sm-block">
                      <div className="header-action-icon side-open header-account" data-side=".side-account">
                        <i className="material-icons md-24">login</i>
                      </div>
                    </li>
                    <li className="d-none d-sm-block">
                      <div className="header-action-icon header-wishlist wishlist_popup_open">
                        <i className="material-icons md-24">favorite_border</i>
                        <span className="ha-count">3</span>
                      </div>
                    </li>
                    <li>
                      <div className="header-action-icon side-open header-cart" data-side=".side-cart">
                        <i className="material-icons material-icons-outlined md-22">shopping_cart</i>
                        <span className="ha-count">3</span>
                      </div>
                    </li>
                    <li className="d-none d-lg-block">
                      <div className="header-lang">
                        <div className="header-lang-current"><i className="material-icons md-22">language</i></div>
                        <ul className="header-lang-list">
                          <li className="active"><a href="#!" className="hover-link" data-lang="En"
                                                    data-title="English"><span>English</span></a></li>
                          <li><a href="#!" className="hover-link" data-lang="Sp"
                                 data-title="Spanish"><span>Spanish</span></a></li>
                          <li><a href="#!" className="hover-link" data-lang="It"
                                 data-title="Italian"><span>Italian</span></a></li>
                          <li><a href="#!" className="hover-link" data-lang="Uk"
                                 data-title="Ukraine"><span>Ukraine</span></a></li>
                          <li><a href="#!" className="hover-link" data-lang="Ru"
                                 data-title="Russian"><span>Russian</span></a></li>
                        </ul>
                      </div>
                    </li>
                    <li>
                      <div className="header-search">
                        <div className="header-action-icon header-search-ico">
                          <i className="material-icons md-22 header-search-ico-search">search</i>
                          <i className="material-icons md-22 header-search-ico-close">close</i>
                        </div>
                        <form action="#!" method="post" className="header-search-form">
                          <div className="container">
                            <div className="row">
                              <div className="col-12">
                                <div className="form-field">
                                  <label htmlFor="field-search" className="form-field-label">Search...</label>
                                  <input type="search" className="form-field-input" name="Search" autoComplete="off"
                                         required={true} id="field-search" defaultValue="" />
                                  <button type="submit" className="header-search-btn"><i
                                    className="material-icons md-22">search</i></button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </li>
                    <li className="d-block d-lg-none">
                      <div className="header-navbar">
                        <div className="header-navbar-btn">
                          <i className="material-icons md-24">more_vert</i>
                        </div>
                        <ul className="header-navbar-content">
                          <li>
                            <ul className="header-actions">
                              <li className="d-block d-sm-none">
                                <div className="header-action-icon side-open header-account"
                                     data-side=".side-account">
                                  <i className="material-icons md-24">login</i>
                                </div>
                              </li>
                              <li className="d-block d-sm-none">
                                <div className="header-action-icon header-wishlist wishlist_popup_open">
                                  <i className="material-icons md-24">favorite_border</i>
                                  <span className="ha-count">3</span>
                                </div>
                              </li>
                            </ul>
                          </li>
                          <li>
                            <a href="mailto:mail@example.com">
                              <i className="material-icons md-20">mail_outline</i>
                              <span>mail@example.com</span>
                            </a>
                          </li>
                          <li>
                            <a href="mailto:mail@example.com" className="formingHrefTel">
                              <i className="material-icons md-20">support_agent</i>
                              <span>1-888-777-1234</span>
                            </a>
                          </li>
                          <li>
                            <b>Free shipping:</b>
                            <span>On orders over $150</span>
                          </li>
                          <li>
                            <a href="#сallback_popup" className="header-call-back-link сallback_popup_open">
                              <i className="material-icons">ring_volume</i>
                              <span>Callback</span>
                            </a>
                          </li>
                          <li>
                            <SocialLinks className="social-links" />
                          </li>
                        </ul>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <div></div>
    </>
  )
}

export default FixedHeaderComponent;
