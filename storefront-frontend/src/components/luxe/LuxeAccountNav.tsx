'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, useTransition } from 'react';

import styles from '@/app/(storefront)/(home)/home/_components/luxe/Home.module.css';
import { ChevronDownIcon, UserIcon } from '@/app/(storefront)/(home)/home/_components/luxe/Icons';
import { useAuth } from '@/context/AuthContext';
import type { UserProfile } from '@/types/auth';

const ACCOUNT_LINKS = [
  { label: 'My Account', href: '/my-account' },
  { label: 'My Orders', href: '/my-orders' },
  { label: 'Wishlist', href: '/shop-wishlist' },
];

/** First name when we know it, a neutral label otherwise. */
function shortName(user: UserProfile): string {
  const name = user.name?.trim();
  return name ? name.split(/\s+/)[0] : 'Account';
}

/** The single character shown in the avatar circle. */
function initial(user: UserProfile): string {
  const source = user.name?.trim() || user.email?.trim() || user.phone;
  return source.match(/[a-z0-9]/i)?.[0].toUpperCase() ?? 'A';
}

/** The login pill when signed out, the profile menu when signed in. */
export default function LuxeAccountNav() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [signingOut, startSignOut] = useTransition();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  if (!user) {
    return (
      <Link href="/signin" className={styles.authPill} aria-label="Login or sign up">
        <span>Login / Signup</span>
        <UserIcon />
      </Link>
    );
  }

  return (
    <div className={styles.accountMenu} ref={menuRef}>
      <button
        type="button"
        className={styles.profilePill}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Account menu for ${shortName(user)}`}
        onClick={() => setOpen(value => !value)}>
        <span className={styles.profileInitial} aria-hidden="true">
          {initial(user)}
        </span>
        <span className={styles.profileLabel}>{shortName(user)}</span>
        <ChevronDownIcon size={12} className={styles.profileChevron} />
      </button>

      {open && (
        <div className={styles.profileDropdown} role="menu">
          <div className={styles.profileHead}>
            <p className={styles.profileHeadName}>{user.name?.trim() || 'Welcome back'}</p>
            <p className={styles.profileHeadContact}>{user.email ?? user.phone}</p>
          </div>

          {ACCOUNT_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              role="menuitem"
              className={styles.profileItem}
              onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}

          <button
            type="button"
            role="menuitem"
            className={`${styles.profileItem} ${styles.profileSignOut}`}
            disabled={signingOut}
            onClick={() => startSignOut(() => void logout())}>
            {signingOut ? 'Signing out...' : 'Sign out'}
          </button>
        </div>
      )}
    </div>
  );
}
