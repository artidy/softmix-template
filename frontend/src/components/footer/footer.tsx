import Logo from "../logo";
import SocialLinks from "../social-links";
import Menu from "../menu";
import {AppRoutes} from "../../const";

const MAIN_MENU_FOOTER = {
  navClass: 'footer-nav',
  listClass: 'footer-mnu',
  elements: [
    {
      title: 'Главная',
      dataTitle: 'Главная',
      link: AppRoutes.Main,
      className: 'hover-link'
    },
    {
      title: 'О компании',
      dataTitle: 'О компании',
      link: AppRoutes.About,
      className: 'hover-link'
    },
    {
      title: 'Услуги',
      dataTitle: 'Услуги',
      link: AppRoutes.Services,
      className: 'hover-link'
    },
    {
      title: 'Товары',
      dataTitle: 'Товары',
      link: 'shop.html',
      className: 'hover-link'
    },
    {
      title: 'Контакты',
      dataTitle: 'Контакты',
      link: AppRoutes.Contacts,
      className: 'hover-link'
    }
  ]
}

const PRODUCT_MENU_FOOTER = {
  navClass: 'footer-nav',
  listClass: 'footer-mnu',
  elements: [
    {
      title: 'DB Management',
      dataTitle: 'DB Management',
      link: 'index.html',
      className: 'hover-link'
    },
    {
      title: 'IOS/MacOS',
      dataTitle: 'IOS/MacOS',
      link: 'services.html',
      className: 'hover-link'
    },
    {
      title: 'Android Apps',
      dataTitle: 'Android Apps',
      link: 'ui.html',
      className: 'hover-link'
    },
    {
      title: 'Windows Apps',
      dataTitle: 'Windows Apps',
      link: 'shop.html',
      className: 'hover-link'
    },
    {
      title: 'UX & UI',
      dataTitle: 'UX & UI',
      link: 'news.html',
      className: 'hover-link'
    }
  ]
}

const Footer = (): JSX.Element => {

  const changeEmail = () => {

  }

  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="container">
          <div className="row items">
            <div className="col-xl-3 col-lg-3 col-md-5 col-12 item">
              <div className="footer-company-info">
                <div className="footer-company-top">
                  <Logo title="Soft Mix" src="assets/img/logo.png" />
                  <div className="footer-company-desc">
                    <p>Our company has been developing high-quality and reliable software for corporate needs since
                      2008. We are renowned professionals of software development.</p>
                  </div>
                </div>
                <SocialLinks className="footer-social-links" />
              </div>
            </div>
            <div className="col-xl-2 offset-xl-1 col-md-3 col-5 col-lg-2 item">
              <div className="footer-item">
                <p className="footer-item-heading">Menu</p>
                <Menu {...MAIN_MENU_FOOTER} />
              </div>
            </div>
            <div className="col-xl-2 col-lg-3 col-md-3 col-7 item">
              <div className="footer-item">
                <p className="footer-item-heading">What We Offer</p>
                <Menu {...PRODUCT_MENU_FOOTER} />
              </div>
            </div>
            <div className="col-xs-4 col-lg-4 col-12 item">
              <div className="footer-item">
                <p className="footer-item-heading">Our contacts</p>
                <ul className="footer-contacts">
                  <li>
                    <i className="material-icons md-22">location_on</i>
                    <div className="footer-contact-info">
                      301 S Irving Blvd Los Angeles, CA 90020
                    </div>
                  </li>
                  <li>
                    <i className="material-icons md-22 footer-contact-tel">smartphone</i>
                    <div className="footer-contact-info">
                      <a href="#!" className="formingHrefTel">+1 323-913-4688</a>, <a href="#!"
                                                                                      className="formingHrefTel">+1
                      323-888-4554</a>
                    </div>
                  </li>
                  <li>
                    <i className="material-icons md-22 footer-contact-email">email</i>
                    <div className="footer-contact-info">
                      <a href="mailto:mail@example.com">mail@example.com</a>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="footer-item">
                <p className="footer-item-heading">Subscribe</p>
                <form action="#!" method="post" className="footer-subscribe">
                  <div className="form-field">
                    <label htmlFor="subscribe-email" className="form-field-label">Your email</label>
                    <input type="email" className="form-field-input" name="Subscribe_email" value="" autoComplete="off"
                           required={true} id="subscribe-email" onChange={changeEmail} />
                  </div>
                  <div className="form-btn">
                    <button type="submit" className="btn ripple"><span>Subscribe</span></button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <div className="row justify-content-between items">
            <div className="col-md-auto col-12 item">
              <nav className="footer-links">
                <ul>
                  <li><a href="terms-and-conditions.html">Terms and Conditions</a></li>
                  <li><a href="privacy-policy.html">Privacy Policy</a></li>
                </ul>
              </nav>
            </div>
            <div className="col-md-auto col-12 item">
              <div className="copyright">© 2021 PathSoft. All rights reserved.</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer;
