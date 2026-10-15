import { cookies } from 'next/headers';

export const GUEST_CART_COOKIE = 'zeen_guest_cart';

const GUEST_CART_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;
const MAX_LINES = 50;

export interface GuestCartLine {
  variant_id: string;
  quantity: number;
}

/**
 * A cart for signed-out shoppers.
 *
 * Every /cart route on the backend requires a customer, and there is no
 * merge endpoint, so a guest cart has to live here and be replayed into the
 * API after sign-in. It is kept in a cookie rather than localStorage so the
 * server can read it while rendering.
 */
export async function readGuestCart(): Promise<GuestCartLine[]> {
  const store = await cookies();
  const raw = store.get(GUEST_CART_COOKIE)?.value;
  if (!raw) return [];

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter(
        (line): line is GuestCartLine =>
          typeof line === 'object' &&
          line !== null &&
          typeof (line as GuestCartLine).variant_id === 'string' &&
          Number.isInteger((line as GuestCartLine).quantity) &&
          (line as GuestCartLine).quantity > 0,
      )
      .slice(0, MAX_LINES);
  } catch {
    return [];
  }
}

export async function writeGuestCart(lines: GuestCartLine[]): Promise<void> {
  const store = await cookies();

  if (lines.length === 0) {
    store.delete(GUEST_CART_COOKIE);
    return;
  }

  store.set(GUEST_CART_COOKIE, JSON.stringify(lines.slice(0, MAX_LINES)), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: GUEST_CART_MAX_AGE_SECONDS,
  });
}

export async function clearGuestCart(): Promise<void> {
  const store = await cookies();
  store.delete(GUEST_CART_COOKIE);
}

/** Add or top up a line, capped at the quantity the backend will accept. */
export function addLine(lines: GuestCartLine[], variantId: string, quantity: number): GuestCartLine[] {
  const existing = lines.find((line) => line.variant_id === variantId);

  if (existing) {
    return lines.map((line) =>
      line.variant_id === variantId
        ? { ...line, quantity: Math.min(line.quantity + quantity, 999) }
        : line,
    );
  }

  return [...lines, { variant_id: variantId, quantity: Math.min(quantity, 999) }];
}
