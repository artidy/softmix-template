import { ChangeEvent, FormEvent, useEffect, useId, useState } from 'react';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';
import { CreditCard } from 'lucide-react';
import { PaymentMethod, PaymentSettingsApi, UpdatePaymentSettingsDto } from '@project-lib/shared-types';

import { http } from '../services/http';
import { useDocumentTitle } from '../lib/use-document-title';
import { formatDate } from '../utils/format';
import { AdminPageHeader } from '../components/admin/admin-page-header';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { EmptyState, PageLoader } from '../ui/feedback';
import { Field, Input, PasswordInput } from '../ui/form';
import { Switch } from '../ui/switch';

const PROVIDER_LABELS: Partial<Record<PaymentMethod, string>> = {
  [PaymentMethod.FreedomPay]: 'Freedom Pay',
  [PaymentMethod.KaspiPay]: 'Kaspi Pay',
  [PaymentMethod.HalykEpay]: 'Halyk epay',
};

const PROVIDER_HINTS: Partial<Record<PaymentMethod, string>> = {
  [PaymentMethod.FreedomPay]: 'Получите merchant_id и secret_key в кабинете Freedom Pay. По умолчанию: api.freedompay.kz',
  [PaymentMethod.KaspiPay]:
    'Реальная интеграция требует договора с Kaspi и доступа к мерчант-кабинету. Сейчас работает через mock-провайдер.',
  [PaymentMethod.HalykEpay]: 'Реальная интеграция требует договора с Halyk Bank. Сейчас работает через mock-провайдер.',
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

/** Отправляем только изменённые поля; ключи — только если ввели новые. */
function diff(form: FormState, original: PaymentSettingsApi): UpdatePaymentSettingsDto {
  const dto: UpdatePaymentSettingsDto = {};
  if (form.enabled !== original.enabled) {
    dto.enabled = form.enabled;
  }
  if (form.testMode !== original.testMode) {
    dto.testMode = form.testMode;
  }
  if ((form.apiUrl ?? '') !== (original.apiUrl ?? '')) {
    dto.apiUrl = form.apiUrl;
  }
  if (form.merchantId && form.merchantId !== MASKED) {
    dto.merchantId = form.merchantId;
  }
  if (form.secret && form.secret !== MASKED) {
    dto.secret = form.secret;
  }
  return dto;
}

function errorMessage(e: unknown, fallback: string): string {
  return isAxiosError(e) ? e.response?.data?.message || fallback : fallback;
}

function ProviderCard({ record, onSaved }: { record: PaymentSettingsApi; onSaved: (next: PaymentSettingsApi) => void }) {
  const id = useId();
  const [form, setForm] = useState<FormState>(() => toForm(record));
  const [saving, setSaving] = useState(false);
  const label = PROVIDER_LABELS[record.provider] ?? record.provider;

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
      const { data } = await http.put<PaymentSettingsApi>(`/payment-settings/${record.provider}`, dto);
      onSaved(data);
      toast.success(`Настройки ${label} сохранены`);
    } catch (e) {
      toast.error(errorMessage(e, 'Не удалось сохранить'));
    } finally {
      setSaving(false);
    }
  };

  const savedHint = <span className="text-success">Значение задано. Введите новое, чтобы заменить.</span>;

  return (
    <Card className="p-5 sm:p-6">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary" aria-hidden="true">
              <CreditCard className="size-5" />
            </span>
            <div>
              <h2 className="font-semibold">{label}</h2>
              <div className="mt-0.5 flex gap-1.5">
                <Badge variant={record.enabled ? 'success' : 'neutral'}>{record.enabled ? 'Включён' : 'Выключен'}</Badge>
                {record.testMode && <Badge variant="warning">Тестовый режим</Badge>}
              </div>
            </div>
          </div>
          <Switch id={`${id}-enabled`} checked={form.enabled} onChange={handleField('enabled')} label="Включён" />
        </div>

        {PROVIDER_HINTS[record.provider] && (
          <p className="mt-4 text-sm text-muted-foreground">{PROVIDER_HINTS[record.provider]}</p>
        )}

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Merchant ID" htmlFor={`${id}-merchant`} hint={record.hasMerchantId ? savedHint : undefined}>
            <PasswordInput
              id={`${id}-merchant`}
              value={form.merchantId}
              onChange={handleField('merchantId')}
              placeholder={record.hasMerchantId ? MASKED : 'Не задан'}
              autoComplete="off"
            />
          </Field>
          <Field label="Secret" htmlFor={`${id}-secret`} hint={record.hasSecret ? savedHint : undefined}>
            <PasswordInput
              id={`${id}-secret`}
              value={form.secret}
              onChange={handleField('secret')}
              placeholder={record.hasSecret ? MASKED : 'Не задан'}
              autoComplete="off"
            />
          </Field>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
          <Field label="API URL" htmlFor={`${id}-url`}>
            <Input id={`${id}-url`} value={form.apiUrl} onChange={handleField('apiUrl')} />
          </Field>
          <Switch id={`${id}-test`} checked={form.testMode} onChange={handleField('testMode')} label="Тестовый режим" className="h-10" />
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t pt-5">
          <span className="text-sm text-muted-foreground">{record.updatedAt ? `Обновлено: ${formatDate(record.updatedAt)}` : ''}</span>
          <Button type="submit" loading={saving}>
            Сохранить
          </Button>
        </div>
      </form>
    </Card>
  );
}

function AdminPaymentSettingsPage() {
  const [items, setItems] = useState<PaymentSettingsApi[] | null>(null);

  useDocumentTitle('Платёжные системы — панель управления');

  useEffect(() => {
    http
      .get<PaymentSettingsApi[]>('/payment-settings')
      .then(({ data }) => setItems(data))
      .catch((e) => {
        toast.error(errorMessage(e, 'Не удалось загрузить настройки'));
        setItems([]);
      });
  }, []);

  if (!items) {
    return <PageLoader />;
  }

  const handleSaved = (next: PaymentSettingsApi) => {
    setItems((prev) => (prev ?? []).map((item) => (item.provider === next.provider ? next : item)));
  };

  return (
    <>
      <AdminPageHeader
        title="Платёжные системы"
        description="Секреты хранятся зашифрованными в базе. После изменения новые значения подхватятся в течение минуты."
      />
      {items.length === 0 ? (
        <EmptyState icon={<CreditCard />} title="Платёжные системы не найдены" className="rounded-2xl border bg-card" />
      ) : (
        <div className="grid gap-6">
          {items.map((record) => (
            <ProviderCard key={record.provider} record={record} onSaved={handleSaved} />
          ))}
        </div>
      )}
    </>
  );
}

export default AdminPaymentSettingsPage;
