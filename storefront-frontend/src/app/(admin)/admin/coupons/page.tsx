import type { Metadata } from 'next';

import ActionForm from '@/components/admin/ActionForm';
import DangerAction from '@/components/admin/DangerAction';
import EmptyState from '@/components/admin/EmptyState';
import Field from '@/components/admin/Field';
import PageHeader from '@/components/admin/PageHeader';
import Pagination from '@/components/admin/Pagination';
import { createCoupon, deactivateCoupon, updateCoupon } from '@/lib/admin/actions';
import { adminApi } from '@/lib/api/admin';
import { requireStaff } from '@/lib/auth/require-staff';
import { formatDate, formatMoney } from '@/lib/format';
import type { Coupon } from '@/types/admin';

export const metadata: Metadata = { title: 'Coupons | Admin' };

const PAGE_SIZE = 20;

/** Percentage coupons carry no currency; fixed ones are money. */
function discountLabel(coupon: Coupon): string {
  return coupon.discount_type === 'PERCENTAGE'
    ? `${Number(coupon.discount_value)}%`
    : formatMoney(coupon.discount_value, coupon.currency);
}

function windowLabel(coupon: Coupon): string {
  if (!coupon.starts_at && !coupon.expires_at) return 'Always';
  const from = coupon.starts_at ? formatDate(coupon.starts_at) : 'Now';
  const to = coupon.expires_at ? formatDate(coupon.expires_at) : 'No end';
  return `${from} – ${to}`;
}

export default async function AdminCouponsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { token } = await requireStaff();
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? 1) || 1);

  const coupons = await adminApi.listCoupons(token, { page, page_size: PAGE_SIZE }).catch(() => null);

  return (
    <>
      <PageHeader title="Coupons" subtitle="Discount codes shoppers can apply at checkout." />

      <div className="card mb-24">
        <div className="card-body">
          <h6 className="text-md mb-16">New coupon</h6>
          <ActionForm action={createCoupon} submitLabel="Create coupon" resetOnSuccess>
            <div className="row gy-3">
              <Field label="Code" name="code" placeholder="WELCOME10" required className="col-md-3" />

              <div className="col-md-3">
                <label className="form-label text-sm fw-medium" htmlFor="discount_type">
                  Type <span className="text-danger-main">*</span>
                </label>
                <select id="discount_type" name="discount_type" className="form-select radius-8">
                  <option value="PERCENTAGE">Percentage off</option>
                  <option value="FIXED_AMOUNT">Fixed amount off</option>
                </select>
              </div>

              <Field
                label="Value"
                name="discount_value"
                placeholder="10"
                inputMode="decimal"
                required
                className="col-md-3"
              />
              <Field
                label="Minimum basket"
                name="min_order_amount"
                placeholder="Optional"
                inputMode="decimal"
                className="col-md-3"
              />
              <Field
                label="Maximum discount"
                name="max_discount_amount"
                placeholder="Optional, caps a percentage"
                inputMode="decimal"
                className="col-md-3"
              />
              <Field label="Starts" name="starts_at" type="datetime-local" className="col-md-3" />
              <Field label="Expires" name="expires_at" type="datetime-local" className="col-md-3" />
              <Field
                label="Total uses"
                name="usage_limit"
                placeholder="Unlimited"
                inputMode="numeric"
                className="col-md-3"
              />
              <Field
                label="Uses per customer"
                name="per_customer_usage_limit"
                placeholder="Unlimited"
                inputMode="numeric"
                className="col-md-3"
              />

              <div className="col-md-3 d-flex align-items-end">
                <div className="form-check d-flex align-items-center gap-2">
                  <input
                    className="form-check-input m-0 flex-shrink-0"
                    type="checkbox"
                    id="new-coupon-active"
                    name="is_active"
                    defaultChecked
                  />
                  <label className="form-check-label text-sm" htmlFor="new-coupon-active">
                    Active
                  </label>
                </div>
              </div>
            </div>
          </ActionForm>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          {coupons === null ? (
            <EmptyState title="Could not load coupons." hint="The API did not answer." />
          ) : coupons.items.length === 0 ? (
            <EmptyState
              icon="solar:ticket-outline"
              title="No coupons yet."
              hint="Creating one is not wired up here yet — the API supports it."
            />
          ) : (
            <>
              <div className="table-responsive scroll-sm">
                <table className="table bordered-table sm-table mb-0">
                  <thead>
                    <tr>
                      <th scope="col">Code</th>
                      <th scope="col">Discount</th>
                      <th scope="col">Valid</th>
                      <th scope="col">Used</th>
                      <th scope="col">Active</th>
                      <th scope="col" className="text-end">
                        &nbsp;
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {coupons.items.map(coupon => (
                      <tr key={coupon.id}>
                        <td className="fw-medium">{coupon.code}</td>
                        <td>{discountLabel(coupon)}</td>
                        <td className="text-sm">{windowLabel(coupon)}</td>
                        <td className="text-sm">
                          {coupon.times_used}
                          {coupon.usage_limit ? ` / ${coupon.usage_limit}` : ''}
                        </td>
                        <td>
                          <span
                            className={`px-16 py-4 rounded-pill fw-medium text-sm ${
                              coupon.is_active
                                ? 'bg-success-focus text-success-main'
                                : 'bg-neutral-200 text-neutral-600'
                            }`}
                          >
                            {coupon.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="text-end">
                          <div className="d-flex align-items-center justify-content-end gap-2">
                            <ActionForm
                              action={updateCoupon}
                              submitLabel="Save"
                              hidden={{
                                coupon_id: coupon.id,
                                discount_type: coupon.discount_type,
                                discount_value: coupon.discount_value,
                              }}
                              inline
                            >
                              <Field
                                label="Total uses"
                                name="usage_limit"
                                defaultValue={coupon.usage_limit}
                                inputMode="numeric"
                                hideLabel
                                className="max-w-135-px"
                              />
                              <div className="form-check d-flex align-items-center gap-2">
                                <input
                                  className="form-check-input m-0 flex-shrink-0"
                                  type="checkbox"
                                  id={`active-${coupon.id}`}
                                  name="is_active"
                                  defaultChecked={coupon.is_active}
                                />
                                <label className="form-check-label text-sm" htmlFor={`active-${coupon.id}`}>
                                  Active
                                </label>
                              </div>
                            </ActionForm>

                            {coupon.is_active && (
                              <DangerAction
                                action={deactivateCoupon}
                                fields={{ coupon_id: coupon.id }}
                                label="Deactivate"
                                confirmLabel="Deactivate"
                                size="xs"
                              />
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Pagination
                page={coupons.meta.page}
                totalPages={coupons.meta.total_pages}
                totalItems={coupons.meta.total_items}
                hrefFor={next => (next > 1 ? `/admin/coupons?page=${next}` : '/admin/coupons')}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}
