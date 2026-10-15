import { Icon } from '@iconify/react';

import { formatMoney } from '@/lib/format';
import type { DashboardOverview } from '@/types/admin';

/**
 * Change against the previous comparable period.
 *
 * The backend sends null when that period had nothing to compare against,
 * which is not the same as no change -- a store's first day would otherwise
 * read as flat rather than as new.
 */
function Delta({ pct, label }: { pct: number | null; label: string }) {
  if (pct === null) {
    return <span className="text-xs fw-medium text-neutral-500">No {label} to compare</span>;
  }

  const rising = pct >= 0;

  return (
    <>
      <span
        className={`d-inline-flex align-items-center gap-1 ${rising ? 'text-success-main' : 'text-danger-main'}`}
      >
        <Icon icon={rising ? 'bxs:up-arrow' : 'bxs:down-arrow'} className="text-xs" />
        {rising ? '+' : ''}
        {pct.toFixed(1)}%
      </span>
      vs {label}
    </>
  );
}

function MetricCard({
  gradient,
  tone,
  icon,
  label,
  value,
  children,
}: {
  gradient: number;
  tone: string;
  icon: string;
  label: string;
  value: string;
  children: React.ReactNode;
}) {
  return (
    <div className="col">
      <div className={`card shadow-none border bg-gradient-start-${gradient} h-100`}>
        <div className="card-body p-20">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
            <div>
              <p className="fw-medium text-primary-light mb-1">{label}</p>
              <h6 className="mb-0">{value}</h6>
            </div>
            <div
              className={`w-50-px h-50-px ${tone} rounded-circle d-flex justify-content-center align-items-center`}
            >
              <Icon icon={icon} className="text-white text-2xl mb-0" />
            </div>
          </div>
          <p className="fw-medium text-sm text-primary-light mt-12 mb-0 d-flex align-items-center gap-2">
            {children}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * The six numbers a store owner opens the dashboard for.
 *
 * Revenue counts only orders the backend treats as earned -- processing,
 * shipped and delivered -- so a pile of unpaid pending orders does not read
 * as money taken. The cards say so, because otherwise revenue sitting at
 * zero next to a non-zero order count looks like a broken dashboard.
 */
export default function DashboardMetrics({
  overview,
  currency,
}: {
  overview: DashboardOverview;
  currency: string;
}) {
  const { sales, orders, customers, products, payments, inventory } = overview;

  return (
    <div className="row row-cols-xxxl-5 row-cols-lg-3 row-cols-sm-2 row-cols-1 gy-4">
      <MetricCard
        gradient={1}
        tone="bg-cyan"
        icon="solar:wallet-bold"
        label="Revenue today"
        value={formatMoney(sales.today.revenue, currency)}
      >
        <Delta pct={sales.today.revenue_change_pct} label="yesterday" />
      </MetricCard>

      <MetricCard
        gradient={2}
        tone="bg-purple"
        icon="solar:chart-2-bold"
        label="Revenue this month"
        value={formatMoney(sales.month.revenue, currency)}
      >
        <Delta pct={sales.month.revenue_change_pct} label="last month" />
      </MetricCard>

      <MetricCard
        gradient={3}
        tone="bg-info"
        icon="solar:cart-5-bold"
        label="Orders today"
        value={String(orders.today)}
      >
        <span className="text-success-main">{orders.total}</span> all time
      </MetricCard>

      <MetricCard
        gradient={4}
        tone="bg-success-main"
        icon="gridicons:multiple-users"
        label="Customers"
        value={String(customers.total)}
      >
        <span className="text-success-main">+{customers.new_this_month}</span> this month
      </MetricCard>

      <MetricCard
        gradient={5}
        tone="bg-red"
        icon="solar:box-bold"
        label="Products"
        value={String(products.total)}
      >
        {inventory.out_of_stock_count > 0 ? (
          <>
            <span className="text-danger-main">{inventory.out_of_stock_count}</span> out of stock
          </>
        ) : (
          <span className="text-success-main">All variants in stock</span>
        )}
      </MetricCard>

      <MetricCard
        gradient={1}
        tone="bg-warning"
        icon="solar:card-bold"
        label="Payments awaiting"
        value={String(payments.pending_count)}
      >
        {formatMoney(payments.today_paid_amount, currency)} paid today
      </MetricCard>
    </div>
  );
}
