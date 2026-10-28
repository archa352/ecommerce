'use client';

import Link from 'next/link';

import styles from '@/app/(storefront)/(home)/home/_components/luxe/Home.module.css';

const SHOP_LINKS = [
  { label: 'New Arrivals', href: '/products' },
  { label: 'Collections', href: '/products' },
  { label: 'Best Sellers', href: '/products' },
  { label: 'Gift Cards', href: '/our-gift-vouchers' },
  { label: 'Wishlist', href: '/wishlist' },
  { label: 'Track Order', href: '/account/orders' },
];

const ABOUT_LINKS = [
  { label: 'Our Story', href: '/about-us' },
  { label: 'Sustainability', href: '/about-us' },
  { label: 'Journal', href: '/blog-list-no-sidebar' },
  { label: 'FAQs', href: '/faqs-1' },
  { label: 'Shipping & Returns', href: '/faqs-1' },
  { label: 'Account', href: '/account' },
];

/** Payment options the storefront checkout already offers. */
const PAYMENTS = ['UPI', 'Cards', 'Net Banking', 'Wallets', 'Cash on Delivery'];

/**
 * The home page's footer: a concise contact note above the existing link
 * columns, closed by the ZEEN lockup in Champagne Gold.
 */
function HomeFooter() {
  return (
    <footer className={styles.homeFooter}>
      <div className={styles.footerContact}>
        <p className={styles.footerContactQuestion}>Have any questions or concerns?</p>
        <p className={styles.footerContactCopy}>
          For any assistance, reach out to us at{' '}
          <a href="mailto:zeen@gmail.com" className={styles.footerContactEmail}>
            zeen@gmail.com
          </a>
          .
        </p>
      </div>

      <div className={styles.footerGrid}>
        <div>
          <p className={styles.footerLabel}>Contact</p>
          <p className={styles.footerBig}>
            <Link href="/contact-us-1">Write to the ZEEN studio</Link>
          </p>
          <p className={styles.footerLabel}>Social</p>
          <p className={styles.footerBig}>
            <a href="#">Instagram</a> / <a href="#">X</a> / <a href="#">TikTok</a>
          </p>
        </div>
        <ul className={styles.footerLinks}>
          {SHOP_LINKS.map(link => (
            <li key={link.label}>
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>
        <ul className={styles.footerLinks}>
          {ABOUT_LINKS.map(link => (
            <li key={link.label}>
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.footerBottom}>
        <span className={styles.footerLogoLockup} role="img" aria-label="ZEEN">
          <span className={styles.footerLogoSymbol} />
          <span className={styles.footerLogoWordmark} />
        </span>
        <div>
          <p className={styles.footerLabel}>We accept</p>
          <ul className={styles.footerPayments}>
            {PAYMENTS.map(method => (
              <li key={method}>{method}</li>
            ))}
          </ul>
        </div>
        <div className={styles.footerLegal}>
          <p className={styles.footerLabel}>Legal</p>
          <Link href="/faqs-1">Privacy policy</Link>
        </div>
      </div>
    </footer>
  );
}

/** The Zeen footer, shared by every page in the luxe design system. See LuxeHeader for why it's a copy, not an import, of the Home page's own markup. */
export default function LuxeFooter() {
  return <HomeFooter />;
}
