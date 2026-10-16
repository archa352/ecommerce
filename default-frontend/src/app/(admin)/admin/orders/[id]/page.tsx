import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import OrderStatusForm from '@/components/admin/OrderStatusForm';
import PageHeader from '@/components/admin/PageHeader';
import { OrderStatusBadge, PaymentStatusBadge } from '@/components/admin/StatusBadge';
import { adminApi } from '@/lib/api/admin';
import { ApiError } from '@/lib/api/errors';
import { requireStaff } from '@/lib/auth/require-staff';
import { formatDateTime, formatMoney } from '@/lib/format';

export const metadata: Metadata = { title: 'Order | Admin' };

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="d-flex align-items-center justify-content-between py-8 border-bottom">
      <span className={`text-sm ${strong ? 'fw-semibold' : 'text-secondary-light'}`}>{label}</span>
      <span className={`text-sm ${strong ? 'fw-semibold' : ''}`}>{value}</span>
    </div>
  );
}

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { token } = await requireStaff();
  const { id } = await params;

  const order = await adminApi.getOrder(token, id).catch(error => {
    if (error instanceof ApiError && error.isNotFound) notFound();
    throw error;
  });

  const address = order.delivery_address;

  return (
    <>
      <PageHeader
        title={order.order_number}
        subtitle={`Placed ${formatDateTime(order.created_at)}`}
        trail={[{ label: 'Orders', href: '/admin/orders' }]}
        action={
          <div className="d-flex align-items-center gap-2">
            <OrderStatusBadge status={order.status} />
            <PaymentStatusBadge status={order.payment_status} />
          </div>
        }
      />

      <div className="row gy-4">
        <div className="col-xxl-8">
          <div className="card h-100">
            <div className="card-body">
              <h6 className="text-lg mb-20">Items</h6>

              <div className="table-responsive scroll-sm">
                <table className="table bordered-table sm-table mb-0">
                  <thead>
                    <tr>
                      <th scope="col">Product</th>
                      <th scope="col">SKU</th>
                      <th scope="col" className="text-end">
                        Qty
                      </th>
                      <th scope="col" className="text-end">
                        Unit
                      </th>
                      <th scope="col" className="text-end">
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map(item => (
                      <tr key={`${item.variant_id}-${item.sku}`}>
                        <td>
                          <span className="fw-medium d-block">{item.product_name}</span>
                          <span className="text-sm text-secondary-light">{item.variant_name}</span>
                        </td>
                        <td className="text-sm">{item.sku}</td>
                        <td className="text-end">{item.quantity}</td>
                        <td className="text-end">{formatMoney(item.unit_price, order.currency)}</td>
                        <td className="text-end fw-medium">
                          {formatMoney(item.subtotal, order.currency)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-24 ms-auto max-w-440-px">
                <Row label="Subtotal" value={formatMoney(order.subtotal, order.currency)} />
                {order.coupon_code && (
                  <Row
                    label={`Discount (${order.coupon_code})`}
                    value={`- ${formatMoney(order.discount_amount, order.currency)}`}
                  />
                )}
                <Row label="Shipping" value={formatMoney(order.shipping_amount, order.currency)} />
                <Row label="Tax" value={formatMoney(order.tax_amount, order.currency)} />
                <Row label="Total" value={formatMoney(order.total_amount, order.currency)} strong />
              </div>
            </div>
          </div>
        </div>

        <div className="col-xxl-4">
          <div className="d-flex flex-column gap-4">
            <div className="card">
              <div className="card-body">
                <h6 className="text-lg mb-16">Fulfilment</h6>
                <OrderStatusForm orderId={order.id} status={order.status} />
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <h6 className="text-lg mb-16">Deliver to</h6>
                <p className="mb-0 fw-medium">{address.full_name}</p>
                <p className="mb-0 text-sm text-secondary-light">{address.phone}</p>
                <p className="mb-0 text-sm mt-8">
                  {address.address_line_1}
                  {address.address_line_2 ? `, ${address.address_line_2}` : ''}
                  <br />
                  {address.city}, {address.state} {address.postal_code}
                  <br />
                  {address.country}
                </p>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <h6 className="text-lg mb-16">Payment</h6>
                {order.payment === null ? (
                  <p className="text-sm text-secondary-light mb-0">No payment recorded.</p>
                ) : (
                  <>
                    <Row label="Provider" value={order.payment.provider} />
                    <Row
                      label="Amount"
                      value={formatMoney(order.payment.amount, order.payment.currency)}
                    />
                    <div className="d-flex align-items-center justify-content-between py-8">
                      <span className="text-sm text-secondary-light">Status</span>
                      <PaymentStatusBadge status={order.payment.status} />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
