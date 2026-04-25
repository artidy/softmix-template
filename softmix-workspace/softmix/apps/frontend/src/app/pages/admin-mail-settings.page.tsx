import { ChangeEvent, FormEvent, ReactElement, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { isAxiosError } from 'axios';
import { MailSettingsApi, UpdateMailSettingsDto } from '@project-lib/shared-types';

import { api } from '../store';
import Loader from '../components/loader/loader.component';
import { formatDate } from '../utils/format';

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

function diff(form: FormState, original: MailSettingsApi): UpdateMailSettingsDto {
  const dto: UpdateMailSettingsDto = {};
  if (form.enabled !== original.enabled) dto.enabled = form.enabled;
  if (form.host !== original.host) dto.host = form.host;
  if (Number(form.port) !== original.port) dto.port = Number(form.port);
  if (form.secure !== original.secure) dto.secure = form.secure;
  if (form.user && form.user !== MASKED) dto.user = form.user;
  if (form.password && form.password !== MASKED) dto.password = form.password;
  if (form.fromAddress !== original.fromAddress) dto.fromAddress = form.fromAddress;
  if (form.adminEmail !== original.adminEmail) dto.adminEmail = form.adminEmail;
  if (form.shopName !== original.shopName) dto.shopName = form.shopName;
  if (form.shopUrl !== original.shopUrl) dto.shopUrl = form.shopUrl;
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

function AdminMailSettingsPage(): ReactElement {
  const [record, setRecord] = useState<MailSettingsApi | null>(null);
  const [form, setForm] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testEmail, setTestEmail] = useState('');

  const load = () => {
    api
      .get<MailSettingsApi>('/mail-settings')
      .then(({ data }) => {
        setRecord(data);
        setForm(toForm(data));
      })
      .catch((e) => {
        let message = 'Не удалось загрузить настройки';
        if (isAxiosError(e)) {
          message = e.response?.data?.message || message;
        }
        toast.error(message);
      });
  };

  useEffect(() => {
    load();
  }, []);

  if (!record || !form) {
    return <Loader />;
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

  const applyPreset = (preset: typeof PRESETS[number]) => {
    setForm((prev) => (prev ? { ...prev, ...preset.values } as FormState : prev));
  };

  const handleSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (!form || !record) return;
    const dto = diff(form, record);
    if (Object.keys(dto).length === 0) {
      toast.info('Нет изменений');
      return;
    }
    try {
      setSaving(true);
      const { data } = await api.put<MailSettingsApi>('/mail-settings', dto);
      setRecord(data);
      setForm(toForm(data));
      toast.success('Настройки SMTP сохранены');
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

  const handleTest = async () => {
    const target = testEmail.trim() || record.adminEmail;
    if (!target) {
      toast.error('Укажите email для тестового письма или сохраните email админа в настройках');
      return;
    }
    try {
      setTesting(true);
      const { data } = await api.post<{ ok: true; sentTo: string }>(
        '/mail-settings/test',
        { to: target },
      );
      toast.success(`Письмо отправлено на ${data.sentTo}`);
    } catch (e) {
      let message = 'Не удалось отправить тестовое письмо';
      if (isAxiosError(e)) {
        message = e.response?.data?.message || message;
      }
      toast.error(message);
    } finally {
      setTesting(false);
    }
  };

  return (
    <section>
      <h1>Настройки почты</h1>
      <p className="text-muted">
        SMTP-настройки хранятся зашифрованными в БД. Если SMTP не задан или выключатель «Включена» в положении off — письма не отправляются.
      </p>

      <div className="mb-3">
        <span className="me-2 text-muted">Пресеты:</span>
        {PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            className="btn btn-sm btn-outline-secondary me-2"
            onClick={() => applyPreset(preset)}
          >
            {preset.title}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="card mb-3">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <h4 className="mb-0">SMTP-сервер</h4>
            <div className="form-check form-switch">
              <input
                type="checkbox"
                role="switch"
                className="form-check-input"
                id="mail-enabled"
                checked={form.enabled}
                onChange={handleField('enabled')}
              />
              <label className="form-check-label" htmlFor="mail-enabled">
                Включена отправка
              </label>
            </div>
          </div>

          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Host</label>
              <input
                type="text"
                className="form-control"
                value={form.host}
                onChange={handleField('host')}
                placeholder="smtp.yandex.kz"
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Port</label>
              <input
                type="number"
                className="form-control"
                value={form.port}
                onChange={handleField('port')}
              />
            </div>
            <div className="col-md-3 d-flex align-items-end">
              <div className="form-check form-switch">
                <input
                  type="checkbox"
                  role="switch"
                  className="form-check-input"
                  id="mail-secure"
                  checked={form.secure}
                  onChange={handleField('secure')}
                />
                <label className="form-check-label" htmlFor="mail-secure">
                  SSL (порт 465)
                </label>
              </div>
            </div>
            <div className="col-md-6">
              <label className="form-label">Логин</label>
              <input
                type="text"
                className="form-control"
                value={form.user}
                onChange={handleField('user')}
                placeholder={record.hasUser ? MASKED : 'без авторизации'}
                autoComplete="off"
              />
              {record.hasUser && (
                <small className="text-success">Значение задано. Введите новое, чтобы заменить.</small>
              )}
            </div>
            <div className="col-md-6">
              <label className="form-label">Пароль</label>
              <input
                type="password"
                className="form-control"
                value={form.password}
                onChange={handleField('password')}
                placeholder={record.hasPassword ? MASKED : ''}
                autoComplete="off"
              />
              {record.hasPassword && (
                <small className="text-success">Значение задано. Введите новое, чтобы заменить.</small>
              )}
            </div>
          </div>

          <h4 className="mt-4">Параметры писем</h4>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Адрес отправителя (From)</label>
              <input
                type="email"
                className="form-control"
                value={form.fromAddress}
                onChange={handleField('fromAddress')}
                placeholder="no-reply@softmix.kz"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Email админа (для уведомлений)</label>
              <input
                type="email"
                className="form-control"
                value={form.adminEmail}
                onChange={handleField('adminEmail')}
                placeholder="admin@softmix.kz"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Название магазина</label>
              <input
                type="text"
                className="form-control"
                value={form.shopName}
                onChange={handleField('shopName')}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Публичный URL сайта</label>
              <input
                type="text"
                className="form-control"
                value={form.shopUrl}
                onChange={handleField('shopUrl')}
                placeholder="https://softmix.kz"
              />
              <small className="text-muted">
                Используется для ссылок в письмах и callback'ов платёжных систем.
              </small>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
            <small className="text-muted">
              {record.updatedAt ? `Обновлено: ${formatDate(record.updatedAt)}` : ''}
            </small>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Сохраняем…' : 'Сохранить'}
            </button>
          </div>
        </div>
      </form>

      <div className="card">
        <div className="card-body">
          <h4>Тестовое письмо</h4>
          <p className="text-muted small mb-2">
            Отправить тестовое письмо для проверки настроек. Используются текущие сохранённые значения.
          </p>
          <div className="d-flex gap-2 flex-wrap">
            <input
              type="email"
              className="form-control"
              style={{ width: 320, maxWidth: '100%' }}
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder={record.adminEmail || 'куда отправить'}
            />
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={handleTest}
              disabled={testing}
            >
              {testing ? 'Отправляем…' : 'Отправить тестовое письмо'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminMailSettingsPage;
