import { ChangeEvent, FormEvent, ReactNode, useEffect, useId, useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { CheckoutDto, DeliveryType, PaymentMethod } from '@project-lib/shared-types';

import { useAppDispatch, useAppSelector } from '../hooks';
import { AppRoute, DEFAULT_PRODUCT_IMG } from '../const';
import { cn } from '../lib/cn';
import { useDocumentTitle } from '../lib/use-document-title';
import { getCart, getCartLoading } from '../store/cart-data/selectors';
import { getCart as fetchCart } from '../store/cart-data/api-actions';
import { getCheckoutLoading } from '../store/orders-data/selectors';
import { checkoutOrder } from '../store/orders-data/api-actions';
import { initPayment } from '../store/orders-data/payment-actions';
import { getIsAuth, getIsUnknown, getUser } from '../store/user-data/selectors';
import { formatPhoneInput, formatPrice, isValidEmail, isValidKzPhone, phoneToE164 } from '../utils/format';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { PageLoader } from '../ui/feedback';
import { FadeImage } from '../ui/fade-image';
import { Field, Input, Textarea } from '../ui/form';
import { Container } from '../ui/layout';
import { PageHeader } from '../ui/page-header';

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

const ONLINE_METHODS: PaymentMethod[] = [PaymentMethod.FreedomPay, PaymentMethod.KaspiPay, PaymentMethod.HalykEpay];

function Section({ step, title, children }: { step: number; title: string; children: ReactNode }) {
  return (
    <Card className="p-5 sm:p-6">
      <h2 className="mb-5 flex items-center gap-3 text-lg font-semibold">
        <span className="grid size-7 place-items-center rounded-full bg-primary-soft text-sm text-primary" aria-hidden="true">
          {step}
        </span>
        {title}
      </h2>
      {children}
    </Card>
  );
}

type OptionCardProps = {
  name: string;
  checked: boolean;
  onSelect: () => void;
  title: string;
  hint?: string;
};

function OptionCard({ name, checked, onSelect, title, hint }: OptionCardProps) {
  return (
    <label
      className={cn(
        'flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring',
        checked ? 'border-primary bg-primary-soft/60' : 'hover:border-foreground/25',
      )}
    >
      <input type="radio" name={name} checked={checked} onChange={onSelect} className="mt-0.5 size-4 shrink-0 accent-primary" />
      <span className="grid gap-0.5">
        <span className="text-sm font-medium">{title}</span>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </span>
    </label>
  );
}

function CheckoutPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const id = useId();

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
  // После оформления корзина очищается — в этот момент не уводим в пустую корзину.
  const [isPlacing, setIsPlacing] = useState(false);

  useDocumentTitle('Оформление заказа');

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  // Подставляем данные из профиля, не затирая уже введённое.
  useEffect(() => {
    if (user) {
      if (user.name) {
        setName((prev) => prev || user.name);
      }
      if (user.email) {
        setEmail((prev) => prev || user.email);
      }
      if (user.phone) {
        setPhone((prev) => (prev === '+7 ' ? formatPhoneInput(user.phone) : prev));
      }
      if (user.address) {
        setStreet((prev) => prev || user.address);
      }
    }
  }, [user]);

  const deliveryCost = useMemo(
    () => DELIVERY_OPTIONS.find((option) => option.value === deliveryType)?.cost ?? 0,
    [deliveryType],
  );

  if (isUnknown || (cartLoading && !cart)) {
    return <PageLoader />;
  }

  if (!isAuth) {
    return <Navigate to={AppRoute.Login} state={{ from: AppRoute.Checkout }} replace />;
  }

  if (!cart || cart.items.length === 0) {
    return isPlacing ? <PageLoader /> : <Navigate to={AppRoute.Cart} replace />;
  }

  const totalPrice = cart.totalPrice + deliveryCost;
  const isPickup = deliveryType === DeliveryType.Pickup;

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

    setIsPlacing(true);
    const result = await dispatch(checkoutOrder(dto)).unwrap();
    if (!result) {
      setIsPlacing(false);
      return;
    }

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
      <PageHeader
        title="Оформление заказа"
        breadcrumbs={[
          { label: 'Главная', to: AppRoute.Main },
          { label: 'Корзина', to: AppRoute.Cart },
          { label: 'Оформление' },
        ]}
      />
      <Container className="py-8 lg:py-10">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-8"
        >
          <div className="grid gap-6">
            <Section step={1} title="Контактные данные">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Имя" htmlFor={`${id}-name`} required>
                  <Input id={`${id}-name`} value={name} onChange={(evt) => setName(evt.target.value)} autoComplete="name" />
                </Field>
                <Field label="Телефон" htmlFor={`${id}-phone`} required>
                  <Input
                    id={`${id}-phone`}
                    type="tel"
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="+7 (7XX) XXX-XX-XX"
                    autoComplete="tel"
                  />
                </Field>
                <Field label="Email" htmlFor={`${id}-email`} required className="sm:col-span-2">
                  <Input
                    id={`${id}-email`}
                    type="email"
                    value={email}
                    onChange={(evt) => setEmail(evt.target.value)}
                    autoComplete="email"
                  />
                </Field>
              </div>
            </Section>

            <Section step={2} title="Доставка">
              <div className="grid gap-3 sm:grid-cols-2">
                {DELIVERY_OPTIONS.map((option) => (
                  <OptionCard
                    key={option.value}
                    name="delivery"
                    checked={deliveryType === option.value}
                    onSelect={() => setDeliveryType(option.value)}
                    title={option.label}
                    hint={option.cost > 0 ? `+${formatPrice(option.cost)}` : 'бесплатно'}
                  />
                ))}
              </div>

              {!isPickup && (
                <div className="mt-5 grid gap-4 sm:grid-cols-6">
                  <Field label="Область" htmlFor={`${id}-region`} className="sm:col-span-3">
                    <Input id={`${id}-region`} value={region} onChange={(evt) => setRegion(evt.target.value)} />
                  </Field>
                  <Field label="Город" htmlFor={`${id}-city`} required className="sm:col-span-3">
                    <Input
                      id={`${id}-city`}
                      value={city}
                      onChange={(evt) => setCity(evt.target.value)}
                      autoComplete="address-level2"
                    />
                  </Field>
                  <Field label="Улица" htmlFor={`${id}-street`} required className="sm:col-span-6">
                    <Input
                      id={`${id}-street`}
                      value={street}
                      onChange={(evt) => setStreet(evt.target.value)}
                      autoComplete="address-line1"
                    />
                  </Field>
                  <Field label="Дом" htmlFor={`${id}-house`} required className="sm:col-span-2">
                    <Input id={`${id}-house`} value={house} onChange={(evt) => setHouse(evt.target.value)} />
                  </Field>
                  <Field label="Кв./офис" htmlFor={`${id}-apartment`} className="sm:col-span-2">
                    <Input id={`${id}-apartment`} value={apartment} onChange={(evt) => setApartment(evt.target.value)} />
                  </Field>
                  <Field label="Индекс" htmlFor={`${id}-postal`} className="sm:col-span-2">
                    <Input
                      id={`${id}-postal`}
                      value={postalCode}
                      onChange={(evt) => setPostalCode(evt.target.value)}
                      inputMode="numeric"
                      autoComplete="postal-code"
                    />
                  </Field>
                </div>
              )}
            </Section>

            <Section step={3} title="Оплата">
              <div className="grid gap-3">
                {PAYMENT_OPTIONS.map((option) => (
                  <OptionCard
                    key={option.value}
                    name="payment"
                    checked={paymentMethod === option.value}
                    onSelect={() => setPaymentMethod(option.value)}
                    title={option.label}
                  />
                ))}
              </div>
            </Section>

            <Section step={4} title="Комментарий">
              <Textarea
                rows={3}
                value={comment}
                onChange={(evt) => setComment(evt.target.value)}
                placeholder="Например, удобное время для звонка"
                aria-label="Комментарий к заказу"
              />
            </Section>
          </div>

          <Card className="p-5 sm:p-6 lg:sticky lg:top-24">
            <h2 className="text-lg font-semibold">Ваш заказ</h2>
            <ul className="mt-4 grid max-h-80 gap-3 overflow-y-auto pr-1">
              {cart.items.map((item) => (
                <li key={item.productId} className="flex items-center gap-3">
                  <span className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-lg border bg-white p-1">
                    <FadeImage src={item.imageUrl || DEFAULT_PRODUCT_IMG} fallbackSrc={DEFAULT_PRODUCT_IMG} alt="" loading="lazy" className="size-full object-contain" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="line-clamp-2 text-sm leading-snug">{item.title}</span>
                    <span className="text-xs tabular-nums text-muted-foreground">× {item.quantity}</span>
                  </span>
                  <span className="shrink-0 text-sm font-medium tabular-nums">{formatPrice(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-5 grid gap-3 border-t pt-4 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Товары</dt>
                <dd className="tabular-nums">{formatPrice(cart.totalPrice)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Доставка</dt>
                <dd className="tabular-nums">{deliveryCost > 0 ? formatPrice(deliveryCost) : 'Бесплатно'}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 border-t pt-3">
                <dt className="font-medium">Итого</dt>
                <dd className="text-2xl font-semibold tabular-nums">{formatPrice(totalPrice)}</dd>
              </div>
            </dl>
            <Button type="submit" size="lg" className="mt-6 w-full" loading={isCheckoutLoading}>
              {isCheckoutLoading ? 'Оформляем…' : 'Подтвердить заказ'}
            </Button>
          </Card>
        </form>
      </Container>
    </>
  );
}

export default CheckoutPage;
