'use server';

import { revalidatePath } from 'next/cache';

import { cartApi, wishlistApi } from '@/lib/api/cart';
import { ApiError, ApiUnreachableError } from '@/lib/api/errors';
import { getActionAccessToken } from '@/lib/auth/session';
import { addLine, clearGuestCart, readGuestCart, writeGuestCart } from '@/lib/cart/guest-cart';
import { getCart } from '@/lib/cart/read';
import type { CartActionState, CartMutation } from '@/lib/cart/state';

function toState(error: unknown): CartActionState {
  if (error instanceof ApiError) {
    if (error.isRateLimited) return { status: 'error', message: 'Too many requests. Try again shortly.' };
    return { status: 'error', message: error.message };
  }

  if (error instanceof ApiUnreachableError) {
    return { status: 'error', message: 'Could not reach Zeen. Try again in a moment.' };
  }

  throw error;
}

function refreshCartViews(): void {
  revalidatePath('/cart-items');
  revalidatePath('/', 'layout');
}

/**
 * Add a variant to the cart.
 *
 * A signed-in shopper's line goes straight to the backend, which is
 * authoritative for stock. A guest's is held in a cookie and replayed after
 * sign-in, since the backend has no guest cart to write to.
 */
export async function addToCart(
  _previous: CartActionState,
  formData: FormData,
): Promise<CartActionState> {
  const variantId = String(formData.get('variant_id') ?? '');
  const quantity = Number(formData.get('quantity') ?? 1);

  if (!variantId) return { status: 'error', message: 'Choose an option first.' };
  if (!Number.isInteger(quantity) || quantity < 1) {
    return { status: 'error', message: 'Choose a quantity.' };
  }

  const token = await getActionAccessToken();

  if (token) {
    try {
      await cartApi.addItem(token, variantId, quantity);
    } catch (error) {
      return toState(error);
    }
  } else {
    const lines = await readGuestCart();
    await writeGuestCart(addLine(lines, variantId, quantity));
  }

  refreshCartViews();
  return { status: 'success', message: 'Added to your cart' };
}

export async function updateCartQuantity(
  _previous: CartActionState,
  formData: FormData,
): Promise<CartActionState> {
  const itemId = String(formData.get('item_id') ?? '');
  const quantity = Number(formData.get('quantity') ?? 1);

  const token = await getActionAccessToken();

  if (token) {
    try {
      await cartApi.updateItem(token, itemId, quantity);
    } catch (error) {
      return toState(error);
    }
  } else {
    const lines = await readGuestCart();
    await writeGuestCart(
      lines.map((line) => (line.variant_id === itemId ? { ...line, quantity } : line)),
    );
  }

  refreshCartViews();
  return { status: 'success', message: 'Cart updated' };
}

export async function removeCartItem(
  _previous: CartActionState,
  formData: FormData,
): Promise<CartActionState> {
  const itemId = String(formData.get('item_id') ?? '');
  const token = await getActionAccessToken();

  if (token) {
    try {
      await cartApi.removeItem(token, itemId);
    } catch (error) {
      return toState(error);
    }
  } else {
    const lines = await readGuestCart();
    await writeGuestCart(lines.filter((line) => line.variant_id !== itemId));
  }

  refreshCartViews();
  return { status: 'success', message: 'Removed from your cart' };
}

/**
 * Move a guest cart into the backend after sign-in.
 *
 * Lines are replayed one at a time so a single rejection -- stock gone, a
 * variant withdrawn -- does not cost the shopper the rest of the cart.
 * Whatever happens the cookie is cleared, so nothing is added twice.
 */
export async function mergeGuestCart(token: string): Promise<{ merged: number; rejected: number }> {
  const lines = await readGuestCart();
  if (lines.length === 0) return { merged: 0, rejected: 0 };

  let merged = 0;
  let rejected = 0;

  for (const line of lines) {
    try {
      await cartApi.addItem(token, line.variant_id, line.quantity);
      merged += 1;
    } catch {
      rejected += 1;
    }
  }

  await clearGuestCart();
  refreshCartViews();

  return { merged, rejected };
}

export async function toggleWishlist(
  _previous: CartActionState,
  formData: FormData,
): Promise<CartActionState> {
  const variantId = String(formData.get('variant_id') ?? '');
  const itemId = String(formData.get('item_id') ?? '');

  const token = await getActionAccessToken();
  if (!token) return { status: 'error', message: 'Sign in to save pieces to your wishlist.' };

  try {
    if (itemId) {
      await wishlistApi.removeItem(token, itemId);
      revalidatePath('/shop-wishlist');
      return { status: 'success', message: 'Removed from your wishlist' };
    }

    await wishlistApi.addItem(token, variantId);
    revalidatePath('/shop-wishlist');
    return { status: 'success', message: 'Saved to your wishlist' };
  } catch (error) {
    return toState(error);
  }
}

/**
 * Mutations the client cart provider calls directly.
 *
 * They answer with the whole cart rather than a status, so the provider can
 * render the backend's own totals instead of recomputing them locally. The
 * form-shaped actions above stay for anything driven by a <form>.
 */
async function mutate(apply: (token: string | null) => Promise<void>): Promise<CartMutation> {
  const token = await getActionAccessToken();

  try {
    await apply(token);
  } catch (error) {
    const state = toState(error);
    return { cart: await getCart(), error: state.message };
  }

  refreshCartViews();
  return { cart: await getCart(), error: null };
}

export async function addCartItem(variantId: string, quantity: number): Promise<CartMutation> {
  if (!variantId) return { cart: await getCart(), error: 'Choose an option first.' };

  return mutate(async token => {
    if (token) {
      await cartApi.addItem(token, variantId, quantity);
      return;
    }

    const lines = await readGuestCart();
    await writeGuestCart(addLine(lines, variantId, quantity));
  });
}

export async function setCartItemQuantity(itemId: string, quantity: number): Promise<CartMutation> {
  if (quantity < 1) return removeCartLine(itemId);

  return mutate(async token => {
    if (token) {
      await cartApi.updateItem(token, itemId, quantity);
      return;
    }

    const lines = await readGuestCart();
    await writeGuestCart(
      lines.map(line => (line.variant_id === itemId ? { ...line, quantity } : line)),
    );
  });
}

export async function removeCartLine(itemId: string): Promise<CartMutation> {
  return mutate(async token => {
    if (token) {
      await cartApi.removeItem(token, itemId);
      return;
    }

    const lines = await readGuestCart();
    await writeGuestCart(lines.filter(line => line.variant_id !== itemId));
  });
}

export async function clearCart(): Promise<CartMutation> {
  return mutate(async token => {
    if (token) {
      await cartApi.clear(token);
      return;
    }

    await clearGuestCart();
  });
}
