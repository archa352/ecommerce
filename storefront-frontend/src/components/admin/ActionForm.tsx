'use client';

import { useActionState, useRef } from 'react';

import { initialCheckoutState } from '@/lib/orders/state';
import type { CheckoutState } from '@/lib/orders/state';

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
  
  hidden?: Record<string, string>;
  resetOnSuccess?: boolean;
  inline?: boolean;
  submitClassName?: string;
}) {
  const [state, formAction, pending] = useActionState(action, initialCheckoutState);
  const formRef = useRef<HTMLFormElement>(null);

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
