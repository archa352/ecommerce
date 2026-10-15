import MainFooter from '@/components/MainFoooter';
import { checkoutApi } from '@/lib/api/orders';
import { getAccessToken } from '@/lib/auth/session';
import Cart from './_components/Cart';
import CartHeader from './_components/CartHeader';

/**
 * The cart is open to guests, so the checkout preview is best-effort: it
 * needs a session, and an empty cart has nothing to price.
 *
 * This page renders its own minimal `CartHeader` instead of `CommanLayout`'s
 * shared `Header` -- the cart page has its own reference design for the top
 * bar, and building a second header here keeps that scoped to this page
 * rather than changing navigation on every other page.
 */
export default async function CartPage() {
  const token = await getAccessToken();
  const preview = token ? await checkoutApi.preview(token).catch(() => null) : null;

  return (
    <div className="page-wraper">
      <CartHeader />
      <Cart preview={preview} />
      <MainFooter />
    </div>
  );
}
