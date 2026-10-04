import { ChangeEvent, FormEvent, useCallback, useEffect, useId, useState } from 'react';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';
import { MailWarning, Send } from 'lucide-react';
import { MailSettingsApi, UpdateMailSettingsDto } from '@project-lib/shared-types';

import { http } from '../services/http';
import { useDocumentTitle } from '../lib/use-document-title';
import { formatDate } from '../utils/format';
import { AdminPageHeader } from '../components/admin/admin-page-header';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { EmptyState, PageLoader } from '../ui/feedback';
import { Field, Input, PasswordInput } from '../ui/form';
import { Switch } from '../ui/switch';

const MASKED = '******';

interface FormState {
  enabled: boolean;
  host: string;
  port: number;
  secure: boolean;
  user: string;
  password: string;
  fromAddress: string;
  adminEmail: string;
  shopName: string;
  shopUrl: string;
}

function toForm(record: MailSettingsApi): FormState {
  return {
    enabled: record.enabled,
    host: record.host,
    port: record.port,
    secure: record.secure,
    user: record.hasUser ? MASKED : '',
    password: record.hasPassword ? MASKED : '',
    fromAddress: record.fromAddress,
    adminEmail: record.adminEmail,
    shopName: record.shopName,
    shopUrl: record.shopUrl,
  };
}

/** Отправляем только изменённые поля; логин и пароль — только если ввели новые. */
function diff(form: FormState, original: MailSettingsApi): UpdateMailSettingsDto {
  const dto: UpdateMailSettingsDto = {};
  if (form.enabled !== original.enabled) {
    dto.enabled = form.enabled;
  }
  if (form.host !== original.host) {
    dto.host = form.host;
  }
  if (Number(form.port) !== original.port) {
    dto.port = Number(form.port);
  }
  if (form.secure !== original.secure) {
    dto.secure = form.secure;
  }
  if (form.user && form.user !== MASKED) {
    dto.user = form.user;
  }
  if (form.password && form.password !== MASKED) {
    dto.password = form.password;
  }
  if (form.fromAddress !== original.fromAddress) {
    dto.fromAddress = form.fromAddress;
  }
  if (form.adminEmail !== original.adminEmail) {
    dto.adminEmail = form.adminEmail;
  }
  if (form.shopName !== original.shopName) {
    dto.shopName = form.shopName;
  }
  if (form.shopUrl !== original.shopUrl) {
    dto.shopUrl = form.shopUrl;
  }
  return dto;
}

const PRESETS: { id: string; title: string; values: Partial<FormState> }[] = [
  {
    id: 'mailpit',
    title: 'Mailpit (dev)',
    values: { host: 'softmix.mailpit', port: 1025, secure: false, user: '', password: '' },
  },
  {
    id: 'yandex',
    title: 'Yandex',
    values: { host: 'smtp.yandex.kz', port: 465, secure: true },
  },
  {
    id: 'gmail',
    title: 'Gmail',
    values: { host: 'smtp.gmail.com', port: 587, secure: false },
  },
];

function errorMessage(e: unknown, fallback: string): string {
  return isAxiosError(e) ? e.response?.data?.message || fallback : fallback;
}

