import type { Metadata } from 'next';
import Link from 'next/link';

import EmptyState from '@/components/admin/EmptyState';
import PageHeader from '@/components/admin/PageHeader';
import Pagination from '@/components/admin/Pagination';
import ReviewModerationForm from '@/components/admin/ReviewModerationForm';
import { adminApi } from '@/lib/api/admin';
import { requireStaff } from '@/lib/auth/require-staff';
import { formatDate } from '@/lib/format';

export const metadata: Metadata = { title: 'Reviews | Admin' };

const PAGE_SIZE = 20;

/** "pending" is the useful default view: those are the ones awaiting a call. */
function asApproval(value: string | undefined): boolean | undefined {
  if (value === 'approved') return true;
  if (value === 'pending') return false;
  return undefined;
}

export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; show?: string }>;
}) {
  const { token } = await requireStaff();
  const params = await searchParams;

  const page = Math.max(1, Number(params.page ?? 1) || 1);
  const show = params.show ?? 'all';
  const isApproved = asApproval(show);

  const reviews = await adminApi
    .listReviews(token, { page, page_size: PAGE_SIZE, is_approved: isApproved })
    .catch(() => null);

  function hrefFor(nextPage: number) {
    const query = new URLSearchParams();
    if (show !== 'all') query.set('show', show);
    if (nextPage > 1) query.set('page', String(nextPage));
    const encoded = query.toString();
    return encoded ? `/admin/reviews?${encoded}` : '/admin/reviews';
  }

  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Awaiting approval' },
    { key: 'approved', label: 'Published' },
  ];

  return (
    <>
      <PageHeader title="Reviews" subtitle="Approve what shoppers see on the storefront." />

      <div className="card">
        <div className="card-body">
          <div className="d-flex flex-wrap gap-2 mb-24">
            {tabs.map(tab => (
              <Link
                key={tab.key}
                href={tab.key === 'all' ? '/admin/reviews' : `/admin/reviews?show=${tab.key}`}
                className={`btn btn-sm radius-8 px-16 py-6 ${
                  show === tab.key ? 'btn-primary-600' : 'btn-outline-secondary'
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </div>

          {reviews === null ? (
            <EmptyState title="Could not load reviews." hint="The API did not answer." />
          ) : reviews.items.length === 0 ? (
            <EmptyState
              icon="solar:star-outline"
              title="Nothing here."
              hint="Reviews appear once shoppers write them."
            />
          ) : (
            <>
              <div className="table-responsive scroll-sm">
                <table className="table bordered-table sm-table mb-0">
                  <thead>
                    <tr>
                      <th scope="col">Rating</th>
                      <th scope="col">Review</th>
                      <th scope="col">Written</th>
                      <th scope="col">State</th>
                      <th scope="col" className="text-end">
                        &nbsp;
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviews.items.map(review => (
                      <tr key={review.id}>
                        <td className="fw-semibold text-nowrap">{review.rating} / 5</td>
                        <td>
                          {review.title && <span className="fw-medium d-block">{review.title}</span>}
                          <span className="text-sm text-secondary-light">{review.comment ?? '—'}</span>
                          {review.is_verified_purchase && (
                            <span className="text-xs text-success-main d-block">Verified purchase</span>
                          )}
                        </td>
                        <td className="text-sm text-nowrap">{formatDate(review.created_at)}</td>
                        <td>
                          <span
                            className={`px-16 py-4 rounded-pill fw-medium text-sm ${
                              review.is_approved
                                ? 'bg-success-focus text-success-main'
                                : 'bg-warning-focus text-warning-main'
                            }`}
                          >
                            {review.is_approved ? 'Published' : 'Awaiting'}
                          </span>
                        </td>
                        <td className="text-end">
                          <ReviewModerationForm reviewId={review.id} isApproved={review.is_approved} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Pagination
                page={reviews.meta.page}
                totalPages={reviews.meta.total_pages}
                totalItems={reviews.meta.total_items}
                hrefFor={hrefFor}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}
