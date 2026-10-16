import type { Metadata } from 'next';
import Link from 'next/link';

import EmptyState from '@/components/admin/EmptyState';
import PageHeader from '@/components/admin/PageHeader';
import Pagination from '@/components/admin/Pagination';
import { PaymentStatusBadge } from '@/components/admin/StatusBadge';
import { adminApi } from '@/lib/api/admin';
import { requireStaff } from '@/lib/auth/require-staff';
import { formatDateTime, formatMoney } from '@/lib/format';
import type { PaymentStatus } from '@/types/orders';

export const metadata: Metadata = { title: 'Payments | Admin' };

const PAGE_SIZE = 20;
const PAYMENT_STATUSES: PaymentStatus[] = ['PENDING', 'PAID', 'FAILED', 'REFUNDED'];

function asPaymentStatus(value: string | undefined): PaymentStatus | undefined {
  return PAYMENT_STATUSES.includes(value as PaymentStatus) ? (value as PaymentStatus) : undefined;
}

export default async function AdminPaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string }>;
}) {
  const { token } = await requireStaff();
  const params = await searchParams;

  const page = Math.max(1, Number(params.page ?? 1) || 1);
  const status = asPaymentStatus(params.status);

  const payments = await adminApi
    .listPayments(token, { page, page_size: PAGE_SIZE, status })
    .catch(() => null);

  function hrefFor(nextPage: number) {
    const query = new URLSearchParams();
    if (status) query.set('status', status);
    if (nextPage > 1) query.set('page', String(nextPage));
    const encoded = query.toString();
    return encoded ? `/admin/payments?${encoded}` : '/admin/payments';
  }

  return (
    <>
      <PageHeader
        title="Payments"
        subtitle="Cash on delivery is the only provider the backend implements."
      />

      <div className="card">
        <div className="card-body">
          <form className="row gy-3 align-items-end mb-24" method="get">
            <div className="col-sm-4 col-md-3">
              <label className="form-label text-sm fw-medium" htmlFor="status">
                Status
              </label>
              <select id="status" name="status" className="form-select radius-8" defaultValue={status ?? ''}>
                <option value="">All</option>
                {PAYMENT_STATUSES.map(value => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4 d-flex gap-2">
              <button type="submit" className="btn btn-primary-600 radius-8 px-20 py-9">
                Filter
              </button>
              <Link href="/admin/payments" className="btn btn-outline-secondary radius-8 px-20 py-9">
                Reset
              </Link>
            </div>
          </form>

          {payments === null ? (
            <EmptyState title="Could not load payments." hint="The API did not answer." />
          ) : payments.items.length === 0 ? (
            <EmptyState title="No payments yet." hint="A payment row appears when an order is placed." />
          ) : (
            <>
              <div className="table-responsive scroll-sm">
                <table className="table bordered-table sm-table mb-0">
                  <thead>
                    <tr>
                      <th scope="col">Taken</th>
                      <th scope="col">Order</th>
                      <th scope="col">Provider</th>
                      <th scope="col">Status</th>
                      <th scope="col" className="text-end">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.items.map(payment => (
                      <tr key={payment.id}>
                        <td className="text-nowrap">{formatDateTime(payment.created_at)}</td>
                        <td>
                          <Link
                            href={`/admin/orders/${payment.order_id}`}
                            className="text-primary-600 fw-medium text-sm"
                          >
                            View order
                          </Link>
                        </td>
                        <td>{payment.provider}</td>
                        <td>
                          <PaymentStatusBadge status={payment.status} />
                        </td>
                        <td className="text-end fw-semibold">
                          {formatMoney(payment.amount, payment.currency)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Pagination
                page={payments.meta.page}
                totalPages={payments.meta.total_pages}
                totalItems={payments.meta.total_items}
                hrefFor={hrefFor}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}
