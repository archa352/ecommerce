import pageStyles from '@/app/(storefront)/(home)/home/_components/luxe/Home.module.css';
import StorefrontShell from '@/components/StorefrontShell';
import LuxeFooter from '@/components/luxe/LuxeFooter';
import LuxeHeader from '@/components/luxe/LuxeHeader';
import { getCurrentUser } from '@/lib/auth/current-user';
import { getCart } from '@/lib/cart/read';
import { EMPTY_WISHLIST, getWishlist } from '@/lib/wishlist/read';
import type { UserProfile } from '@/types/auth';
import type { Cart, Wishlist } from '@/types/cart';

const EMPTY_CART: Cart = { id: 'guest', items: [], subtotal: '0.00', item_count: 0 };

/**
 * Resolve the session, cart and wishlist for every storefront page.
 *
 * A backend that is down degrades to a signed-out visitor with an empty
 * cart and wishlist rather than an error page: the catalogue still reads,
 * and the pages that genuinely need a session say so themselves.
 */
async function loadShellData(): Promise<{
  user: UserProfile | null;
  cart: Cart;
  wishlist: Wishlist;
}> {
  const [user, cart, wishlist] = await Promise.all([
    getCurrentUser().catch(() => null),
    getCart().catch(() => EMPTY_CART),
    getWishlist().catch(() => EMPTY_WISHLIST),
  ]);

  return { user, cart, wishlist };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { user, cart, wishlist } = await loadShellData();

  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&family=DM+Sans:wght@400;500;700&family=Playfair+Display:ital,wght@1,400;1,500&family=Roboto:wght@100;300;400;500;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <StorefrontShell user={user} cart={cart} wishlist={wishlist}>
          <div className={`page-wraper ${pageStyles.page}`}>
            <LuxeHeader />
            {children}
            <LuxeFooter />
          </div>
        </StorefrontShell>
      </body>
    </html>
  );
}
