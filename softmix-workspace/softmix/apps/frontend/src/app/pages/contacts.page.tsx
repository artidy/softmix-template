import { memo, ReactElement } from 'react';

import BreadcrumbComponent from '../components/breadcrumb/breadcrumb.component';
import { AppRoute } from '../const';
import { useAppSelector } from '../hooks';
import { getSettings } from '../store/settings-data/selectors';

function ContactsPage(): ReactElement {
  const settings = useAppSelector(getSettings);

  return (
    <>
      <BreadcrumbComponent
        title="Контакты"
        links={[
          {title: 'Главная', href: AppRoute.Main},
        ]}
        pageName="Контакты"
      />
      <div className="ltn__contact-address-area mb-60">
        <div className="container">
          <div className="row">
            <div className="col-lg-3">
              <div className="ltn__contact-address-item ltn__contact-address-item-4 box-shadow">
                <div className="ltn__contact-address-icon">
                  <i className="icon-location-pin"></i>
                </div>
                <h3>Адрес</h3>
                <p>{settings?.address || ''}</p>
              </div>
            </div>
            <div className="col-lg-3">
            <div className="ltn__contact-address-item ltn__contact-address-item-4 box-shadow">
                <div className="ltn__contact-address-icon">
                  <i className="icon-phone"></i>
                </div>
                <h3>Номер телефона</h3>
                <p>{settings?.phone || ''}</p>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="ltn__contact-address-item ltn__contact-address-item-4 box-shadow">
                <div className="ltn__contact-address-icon">
                  <i className="icon-envelope"></i>
                </div>
                <h3>Email</h3>
                <p><a href={`mailto:${settings?.email || ''}`}>{settings?.email || ''}</a></p>
              </div>
            </div>
            <div className="col-lg-3">
            <div className="ltn__contact-address-item ltn__contact-address-item-4 box-shadow">
                <div className="ltn__contact-address-icon">
                  <i className="icon-speedometer"></i>
                </div>
                <h3>Время работы</h3>
                <p>с Пн по Пт: с 9:00 до 18:00<br/>
                  Суббота, Воскресенье - выходные</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default memo(ContactsPage);
