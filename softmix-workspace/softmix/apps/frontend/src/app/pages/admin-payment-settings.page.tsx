import { ChangeEvent, FormEvent, ReactElement, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { isAxiosError } from 'axios';
import {
  PaymentMethod,
  PaymentSettingsApi,
  UpdatePaymentSettingsDto,
} from '@project-lib/shared-types';

import { api } from '../store';
import Loader from '../components/loader/loader.component';
import { formatDate } from '../utils/format';

const PROVIDER_LABELS: Partial<Record<PaymentMethod, string>> = {
  [PaymentMethod.FreedomPay]: 'Freedom Pay',
  [PaymentMethod.KaspiPay]: 'Kaspi Pay',
  [PaymentMethod.HalykEpay]: 'Halyk epay',
};

const PROVIDER_HINTS: Partial<Record<PaymentMethod, string>> = {
  [PaymentMethod.FreedomPay]:
    'Получите merchant_id и secret_key в кабинете Freedom Pay. По умолчанию: api.freedompay.kz',
  [PaymentMethod.KaspiPay]:
    'Реальная интеграция требует договора с Kaspi и доступа к мерчант-кабинету. Сейчас работает через mock-провайдер.',
  [PaymentMethod.HalykEpay]:
    'Реальная интеграция требует договора с Halyk Bank. Сейчас работает через mock-провайдер.',
};

const MASKED = '******';

interface FormState {
  provider: PaymentMethod;
  enabled: boolean;
  testMode: boolean;
  apiUrl: string;
  merchantId: string;
  secret: string;
}

function toForm(record: PaymentSettingsApi): FormState {
  return {
    provider: record.provider,
    enabled: record.enabled,
    testMode: record.testMode,
    apiUrl: record.apiUrl ?? '',
    merchantId: record.hasMerchantId ? MASKED : '',
    secret: record.hasSecret ? MASKED : '',
  };
}

function diff(form: FormState, original: PaymentSettingsApi): UpdatePaymentSettingsDto {
  const dto: UpdatePaymentSettingsDto = {};
  if (form.enabled !== original.enabled) dto.enabled = form.enabled;
  if (form.testMode !== original.testMode) dto.testMode = form.testMode;
  if ((form.apiUrl ?? '') !== (original.apiUrl ?? '')) dto.apiUrl = form.apiUrl;
  if (form.merchantId && form.merchantId !== MASKED) dto.merchantId = form.merchantId;
  if (form.secret && form.secret !== MASKED) dto.secret = form.secret;
  return dto;
}

function ProviderCard({
  record,
  onSaved,
}: {
  record: PaymentSettingsApi;
  onSaved: (next: PaymentSettingsApi) => void;
}): ReactElement {
  const [form, setForm] = useState<FormState>(toForm(record));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(toForm(record));
  }, [record]);

  const handleField =
    <K extends keyof FormState>(key: K) =>
    (evt: ChangeEvent<HTMLInputElement>) => {
      const value = evt.target.type === 'checkbox' ? evt.target.checked : evt.target.value;
      setForm((prev) => ({ ...prev, [key]: value as FormState[K] }));
    };

  const handleSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    const dto = diff(form, record);
    if (Object.keys(dto).length === 0) {
      toast.info('Нет изменений');
      return;
    }
    try {
      setSaving(true);
      const { data } = await api.put<PaymentSettingsApi>(
        `/payment-settings/${record.provider}`,
        dto,
      );
      onSaved(data);
      toast.success(`Настройки ${PROVIDER_LABELS[record.provider]} сохранены`);
    } catch (e) {
      let message = 'Не удалось сохранить';
      if (isAxiosError(e)) {
        message = e.response?.data?.message || message;
      }
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const enabledId = `enabled-${record.provider}`;
  const testModeId = `testmode-${record.provider}`;

  return (
    <form onSubmit={handleSubmit} className="card mb-3">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
          <h4 className="mb-0">{PROVIDER_LABELS[record.provider]}</h4>
          <div className="form-check form-switch">
            <input
              type="checkbox"
              role="switch"
              className="form-check-input"
              id={enabledId}
              checked={form.enabled}
              onChange={handleField('enabled')}
            />
            <label className="form-check-label" htmlFor={enabledId}>
              Включён
            </label>
          </div>
        </div>

        {PROVIDER_HINTS[record.provider] && (
          <p className="text-muted small">{PROVIDER_HINTS[record.provider]}</p>
        )}

        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Merchant ID</label>
            <input
              type="password"
              className="form-control"
              value={form.merchantId}
              onChange={handleField('merchantId')}
              placeholder={record.hasMerchantId ? MASKED : 'Не задан'}
              autoComplete="off"
            />
            {record.hasMerchantId && (
              <small className="text-success">Значение задано. Введите новое, чтобы заменить.</small>
            )}
          </div>
          <div className="col-md-6">
            <label className="form-label">Secret</label>
            <input
              type="password"
              className="form-control"
              value={form.secret}
              onChange={handleField('secret')}
              placeholder={record.hasSecret ? MASKED : 'Не задан'}
              autoComplete="off"
            />
            {record.hasSecret && (
              <small className="text-success">Значение задано. Введите новое, чтобы заменить.</small>
            )}
          </div>
          <div className="col-md-9">
            <label className="form-label">API URL</label>
            <input
              type="text"
              className="form-control"
              value={form.apiUrl}
              onChange={handleField('apiUrl')}
            />
          </div>
          <div className="col-md-3 d-flex align-items-end">
            <div className="form-check form-switch">
              <input
                type="checkbox"
                role="switch"
                className="form-check-input"
                id={testModeId}
                checked={form.testMode}
                onChange={handleField('testMode')}
              />
              <label className="form-check-label" htmlFor={testModeId}>
                Тестовый режим
              </label>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-3">
          <small className="text-muted">
            {record.updatedAt ? `Обновлено: ${formatDate(record.updatedAt)}` : ''}
          </small>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Сохраняем…' : 'Сохранить'}
          </button>
        </div>
      </div>
    </form>
  );
}

function AdminPaymentSettingsPage(): ReactElement {
  const [items, setItems] = useState<PaymentSettingsApi[] | null>(null);

  useEffect(() => {
    api
      .get<PaymentSettingsApi[]>('/payment-settings')
      .then(({ data }) => setItems(data))
      .catch((e) => {
        let message = 'Не удалось загрузить настройки';
        if (isAxiosError(e)) {
          message = e.response?.data?.message || message;
        }
        toast.error(message);
        setItems([]);
      });
  }, []);

  if (!items) {
    return <Loader />;
  }

  const handleSaved = (next: PaymentSettingsApi) => {
    setItems((prev) => (prev ?? []).map((p) => (p.provider === next.provider ? next : p)));
  };

  return (
    <section>
      <h1>Платёжные системы</h1>
      <p className="text-muted">
        Секреты хранятся зашифрованными в базе. После изменения новые значения подхватятся
        в течение минуты.
      </p>
      {items.map((record) => (
        <ProviderCard key={record.provider} record={record} onSaved={handleSaved} />
      ))}
    </section>
  );
}

export default AdminPaymentSettingsPage;
