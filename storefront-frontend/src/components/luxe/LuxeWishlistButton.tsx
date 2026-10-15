'use client';

import Link from 'next/link';

import styles from '@/app/(storefront)/(home)/home/_components/luxe/Home.module.css';
import { HeartIcon } from '@/app/(storefront)/(home)/home/_components/luxe/Icons';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';

/** Header link to the wishlist, badged with how much is saved. */
export default function LuxeWishlistButton() {
  const { isSignedIn } = useAuth();
  const { wishlist } = useWishlist();
  const count = isSignedIn ? wishlist.item_count : 0;

  return (
    <Link
      href={isSignedIn ? '/shop-wishlist' : '/signin?next=/shop-wishlist'}
      className={styles.headerRoundBtn}
      aria-label={count > 0 ? `Wishlist, ${count} saved` : 'Wishlist'}>
      <HeartIcon />
      {count > 0 && (
        <span className={styles.headerBadge} aria-hidden="true">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  );
}
