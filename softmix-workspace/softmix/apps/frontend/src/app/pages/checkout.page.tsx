import { ChangeEvent, FormEvent, ReactElement, useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CheckoutDto, DeliveryType, PaymentMethod } from '@project-lib/shared-types';

import { useAppDispatch, useAppSelector } from '../hooks';
import { AppRoute } from '../const';
import { getCart, getCartLoading } from '../store/cart-data/selectors';
import { getCart as fetchCart } from '../store/cart-data/api-actions';
import { getCheckoutLoading } from '../store/orders-data/selectors';
import { checkoutOrder } from '../store/orders-data/api-actions';
import { initPayment } from '../store/orders-data/payment-actions';
import { getIsAuth, getIsUnknown, getUser } from '../store/user-data/selectors';
import BreadcrumbComponent from '../components/breadcrumb/breadcrumb.component';
import Loader from '../components/loader/loader.component';
import {
  formatPhoneInput,
  formatPrice,
  isValidEmail,
  isValidKzPhone,
  phoneToE164,
} from '../utils/format';

const DELIVERY_OPTIONS: { value: DeliveryType; label: string; cost: number }[] = [
  { value: DeliveryType.Pickup, label: 'Самовывоз', cost: 0 },
  { value: DeliveryType.Courier, label: 'Курьер по городу', cost: 1500 },
  { value: DeliveryType.KazPost, label: 'Казпочта', cost: 1200 },
  { value: DeliveryType.Sdek, label: 'СДЭК', cost: 2000 },
];

const PAYMENT_OPTIONS: { value: PaymentMethod; label: string }[] = [
  { value: PaymentMethod.CashOnDelivery, label: 'Оплата при получении' },
  { value: PaymentMethod.BankTransfer, label: 'Банковский перевод' },
  { value: PaymentMethod.FreedomPay, label: 'Картой / Kaspi / Apple Pay (Freedom Pay)' },
];

const ONLINE_METHODS: PaymentMethod[] = [
  PaymentMethod.FreedomPay,
  PaymentMethod.KaspiPay,
  PaymentMethod.HalykEpay,
];

