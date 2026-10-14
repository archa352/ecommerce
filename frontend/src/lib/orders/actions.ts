'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { addressApi } from '@/lib/api/addresses';
import { ApiError, ApiUnreachableError } from '@/lib/api/errors';
import { checkoutApi, couponApi, orderApi, paymentApi } from '@/lib/api/orders';
import { getActionAccessToken } from '@/lib/auth/session';
import type { CheckoutState } from '@/lib/orders/state';
import { pendingOnlinePayment } from '@/lib/payments/online';
import {
  ONLINE_PAYMENT_METHODS,
  type CheckoutPreview,
  type Order,
  type PaymentMethod,
  type RazorpayVerification,
} from '@/types/orders';

function toState(error: unknown): CheckoutState {
  if (error instanceof ApiError) {
    return {
      status: 'error',
      message: error.message,
      fieldErrors: error.fieldErrors(),
      requestId: error.requestId,
    };
  }

  if (error instanceof ApiUnreachableError) {
    return { status: 'error', message: 'Could not reach Zeen. Try again in a moment.' };
  }

  throw error;
}

export async function saveAddress(_previous: CheckoutState, formData: FormData): Promise<CheckoutState> {
  const token = await getActionAccessToken();
  if (!token) return { status: 'error', message: 'Sign in to continue.' };

  const payload = {
    full_name: String(formData.get('full_name') ?? '').trim(),
    phone: String(formData.get('phone') ?? '').trim(),
    address_line_1: String(formData.get('address_line_1') ?? '').trim(),
    address_line_2: String(formData.get('address_line_2') ?? '').trim() || null,
    city: String(formData.get('city') ?? '').trim(),
    state: String(formData.get('state') ?? '').trim(),
    postal_code: String(formData.get('postal_code') ?? '').trim(),
    country: String(formData.get('country') ?? 'India').trim(),
    is_default: formData.get('is_default') === 'on',
  };

  try {
    await addressApi.create(token, payload);
  } catch (error) {
    return toState(error);
  }

  revalidatePath('/check-out');
  revalidatePath('/my-account');
  return { status: 'success', message: 'Address saved' };
}

export async function updateAddress(_previous: CheckoutState, formData: FormData): Promise<CheckoutState> {
  const token = await getActionAccessToken();
  if (!token) return { status: 'error', message: 'Sign in to continue.' };

  const addressId = String(formData.get('address_id') ?? '');
  if (!addressId) return { status: 'error', message: 'Missing address.' };

  const payload = {
    full_name: String(formData.get('full_name') ?? '').trim(),
    phone: String(formData.get('phone') ?? '').trim(),
    address_line_1: String(formData.get('address_line_1') ?? '').trim(),
    address_line_2: String(formData.get('address_line_2') ?? '').trim() || null,
    city: String(formData.get('city') ?? '').trim(),
    state: String(formData.get('state') ?? '').trim(),
    postal_code: String(formData.get('postal_code') ?? '').trim(),
    country: String(formData.get('country') ?? 'India').trim(),
    is_default: formData.get('is_default') === 'on',
  };

  try {
    await addressApi.update(token, addressId, payload);
  } catch (error) {
    return toState(error);
  }

  revalidatePath('/check-out');
  revalidatePath('/my-account');
  return { status: 'success', message: 'Address updated' };
}

export async function deleteAddress(_previous: CheckoutState, formData: FormData): Promise<CheckoutState> {
  const token = await getActionAccessToken();
  if (!token) return { status: 'error', message: 'Sign in to continue.' };

  try {
    await addressApi.remove(token, String(formData.get('address_id') ?? ''));
  } catch (error) {
    return toState(error);
  }

  revalidatePath('/my-account');
  return { status: 'success', message: 'Address removed' };
}

/** Validates a code against the live cart and reports what it takes off. */
export async function applyCoupon(_previous: CheckoutState, formData: FormData): Promise<CheckoutState> {
  const token = await getActionAccessToken();
  if (!token) return { status: 'error', message: 'Sign in to continue.' };

  const code = String(formData.get('code') ?? '').trim();
  if (!code) return { status: 'error', message: 'Enter a code.' };

  try {
    const result = await couponApi.apply(token, code);
    revalidatePath('/check-out');
    return { status: 'success', message: `${result.code} applied`, couponCode: result.code };
  } catch (error) {
    return toState(error);
  }
}

const PAYMENT_METHODS: readonly PaymentMethod[] = [...ONLINE_PAYMENT_METHODS, 'CASH_ON_DELIVERY'];

function paymentMethodFrom(formData: FormData): PaymentMethod {
  const value = String(formData.get('payment_method') ?? '');
  return (PAYMENT_METHODS as readonly string[]).includes(value) ? (value as PaymentMethod) : 'CASH_ON_DELIVERY';
}

/**
 * Place the order.
 *
 * Only the address, an optional coupon and the payment method are sent.
 * Every price is computed by the backend from the cart, so nothing about
 * money crosses from here. The idempotency key makes a double submit safe:
 * the original order comes back rather than a second one being created.
 *
 * Cash goes straight to the confirmation page. Anything paid online comes
 * back as `pay`, carrying what the browser needs to open Razorpay Checkout.
 */
