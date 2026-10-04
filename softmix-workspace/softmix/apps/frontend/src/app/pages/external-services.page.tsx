import { FormEvent, useEffect, useId, useState } from 'react';
import { toast } from 'sonner';
import { Lock, Pencil, Plug, PlugZap, Plus, Trash2, X } from 'lucide-react';
import { AuthType, ExternalService, ExternalServiceHeader, UrlPaths } from '@project-lib/shared-types';

import { useAppDispatch, useAppSelector } from '../hooks';
import { useDocumentTitle } from '../lib/use-document-title';
import {
  getExternalServices,
  getIsCreateMode,
  getIsEditLoading,
  getIsExternalServicesLoading,
  getServiceEdit,
} from '../store/external-services-data/selectors';
import {
  createExternalServiceApi,
  deleteExternalServiceApi,
  getEditExternalServiceApi,
  getExternalServicesApi,
  updateExternalServiceApi,
} from '../store/external-services-data/api-actions';
import { setCreateMode, setServiceEdit, setServices } from '../store/external-services-data/external-services-data';
import { http } from '../services/http';
import { AdminPageHeader } from '../components/admin/admin-page-header';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { ConfirmDialog } from '../ui/confirm-dialog';
import { Dialog, DialogContent } from '../ui/dialog';
import { EmptyState, PageLoader, Skeleton } from '../ui/feedback';
import { Field, Input, PasswordInput, Select, Textarea } from '../ui/form';
import { Switch } from '../ui/switch';

const AUTH_TYPE_LABELS: Record<AuthType, string> = {
  [AuthType.None]: 'Без авторизации',
  [AuthType.Bearer]: 'Bearer Token',
  [AuthType.QueryParam]: 'Query параметр',
  [AuthType.ApiKey]: 'API Key (заголовок)',
  [AuthType.BasicAuth]: 'Basic Auth (login:password)',
};

const MASKED = '******';

