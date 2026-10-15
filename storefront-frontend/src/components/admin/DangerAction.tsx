'use client';

import { useActionState, useState } from 'react';

import { initialCheckoutState } from '@/lib/orders/state';
import type { CheckoutState } from '@/lib/orders/state';

/**
 * A destructive action behind an inline confirmation.
 *
 * The first click only arms the button; the second submits. That is
 * deliberately not `window.confirm` -- a dialog the browser can suppress is
 * a poor guard for something irreversible, and this stays visible in the
 * page where the row it belongs to is.
 *
 * `fields` carries whatever the action needs to identify the row, so one
 * component serves archiving a product, a variant, a category or a coupon.
 */
export default function DangerAction({
  action,
  fields,
  label,
  confirmLabel = 'Confirm',
  size = 'sm',
}: {
  action: (state: CheckoutState, formData: FormData) => Promise<CheckoutState>;
  fields: Record<string, string>;
  label: string;
  confirmLabel?: string;
  size?: 'sm' | 'xs';
}) {
  const [state, formAction, pending] = useActionState(action, initialCheckoutState);
  const [armed, setArmed] = useState(false);

  const padding = size === 'xs' ? 'px-12 py-4 text-xs' : 'px-16 py-6 text-sm';

  return (
    <form action={formAction} className="d-inline-flex flex-column align-items-end gap-1">
      {Object.entries(fields).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}

      {armed ? (
        <span className="d-inline-flex align-items-center gap-2">
          <button type="submit" className={`btn btn-danger radius-8 ${padding}`} disabled={pending}>
            {pending ? 'Working…' : confirmLabel}
          </button>
          <button
            type="button"
            className={`btn btn-outline-secondary radius-8 ${padding}`}
            onClick={() => setArmed(false)}
            disabled={pending}
          >
            Cancel
          </button>
        </span>
      ) : (
        <button
          type="button"
          className={`btn btn-outline-danger radius-8 ${padding}`}
          onClick={() => setArmed(true)}
        >
          {label}
        </button>
      )}

      {state.status === 'error' && (
        <span className="text-danger-main text-xs text-end">{state.message}</span>
      )}
      {state.status === 'success' && (
        <span className="text-success-main text-xs text-end">{state.message}</span>
      )}
    </form>
  );
}
