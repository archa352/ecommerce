'use client';

import { useState } from 'react';

import { formatMoney } from '@/lib/format';
import type { PaymentStatus } from '@/types/orders';

function PackageSearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true">
      <path d="M21 10V7a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 7v10a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l1.5-.86" />
      <path d="M3.29 7 12 12l8.71-5" />
      <path d="M12 22V12" />
      <circle cx="18.5" cy="15.5" r="2.5" />
      <path d="M20.27 17.27 22 19" />
    </svg>
  );
}

/** One order's payment, as the table shows it. */
export interface PaymentRow {
  orderId: string;
  orderNumber: string;
  paymentId: string;
  method: string;
  amount: string;
  currency: string;
  status: PaymentStatus;
}

interface StatusMeta {
  label: string;
  dotClassName: string;
  textClassName: string;
}

const STATUS_META: Record<PaymentStatus, StatusMeta> = {
  PAID: {
    label: 'Paid',
    dotClassName: 'myorderDotEmerald',
    textClassName: 'myorderTextEmerald',
  },
  PENDING: {
    label: 'Pending',
    dotClassName: 'myorderDotAmber',
    textClassName: 'myorderTextAmber',
  },
  FAILED: {
    label: 'Failed',
    dotClassName: 'myorderDotRose',
    textClassName: 'myorderTextRose',
  },
  REFUNDED: {
    label: 'Refunded',
    dotClassName: 'myorderDotBlue',
    textClassName: 'myorderTextBlue',
  },
};

type FilterValue = 'all' | PaymentStatus;

const FILTERS: FilterValue[] = ['all', 'PAID', 'PENDING', 'FAILED', 'REFUNDED'];

export default function PaymentHistory({ payments: allPayments }: { payments: PaymentRow[] }) {
  const [filter, setFilter] = useState<FilterValue>('all');

  const payments = filter === 'all' ? allPayments : allPayments.filter(p => p.status === filter);

  return (
    <div className="myorderPage">
      <div className="myorderContainer">
        <div className="myorderHeader">
          <div>
            <h1 className="myorderTitle">Payments</h1>
          </div>
        </div>

        {payments.length !== 0 && (
          <div className="myorderFilters">
            {FILTERS.map(f => {
              const active = filter === f;
              const label = f === 'all' ? 'All' : STATUS_META[f].label;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={`myorderFilterButton ${active ? 'myorderFilterButtonActive' : ''}`}>
                  {label}
                </button>
              );
            })}
          </div>
        )}

        <div className="myorderTableCard">
          {/* Horizontal scroll wrapper: keeps the table usable on narrow screens */}
          <div className="myorderTableScroll">
            <table className="myorderTable">
              <thead>
                <tr className="myorderHeadRow">
                  <th className="myorderTh">Order ID</th>
                  <th className="myorderTh">Payment ID</th>
                  <th className="myorderTh">Method</th>
                  <th className="myorderTh">Amount</th>
                  <th className="myorderTh">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment, i) => {
                  const meta = STATUS_META[payment.status];
                  const isLast = i === payments.length - 1;
                  return (
                    <tr key={payment.orderId} className={`myorderRow ${!isLast ? 'myorderRowBorder' : ''}`}>
                      <td className="myorderTd myorderTdOrderId">{payment.orderNumber}</td>
                      <td className="myorderTd myorderTdDate">{payment.paymentId}</td>
                      <td className="myorderTd myorderTdDate">{payment.method}</td>
                      <td className="myorderTd myorderTdAmount">
                        {formatMoney(payment.amount, payment.currency)}
                      </td>
                      <td className="myorderTd">
                        <span className={`myorderStatusBadge ${meta.textClassName}`}>
                          <span className={`myorderStatusDot ${meta.dotClassName}`} />
                          {meta.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {payments.length === 0 && (
            <div className="myorderEmptyState">
              <PackageSearchIcon className="myorderEmptyIcon" />
              <p className="myorderEmptyText">No payment transactions found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
