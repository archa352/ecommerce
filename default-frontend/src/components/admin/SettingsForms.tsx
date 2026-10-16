'use client';

import { useActionState } from 'react';

import { updateShippingSettings, updateTaxSettings } from '@/lib/admin/actions';
import { initialCheckoutState } from '@/lib/orders/state';
import type { ShippingSettings, TaxSettings } from '@/types/admin';

function Feedback({ status, message }: { status: string; message: string | null }) {
  if (status === 'idle' || !message) return null;

  return (
    <p className={`text-sm mb-0 mt-12 ${status === 'error' ? 'text-danger-main' : 'text-success-main'}`}>
      {message}
    </p>
  );
}

/**
 * The delivery charge, and the basket value that waives it.
 *
 * Both fields go up together because the endpoint replaces the whole row.
 */
export function ShippingForm({ settings }: { settings: ShippingSettings }) {
  const [state, formAction, pending] = useActionState(updateShippingSettings, initialCheckoutState);

  return (
    <form action={formAction}>
      <div className="mb-16">
        <label className="form-label text-sm fw-medium" htmlFor="shipping_amount">
          Delivery charge
        </label>
        <input
          id="shipping_amount"
          name="shipping_amount"
          className="form-control radius-8"
          defaultValue={settings.shipping_amount}
          inputMode="decimal"
        />
      </div>

      <div className="mb-16">
        <label className="form-label text-sm fw-medium" htmlFor="free_shipping_minimum">
          Free above
        </label>
        <input
          id="free_shipping_minimum"
          name="free_shipping_minimum"
          className="form-control radius-8"
          defaultValue={settings.free_shipping_minimum ?? ''}
          placeholder="Leave blank to always charge"
          inputMode="decimal"
        />
      </div>

      <div className="form-check d-flex align-items-center gap-2 mb-16">
        <input
          className="form-check-input m-0 flex-shrink-0"
          type="checkbox"
          id="shipping_is_active"
          name="is_active"
          defaultChecked={settings.is_active}
        />
        <label className="form-check-label text-sm" htmlFor="shipping_is_active">
          Charge delivery at checkout
        </label>
      </div>

      <button type="submit" className="btn btn-primary-600 radius-8 px-20 py-9" disabled={pending}>
        {pending ? 'Saving…' : 'Save shipping'}
      </button>

      <Feedback status={state.status} message={state.message} />
    </form>
  );
}

/** The tax rate applied to every order, as a percentage. */
export function TaxForm({ settings }: { settings: TaxSettings }) {
  const [state, formAction, pending] = useActionState(updateTaxSettings, initialCheckoutState);

  return (
    <form action={formAction}>
      <div className="mb-16">
        <label className="form-label text-sm fw-medium" htmlFor="tax_percentage">
          Tax rate (%)
        </label>
        <input
          id="tax_percentage"
          name="tax_percentage"
          className="form-control radius-8"
          defaultValue={settings.tax_percentage}
          inputMode="decimal"
        />
      </div>

      <div className="form-check d-flex align-items-center gap-2 mb-16">
        <input
          className="form-check-input m-0 flex-shrink-0"
          type="checkbox"
          id="tax_is_active"
          name="is_active"
          defaultChecked={settings.is_active}
        />
        <label className="form-check-label text-sm" htmlFor="tax_is_active">
          Apply tax at checkout
        </label>
      </div>

      <button type="submit" className="btn btn-primary-600 radius-8 px-20 py-9" disabled={pending}>
        {pending ? 'Saving…' : 'Save tax'}
      </button>

      <Feedback status={state.status} message={state.message} />
    </form>
  );
}
