'use client';

import { useActionState, useRef } from 'react';

import { initialCheckoutState } from '@/lib/orders/state';
import type { CheckoutState } from '@/lib/orders/state';

/**
 * One form shell for every admin write.
 *
 * The action reports through the same CheckoutState the rest of the app
 * uses, so a backend refusal ("an option name may only appear once per
 * variant", "Category still has active products") is shown verbatim rather
 * than replaced by a guess at what went wrong.
 */
export default function ActionForm({
  action,
  submitLabel,
  pendingLabel,
  children,
  hidden,
  resetOnSuccess = false,
  inline = false,
  submitClassName = 'btn btn-primary-600 radius-8 px-20 py-9',
}: {
  action: (state: CheckoutState, formData: FormData) => Promise<CheckoutState>;
  submitLabel: string;
  pendingLabel?: string;
  children: React.ReactNode;
  /** Identifiers the action needs, e.g. the product this row belongs to. */
  hidden?: Record<string, string>;
  resetOnSuccess?: boolean;
  inline?: boolean;
  /** Lets a form in a tight spot (an image card) use a smaller button. */
  submitClassName?: string;
}) {
  const [state, formAction, pending] = useActionState(action, initialCheckoutState);
  const formRef = useRef<HTMLFormElement>(null);

  /* A form that adds a row (an image, a variant) should come back empty so
     the next one can be typed straight in; an edit form keeps what it has. */
  if (resetOnSuccess && state.status === 'success') formRef.current?.reset();

  return (
    <form
      ref={formRef}
      action={formAction}
      className={inline ? 'd-flex flex-wrap align-items-end gap-2' : ''}
    >
      {Object.entries(hidden ?? {}).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}

      {children}

      <div className={inline ? '' : 'd-flex flex-wrap align-items-center gap-3 mt-16'}>
        <button type="submit" className={submitClassName} disabled={pending}>
          {pending ? (pendingLabel ?? 'Saving…') : submitLabel}
        </button>

        {state.status === 'error' && <span className="text-danger-main text-sm">{state.message}</span>}
        {state.status === 'success' && (
          <span className="text-success-main text-sm">{state.message}</span>
        )}
      </div>
    </form>
  );
}
