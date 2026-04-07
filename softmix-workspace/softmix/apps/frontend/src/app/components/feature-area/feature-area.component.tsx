import { memo, ReactElement } from 'react';

function FeaturesComponent(): ReactElement {
  return (
    <div className="ltn__feature-area mt-100 mt--65">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="ltn__feature-item-box-wrap ltn__feature-item-box-wrap-2 ltn__border section-bg-6 position-relative">
              <div className="ltn__feature-item ltn__feature-item-8">
                <div className="ltn__feature-icon">
                  <img src="assets/img/icons/8-trolley.svg" alt="#" />
                </div>
                <div className="ltn__feature-info">
                  <h4>Бесплатная доставка</h4>
                  <p>От 50 000 тг</p>
                </div>
              </div>
              <div className="ltn__feature-item ltn__feature-item-8">
                <div className="ltn__feature-icon">
                  <img src="assets/img/icons/9-money.svg" alt="#" />
                </div>
                <div className="ltn__feature-info">
                  <h4>14 на возврат товара</h4>
                  <p>Гарантия возврата</p>
                </div>
              </div>
              <div className="ltn__feature-item ltn__feature-item-8">
                <div className="ltn__feature-icon">
                  <img src="assets/img/icons/10-credit-card.svg" alt="#" />
                </div>
                <div className="ltn__feature-info">
                  <h4>Безопасные платежи</h4>
                  <p>Все виды платежей</p>
                </div>
              </div>
              <div className="ltn__feature-item ltn__feature-item-8">
                <div className="ltn__feature-icon">
                  <img src="assets/img/icons/11-gift-card.svg" alt="#" />
                </div>
                <div className="ltn__feature-info">
                  <h4>Закажи и оплати</h4>
                  <p>Получи скидку или подарок</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(FeaturesComponent);
