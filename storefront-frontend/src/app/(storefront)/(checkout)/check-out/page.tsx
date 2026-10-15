import { addressApi } from '@/lib/api/addresses';
import { checkoutApi } from '@/lib/api/orders';
import { getAccessToken } from '@/lib/auth/session';
import type { Address } from '@/types/addresses';
import Checkout from './_components/Checkout';

/**
 * Price the cart and load saved addresses before the form renders.
 *
 * Middleware already turns guests away (`/check-out` requires a session), so
 * a missing token here only means a backend hiccup -- the page degrades to
 * an empty address list and no preview rather than crashing, and the form
 * itself surfaces the real error on the next action it tries.
 */
export default async function CheckoutPageRoute() {
  const token = await getAccessToken();

  const [addresses, preview] = token
    ? await Promise.all([
        addressApi.list(token).catch((): Address[] => []),
        checkoutApi.preview(token).catch(() => null),
      ])
    : [[] as Address[], null];

  return <Checkout initialAddresses={addresses} initialPreview={preview} />;
}
