import {AppRoutes} from "../const";
import BreadCrumbs from "../components/bread-crumbs";

const BREAD_CRUMBS = [
  {
    title: 'Контакты',
    link: AppRoutes.Contacts
  }
]

const ADDRESS = {
  mapLink: '#map',
  mapPoint: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2547.893081909212!2d71.4312641012326!3d51.124660504' +
    '20535!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4245841b8b42a6ab%3A0x6022b1a77b438bce!2z0JHQpiAi0KHQsNC' +
    '90LrRgi3Qn9C10YLQtdGA0LHRg9GA0LMi!5e0!3m2!1sru!2str!4v1658862941285!5m2!1sru!2str',
  title: 'Нур-Султан, ул. Достык 20 БЦ "Санкт-Петербург" офис 401'
}

const PHONES = [
  {
    title: '+7(7172)-78-72-06',
    link: 'tel:+77172787206'
  }
]

const EMAILS = [
  {
    title: 'info@softmix.kz',
    link: 'mailto:info@softmix.kz'
  }
]

const Contacts = (): JSX.Element => {
  const phoneContent = PHONES.map((phone) =>
    <a key={phone.title} href={phone.link} className="formingHrefTel">{phone.title}</a>);

  const emailsContent = EMAILS.map((email) => <a href={email.link}>{email.title}</a>);

  return (
    <>
      <BreadCrumbs elements={BREAD_CRUMBS} />
      <div className="section">
        <div className="container">
          <div className="row content-items">
            <div className="col-12">
              <div className="section-heading">
                <div className="section-subheading">мы всегда доступны</div>
                <h1>Наши контакты</h1>
              </div>
            </div>
            <div className="col-xl-4 col-md-5 content-item">
              <div className="contact-info section-bgc">
                <h3>Наш адрес</h3>
                <ul className="contact-list">
                  <li>
                    <i className="material-icons md-22">location_on</i>
                    <div className="footer-contact-info">
                      <a href={ADDRESS.mapLink}>
                        {ADDRESS.title}
                      </a>
                    </div>
                  </li>
                  <li>
                    <i className="material-icons md-22 footer-contact-tel">smartphone</i>
                    <div className="footer-contact-info">
                      {phoneContent}
                    </div>
                  </li>
                  <li>
                    <i className="material-icons md-22 footer-contact-email">email</i>
                    <div className="footer-contact-info">
                      {emailsContent}
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-xl-8 col-md-7 content-item">
              <form action="#!" method="post" className="contact-form contact-form-padding">
                <input type="hidden" name="form_subject" value="Contact form" />
                  <div className="row gutters-default">
                    <div className="col-12">
                      <h3>Контактная форма</h3>
                    </div>
                    <div className="col-xl-4 col-sm-6 col-12">
                      <div className="form-field">
                        <label htmlFor="contact-name" className="form-field-label">Ваше имя</label>
                        <input
                          type="text"
                          className="form-field-input"
                          name="Name"
                          value=""
                          autoComplete="off"
                          required={true}
                          id="contact-name"
                        />
                      </div>
                    </div>
                    <div className="col-xl-4 col-sm-6 col-12">
                      <div className="form-field">
                        <label htmlFor="contact-phone" className="form-field-label">Ваш номер телефона</label>
                        <input
                          type="tel"
                          className="form-field-input mask-phone"
                          name="Phone"
                          value=""
                          autoComplete="off"
                          required={true}
                          id="contact-phone"
                        />
                      </div>
                    </div>
                    <div className="col-xl-4 col-12">
                      <div className="form-field">
                        <label htmlFor="contact-email" className="form-field-label">Ваш email</label>
                        <input
                          type="email"
                          className="form-field-input"
                          name="Email"
                          value=""
                          autoComplete="off"
                          required={true}
                          id="contact-email"
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-field">
                        <label htmlFor="contact-message" className="form-field-label">Ваше сообщение</label>
                        <textarea
                          name="Message"
                          className="form-field-input"
                          id="contact-message"
                          cols={30}
                          rows={6}
                        >
                        </textarea>
                      </div>
                      <div className="form-field form-field-checkbox">
                        <div className="checkbox">
                          <input type="checkbox" className="checkbox-input" name="PrivacyPolicy" id="checkbox-popup" />
                          <label
                            htmlFor="checkbox-popup"
                            className="checkbox-label">Я согласен на передачу персональных данных в соответствии с<br />
                            <a href="privacy-policy.html">Политикой конфиденциальности</a></label>
                        </div>
                      </div>
                      <div className="form-btn">
                        <button type="submit" className="btn btn-w240 ripple"><span>Отправить сообщение</span></button>
                      </div>
                    </div>
                  </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div id='map' className="map">
        <iframe
          title={ADDRESS.title}
          className="lazy"
          data-src={ADDRESS.mapPoint}
        >
        </iframe>
      </div>
    </>
  )
}

export default Contacts;
