'use client';

import Link from 'next/link';

import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

import styles from './CheckoutHeader.module.css';

function MenuIcon() {
  return (
    <svg width="22" height="16" viewBox="0 0 22 16" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M0 1h22M0 8h22M0 15h22" strokeLinecap="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20.5c1.4-3.6 4.2-5.5 7.5-5.5s6.1 1.9 7.5 5.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path
        d="M12 20.5s-7.5-4.6-9.8-9.3C.6 7.7 2.3 4.5 5.6 4a4.6 4.6 0 0 1 6.4 2 4.6 4.6 0 0 1 6.4-2c3.3.5 5 3.7 3.4 7.2C19.5 15.9 12 20.5 12 20.5Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M6 8h12l1 12.5a1 1 0 0 1-1 1.5H6a1 1 0 0 1-1-1.5L6 8Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/shop-standard', label: 'Shop' },
  { href: '/shop-standard', label: 'New Arrivals' },
  { href: '/shop-standard', label: 'Collections' },
  { href: '/about-us', label: 'About' },
];

/**
 * Checkout's own header -- mobile shows the same minimal hamburger/logo/icon
 * bar as the cart and 404 pages; desktop switches to the reference's full
 * nav-link bar instead. Both markups always render; CSS shows one at a time
 * (see `.module.css`) rather than swapping DOM on resize. Page-scoped copy,
 * not a shared component -- the site's real `Header.tsx` is untouched.
 */
export default function CheckoutHeader() {
  const { itemCount } = useCart();
  const { wishlist } = useWishlist();

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.menuBtn} aria-label="Home">
        <MenuIcon />
      </Link>

      <nav className={styles.navLinks} aria-label="Primary">
        {NAV_LINKS.map(link => (
          <Link key={link.label} href={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>

      <Link href="/" className={styles.logo}>
        ZEEN
      </Link>

      <div className={styles.actions}>
        <span className={styles.iconBtn} aria-hidden="true">
          <SearchIcon />
        </span>

        <Link href="/my-account" className={`${styles.iconBtn} ${styles.accountBtn}`} aria-label="Account">
          <UserIcon />
        </Link>

        <Link href="/shop-wishlist" className={styles.iconBtn} aria-label="Wishlist">
          <HeartIcon />
          {wishlist.item_count > 0 && <span className={styles.badge}>{wishlist.item_count}</span>}
        </Link>

        <Link href="/cart-items" className={styles.iconBtn} aria-label="Cart">
          <BagIcon />
          {itemCount > 0 && <span className={styles.badge}>{itemCount}</span>}
        </Link>
      </div>
    </header>
  );
}
