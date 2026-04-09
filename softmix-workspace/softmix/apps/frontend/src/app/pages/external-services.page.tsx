import { MouseEvent, ReactElement, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { isAxiosError } from 'axios';
import { AuthType, ExternalService, ExternalServiceHeader, UrlPaths } from '@project-lib/shared-types';

import { useAppDispatch, useAppSelector } from '../hooks';
import {
  getExternalServices,
  getIsExternalServicesLoading,
  getServiceEdit,
  getIsEditLoading,
  getIsCreateMode,
} from '../store/external-services-data/selectors';
import {
  getExternalServicesApi,
  createExternalServiceApi,
  updateExternalServiceApi,
  deleteExternalServiceApi,
  getEditExternalServiceApi,
} from '../store/external-services-data/api-actions';
import {
  setServices,
  setServiceEdit,
  setCreateMode,
} from '../store/external-services-data/external-services-data';
import { Message } from '../const';
import { api } from '../store';
import Modal from '../components/modal/modal.component';
import LoaderComponent from '../components/loader/loader.component';

const AUTH_TYPE_LABELS: Record<AuthType, string> = {
  [AuthType.None]: 'Без авторизации',
  [AuthType.Bearer]: 'Bearer Token',
  [AuthType.QueryParam]: 'Query параметр',
  [AuthType.ApiKey]: 'API Key (заголовок)',
  [AuthType.BasicAuth]: 'Basic Auth (login:password)',
};

function ServiceForm({ service, createMode, onClose }: {
  service: ExternalService | null;
  createMode: boolean;
  onClose: () => void;
}) {
  const dispatch = useAppDispatch();

  const [name, setName] = useState(service?.name || '');
  const [baseUrl, setBaseUrl] = useState(service?.baseUrl || '');
  const [basePath, setBasePath] = useState(service?.basePath || '');
  const [authType, setAuthType] = useState<AuthType>(service?.authType || AuthType.None);
  const [authToken, setAuthToken] = useState(service?.authToken || '');
  const [authParamName, setAuthParamName] = useState(service?.authParamName || '');
  const [headers, setHeaders] = useState<ExternalServiceHeader[]>(service?.headers || []);
  const [timeout, setTimeout] = useState(service?.timeout ?? 15000);
  const [forwardHeaders, setForwardHeaders] = useState(service?.forwardHeaders ?? false);
  const [isActive, setIsActive] = useState(service?.isActive ?? true);
  const [description, setDescription] = useState(service?.description || '');
  const [isPinging, setIsPinging] = useState(false);

  const addHeader = () => setHeaders([...headers, { key: '', value: '' }]);

  const updateHeader = (index: number, field: 'key' | 'value', val: string) => {
    const updated = [...headers];
    updated[index] = { ...updated[index], [field]: val };
    setHeaders(updated);
  };

  const removeHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
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
      headers: headers.filter((h) => h.key.trim()),
      timeout,
      forwardHeaders,
      isActive,
      description,
    };

    if (authToken && authToken !== '******') {
      data.authToken = authToken;
    }

    if (createMode) {
      dispatch(createExternalServiceApi(data));
    } else if (service?.id) {
      dispatch(updateExternalServiceApi({ id: service.id, data }));
    }
  };

  const handlePing = async () => {
    setIsPinging(true);
    try {
      await api.get(`${UrlPaths.ServiceProxy}/${name}`);
      toast.success(`Сервис "${name}" доступен`);
    } catch {
      toast.error(`Сервис "${name}" недоступен`);
    } finally {
      setIsPinging(false);
    }
  };

  const selectStyle = { display: 'block' as const, width: '100%', padding: '8px 15px', border: '2px solid #e5eaee', height: '50px', fontSize: '14px' };

  return (
    <div className="ltn__form-box">
      <h4 className="title-2">{createMode ? 'Добавить сервис' : 'Редактировать сервис'}</h4>

      {/* Основные */}
      <div className="row">
        <div className="col-md-6">
          <label>Название (уникальный идентификатор)</label>
          <input type="text" placeholder="например: alstyle" value={name}
            onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="col-md-6">
          <label>Базовый URL</label>
          <input type="text" placeholder="https://api.example.com" value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)} />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <label>Базовый путь (префикс)</label>
          <input type="text" placeholder="/api/v2" value={basePath}
            onChange={(e) => setBasePath(e.target.value)} />
        </div>
        <div className="col-md-3">
          <label>Таймаут (мс)</label>
          <input type="number" placeholder="15000" value={timeout}
            onChange={(e) => setTimeout(Number(e.target.value) || 15000)} />
        </div>
        <div className="col-md-3">
          <label>Статус</label>
          <div style={{ paddingTop: '10px' }}>
            <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="checkbox" checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                style={{ width: '20px', height: '20px' }} />
              <span>{isActive ? 'Активен' : 'Отключён'}</span>
            </label>
          </div>
        </div>
      </div>

      {/* Авторизация */}
      <div className="row">
        <div className="col-md-6">
          <label>Тип авторизации</label>
          <select className="nice-select" value={authType}
            onChange={(e) => setAuthType(e.target.value as AuthType)}
            style={selectStyle}>
            {Object.entries(AUTH_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <label>Прокидывать заголовки клиента</label>
          <div style={{ paddingTop: '10px' }}>
            <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="checkbox" checked={forwardHeaders}
                onChange={(e) => setForwardHeaders(e.target.checked)}
                style={{ width: '20px', height: '20px' }} />
              <span>{forwardHeaders ? 'Да (Authorization, Accept и др.)' : 'Нет'}</span>
            </label>
          </div>
        </div>
      </div>

      {authType !== AuthType.None && (
        <div className="row">
          <div className="col-md-6">
            <label>
              {authType === AuthType.BasicAuth ? 'Логин:Пароль' : 'Токен / ключ'}
            </label>
            <input type="password"
              placeholder={!createMode && service?.authToken ? 'Введите новый токен или оставьте пустым' :
                (authType === AuthType.BasicAuth ? 'user:password' : 'Введите токен')}
              value={authToken}
              onFocus={() => { if (authToken === '******') setAuthToken(''); }}
              onChange={(e) => setAuthToken(e.target.value)} />
            {!createMode && service?.authToken && !authToken && (
              <small style={{ color: '#28a745', marginTop: '-25px', display: 'block', marginBottom: '10px' }}>
                <i className="fa fa-lock"></i> Токен сохранён. Введите новый, чтобы заменить.
              </small>
            )}
          </div>
          {(authType === AuthType.QueryParam || authType === AuthType.ApiKey) && (
            <div className="col-md-6">
              <label>
                {authType === AuthType.QueryParam ? 'Имя query-параметра' : 'Имя заголовка'}
              </label>
              <input type="text"
                placeholder={authType === AuthType.QueryParam ? 'access-token' : 'X-API-Key'}
                value={authParamName}
                onChange={(e) => setAuthParamName(e.target.value)} />
            </div>
          )}
        </div>
      )}

      {/* Кастомные заголовки */}
      <div style={{ marginTop: '15px', marginBottom: '15px' }}>
        <label style={{ fontWeight: 600 }}>Кастомные заголовки</label>
        {headers.map((header, index) => (
          <div key={index} className="row" style={{ marginBottom: '5px' }}>
            <div className="col-5">
              <input type="text" placeholder="Header-Name" value={header.key}
                onChange={(e) => updateHeader(index, 'key', e.target.value)} />
            </div>
            <div className="col-5">
              <input type="text" placeholder="Header-Value" value={header.value}
                onChange={(e) => updateHeader(index, 'value', e.target.value)} />
            </div>
            <div className="col-2">
              <button type="button" className="btn btn-sm btn-outline-danger"
                onClick={() => removeHeader(index)}
                style={{ marginTop: '10px', padding: '6px 12px' }}>
                <i className="fa fa-times"></i>
              </button>
            </div>
          </div>
        ))}
        <button type="button" className="btn btn-sm btn-outline-secondary"
          onClick={addHeader} style={{ fontSize: '13px', padding: '4px 12px' }}>
          <i className="fa fa-plus"></i> Добавить заголовок
        </button>
      </div>

      {/* Описание */}
      <div className="row">
        <div className="col-md-12">
          <label>Описание</label>
          <textarea rows={3} placeholder="Описание сервиса" value={description}
            onChange={(e) => setDescription(e.target.value)} />
        </div>
      </div>

      <div className="btn-wrapper" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <button className="theme-btn-1 btn" type="button" onClick={handleSubmit}>
          <i className="fa fa-save"></i> {createMode ? 'Создать' : 'Сохранить'}
        </button>
        {!createMode && name && (
          <button className="theme-btn-2 btn" type="button" onClick={handlePing} disabled={isPinging}>
            {isPinging ? <><i className="fa fa-spinner fa-spin"></i> Проверка...</> :
              <><i className="fa fa-plug"></i> Проверить доступность</>}
          </button>
        )}
      </div>
    </div>
  );
}

