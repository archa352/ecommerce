'use client';

import Link from 'next/link';

import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

import styles from './OrderSuccessHeader.module.css';

function MenuIcon() {
  return (
    <svg width="22" height="16" viewBox="0 0 22 16" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M0 1h22M0 8h22M0 15h22" strokeLinecap="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path
        d="M12 20.5s-7.5-4.6-9.8-9.3C.6 7.7 2.3 4.5 5.6 4a4.6 4.6 0 0 1 6.4 2 4.6 4.6 0 0 1 6.4-2c3.3.5 5 3.7 3.4 7.2C19.5 15.9 12 20.5 12 20.5Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20.5c1.4-3.6 4.2-5.5 7.5-5.5s6.1 1.9 7.5 5.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M6 8h12l1 12.5a1 1 0 0 1-1 1.5H6a1 1 0 0 1-1-1.5L6 8Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const NAV_LINKS = [
  { href: '/shop-standard', label: 'New Arrivals' },
  { href: '/shop-standard', label: 'Women' },
  { href: '/shop-standard', label: 'Kurtas' },
  { href: '/shop-standard', label: 'Tops' },
  { href: '/shop-standard', label: 'Sale' },
];

/** First letters of up to two words in a name, for the avatar circle. */
function initialsOf(name: string | null): string | null {
  if (!name) return null;
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return null;
  const initials = parts.length === 1 ? parts[0].slice(0, 2) : parts[0][0] + parts[1][0];
  return initials.toUpperCase();
}

/**
 * Order-success's own header -- mobile shows the same hamburger/logo/icon
 * bar as the rest of this app's page-scoped headers; desktop switches to
 * this page's reference (full nav links + an account avatar) instead. Both
 * markups always render; CSS shows one at a time -- see `.module.css`.
 * Page-scoped copy, not the shared `Header.tsx`.
 */
export default function OrderSuccessHeader() {
  const { itemCount } = useCart();
  const { wishlist } = useWishlist();
  const { user } = useAuth();
  const initials = initialsOf(user?.name ?? null);

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.menuBtn} aria-label="Home">
        <MenuIcon />
      </Link>

      <Link href="/" className={styles.logo}>
        ZEEN
      </Link>

      <nav className={styles.navLinks} aria-label="Primary">
        {NAV_LINKS.map(link => (
          <Link key={link.label} href={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>

      <div className={styles.actions}>
        <span className={styles.iconBtn} aria-hidden="true">
          <SearchIcon />
        </span>

        <Link href="/shop-wishlist" className={styles.iconBtn} aria-label="Wishlist">
          <HeartIcon />
          {wishlist.item_count > 0 && <span className={styles.badge}>{wishlist.item_count}</span>}
        </Link>

        <Link href="/cart-items" className={styles.iconBtn} aria-label="Cart">
          <BagIcon />
          {itemCount > 0 && <span className={styles.badge}>{itemCount}</span>}
        </Link>

        <Link href="/my-account" className={styles.avatar} aria-label="Account">
          {initials ?? <UserIcon />}
        </Link>
      </div>
    </header>
  );
}