function AdminMailSettingsPage() {
  const id = useId();
  const [record, setRecord] = useState<MailSettingsApi | null>(null);
  const [form, setForm] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [loadError, setLoadError] = useState(false);

  useDocumentTitle('Настройки почты — панель управления');

  const load = useCallback(() => {
    setLoadError(false);
    http
      .get<MailSettingsApi>('/mail-settings')
      .then(({ data }) => {
        setRecord(data);
        setForm(toForm(data));
      })
      .catch((e) => {
        setLoadError(true);
        toast.error(errorMessage(e, 'Не удалось загрузить настройки'));
      });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loadError) {
    return (
      <EmptyState
        icon={<MailWarning />}
        title="Не удалось загрузить настройки почты"
        action={<Button onClick={load}>Повторить</Button>}
        className="rounded-2xl border bg-card"
      />
    );
  }

  if (!record || !form) {
    return <PageLoader />;
  }

  const handleField =
    <K extends keyof FormState>(key: K) =>
    (evt: ChangeEvent<HTMLInputElement>) => {
      const value =
        evt.target.type === 'checkbox'
          ? evt.target.checked
          : evt.target.type === 'number'
            ? Number(evt.target.value)
            : evt.target.value;
      setForm((prev) => (prev ? { ...prev, [key]: value as FormState[K] } : prev));
    };

  const applyPreset = (preset: (typeof PRESETS)[number]) => {
    setForm((prev) => (prev ? ({ ...prev, ...preset.values } as FormState) : prev));
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
      const { data } = await http.put<MailSettingsApi>('/mail-settings', dto);
      setRecord(data);
      setForm(toForm(data));
      toast.success('Настройки SMTP сохранены');
    } catch (e) {
      toast.error(errorMessage(e, 'Не удалось сохранить'));
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    const target = testEmail.trim() || record.adminEmail;
    if (!target) {
      toast.error('Укажите email для тестового письма или сохраните email админа в настройках');
      return;
    }
    try {
      setTesting(true);
      const { data } = await http.post<{ ok: true; sentTo: string }>('/mail-settings/test', { to: target });
      toast.success(`Письмо отправлено на ${data.sentTo}`);
    } catch (e) {
      toast.error(errorMessage(e, 'Не удалось отправить тестовое письмо'));
    } finally {
      setTesting(false);
    }
  };

  const savedHint = <span className="text-success">Значение задано. Введите новое, чтобы заменить.</span>;

  return (
    <>
      <AdminPageHeader
        title="Настройки почты"
        description="SMTP-настройки хранятся зашифрованными в БД. Если SMTP не задан или выключатель «Включена отправка» выключен — письма не отправляются."
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">Пресеты:</span>
        {PRESETS.map((preset) => (
          <Button key={preset.id} variant="outline" size="sm" onClick={() => applyPreset(preset)}>
            {preset.title}
          </Button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6">
        <Card className="p-5 sm:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-semibold">SMTP-сервер</h2>
            <Switch id={`${id}-enabled`} checked={form.enabled} onChange={handleField('enabled')} label="Включена отправка" />
          </div>
          <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_8rem_auto] sm:items-end">
            <Field label="Host" htmlFor={`${id}-host`}>
              <Input id={`${id}-host`} value={form.host} onChange={handleField('host')} placeholder="smtp.yandex.kz" />
            </Field>
            <Field label="Port" htmlFor={`${id}-port`}>
              <Input id={`${id}-port`} type="number" value={form.port} onChange={handleField('port')} />
            </Field>
            <Switch id={`${id}-secure`} checked={form.secure} onChange={handleField('secure')} label="SSL (порт 465)" className="h-10" />
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Логин" htmlFor={`${id}-user`} hint={record.hasUser ? savedHint : undefined}>
              <Input
                id={`${id}-user`}
                value={form.user}
                onChange={handleField('user')}
                placeholder={record.hasUser ? MASKED : 'без авторизации'}
                autoComplete="off"
              />
            </Field>
            <Field label="Пароль" htmlFor={`${id}-password`} hint={record.hasPassword ? savedHint : undefined}>
              <PasswordInput
                id={`${id}-password`}
                value={form.password}
                onChange={handleField('password')}
                placeholder={record.hasPassword ? MASKED : ''}
                autoComplete="new-password"
              />
            </Field>
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <h2 className="mb-5 font-semibold">Параметры писем</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Адрес отправителя (From)" htmlFor={`${id}-from`}>
              <Input id={`${id}-from`} type="email" value={form.fromAddress} onChange={handleField('fromAddress')} placeholder="no-reply@softmix.kz" />
            </Field>
            <Field label="Email админа (для уведомлений)" htmlFor={`${id}-admin`}>
              <Input id={`${id}-admin`} type="email" value={form.adminEmail} onChange={handleField('adminEmail')} placeholder="admin@softmix.kz" />
            </Field>
            <Field label="Название магазина" htmlFor={`${id}-shop`}>
              <Input id={`${id}-shop`} value={form.shopName} onChange={handleField('shopName')} />
            </Field>
            <Field
              label="Публичный URL сайта"
              htmlFor={`${id}-url`}
              hint="Используется для ссылок в письмах и callback'ов платёжных систем."
            >
              <Input id={`${id}-url`} value={form.shopUrl} onChange={handleField('shopUrl')} placeholder="https://softmix.kz" />
            </Field>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t pt-5">
            <span className="text-sm text-muted-foreground">{record.updatedAt ? `Обновлено: ${formatDate(record.updatedAt)}` : ''}</span>
            <Button type="submit" loading={saving}>
              Сохранить
            </Button>
          </div>
        </Card>
      </form>

      <Card className="mt-6 p-5 sm:p-6">
        <h2 className="font-semibold">Тестовое письмо</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Отправить тестовое письмо для проверки настроек. Используются текущие сохранённые значения.
        </p>
        <form onSubmit={handleTest} className="mt-4 flex flex-wrap gap-2">
          <Input
            type="email"
            className="w-80 max-w-full"
            value={testEmail}
            onChange={(evt) => setTestEmail(evt.target.value)}
            placeholder={record.adminEmail || 'куда отправить'}
            aria-label="Email для тестового письма"
          />
          <Button type="submit" variant="outline" loading={testing}>
            {!testing && <Send />}
            Отправить тестовое письмо
          </Button>
        </form>
      </Card>
    </>
  );
}

export default AdminMailSettingsPage;
