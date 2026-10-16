'use client';

import { SubmitEvent } from 'react';
import { useState } from 'react';
import Link from 'next/link';

interface FooterLink {
  label: string;
  href: string;
}

const shopLinks: FooterLink[] = [
  { label: 'New arrivals', href: '/shop/new' },
  { label: 'Shop', href: '/shop-standard' },
  { label: 'Home', href: '/' },
  { label: 'Men', href: '/shop/men' },
  { label: 'Women', href: '/shop/women' },
];

const helpLinks: FooterLink[] = [
  { label: 'Shipping and returns', href: '/help/shipping-returns' },
  { label: 'Size guide', href: '/help/size-guide' },
  { label: 'Track an order', href: '/help/track-order' },
  { label: 'Contact us', href: '/help/contact' },
  { label: 'FAQ', href: '/help/faq' },
];

const companyLinks: FooterLink[] = [
  { label: 'About', href: '/about' },
  { label: 'Journal', href: '/journal' },
  { label: 'Sustainability', href: '/sustainability' },
  { label: 'Careers', href: '/careers' },
  { label: 'Wholesale', href: '/wholesale' },
];

interface LinkColumnProps {
  heading: string;
  links: FooterLink[];
}

function LinkColumn({ heading, links }: LinkColumnProps) {
  return (
    <div>
      <p className="footer-col-heading">{heading}</p>
      <ul className="footer-col-list">
        {links.map(link => (
          <li key={link.href}>
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function EcommerceFooter() {
  const [email, setEmail] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;
    setSubmitted(true);
  };

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          {/* Brand + newsletter */}
          <div>
            <p className="footer-brand-name">Zeen</p>
            <p className="footer-brand-tagline">
              Considered goods for everyday living. New arrivals and restock notices, roughly twice a month.
            </p>

            {submitted ? (
              <p className="footer-success">You're on the list — thanks for joining.</p>
            ) : (
              <form className="footer-form" onSubmit={handleSubmit}>
                <input
                  className="footer-input"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@email.com"
                />
                <button type="submit" className="footer-submit" aria-label="Subscribe">
                  <i className="bi bi-arrow-right" aria-hidden="true"></i>
                </button>
              </form>
            )}
          </div>

          <LinkColumn heading="Shop" links={shopLinks} />
          <LinkColumn heading="Help" links={helpLinks} />
          <LinkColumn heading="Company" links={companyLinks} />
        </div>

        <div className="footer-bottom">
          <div className="footer-legal">
            <span>© 2026 Zeen</span>
            <Link href="/privacy">Privacy policy</Link>
            <Link href="/terms">Terms of service</Link>
            <Link href="/accessibility">Accessibility</Link>
          </div>

          <div className="footer-meta">
            <div className="footer-payments">
              <span>Visa</span>
              <span>Mastercard</span>
              <span>Amex</span>
              <span>PayPal</span>
            </div>
            <div className="footer-social">
              <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                <i className="bi bi-instagram" aria-hidden="true"></i>
              </a>
              <a href="https://facebook.com" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                <i className="bi bi-facebook" aria-hidden="true"></i>
              </a>
              <a href="https://twitter.com" aria-label="X" target="_blank" rel="noopener noreferrer">
                <i className="bi bi-twitter-x" aria-hidden="true"></i>
              </a>
              <a href="https://youtube.com" aria-label="YouTube" target="_blank" rel="noopener noreferrer">
                <i className="bi bi-youtube" aria-hidden="true"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
