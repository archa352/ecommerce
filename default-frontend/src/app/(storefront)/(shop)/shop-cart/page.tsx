import Cart from '@/app/(storefront)/(cart)/cart-items/_components/Cart';
import CartHeader from '@/app/(storefront)/(cart)/cart-items/_components/CartHeader';
import MainFooter from '@/components/MainFoooter';
import { checkoutApi } from '@/lib/api/orders';
import { getAccessToken } from '@/lib/auth/session';

/**
 * `/shop-cart` is a second URL for the same real cart as `/cart-items`
 * (dozens of old template pages link here; the header's own cart icon links
 * to `/cart-items` -- see Header.tsx). It renders the same `Cart` +
 * `CartHeader` composition as `cart-items/page.tsx` (identical to that page,
 * see the comment there) rather than `CommanLayout`'s shared header, so both
 * URLs for this one cart look the same.
 */
export default async function ShopCartPage() {
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
