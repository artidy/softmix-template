import { ChangeEvent, ReactElement, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { OrderStatus } from '@project-lib/shared-types';

import { useAppDispatch, useAppSelector } from '../hooks';
import { AppRoute } from '../const';
import { fetchAllOrders } from '../store/orders-data/api-actions';
import { getOrders, getOrdersLoading, getOrdersTotal } from '../store/orders-data/selectors';
import Loader from '../components/loader/loader.component';
import { formatDate, formatPrice } from '../utils/format';
import { ORDER_STATUS_BADGE, ORDER_STATUS_LABEL } from '../utils/order-labels';

const PAGE_SIZE = 20;

function AdminOrdersPage(): ReactElement {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(getOrders);
  const total = useAppSelector(getOrdersTotal);
  const isLoading = useAppSelector(getOrdersLoading);

  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<OrderStatus | ''>('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    dispatch(
      fetchAllOrders({
        page,
        limit: PAGE_SIZE,
        status: status || undefined,
        search: search || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      }),
    );
  }, [dispatch, page, status, search, dateFrom, dateTo]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / PAGE_SIZE)), [total]);

  const handleStatus = (evt: ChangeEvent<HTMLSelectElement>) => {
    setStatus(evt.target.value as OrderStatus | '');
    setPage(1);
  };

  const applySearch = () => {
    setSearch(searchInput.trim());
    setPage(1);
  };

  const resetFilters = () => {
    setStatus('');
    setSearch('');
    setSearchInput('');
    setDateFrom('');
    setDateTo('');
    setPage(1);
  };

  const hasActiveFilters = Boolean(status || search || dateFrom || dateTo);

  return (
    <section>
      <h1>Заказы</h1>

      <div className="card admin-orders__filters mb-3">
        <div className="card-body">
          <div className="d-flex flex-wrap gap-2 align-items-end">
            <div>
              <label className="form-label">Статус</label>
              <select
                className="form-select"
                style={{ width: 200 }}
                value={status}
                onChange={handleStatus}
              >
                <option value="">Все</option>
                {Object.values(OrderStatus).map((s) => (
                  <option key={s} value={s}>
                    {ORDER_STATUS_LABEL[s]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Дата от</label>
              <input
                type="date"
                className="form-control"
                style={{ width: 170 }}
                value={dateFrom}
                onChange={(e) => {
                  setDateFrom(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <div>
              <label className="form-label">Дата до</label>
              <input
                type="date"
                className="form-control"
                style={{ width: 170 }}
                value={dateTo}
                onChange={(e) => {
                  setDateTo(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <div>
              <label className="form-label">Поиск</label>
              <div className="position-relative" style={{ width: 320, maxWidth: '100%' }}>
                <input
                  type="text"
                  className="form-control"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') applySearch();
                  }}
                  placeholder="Номер, имя, телефон, email"
                  style={{ paddingRight: searchInput ? 36 : undefined }}
                />
                {searchInput && (
                  <button
                    type="button"
                    className="btn-close position-absolute top-50 translate-middle-y end-0 me-2"
                    aria-label="Очистить"
                    onClick={() => {
                      setSearchInput('');
                      if (search) {
                        setSearch('');
                        setPage(1);
                      }
                    }}
                    style={{ fontSize: 12 }}
                  />
                )}
              </div>
            </div>
            <div className="btn-group" role="group">
              <button type="button" className="btn btn-primary" onClick={applySearch}>
                Найти
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={resetFilters}
                disabled={!hasActiveFilters}
              >
                Сбросить
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="text-muted mb-2">Всего: {total}</div>

      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div>
            <table className="styled-table">
              <thead>
                <tr>
                  <th>Номер</th>
                  <th>Дата</th>
                  <th>Клиент</th>
                  <th>Телефон</th>
                  <th>Сумма</th>
                  <th>Статус</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center text-muted py-4">
                      Заказы не найдены
                    </td>
                  </tr>
                )}
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.orderNumber}</td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td>{order.contact.name}</td>
                    <td>{order.contact.phone}</td>
                    <td>{formatPrice(order.totalPrice)}</td>
                    <td>
                      <span className={`badge ${ORDER_STATUS_BADGE[order.status]}`}>
                        {ORDER_STATUS_LABEL[order.status]}
                      </span>
                    </td>
                    <td>
                      <Link
                        to={`${AppRoute.AdminOrders}/${order.id}`}
                        className="btn btn-sm btn-outline-primary"
                      >
                        Открыть
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="d-flex gap-2 align-items-center justify-content-center mt-3">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                ← Назад
              </button>
              <span>
                Страница {page} из {totalPages}
              </span>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Вперёд →
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default AdminOrdersPage;
