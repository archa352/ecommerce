'use client';

import { useActionState } from 'react';

import { moderateReview } from '@/lib/admin/actions';
import { initialCheckoutState } from '@/lib/orders/state';

/** Approving publishes the review on the storefront; hiding takes it down. */
export default function ReviewModerationForm({
  reviewId,
  isApproved,
}: {
  reviewId: string;
  isApproved: boolean;
}) {
  const [state, formAction, pending] = useActionState(moderateReview, initialCheckoutState);

  return (
    <form action={formAction} className="d-flex align-items-center justify-content-end gap-2">
      <input type="hidden" name="review_id" value={reviewId} />
      <input type="hidden" name="is_approved" value={isApproved ? 'false' : 'true'} />

      <button
        type="submit"
        disabled={pending}
        className={`btn btn-sm radius-8 px-16 py-6 ${
          isApproved ? 'btn-outline-danger' : 'btn-primary-600'
        }`}
      >
        {pending ? '…' : isApproved ? 'Hide' : 'Approve'}
      </button>

      {state.status === 'error' && <span className="text-danger-main text-sm">{state.message}</span>}
    </form>
  );
}
