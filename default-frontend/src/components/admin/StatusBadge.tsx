import type { OrderStatus, PaymentStatus } from '@/types/orders';

/**
 * `RecentOrderSummary.order_status` is typed against the storefront's own
 * union, but the dashboard renders whatever the backend sends -- a status
 * added server-side should show up as itself rather than crash the table.
 */
const ORDER_TONES: Record<string, string> = {
  PENDING: 'bg-warning-focus text-warning-main',
  CONFIRMED: 'bg-info-focus text-info-main',
  PROCESSING: 'bg-info-focus text-info-main',
  SHIPPED: 'bg-primary-light text-primary-600',
  DELIVERED: 'bg-success-focus text-success-main',
  CANCELLED: 'bg-danger-focus text-danger-main',
};

const PAYMENT_TONES: Record<string, string> = {
  PENDING: 'bg-warning-focus text-warning-main',
  PAID: 'bg-success-focus text-success-main',
  FAILED: 'bg-danger-focus text-danger-main',
  REFUNDED: 'bg-neutral-200 text-neutral-600',
};

const FALLBACK = 'bg-neutral-200 text-neutral-600';

function label(status: string): string {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`px-16 py-4 rounded-pill fw-medium text-sm ${ORDER_TONES[status] ?? FALLBACK}`}>
      {label(status)}
    </span>
  );
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <span className={`px-16 py-4 rounded-pill fw-medium text-sm ${PAYMENT_TONES[status] ?? FALLBACK}`}>
      {label(status)}
    </span>
  );
}
