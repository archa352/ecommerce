'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import homeStyles from '@/app/(storefront)/(home)/home/_components/luxe/Home.module.css';
import listingStyles from '@/app/(storefront)/(shop)/shop-list/_components/luxe/Listing.module.css';
import { mediaUrl } from '@/lib/media';
import { formatDate, formatMoney } from '@/lib/format';
import type { OrderStatus, OrderSummary } from '@/types/orders';

import styles from './MyOrders.module.css';

export interface OrderItemImage {
  url: string;
  alt_text: string | null;
}

/**
 * `OrderSummary` is the real `/orders` response -- no items, no image (see
 * `page.tsx`'s doc comment for why). `item_count` and `preview_image` are
 * filled in there from calls the frontend already makes, not from this
 * endpoint, so they live on this page-local type rather than on the shared
 * `OrderSummary` -- that type stays an honest match for the wire response.
 */
export interface OrderRow extends OrderSummary {
  item_count: number;
  preview_image: OrderItemImage | null;
}

type FilterValue = 'all' | OrderStatus;

const FILTERS: FilterValue[] = ['all', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

/** The backend's six statuses, mapped onto the design system's badge colours. */
const STATUS_META: Record<OrderStatus, { label: string; dot: string }> = {
  PENDING: { label: 'Pending', dot: styles.dotAmber },
  CONFIRMED: { label: 'Confirmed', dot: styles.dotBlue },
  PROCESSING: { label: 'Processing', dot: styles.dotBlue },
  SHIPPED: { label: 'Shipped', dot: styles.dotBlue },
  DELIVERED: { label: 'Delivered', dot: styles.dotGreen },
  CANCELLED: { label: 'Cancelled', dot: styles.dotRed },
};

function PackageIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}

function ArrowUpRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 17 17 7" />
      <path d="M7 7h10v10" />
    </svg>
  );
}

export default function MyOrders({ orders: allOrders }: { orders: OrderRow[] }) {
  const [filter, setFilter] = useState<FilterValue>('all');

  // Guard against a missing/non-array prop -- an API hiccup upstream must
  // not crash this page, it should just read as "no orders".
  const safeOrders = Array.isArray(allOrders) ? allOrders : [];

  const orders = useMemo(
    () => (filter === 'all' ? safeOrders : safeOrders.filter(order => order.status === filter)),
    [safeOrders, filter],
  );

  return (
    <>
      <section className={listingStyles.banner}>
        <div className={homeStyles.container}>
          <p className={listingStyles.crumb}>
            <Link href="/">Home</Link>
            <span>/</span>
            <span aria-current="page">My Orders</span>
          </p>
          <h1 className={homeStyles.h2}>My Orders</h1>
          <p className={listingStyles.subtitle}>Track and manage your orders.</p>
        </div>
      </section>

      <section className={listingStyles.listingSection}>
        <div className={homeStyles.container}>
          {safeOrders.length !== 0 && (
            <div className={homeStyles.filterRow} role="group" aria-label="Filter orders by status">
              {FILTERS.map(f => {
                const active = filter === f;
                const label = f === 'all' ? 'All' : STATUS_META[f].label;
                return (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFilter(f)}
                    aria-pressed={active}
                    aria-label={`Filter by ${label}`}
                    className={`${homeStyles.filterPill} ${active ? homeStyles.active : ''}`}>
                    {label}
                  </button>
                );
              })}
            </div>
          )}

          {orders.length === 0 ? (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>
                <PackageIcon />
              </span>
              <p>
                {safeOrders.length === 0 ? "You haven't placed any orders yet" : 'No orders match this filter'}
              </p>
              {safeOrders.length === 0 && (
                <Link href="/" className={homeStyles.pill}>
                  Continue Shopping
                  <span className={homeStyles.pillIcon}>
                    <ArrowUpRightIcon />
                  </span>
                </Link>
              )}
            </div>
          ) : (
            <div className={styles.ordersList}>
              {orders.map(order => {
                const meta = STATUS_META[order.status];
                return (
                  <article key={order.id} className={styles.orderCard}>
                    <div className={listingStyles.cardMediaWrap}>
                      <div className={`${listingStyles.cardMedia} ${styles.thumb}`}>
                        {order.preview_image ? (
                          <Image
                            src={mediaUrl(order.preview_image.url)}
                            alt={order.preview_image.alt_text ?? `Order #${order.order_number}`}
                            fill
                            sizes="96px"
                            className={listingStyles.cardImg}
                          />
                        ) : (
                          <div className={listingStyles.mediaEmpty}>
                            <PackageIcon />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className={styles.orderBody}>
                      <div className={styles.orderTop}>
                        <div>
                          <p className={styles.orderNumber}>Order #{order.order_number}</p>
                          <p className={styles.orderMeta}>
                            Placed on {formatDate(order.created_at)}
                            {order.item_count > 0 &&
                              ` · ${order.item_count} ${order.item_count === 1 ? 'item' : 'items'}`}
                          </p>
                        </div>
                        <span className={styles.status}>
                          <span className={`${styles.statusDot} ${meta.dot}`} />
                          {meta.label}
                        </span>
                      </div>

                      <div className={styles.orderBottom}>
                        <p className={styles.orderAmount}>{formatMoney(order.total_amount, order.currency)}</p>
                        <Link
                          href={`/order-details/${order.id}`}
                          className={styles.viewButton}
                          aria-label={`View order #${order.order_number}`}>
                          View Order
                          <ArrowUpRightIcon />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
