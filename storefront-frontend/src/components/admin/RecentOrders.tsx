import { formatDate, formatMoney } from '@/lib/format';
import type { RecentOrderSummary } from '@/types/admin';

import { OrderStatusBadge, PaymentStatusBadge } from './StatusBadge';

/** Each order carries its own currency, so nothing here assumes the tenant's. */
export default function RecentOrders({ orders }: { orders: RecentOrderSummary[] }) {
  return (
    <div className="col-12">
      <div className="card h-100">
        <div className="card-body">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-20">
            <h6 className="text-lg mb-0">Recent orders</h6>
          </div>

          {orders.length === 0 ? (
            <p className="text-neutral-500 text-center py-40 mb-0">No orders yet.</p>
          ) : (
            <div className="table-responsive scroll-sm">
              <table className="table bordered-table sm-table mb-0">
                <thead>
                  <tr>
                    <th scope="col">Order</th>
                    <th scope="col">Customer</th>
                    <th scope="col">Placed</th>
                    <th scope="col">Status</th>
                    <th scope="col">Payment</th>
                    <th scope="col" className="text-end">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.order_id}>
                      <td className="fw-medium">{order.order_number}</td>
                      <td className="max-w-288-px text-truncate">
                        {order.customer_email ?? <span className="text-neutral-400">Guest</span>}
                      </td>
                      <td className="text-nowrap">{formatDate(order.created_at)}</td>
                      <td>
                        <OrderStatusBadge status={order.order_status} />
                      </td>
                      <td>
                        <PaymentStatusBadge status={order.payment_status} />
                      </td>
                      <td className="text-end fw-semibold">
                        {formatMoney(order.total_amount, order.currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
