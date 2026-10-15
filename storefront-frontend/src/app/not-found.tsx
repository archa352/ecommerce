import StorefrontShell from '@/components/StorefrontShell';
import NotFoundPage from '@/app/(storefront)/_components/not-found/NotFoundPage';
import { getCurrentUser } from '@/lib/auth/current-user';
import { getCart } from '@/lib/cart/read';
import { EMPTY_WISHLIST, getWishlist } from '@/lib/wishlist/read';
import type { Cart } from '@/types/cart';

export const metadata = {
  title: 'Page Not Found | ZEEN',
  description: "The page you're looking for doesn't exist or may have been moved.",
};

const EMPTY_CART: Cart = { id: 'guest', items: [], subtotal: '0.00', item_count: 0 };

/**
 * The app has no single root layout -- `(storefront)` and `(admin)` each
 * define their own `<html>`/`<body>` ("multiple root layouts", per
 * Next.js's app router). A URL that matches neither group's routes at all
 * (a typo, a dead link) can't be routed into either group's tree, so Next
 * falls back to its own generic 404 unless a root `not-found.tsx` exists.
 * This is that file: it renders the same ZEEN 404 as
 * `(storefront)/not-found.tsx`, with its own minimal shell (no layout wraps
 * it) so the header's cart/wishlist badges still work.
 */
export default async function RootNotFound() {
  const [user, cart, wishlist] = await Promise.all([
    getCurrentUser().catch(() => null),
    getCart().catch(() => EMPTY_CART),
    getWishlist().catch(() => EMPTY_WISHLIST),
  ]);

  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Roboto:wght@100;300;400;500;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <StorefrontShell user={user} cart={cart} wishlist={wishlist}>
          <NotFoundPage />
        </StorefrontShell>
      </body>
    </html>
  );
}