function ServiceForm({ service, onCancel }: { service: ExternalService | null; onCancel: () => void }) {
  const dispatch = useAppDispatch();
  const id = useId();
  const isCreate = !service;

  const [name, setName] = useState(service?.name || '');
  const [baseUrl, setBaseUrl] = useState(service?.baseUrl || '');
  const [basePath, setBasePath] = useState(service?.basePath || '');
  const [authType, setAuthType] = useState<AuthType>(service?.authType || AuthType.None);
  const [authToken, setAuthToken] = useState(service?.authToken || '');
  const [authParamName, setAuthParamName] = useState(service?.authParamName || '');
  const [headers, setHeaders] = useState<ExternalServiceHeader[]>(service?.headers || []);
  const [timeout, setTimeoutValue] = useState(service?.timeout ?? 15000);
  const [forwardHeaders, setForwardHeaders] = useState(service?.forwardHeaders ?? false);
  const [isActive, setIsActive] = useState(service?.isActive ?? true);
  const [description, setDescription] = useState(service?.description || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isPinging, setIsPinging] = useState(false);

  const updateHeader = (index: number, field: 'key' | 'value', value: string) => {
    setHeaders((prev) => prev.map((header, i) => (i === index ? { ...header, [field]: value } : header)));
  };

  const handleSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (!name.trim() || !baseUrl.trim()) {
      toast.error('Заполните название и базовый URL');
      return;
    }

    const data: Partial<ExternalService> = {
      name: name.trim(),
      baseUrl: baseUrl.trim(),
      basePath: basePath.trim(),
      authType,
      authParamName,
      headers: headers.filter((header) => header.key.trim()),
      timeout,
      forwardHeaders,
      isActive,
      description,
    };

    // Сохранённый токен приходит замаскированным — отправляем только новый.
    if (authToken && authToken !== MASKED) {
      data.authToken = authToken;
    }

    // Окно закроется само: после успеха thunk'и сбрасывают режим создания или редактирования.
    setIsSaving(true);
    if (isCreate) {
      await dispatch(createExternalServiceApi(data));
    } else {
      await dispatch(updateExternalServiceApi({ id: service.id, data }));
    }
    setIsSaving(false);
  };

  const handlePing = async () => {
    setIsPinging(true);
    try {
      await http.get(`${UrlPaths.ServiceProxy}/${name}`);
      toast.success(`Сервис "${name}" доступен`);
    } catch {
      toast.error(`Сервис "${name}" недоступен`);
    } finally {
      setIsPinging(false);
    }
  };

  const hasSavedToken = !isCreate && Boolean(service?.authToken);

  return (
    <form className="grid gap-6" onSubmit={handleSubmit} noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Название (уникальный идентификатор)" htmlFor={`${id}-name`} required>
          <Input id={`${id}-name`} value={name} onChange={(evt) => setName(evt.target.value)} placeholder="например: alstyle" />
        </Field>
        <Field label="Базовый URL" htmlFor={`${id}-url`} required>
          <Input id={`${id}-url`} value={baseUrl} onChange={(evt) => setBaseUrl(evt.target.value)} placeholder="https://api.example.com" />
        </Field>
        <Field label="Базовый путь (префикс)" htmlFor={`${id}-path`}>
          <Input id={`${id}-path`} value={basePath} onChange={(evt) => setBasePath(evt.target.value)} placeholder="/api/v2" />
        </Field>
        <Field label="Таймаут (мс)" htmlFor={`${id}-timeout`}>
          <Input
            id={`${id}-timeout`}
            type="number"
            value={timeout}
            onChange={(evt) => setTimeoutValue(Number(evt.target.value) || 15000)}
            placeholder="15000"
          />
        </Field>
      </div>

      <div className="flex flex-wrap gap-x-8 gap-y-3">
        <Switch id={`${id}-active`} checked={isActive} onChange={(evt) => setIsActive(evt.target.checked)} label={isActive ? 'Активен' : 'Отключён'} />
        <Switch
          id={`${id}-forward`}
          checked={forwardHeaders}
          onChange={(evt) => setForwardHeaders(evt.target.checked)}
          label={`Прокидывать заголовки клиента${forwardHeaders ? ' (Authorization, Accept и др.)' : ''}`}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Тип авторизации" htmlFor={`${id}-auth`}>
          <Select id={`${id}-auth`} value={authType} onChange={(evt) => setAuthType(evt.target.value as AuthType)}>
            {Object.entries(AUTH_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </Field>
        {authType !== AuthType.None && (
          <Field
            label={authType === AuthType.BasicAuth ? 'Логин:Пароль' : 'Токен / ключ'}
            htmlFor={`${id}-token`}
            hint={
              hasSavedToken && (!authToken || authToken === MASKED) ? (
                <span className="inline-flex items-center gap-1 text-success">
                  <Lock className="size-3" aria-hidden="true" />
                  Токен сохранён. Введите новый, чтобы заменить.
                </span>
              ) : undefined
            }
          >
            <PasswordInput
              id={`${id}-token`}
              value={authToken}
              onFocus={() => authToken === MASKED && setAuthToken('')}
              onChange={(evt) => setAuthToken(evt.target.value)}
              placeholder={
                hasSavedToken
                  ? 'Введите новый токен или оставьте пустым'
                  : authType === AuthType.BasicAuth
                    ? 'user:password'
                    : 'Введите токен'
              }
              autoComplete="off"
            />
          </Field>
        )}
        {(authType === AuthType.QueryParam || authType === AuthType.ApiKey) && (
          <Field label={authType === AuthType.QueryParam ? 'Имя query-параметра' : 'Имя заголовка'} htmlFor={`${id}-param`}>
            <Input
              id={`${id}-param`}
              value={authParamName}
              onChange={(evt) => setAuthParamName(evt.target.value)}
              placeholder={authType === AuthType.QueryParam ? 'access-token' : 'X-API-Key'}
            />
          </Field>
        )}
      </div>

      <div className="grid gap-2">
        <p className="text-sm font-medium">Кастомные заголовки</p>
        {headers.map((header, index) => (
          <div key={index} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] gap-2">
            <Input value={header.key} onChange={(evt) => updateHeader(index, 'key', evt.target.value)} placeholder="Header-Name" aria-label="Имя заголовка" />
            <Input value={header.value} onChange={(evt) => updateHeader(index, 'value', evt.target.value)} placeholder="Header-Value" aria-label="Значение заголовка" />
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              onClick={() => setHeaders((prev) => prev.filter((_, i) => i !== index))}
              aria-label="Удалить заголовок"
            >
              <X />
            </Button>
          </div>
        ))}
        <Button variant="outline" size="sm" className="justify-self-start" onClick={() => setHeaders((prev) => [...prev, { key: '', value: '' }])}>
          <Plus />
          Добавить заголовок
        </Button>
      </div>

      <Field label="Описание" htmlFor={`${id}-description`}>
        <Textarea id={`${id}-description`} rows={3} value={description} onChange={(evt) => setDescription(evt.target.value)} placeholder="Описание сервиса" />
      </Field>

      <div className="flex flex-col-reverse gap-2 border-t pt-5 sm:flex-row sm:items-center">
        {!isCreate && name && (
          <Button variant="outline" onClick={handlePing} loading={isPinging} className="sm:mr-auto">
            {!isPinging && <Plug />}
            Проверить доступность
          </Button>
        )}
        <div className="flex flex-col-reverse gap-2 sm:ml-auto sm:flex-row">
          <Button variant="outline" onClick={onCancel} disabled={isSaving}>
            Отмена
          </Button>
          <Button type="submit" loading={isSaving}>
            {isCreate ? 'Создать' : 'Сохранить'}
          </Button>
        </div>
      </div>
    </form>
  );
}

