import { ChangeEvent, FormEvent, useEffect, useId, useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, ChevronRight, PackageSearch, Search, X } from 'lucide-react';
import { OrderStatus } from '@project-lib/shared-types';

import { useAppDispatch, useAppSelector } from '../hooks';
import { AppRoute } from '../const';
import { cn } from '../lib/cn';
import { formatNumber } from '../lib/format';
import { useDocumentTitle } from '../lib/use-document-title';
import { fetchAllOrders } from '../store/orders-data/api-actions';
import { getOrders, getOrdersLoading, getOrdersTotal } from '../store/orders-data/selectors';
import { formatDate, formatPrice } from '../utils/format';
import { ORDER_STATUS_LABEL } from '../utils/order-labels';
import { AdminPageHeader } from '../components/admin/admin-page-header';
import { OrderStatusBadge } from '../components/order/order-parts';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { EmptyState, Skeleton } from '../ui/feedback';
import { Field, Input, Select } from '../ui/form';

const PAGE_SIZE = 20;

function AdminOrdersPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const id = useId();
  const orders = useAppSelector(getOrders);
  const total = useAppSelector(getOrdersTotal);
  const isLoading = useAppSelector(getOrdersLoading);

  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<OrderStatus | ''>('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useDocumentTitle('Заказы — панель управления');

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

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const hasActiveFilters = Boolean(status || search || dateFrom || dateTo);

  const handleStatus = (evt: ChangeEvent<HTMLSelectElement>) => {
    setStatus(evt.target.value as OrderStatus | '');
    setPage(1);
  };

  const applySearch = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    setSearch(searchInput.trim());
    setPage(1);
  };

  const clearSearch = () => {
    setSearchInput('');
    if (search) {
      setSearch('');
      setPage(1);
    }
  };

  const resetFilters = () => {
    setStatus('');
    setSearch('');
    setSearchInput('');
    setDateFrom('');
    setDateTo('');
    setPage(1);
  };

  const openOrder = (orderId: string) => navigate(`${AppRoute.AdminOrders}/${orderId}`);

  return (
    <>
      <AdminPageHeader title="Заказы" description={`Всего: ${formatNumber(total)}`} />

      <Card className="mb-6 p-4 sm:p-5">
        <form onSubmit={applySearch} className="grid gap-4 md:grid-cols-2 xl:grid-cols-[12rem_10rem_10rem_minmax(0,1fr)_auto] xl:items-end">
          <Field label="Статус" htmlFor={`${id}-status`}>
            <Select id={`${id}-status`} value={status} onChange={handleStatus}>
              <option value="">Все</option>
              {Object.values(OrderStatus).map((value) => (
                <option key={value} value={value}>
                  {ORDER_STATUS_LABEL[value]}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Дата от" htmlFor={`${id}-from`}>
            <Input
              id={`${id}-from`}
              type="date"
              value={dateFrom}
              onChange={(evt) => {
                setDateFrom(evt.target.value);
                setPage(1);
              }}
            />
          </Field>
          <Field label="Дата до" htmlFor={`${id}-to`}>
            <Input
              id={`${id}-to`}
              type="date"
              value={dateTo}
              onChange={(evt) => {
                setDateTo(evt.target.value);
                setPage(1);
              }}
            />
          </Field>
          <Field label="Поиск" htmlFor={`${id}-search`}>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input
                id={`${id}-search`}
                value={searchInput}
                onChange={(evt) => setSearchInput(evt.target.value)}
                placeholder="Номер, имя, телефон, email"
                className="px-9"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-2 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
                  aria-label="Очистить поиск"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
          </Field>
          <div className="flex gap-2">
            <Button type="submit">Найти</Button>
            <Button variant="outline" onClick={resetFilters} disabled={!hasActiveFilters}>
              Сбросить
            </Button>
          </div>
        </form>
      </Card>

      <Card className="overflow-hidden">
        {isLoading && orders.length === 0 ? (
          <div className="divide-y">
            {Array.from({ length: 6 }, (_, index) => (
              <div key={index} className="flex items-center gap-4 p-4">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <EmptyState icon={<PackageSearch />} title="Заказы не найдены" description={hasActiveFilters ? 'Попробуйте изменить фильтры.' : undefined} />
        ) : (
          // При смене фильтра или страницы прежний список остаётся приглушённым, пока не придёт новый.
          <div
            className={cn('overflow-x-auto transition-opacity duration-300', isLoading && 'pointer-events-none opacity-45')}
            aria-busy={isLoading || undefined}
          >
            <table className="w-full min-w-[48rem] text-sm">
              <thead className="border-b bg-muted/50 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-semibold">Номер</th>
                  <th className="px-4 py-3 font-semibold">Дата</th>
                  <th className="px-4 py-3 font-semibold">Клиент</th>
                  <th className="px-4 py-3 font-semibold">Телефон</th>
                  <th className="px-4 py-3 text-right font-semibold">Сумма</th>
                  <th className="px-4 py-3 font-semibold">Статус</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => openOrder(order.id)}
                    className="cursor-pointer transition-colors hover:bg-accent/60"
                  >
                    <td className="px-4 py-3 font-medium">
                      {/* Ссылка для клавиатуры и «открыть в новой вкладке»; вся строка тоже кликабельна. */}
                      <a
                        href={`${AppRoute.AdminOrders}/${order.id}`}
                        onClick={(evt) => {
                          evt.preventDefault();
                          openOrder(order.id);
                        }}
                        className="hover:text-primary"
                      >
                        {order.orderNumber}
                      </a>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 tabular-nums text-muted-foreground">{formatDate(order.createdAt)}</td>
                    <td className="px-4 py-3">{order.contact.name}</td>
                    <td className="whitespace-nowrap px-4 py-3 tabular-nums">{order.contact.phone}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-right font-medium tabular-nums">{formatPrice(order.totalPrice)}</td>
                    <td className="px-4 py-3">
                      <OrderStatusBadge order={order} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>
            <ChevronLeft />
            Назад
          </Button>
          <span className="text-sm tabular-nums text-muted-foreground">
            Страница {page} из {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
          >
            Вперёд
            <ChevronRight />
          </Button>
        </div>
      )}
    </>
  );
}

export default AdminOrdersPage;
