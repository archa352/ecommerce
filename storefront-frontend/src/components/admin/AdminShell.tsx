'use client';

import { Icon } from '@iconify/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import SignOutButton from '@/components/SignOutButton';
import ThemeToggleButton from '@/helper/ThemeToggleButton';
import type { UserProfile } from '@/types/auth';

/**
 * One entry per thing the backend can actually do.
 *
 * Anything without an endpoint behind it is deliberately absent: a nav that
 * promises a page the API cannot fill is worse than a short nav.
 */
const NAV = [
  { href: '/admin', label: 'Dashboard', icon: 'solar:home-smile-angle-outline', exact: true },
  { href: '/admin/orders', label: 'Orders', icon: 'solar:cart-5-outline' },
  { href: '/admin/payments', label: 'Payments', icon: 'solar:card-outline' },
  { href: '/admin/products', label: 'Products', icon: 'solar:box-outline' },
  { href: '/admin/categories', label: 'Categories', icon: 'solar:widget-4-outline' },
  { href: '/admin/coupons', label: 'Coupons', icon: 'solar:ticket-outline' },
  { href: '/admin/reviews', label: 'Reviews', icon: 'solar:star-outline' },
  { href: '/admin/settings', label: 'Settings', icon: 'solar:settings-outline' },
];

function isCurrent(pathname: string, href: string, exact?: boolean): boolean {
  return exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminShell({
  user,
  storeName,
  children,
}: {
  user: UserProfile;
  storeName: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarClass = collapsed ? 'sidebar active' : mobileOpen ? 'sidebar sidebar-open' : 'sidebar';

  return (
    <section className={collapsed ? 'overlay active' : 'overlay'}>
      <aside className={sidebarClass}>
        <button type="button" className="sidebar-close-btn" onClick={() => setMobileOpen(false)}>
          <Icon icon="radix-icons:cross-2" />
        </button>

        <div>
          <Link href="/admin" className="sidebar-logo">
            <span className="text-xl fw-bold text-primary-600">{storeName}</span>
          </Link>
        </div>

        <div className="sidebar-menu-area">
          <ul className="sidebar-menu" id="sidebar-menu">
            {NAV.map(item => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={isCurrent(pathname, item.href, item.exact) ? 'active-page' : ''}
                >
                  <Icon icon={item.icon} className="menu-icon" />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <main className={collapsed ? 'dashboard-main active' : 'dashboard-main'}>
        <div className="navbar-header">
          <div className="row align-items-center justify-content-between">
            <div className="col-auto">
              <div className="d-flex flex-wrap align-items-center gap-4">
                <button type="button" className="sidebar-toggle" onClick={() => setCollapsed(v => !v)}>
                  <Icon
                    icon={collapsed ? 'iconoir:arrow-right' : 'heroicons:bars-3-solid'}
                    className="icon text-2xl non-active"
                  />
                </button>
                <button
                  type="button"
                  className="sidebar-mobile-toggle"
                  onClick={() => setMobileOpen(v => !v)}
                >
                  <Icon icon="heroicons:bars-3-solid" className="icon" />
                </button>
                <span className="text-md fw-medium text-secondary-light d-none d-md-inline-block">
                  {storeName}
                </span>
              </div>
            </div>

            <div className="col-auto">
              <div className="d-flex flex-wrap align-items-center gap-3">
                <ThemeToggleButton />
                <Link href="/" className="text-sm fw-medium text-secondary-light d-none d-sm-inline-block">
                  View store
                </Link>
                <div className="d-flex align-items-center gap-2">
                  <span className="w-40-px h-40-px bg-primary-600 text-white rounded-circle d-flex justify-content-center align-items-center fw-semibold">
                    {(user.name ?? user.email ?? user.phone).charAt(0).toUpperCase()}
                  </span>
                  <span className="d-none d-lg-block">
                    <span className="text-sm fw-semibold d-block line-height-1">
                      {user.name ?? user.email ?? user.phone}
                    </span>
                    <span className="text-xs text-secondary-light">{user.role}</span>
                  </span>
                </div>
                <SignOutButton className="btn btn-sm btn-outline-primary-600 radius-8 px-12 py-6" />
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-main-body">{children}</div>

        <footer className="d-footer">
          <p className="mb-0">
            {storeName} admin · {new Date().getFullYear()}
          </p>
        </footer>
      </main>
    </section>
  );
}
