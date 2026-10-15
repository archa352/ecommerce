'use client';

import Link from 'next/link';

import homeStyles from '@/app/(storefront)/(home)/home/_components/luxe/Home.module.css';
import listingStyles from '@/app/(storefront)/(shop)/shop-list/_components/luxe/Listing.module.css';
import { useWishlist } from '@/context/WishlistContext';

import wishlistStyles from './luxe/Wishlist.module.css';
import WishlistCard from './luxe/WishlistCard';

/**
 * The Wishlist page's content, styled to the same Zeen design system
 * as the Product Listing page (reusing its banner/breadcrumb and card media
 * classes directly -- see Wishlist.module.css). Real data throughout:
 * `wishlist` comes from `WishlistContext`, which the layout seeds from the
 * backend and every mutation (add/remove/toggle) keeps in sync with --
 * nothing here is mocked or static.
 */
export default function ShopWishList() {
  const { wishlist } = useWishlist();

  return (
    <>
      <section className={listingStyles.banner}>
        <div className={homeStyles.container}>
          <p className={listingStyles.crumb}>
            <Link href="/">Home</Link>
            <span>/</span>
            <span aria-current="page">Wishlist</span>
          </p>
          <h1 className={homeStyles.h2}>Wishlist</h1>
          <p className={listingStyles.subtitle}>
            {wishlist.items.length === 0
              ? 'Nothing saved yet.'
              : `${wishlist.items.length} saved item${wishlist.items.length === 1 ? '' : 's'}.`}
          </p>
        </div>
      </section>

      <section className={wishlistStyles.listingSection}>
        <div className={homeStyles.container}>
          {wishlist.items.length === 0 ? (
            <div className={wishlistStyles.emptyState}>
              <p>Your wishlist is empty.</p>
              <Link href="/shop-list" className={homeStyles.pillOutline}>
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className={wishlistStyles.grid}>
              {wishlist.items.map(item => (
                <WishlistCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
