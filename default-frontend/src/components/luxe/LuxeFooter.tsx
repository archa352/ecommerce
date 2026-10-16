import Link from 'next/link';
import type { CSSProperties } from 'react';

import styles from '@/app/(storefront)/(home)/home/_components/luxe/Home.module.css';
import {
  InstagramIcon,
  TikTokIcon,
  XSocialIcon,
} from '@/app/(storefront)/(home)/home/_components/luxe/Icons';

const FOOTER_COLUMNS = [
  {
    title: 'Shop',
    links: [
      { label: 'New Arrivals', href: '/shop-list' },
      { label: 'Collections', href: '/shop-list' },
      { label: 'Best Sellers', href: '/shop-list' },
      { label: 'Gift Cards', href: '/our-gift-vouchers' },
    ],
  },
  {
    title: 'About',
    links: [
      { label: 'Our Story', href: '/about-us' },
      { label: 'Sustainability', href: '/about-us' },
      { label: 'Journal', href: '/blog-list-no-sidebar' },
      { label: 'Contact Us', href: '/contact-us-1' },
    ],
  },
  {
    title: 'Customer Care',
    links: [
      { label: 'Shipping & Returns', href: '/faqs-1' },
      { label: 'FAQs', href: '/faqs-1' },
      { label: 'Product Care', href: '/faqs-1' },
      { label: 'Track Order', href: '/my-orders' },
    ],
  },
];

/** The Zeen footer, shared by every page in the luxe design system. See LuxeHeader for why it's a copy, not an import, of the Home page's own markup. */
export default function LuxeFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerTop}>
          <div>
            <p className={styles.footerBrand}>ZEEN</p>
            <p className={styles.footerTagline}>
              Everyday and ethnic wear for women, cut in considered fabrics with careful finishing and
              quiet modern ease.
            </p>
            <div className={styles.footerSocials}>
              <a href="#" aria-label="X (Twitter)">
                <XSocialIcon size={21} />
              </a>
              <a href="#" aria-label="Instagram">
                <InstagramIcon size={22} />
              </a>
              <a href="#" aria-label="TikTok">
                <TikTokIcon size={21} />
              </a>
            </div>
          </div>

          {FOOTER_COLUMNS.map((col, i) => (
            <div
              key={col.title}
              className={styles.footerCol}
              data-reveal
              style={{ '--reveal-delay': `${(i + 1) * 90}ms` } as CSSProperties}
            >
              <p className={styles.footerColTitle}>{col.title}</p>
              <ul>
                {col.links.map(link => (
                  <li key={link.label}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.footerImage}>
        <img src="/home/footer.png" alt="Women wearing the Zeen collection" />
        <span className={styles.footerWatermark} aria-hidden="true">
          ZEEN
        </span>
      </div>
    </footer>
  );
}
