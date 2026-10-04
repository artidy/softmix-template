import { useEffect, useId, useState } from 'react';
import { Link, useParams } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { OrderStatus } from '@project-lib/shared-types';

import { useAppDispatch, useAppSelector } from '../hooks';
import { AppRoute } from '../const';
import { useDocumentTitle } from '../lib/use-document-title';
import { fetchOrderById, updateOrderStatus } from '../store/orders-data/api-actions';
import { getCurrentOrder, getOrdersLoading } from '../store/orders-data/selectors';
import { formatDate } from '../utils/format';
import { ORDER_STATUS_LABEL } from '../utils/order-labels';
import { AdminPageHeader } from '../components/admin/admin-page-header';
import { OrderItemsCard, OrderSideInfo, OrderStatusBadge, OrderTimeline } from '../components/order/order-parts';
import { Button, buttonVariants } from '../ui/button';
import { Card } from '../ui/card';
import { PageLoader } from '../ui/feedback';
import { Field, Select, Textarea } from '../ui/form';

function AdminOrderDetailsPage() {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const formId = useId();
  const order = useAppSelector(getCurrentOrder);
  const isLoading = useAppSelector(getOrdersLoading);

  const [nextStatus, setNextStatus] = useState<OrderStatus | ''>('');
  const [comment, setComment] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useDocumentTitle(order && order.id === id ? `Заказ ${order.orderNumber} — панель управления` : 'Заказ');

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (order) {
      setNextStatus(order.status);
    }
  }, [order]);

  // Пока идёт сохранение статуса, заказ остаётся на экране — без мигания загрузчиком.
  if (!order || order.id !== id || (isLoading && !isSaving)) {
    return <PageLoader />;
  }

  const handleSave = async () => {
    if (!nextStatus || nextStatus === order.status) {
      return;
    }
    setIsSaving(true);
    await dispatch(updateOrderStatus({ id: order.id, dto: { status: nextStatus, comment: comment.trim() || undefined } }));
    setIsSaving(false);
    setComment('');
  };

  return (
    <>
      <Link to={AppRoute.AdminOrders} className={buttonVariants({ variant: 'ghost', size: 'sm', className: '-ml-3 mb-3' })}>
        <ArrowLeft />
        К списку заказов
      </Link>
      <AdminPageHeader
        title={`Заказ ${order.orderNumber}`}
        description={`от ${formatDate(order.createdAt)}`}
        actions={<OrderStatusBadge order={order} className="px-3 py-1 text-sm" />}
      />

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="grid gap-6">
          <OrderItemsCard order={order} />
          {order.comment && (
            <Card className="p-5">
              <h2 className="font-semibold">Комментарий клиента</h2>
              <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">{order.comment}</p>
            </Card>
          )}
          <OrderTimeline order={order} />
        </div>

        <div className="grid gap-4">
          <Card className="p-5">
            <h2 className="mb-4 font-semibold">Сменить статус</h2>
            <div className="grid gap-3">
              <Field label="Новый статус" htmlFor={`${formId}-status`}>
                <Select
                  id={`${formId}-status`}
                  value={nextStatus}
                  onChange={(evt) => setNextStatus(evt.target.value as OrderStatus)}
                >
                  {Object.values(OrderStatus).map((value) => (
                    <option key={value} value={value}>
                      {ORDER_STATUS_LABEL[value]}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Комментарий" htmlFor={`${formId}-comment`} hint="Необязательно — попадёт в историю статусов">
                <Textarea
                  id={`${formId}-comment`}
                  rows={2}
                  className="min-h-16"
                  value={comment}
                  onChange={(evt) => setComment(evt.target.value)}
                />
              </Field>
              <Button onClick={handleSave} loading={isSaving} disabled={!nextStatus || nextStatus === order.status}>
                Сохранить
              </Button>
            </div>
          </Card>
          <OrderSideInfo order={order} linkContacts />
        </div>
      </div>
    </>
  );
}

export default AdminOrderDetailsPage;
