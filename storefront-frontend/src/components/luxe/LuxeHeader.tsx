'use client';

import Link from 'next/link';
import { useState } from 'react';

import styles from '@/app/(storefront)/(home)/home/_components/luxe/Home.module.css';
import {
  BagIcon,
  ChevronDownIcon,
  CloseIcon,
  MenuIcon,
  SearchIcon,
} from '@/app/(storefront)/(home)/home/_components/luxe/Icons';
import LuxeAccountNav from '@/components/luxe/LuxeAccountNav';
import LuxeWishlistButton from '@/components/luxe/LuxeWishlistButton';
import { useCart } from '@/context/CartContext';

const NAV_LINKS = [
  { label: 'Shop', href: '/shop-list', chevron: true },
  { label: 'Best Sellers', href: '/shop-list' },
  { label: 'About', href: '/about-us' },
  { label: 'Contact', href: '/contact-us-1' },
];

/**
 * The Zeen header, shared by every page that opts into the luxe design
 * system. Lifted verbatim out of the Home page's header markup (Home.module.css
 * stays the single source of truth for its styling) so other pages can look
 * identical without the Home page itself importing or re-exporting anything.
 */
export default function LuxeHeader() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { itemCount } = useCart();

  return (
    <header className={styles.header}>
      <div className={`${styles.container} ${styles.headerInner}`}>
        <nav aria-label="Primary">
          <ul className={styles.nav}>
            {NAV_LINKS.map(link => (
              <li key={link.label}>
                <Link href={link.href}>
                  {link.label}
                  {link.chevron && <ChevronDownIcon size={12} />}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Link href="/" className={styles.logo}>
          ZEEN
        </Link>

        <div className={styles.headerRight}>
          <Link href="/search-result" className={styles.headerIconBtn} aria-label="Search">
            <SearchIcon />
          </Link>
          <LuxeAccountNav />
          <LuxeWishlistButton />
          <Link
            href="/cart-items"
            className={styles.headerRoundBtn}
            aria-label={itemCount > 0 ? `Cart, ${itemCount} items` : 'My cart'}>
            <BagIcon size={17} />
            {itemCount > 0 && (
              <span className={styles.headerBadge} aria-hidden="true">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </Link>
          <button
            type="button"
            className={styles.menuBtn}
            aria-label="Toggle menu"
            onClick={() => setMobileNavOpen(v => !v)}
          >
            {mobileNavOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      <div className={`${styles.container} ${styles.mobileNav} ${mobileNavOpen ? styles.open : ''}`}>
        {NAV_LINKS.map(link => (
          <Link key={link.label} href={link.href} onClick={() => setMobileNavOpen(false)}>
            {link.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