function ExternalServicesPage(): ReactElement {
  const dispatch = useAppDispatch();
  const services = useAppSelector(getExternalServices);
  const isLoading = useAppSelector(getIsExternalServicesLoading);
  const editService = useAppSelector(getServiceEdit);
  const isEditLoading = useAppSelector(getIsEditLoading);
  const isCreateMode = useAppSelector(getIsCreateMode);

  useEffect(() => {
    dispatch(getExternalServicesApi());

    return () => {
      dispatch(setServices([]));
    };
  }, []);

  const deleteHandler = (id: string, name: string) => (evt: MouseEvent) => {
    evt.preventDefault();
    if (window.confirm(`Удалить сервис "${name}"?`)) {
      dispatch(deleteExternalServiceApi(id));
    }
  };

  const openEditModal = (id: string) => () => {
    dispatch(getEditExternalServiceApi(id));
  };

  const openCreateModal = () => {
    dispatch(setCreateMode(true));
  };

  const closeModal = () => {
    dispatch(setServiceEdit(null));
    dispatch(setCreateMode(false));
  };

  if (isLoading) {
    return <LoaderComponent />;
  }

  const content = services.map((service) => (
    <tr key={service.id}>
      <td>
        <strong>{service.name}</strong>
        {service.description && (
          <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>{service.description}</div>
        )}
      </td>
      <td style={{ fontSize: '13px', wordBreak: 'break-all' }}>{service.baseUrl}</td>
      <td>{AUTH_TYPE_LABELS[service.authType]}</td>
      <td>
        <span style={{
          display: 'inline-block',
          padding: '3px 10px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: 600,
          color: '#fff',
          backgroundColor: service.isActive ? '#28a745' : '#dc3545',
        }}>
          {service.isActive ? 'Активен' : 'Отключён'}
        </span>
      </td>
      <td className="w-60">
        <div className="btn-panel" style={{ display: 'flex', gap: '5px' }}>
          <button className="btn btn-sm btn-outline-primary" onClick={openEditModal(service.id)}
            title="Редактировать" style={{ padding: '4px 10px', fontSize: '13px' }}>
            <i className="fa fa-pencil-alt"></i>
          </button>
          <button className="btn btn-sm btn-outline-danger" onClick={deleteHandler(service.id, service.name)}
            title="Удалить" style={{ padding: '4px 10px', fontSize: '13px' }}>
            <i className="fa fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  ));

  return (
    <section>
      <div>
        <h1>Внешние сервисы</h1>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Управление подключениями к внешним API. Через прокси <code>/api/service-proxy/:name/...</code> можно обращаться к любому добавленному сервису.
        </p>
        <div className="table-actions">
          <button className="btn btn-add" onClick={openCreateModal}><i className="fa fa-plus"></i> Добавить сервис</button>
          <div>
            <table className="styled-table">
              <thead>
                <tr>
                  <th>Название</th>
                  <th>Базовый URL</th>
                  <th>Авторизация</th>
                  <th>Статус</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {content}
              </tbody>
            </table>
            {services.length === 0 && (
              <p style={{ textAlign: 'center', padding: '30px', color: '#999' }}>
                Нет подключённых сервисов. Нажмите "Добавить сервис" чтобы создать первый.
              </p>
            )}
          </div>
        </div>
      </div>
      <Modal
        isOpen={isCreateMode || !!editService || isEditLoading}
        onCloseHandler={closeModal}
        children={isEditLoading ?
          <LoaderComponent /> :
          <ServiceForm service={editService} createMode={isCreateMode} onClose={closeModal} />
        }
      />
    </section>
  );
}

export default ExternalServicesPage;