export async function placeOrder(_previous: CheckoutState, formData: FormData): Promise<CheckoutState> {
  const token = await getActionAccessToken();
  if (!token) return { status: 'error', message: 'Sign in to continue.' };

  const addressId = String(formData.get('address_id') ?? '');
  if (!addressId) return { status: 'error', message: 'Choose a delivery address.' };

  const couponCode = String(formData.get('coupon_code') ?? '').trim() || null;
  const idempotencyKey = String(formData.get('idempotency_key') ?? '') || crypto.randomUUID();
  const paymentMethod = paymentMethodFrom(formData);

  let order: Order;

  try {
    order = await checkoutApi.placeOrder(token, { addressId, couponCode, idempotencyKey, paymentMethod });
  } catch (error) {
    return toState(error);
  }

  revalidatePath('/my-orders');
  revalidatePath('/cart-items');
  revalidatePath('/', 'layout');

  const payment = pendingOnlinePayment(order);
  if (payment) return { status: 'pay', message: null, payment };

  // The real order id from the backend, never a fabricated one.
  redirect(`/order-success/${order.id}`);
}

/**
 * Confirm what Razorpay Checkout reported. The backend checks Razorpay's
 * signature before anything is marked paid; this only carries it there.
 */
export async function confirmOnlinePayment(
  orderId: string,
  verification: RazorpayVerification,
): Promise<CheckoutState> {
  const token = await getActionAccessToken();

  try {
    await paymentApi.verifyRazorpay(token, verification);
  } catch (error) {
    return toState(error);
  }

  revalidatePath(`/order-success/${orderId}`);
  revalidatePath('/my-orders');
  redirect(`/order-success/${orderId}`);
}

export async function cancelOrder(_previous: CheckoutState, formData: FormData): Promise<CheckoutState> {
  const token = await getActionAccessToken();
  if (!token) return { status: 'error', message: 'Sign in to continue.' };

  const orderId = String(formData.get('order_id') ?? '');

  try {
    await orderApi.cancel(token, orderId);
  } catch (error) {
    return toState(error);
  }

  revalidatePath(`/order-success/${orderId}`);
  revalidatePath('/my-orders');
  return { status: 'success', message: 'Order cancelled' };
}

/**
 * Create the delivery address and place the order in one submit.
 *
 * The checkout form types an address rather than picking a saved one, and
 * the backend's /checkout takes an address id -- so the address is created
 * first and its id handed straight to the order. A failure to save the
 * address stops before anything is charged.
 */
export async function placeOrderWithAddress(
  _previous: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  const token = await getActionAccessToken();
  if (!token) return { status: 'error', message: 'Sign in to continue.' };

  const address = {
    full_name: String(formData.get('full_name') ?? '').trim(),
    phone: String(formData.get('phone') ?? '').trim(),
    address_line_1: String(formData.get('address_line_1') ?? '').trim(),
    address_line_2: String(formData.get('address_line_2') ?? '').trim() || null,
    city: String(formData.get('city') ?? '').trim(),
    state: String(formData.get('state') ?? '').trim(),
    postal_code: String(formData.get('postal_code') ?? '').trim(),
    country: String(formData.get('country') ?? 'India').trim(),
    is_default: true,
  };

  const couponCode = String(formData.get('coupon_code') ?? '').trim() || null;
  const idempotencyKey = String(formData.get('idempotency_key') ?? '') || crypto.randomUUID();

  let orderId: string;

  try {
    const saved = await addressApi.create(token, address);
    const order = await checkoutApi.placeOrder(token, {
      addressId: saved.id,
      couponCode,
      idempotencyKey,
    });
    orderId = order.id;
  } catch (error) {
    return toState(error);
  }

  revalidatePath('/my-orders');
  revalidatePath('/cart-items');
  revalidatePath('/', 'layout');

  redirect(`/order-success/${orderId}`);
}

/** Re-price the cart, so an applied coupon shows its real effect. */
export async function previewCheckout(couponCode: string | null): Promise<CheckoutPreview | null> {
  const token = await getActionAccessToken();
  if (!token) return null;

  try {
    return await checkoutApi.preview(token, { couponCode: couponCode ?? undefined });
  } catch {
    return null;
  }
}

/**
 * Re-price the cart for a chosen address and coupon, keeping the reason a
 * coupon didn't apply (invalid, expired, minimum not met...) rather than
 * swallowing it like `previewCheckout` does -- the checkout page's coupon
 * box needs that message to show the shopper why.
 */
export async function previewCheckoutFor(
  addressId: string | null,
  couponCode: string | null,
  paymentMethod?: PaymentMethod,
): Promise<{ preview: CheckoutPreview | null; error: string | null }> {
  const token = await getActionAccessToken();
  if (!token) return { preview: null, error: 'Sign in to continue.' };

  try {
    const preview = await checkoutApi.preview(token, {
      addressId: addressId ?? undefined,
      couponCode: couponCode ?? undefined,
      paymentMethod,
    });
    return { preview, error: null };
  } catch (error) {
    if (error instanceof ApiError) return { preview: null, error: error.message };
    if (error instanceof ApiUnreachableError) {
      return { preview: null, error: 'Could not reach Zeen. Try again in a moment.' };
    }
    throw error;
  }
}
