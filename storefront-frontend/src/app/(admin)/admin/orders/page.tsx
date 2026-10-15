import type { Metadata } from 'next';
import Link from 'next/link';

import EmptyState from '@/components/admin/EmptyState';
import PageHeader from '@/components/admin/PageHeader';
import Pagination from '@/components/admin/Pagination';
import { OrderStatusBadge, PaymentStatusBadge } from '@/components/admin/StatusBadge';
import { adminApi } from '@/lib/api/admin';
import { requireStaff } from '@/lib/auth/require-staff';
import { formatDateTime, formatMoney } from '@/lib/format';
import type { OrderStatus, PaymentStatus } from '@/types/orders';

export const metadata: Metadata = { title: 'Orders | Admin' };

const PAGE_SIZE = 20;

const ORDER_STATUSES: OrderStatus[] = [
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
];
const PAYMENT_STATUSES: PaymentStatus[] = ['PENDING', 'PAID', 'FAILED', 'REFUNDED'];

function asOrderStatus(value: string | undefined): OrderStatus | undefined {
  return ORDER_STATUSES.includes(value as OrderStatus) ? (value as OrderStatus) : undefined;
}

function asPaymentStatus(value: string | undefined): PaymentStatus | undefined {
  return PAYMENT_STATUSES.includes(value as PaymentStatus) ? (value as PaymentStatus) : undefined;
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string; payment_status?: string; order_number?: string }>;
}) {
  const { token } = await requireStaff();
  const params = await searchParams;

  const page = Math.max(1, Number(params.page ?? 1) || 1);
  const status = asOrderStatus(params.status);
  const paymentStatus = asPaymentStatus(params.payment_status);
  const orderNumber = (params.order_number ?? '').trim();

  const orders = await adminApi
    .listOrders(token, {
      page,
      page_size: PAGE_SIZE,
      status,
      payment_status: paymentStatus,
      order_number: orderNumber || undefined,
    })
    .catch(() => null);

  function hrefFor(nextPage: number) {
    const query = new URLSearchParams();
    if (status) query.set('status', status);
    if (paymentStatus) query.set('payment_status', paymentStatus);
    if (orderNumber) query.set('order_number', orderNumber);
    if (nextPage > 1) query.set('page', String(nextPage));
    const encoded = query.toString();
    return encoded ? `/admin/orders?${encoded}` : '/admin/orders';
  }

  return (
    <>
      <PageHeader title="Orders" subtitle="Every order placed in this store." />

      <div className="card">
        <div className="card-body">
          <form className="row gy-3 align-items-end mb-24" method="get">
            <div className="col-sm-4 col-md-3">
              <label className="form-label text-sm fw-medium" htmlFor="order_number">
                Order number
              </label>
              <input
                id="order_number"
                name="order_number"
                type="search"
                className="form-control radius-8"
                placeholder="ORD-100001"
                defaultValue={orderNumber}
              />
            </div>

            <div className="col-sm-4 col-md-3">
              <label className="form-label text-sm fw-medium" htmlFor="status">
                Status
              </label>
              <select id="status" name="status" className="form-select radius-8" defaultValue={status ?? ''}>
                <option value="">All</option>
                {ORDER_STATUSES.map(value => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-sm-4 col-md-3">
              <label className="form-label text-sm fw-medium" htmlFor="payment_status">
                Payment
              </label>
              <select
                id="payment_status"
                name="payment_status"
                className="form-select radius-8"
                defaultValue={paymentStatus ?? ''}
              >
                <option value="">All</option>
                {PAYMENT_STATUSES.map(value => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3 d-flex gap-2">
              <button type="submit" className="btn btn-primary-600 radius-8 px-20 py-9">
                Filter
              </button>
              <Link href="/admin/orders" className="btn btn-outline-secondary radius-8 px-20 py-9">
                Reset
              </Link>
            </div>
          </form>

          {orders === null ? (
            <EmptyState title="Could not load orders." hint="The API did not answer. Reload to try again." />
          ) : orders.items.length === 0 ? (
            <EmptyState
              title="No orders match these filters."
              hint="Clear the filters to see every order."
            />
          ) : (
            <>
              <div className="table-responsive scroll-sm">
                <table className="table bordered-table sm-table mb-0">
                  <thead>
                    <tr>
                      <th scope="col">Order</th>
                      <th scope="col">Placed</th>
                      <th scope="col">Status</th>
                      <th scope="col">Payment</th>
                      <th scope="col" className="text-end">
                        Total
                      </th>
                      <th scope="col" className="text-end">
                        &nbsp;
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.items.map(order => (
                      <tr key={order.id}>
                        <td className="fw-medium">{order.order_number}</td>
                        <td className="text-nowrap">{formatDateTime(order.created_at)}</td>
                        <td>
                          <OrderStatusBadge status={order.status} />
                        </td>
                        <td>
                          <PaymentStatusBadge status={order.payment_status} />
                        </td>
                        <td className="text-end fw-semibold">
                          {formatMoney(order.total_amount, order.currency)}
                        </td>
                        <td className="text-end">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="text-primary-600 fw-medium text-sm"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Pagination
                page={orders.meta.page}
                totalPages={orders.meta.total_pages}
                totalItems={orders.meta.total_items}
                hrefFor={hrefFor}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}