function CheckoutPage(): ReactElement {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const cart = useAppSelector(getCart);
  const cartLoading = useAppSelector(getCartLoading);
  const isAuth = useAppSelector(getIsAuth);
  const isUnknown = useAppSelector(getIsUnknown);
  const user = useAppSelector(getUser);
  const isCheckoutLoading = useAppSelector(getCheckoutLoading);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+7 ');
  const [email, setEmail] = useState('');
  const [deliveryType, setDeliveryType] = useState<DeliveryType>(DeliveryType.Courier);
  const [region, setRegion] = useState('');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [house, setHouse] = useState('');
  const [apartment, setApartment] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CashOnDelivery);
  const [comment, setComment] = useState('');

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      if (user.name) setName((prev) => prev || user.name);
      if (user.email) setEmail((prev) => prev || user.email);
      if (user.phone) setPhone((prev) => (prev === '+7 ' ? formatPhoneInput(user.phone) : prev));
      if (user.address) setStreet((prev) => prev || user.address);
    }
  }, [user]);

  const deliveryCost = useMemo(
    () => DELIVERY_OPTIONS.find((o) => o.value === deliveryType)?.cost ?? 0,
    [deliveryType],
  );

  const totalPrice = (cart?.totalPrice ?? 0) + deliveryCost;
  const isPickup = deliveryType === DeliveryType.Pickup;

  if (isUnknown || cartLoading) {
    return <Loader />;
  }

  if (!isAuth) {
    return <Navigate to={AppRoute.Login} state={{ from: AppRoute.Checkout }} replace />;
  }

  if (!cart || cart.items.length === 0) {
    return <Navigate to={AppRoute.Cart} replace />;
  }

  const handlePhoneChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhoneInput(evt.target.value));
  };

  const handleSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    if (!name.trim() || name.trim().length < 2) {
      toast.error('Укажите имя получателя');
      return;
    }
    if (!isValidKzPhone(phone)) {
      toast.error('Телефон должен быть в формате +7 7XX XXX-XX-XX');
      return;
    }
    if (!isValidEmail(email)) {
      toast.error('Некорректный email');
      return;
    }
    if (!isPickup && (!city.trim() || !street.trim() || !house.trim())) {
      toast.error('Укажите город, улицу и дом для доставки');
      return;
    }

    const dto: CheckoutDto = {
      contact: {
        name: name.trim(),
        phone: phoneToE164(phone),
        email: email.trim(),
      },
      delivery: {
        type: deliveryType,
        cost: deliveryCost,
        ...(isPickup
          ? {}
          : {
              address: {
                region: region.trim() || undefined,
                city: city.trim(),
                street: street.trim(),
                house: house.trim(),
                apartment: apartment.trim() || undefined,
                postalCode: postalCode.trim() || undefined,
              },
            }),
      },
      payment: { method: paymentMethod },
      comment: comment.trim() || undefined,
    };

    const result = await dispatch(checkoutOrder(dto)).unwrap();
    if (!result) return;

    if (ONLINE_METHODS.includes(paymentMethod)) {
      const initResult = await dispatch(initPayment(result.id)).unwrap();
      if (initResult?.redirectUrl) {
        window.location.href = initResult.redirectUrl;
        return;
      }
    }

    navigate(`${AppRoute.CheckoutSuccess}?id=${result.id}`);
  };

  return (
    <>
      <BreadcrumbComponent
        title="Оформление заказа"
        links={[
          { title: 'Главная', href: AppRoute.Main },
          { title: 'Корзина', href: AppRoute.Cart },
        ]}
        pageName="Оформление"
      />
      <div className="liton__checkout-area mb-105">
        <div className="container">
          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              <div className="col-lg-7">
                <div className="card mb-3">
                  <div className="card-body">
                    <h4 className="card-title">Контактные данные</h4>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">Имя*</label>
                        <input
                          type="text"
                          className="form-control"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Телефон*</label>
                        <input
                          type="tel"
                          className="form-control"
                          value={phone}
                          onChange={handlePhoneChange}
                          placeholder="+7 (7XX) XXX-XX-XX"
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label">Email*</label>
                        <input
                          type="email"
                          className="form-control"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card mb-3">
                  <div className="card-body">
                    <h4 className="card-title">Доставка</h4>
                    <div className="row g-2 mb-3">
                      {DELIVERY_OPTIONS.map((option) => (
                        <div className="col-md-6" key={option.value}>
                          <div className="form-check">
                            <input
                              type="radio"
                              className="form-check-input"
                              id={`delivery-${option.value}`}
                              name="delivery"
                              value={option.value}
                              checked={deliveryType === option.value}
                              onChange={() => setDeliveryType(option.value)}
                            />
                            <label className="form-check-label" htmlFor={`delivery-${option.value}`}>
                              {option.label}{' '}
                              <small className="text-muted">
                                {option.cost > 0 ? `+${formatPrice(option.cost)}` : 'бесплатно'}
                              </small>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>

                    {!isPickup && (
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label">Область</label>
                          <input
                            type="text"
                            className="form-control"
                            value={region}
                            onChange={(e) => setRegion(e.target.value)}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Город*</label>
                          <input
                            type="text"
                            className="form-control"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Улица*</label>
                          <input
                            type="text"
                            className="form-control"
                            value={street}
                            onChange={(e) => setStreet(e.target.value)}
                          />
                        </div>
                        <div className="col-md-3">
                          <label className="form-label">Дом*</label>
                          <input
                            type="text"
                            className="form-control"
                            value={house}
                            onChange={(e) => setHouse(e.target.value)}
                          />
                        </div>
                        <div className="col-md-3">
                          <label className="form-label">Кв./офис</label>
                          <input
                            type="text"
                            className="form-control"
                            value={apartment}
                            onChange={(e) => setApartment(e.target.value)}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Индекс</label>
                          <input
                            type="text"
                            className="form-control"
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="card mb-3">
                  <div className="card-body">
                    <h4 className="card-title">Оплата</h4>
                    {PAYMENT_OPTIONS.map((option) => (
                      <div className="form-check" key={option.value}>
                        <input
                          type="radio"
                          className="form-check-input"
                          id={`payment-${option.value}`}
                          name="payment"
                          value={option.value}
                          checked={paymentMethod === option.value}
                          onChange={() => setPaymentMethod(option.value)}
                        />
                        <label className="form-check-label" htmlFor={`payment-${option.value}`}>
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card mb-3">
                  <div className="card-body">
                    <h4 className="card-title">Комментарий</h4>
                    <textarea
                      rows={3}
                      className="form-control"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Например, удобное время для звонка"
                    />
                  </div>
                </div>
              </div>

              <div className="col-lg-5">
                <div className="card sticky-top" style={{ top: 90 }}>
                  <div className="card-body">
                    <h4 className="card-title">Ваш заказ</h4>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Товар</th>
                          <th className="text-end">Сумма</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cart.items.map((item) => (
                          <tr key={item.productId}>
                            <td>
                              {item.title}{' '}
                              <small className="text-muted">× {item.quantity}</small>
                            </td>
                            <td className="text-end">{formatPrice(item.price * item.quantity)}</td>
                          </tr>
                        ))}
                        <tr>
                          <td>Доставка</td>
                          <td className="text-end">
                            {deliveryCost > 0 ? formatPrice(deliveryCost) : 'Бесплатно'}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Итого</strong>
                          </td>
                          <td className="text-end">
                            <strong>{formatPrice(totalPrice)}</strong>
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <button
                      type="submit"
                      className="btn btn-primary w-100"
                      disabled={isCheckoutLoading}
                    >
                      {isCheckoutLoading ? 'Оформляем…' : 'Подтвердить заказ'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default CheckoutPage;
