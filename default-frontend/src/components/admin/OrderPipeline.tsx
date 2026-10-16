import { Icon } from '@iconify/react';

import type { OrderStatusSummary } from '@/types/admin';

/** Fulfilment stages, in the order an order actually moves through them. */
const STAGES: { key: keyof OrderStatusSummary; label: string; tone: string; icon: string }[] = [
  { key: 'pending', label: 'Pending', tone: 'bg-warning-main', icon: 'solar:clock-circle-bold' },
  { key: 'processing', label: 'Processing', tone: 'bg-info-main', icon: 'solar:box-bold' },
  { key: 'shipped', label: 'Shipped', tone: 'bg-primary-600', icon: 'solar:delivery-bold' },
  { key: 'delivered', label: 'Delivered', tone: 'bg-success-main', icon: 'solar:check-circle-bold' },
  { key: 'cancelled', label: 'Cancelled', tone: 'bg-danger-main', icon: 'solar:close-circle-bold' },
  { key: 'returned', label: 'Returned', tone: 'bg-neutral-400', icon: 'solar:rewind-back-bold' },
];

/**
 * Where every order currently sits.
 *
 * The bar is each stage's share of all orders, so a queue building up in one
 * stage is visible without reading the numbers.
 */
export default function OrderPipeline({ orders }: { orders: OrderStatusSummary }) {
  const total = orders.total || 1;

  return (
    <div className="col-xxl-4 col-xl-12">
      <div className="card h-100">
        <div className="card-body">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-20">
            <h6 className="text-lg mb-0">Order pipeline</h6>
            <span className="text-sm fw-medium text-neutral-500">{orders.total} total</span>
          </div>

          {orders.total === 0 ? (
            <p className="text-neutral-500 text-center py-40 mb-0">No orders yet.</p>
          ) : (
            <div className="d-flex flex-column gap-20">
              {STAGES.map(stage => {
                const count = orders[stage.key];
                const share = Math.round((count / total) * 100);

                return (
                  <div key={stage.key}>
                    <div className="d-flex align-items-center justify-content-between mb-8">
                      <span className="text-sm fw-medium d-flex align-items-center gap-2">
                        <Icon icon={stage.icon} className="text-lg text-neutral-500" />
                        {stage.label}
                      </span>
                      <span className="text-sm fw-semibold">{count}</span>
                    </div>
                    <div className="progress h-8-px bg-neutral-200 rounded-pill">
                      <div
                        className={`progress-bar ${stage.tone} rounded-pill`}
                        role="progressbar"
                        style={{ width: `${share}%` }}
                        aria-valuenow={count}
                        aria-valuemin={0}
                        aria-valuemax={orders.total}
                        aria-label={`${stage.label} orders`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