function ExternalServicesPage() {
  const dispatch = useAppDispatch();
  const services = useAppSelector(getExternalServices);
  const isLoading = useAppSelector(getIsExternalServicesLoading);
  const editService = useAppSelector(getServiceEdit);
  const isEditLoading = useAppSelector(getIsEditLoading);
  const isCreateMode = useAppSelector(getIsCreateMode);
  const [serviceToDelete, setServiceToDelete] = useState<ExternalService | null>(null);

  useDocumentTitle('Внешние сервисы — панель управления');

  useEffect(() => {
    dispatch(getExternalServicesApi());

    return () => {
      dispatch(setServices([]));
    };
  }, [dispatch]);

  const confirmDelete = () => {
    if (serviceToDelete) {
      dispatch(deleteExternalServiceApi(serviceToDelete.id));
    }
    setServiceToDelete(null);
  };

  const closeModal = () => {
    dispatch(setServiceEdit(null));
    dispatch(setCreateMode(false));
  };

  const isFormOpen = isCreateMode || Boolean(editService) || isEditLoading;

  return (
    <>
      <AdminPageHeader
        title="Внешние сервисы"
        description={
          <>
            Управление подключениями к внешним API. Через прокси{' '}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">/api/service-proxy/:name/...</code> можно обращаться к
            любому добавленному сервису.
          </>
        }
        actions={
          <Button onClick={() => dispatch(setCreateMode(true))}>
            <Plus />
            Добавить сервис
          </Button>
        }
      />

      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="divide-y">
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="flex items-center gap-4 p-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            ))}
          </div>
        ) : services.length === 0 ? (
          <EmptyState
            icon={<PlugZap />}
            title="Нет подключённых сервисов"
            description="Нажмите «Добавить сервис», чтобы создать первый."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[44rem] text-sm">
              <thead className="border-b bg-muted/50 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-semibold">Название</th>
                  <th className="px-4 py-3 font-semibold">Базовый URL</th>
                  <th className="px-4 py-3 font-semibold">Авторизация</th>
                  <th className="px-4 py-3 font-semibold">Статус</th>
                  <th className="px-4 py-3">
                    <span className="sr-only">Действия</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {services.map((service) => (
                  <tr key={service.id} className="transition-colors hover:bg-accent/40">
                    <td className="px-4 py-3">
                      <p className="font-medium">{service.name}</p>
                      {service.description && <p className="mt-0.5 text-xs text-muted-foreground">{service.description}</p>}
                    </td>
                    <td className="break-all px-4 py-3 font-mono text-xs">{service.baseUrl}</td>
                    <td className="px-4 py-3">{AUTH_TYPE_LABELS[service.authType]}</td>
                    <td className="px-4 py-3">
                      <Badge variant={service.isActive ? 'success' : 'destructive'}>{service.isActive ? 'Активен' : 'Отключён'}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => dispatch(getEditExternalServiceApi(service.id))}
                          aria-label={`Редактировать ${service.name}`}
                          title="Редактировать"
                        >
                          <Pencil />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => setServiceToDelete(service)}
                          aria-label={`Удалить ${service.name}`}
                          title="Удалить"
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Dialog open={isFormOpen} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent title={isCreateMode ? 'Добавить сервис' : 'Редактировать сервис'} size="xl">
          {isEditLoading ? (
            <PageLoader />
          ) : (
            <ServiceForm key={editService?.id ?? 'new'} service={isCreateMode ? null : editService} onCancel={closeModal} />
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(serviceToDelete)}
        onOpenChange={(open) => !open && setServiceToDelete(null)}
        title="Удалить сервис?"
        description={
          <>
            Удалить сервис <span className="font-medium text-foreground">{serviceToDelete?.name}</span>? Это действие нельзя
            отменить.
          </>
        }
        onConfirm={confirmDelete}
      />
    </>
  );
}

export default ExternalServicesPage;
