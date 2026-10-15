'use client';

import { useActionState } from 'react';

import { updateOrderStatus } from '@/lib/admin/actions';
import { initialCheckoutState } from '@/lib/orders/state';
import { ALLOWED_TRANSITIONS } from '@/types/orders';
import type { OrderStatus } from '@/types/orders';

/**
 * Move an order to its next state.
 *
 * Only the transitions the backend allows from the current status are
 * offered -- it validates them again and rejects anything else, so this
 * mirrors that table rather than inventing its own rules.
 */
export default function OrderStatusForm({
  orderId,
  status,
}: {
  orderId: string;
  status: OrderStatus;
}) {
  const [state, formAction, pending] = useActionState(updateOrderStatus, initialCheckoutState);
  const nextStates = ALLOWED_TRANSITIONS[status] ?? [];

  if (nextStates.length === 0) {
    return (
      <p className="text-sm text-secondary-light mb-0">
        {status === 'DELIVERED' ? 'This order is complete.' : 'This order can no longer change state.'}
      </p>
    );
  }

  return (
    <form action={formAction} className="d-flex flex-wrap align-items-end gap-2">
      <input type="hidden" name="order_id" value={orderId} />

      <div className="flex-grow-1">
        <label className="form-label text-sm fw-medium" htmlFor="status">
          Move to
        </label>
        <select id="status" name="status" className="form-select radius-8" defaultValue={nextStates[0]}>
          {nextStates.map(next => (
            <option key={next} value={next}>
              {next}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" className="btn btn-primary-600 radius-8 px-20 py-9" disabled={pending}>
        {pending ? 'Updating…' : 'Update'}
      </button>

      {state.status === 'error' && <p className="text-danger-main text-sm w-100 mb-0">{state.message}</p>}
      {state.status === 'success' && (
        <p className="text-success-main text-sm w-100 mb-0">{state.message}</p>
      )}
    </form>
  );
}
