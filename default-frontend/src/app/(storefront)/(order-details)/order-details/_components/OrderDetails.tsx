'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'react-toastify';

import { useCart } from '@/context/CartContext';
import { mediaUrl } from '@/lib/media';
import { formatDate, formatMoney } from '@/lib/format';
import { cancelOrder } from '@/lib/orders/actions';
import { initialCheckoutState } from '@/lib/orders/state';
import { paymentMethodLabel } from '@/lib/payments/online';
import type { Order, OrderStatus, PaymentStatus } from '@/types/orders';

import styles from './OrderDetails.module.css';

export type OrderItemImages = Record<string, { url: string; alt_text: string | null } | undefined>;

/** The order's real lifecycle, in order. Cancelled is a separate branch, not a step on this line. */
const TRACK_STEPS: { status: OrderStatus; label: string }[] = [
  { status: 'PENDING', label: 'Order Placed' },
  { status: 'CONFIRMED', label: 'Confirmed' },
  { status: 'PROCESSING', label: 'Processing' },
  { status: 'SHIPPED', label: 'Shipped' },
  { status: 'DELIVERED', label: 'Delivered' },
];

const STATUS_DOT: Record<OrderStatus, string> = {
  PENDING: styles.dotAmber,
  CONFIRMED: styles.dotBlue,
  PROCESSING: styles.dotBlue,
  SHIPPED: styles.dotBlue,
  DELIVERED: styles.dotGreen,
  CANCELLED: styles.dotRed,
};

const STATUS_TINT: Record<OrderStatus, string> = {
  PENDING: styles.tintAmber,
  CONFIRMED: styles.tintBlue,
  PROCESSING: styles.tintBlue,
  SHIPPED: styles.tintBlue,
  DELIVERED: styles.tintGreen,
  CANCELLED: styles.tintRed,
};

const PAYMENT_DOT: Record<PaymentStatus, string> = {
  PENDING: styles.dotAmber,
  PAID: styles.dotGreen,
  FAILED: styles.dotRed,
  REFUNDED: styles.dotBlue,
};

const PAYMENT_TINT: Record<PaymentStatus, string> = {
  PENDING: styles.tintAmber,
  PAID: styles.tintGreen,
  FAILED: styles.tintRed,
  REFUNDED: styles.tintBlue,
};

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <path d="M5 5l14 14M19 5 5 19" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 8v5" />
      <path d="M12 16.5v.01" />
    </svg>
  );
}

function PackageIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}

export default function OrderDetails({ order, images }: { order: Order; images: OrderItemImages }) {
  const router = useRouter();
  const { addToCart, pending: cartPending } = useCart();
  const [cancelling, startCancel] = useTransition();
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  const address = order.delivery_address;
  const paymentMethod = paymentMethodLabel(order);
  const currentStepIndex = TRACK_STEPS.findIndex(step => step.status === order.status);
  const canCancel = order.can_cancel;

  function confirmCancel() {
    startCancel(async () => {
      const formData = new FormData();
      formData.set('order_id', order.id);
      const result = await cancelOrder(initialCheckoutState, formData);

      if (result.status === 'error') {
        toast.error(result.message ?? 'Could not cancel that order.');
        return;
      }

      toast.info('Order cancelled');
      setCancelModalOpen(false);
      router.refresh();
    });
  }

  async function handleBuyAgain(variantId: string, quantity: number) {
    await addToCart(variantId, quantity);
    toast.success('Added to your bag');
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.breadcrumb}>
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/my-orders">My Orders</Link>
          <span>/</span>
          <span aria-current="page">Order #{order.order_number}</span>
        </div>

        <div className={styles.headerRow}>
          <div className={styles.titleGroup}>
            <h1>Order #{order.order_number}</h1>
            <p>Placed on {formatDate(order.created_at)}</p>
          </div>

          <div className={styles.headerRight}>
            <span className={`${styles.statusBadge} ${STATUS_TINT[order.status]}`}>
              <span className={`${styles.statusDot} ${STATUS_DOT[order.status]}`} />
              {order.status}
            </span>

            <div className={styles.headerActions}>
              <Link href={`/invoice/${order.id}`} className={styles.btnDark}>
                <DownloadIcon />
                Download Invoice
              </Link>
              {canCancel && (
                <button type="button" className={styles.btnOutline} onClick={() => setCancelModalOpen(true)}>
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        </div>

        <div className={styles.mainGrid}>
          <div className={styles.leftColumn}>
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Order Items ({order.items.length})</h2>
              <div className={styles.itemList}>
                {order.items.map(item => {
                  const image = images[item.product_id];
                  return (
                    <div key={item.variant_id} className={styles.itemRow}>
                      <div className={styles.itemImage}>
                        {image ? (
                          <Image
                            src={mediaUrl(image.url)}
                            alt={image.alt_text ?? item.product_name}
                            fill
                            sizes="96px"
                            style={{ objectFit: 'contain' }}
                          />
                        ) : (
                          <div className={styles.itemImageEmpty}>
                            <PackageIcon />
                          </div>
                        )}
                      </div>
                      <div className={styles.itemDetails}>
                        <h3 className={styles.itemName}>{item.product_name}</h3>
                        <p className={styles.itemMeta}>{item.variant_name}</p>
                        <p className={styles.itemQty}>Qty: {item.quantity}</p>
                        <p className={styles.itemPrice}>{formatMoney(item.subtotal, order.currency)}</p>
                      </div>
                      <button
                        type="button"
                        className={styles.btnOutline}
                        disabled={cartPending}
                        onClick={() => handleBuyAgain(item.variant_id, item.quantity)}>
                        Buy Again
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Order Status</h2>
              {order.status === 'CANCELLED' ? (
                <p className={styles.cancelledNote}>This order was cancelled.</p>
              ) : (
                <div className={styles.trackingTrack}>
                  <div className={styles.trackingLine} />
                  {TRACK_STEPS.map((step, index) => {
                    const completed = index <= currentStepIndex;
                    return (
                      <div
                        key={step.status}
                        className={`${styles.trackingStep} ${completed ? styles.stepCompleted : ''}`}>
                        <span className={styles.stepIcon}>{completed ? <CheckIcon /> : null}</span>
                        <span className={styles.stepLabel}>{step.label}</span>
                        {step.status === order.status && (
                          <span className={styles.stepSub}>{formatDate(order.created_at)}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className={styles.infoGrid}>
              <div className={styles.card}>
                <div className={styles.infoCardHeader}>
                  <h3 className={styles.infoTitle}>Shipping Address</h3>
                </div>
                <address className={styles.addressText}>
                  <strong>{address.full_name}</strong>
                  <br />
                  {address.address_line_1}
                  {address.address_line_2 ? `, ${address.address_line_2}` : ''}
                  <br />
                  {address.city}, {address.state} {address.postal_code}
                  <br />
                  {address.country}
                  <br />
                  Phone: {address.phone}
                </address>
              </div>

              <div className={styles.card}>
                <div className={styles.infoCardHeader}>
                  <h3 className={styles.infoTitle}>Payment Information</h3>
                  <span className={`${styles.statusBadge} ${PAYMENT_TINT[order.payment_status]}`}>
                    <span className={`${styles.statusDot} ${PAYMENT_DOT[order.payment_status]}`} />
                    {order.payment_status}
                  </span>
                </div>
                <p className={styles.paymentMethodLabel}>Payment Method</p>
                <p className={styles.paymentMethodValue}>{paymentMethod}</p>

                {order.payment && (
                  <div className={styles.paymentMeta}>
                    <div className={styles.metaBlock}>
                      <small>Order ID</small>
                      <span>{order.order_number}</span>
                    </div>
                    <div className={styles.metaBlock}>
                      <small>Payment ID</small>
                      <span>{order.payment.id}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={styles.rightColumn}>
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Order Summary</h2>

              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>{formatMoney(order.subtotal, order.currency)}</span>
              </div>
              {Number(order.discount_amount) > 0 && (
                <div className={styles.summaryRow}>
                  <span>Discount{order.coupon_code ? ` (${order.coupon_code})` : ''}</span>
                  <span className={styles.discountValue}>-{formatMoney(order.discount_amount, order.currency)}</span>
                </div>
              )}
              <div className={styles.summaryRow}>
                <span>Shipping</span>
                <span>{Number(order.shipping_amount) === 0 ? 'Free' : formatMoney(order.shipping_amount, order.currency)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Tax</span>
                <span>{formatMoney(order.tax_amount, order.currency)}</span>
              </div>

              <div className={styles.summaryTotal}>
                <span>Total</span>
                <span>{formatMoney(order.total_amount, order.currency)}</span>
              </div>

              {Number(order.discount_amount) > 0 && (
                <div className={styles.savedBanner}>
                  You saved {formatMoney(order.discount_amount, order.currency)} on this order
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.backBtnRow}>
          <Link href="/my-orders" className={styles.btnOutline}>
            ← Back to My Orders
          </Link>
        </div>
      </div>

      {cancelModalOpen && (
        <div className={styles.cancelOverlay} onClick={() => !cancelling && setCancelModalOpen(false)}>
          <div
            className={styles.cancelModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-order-title"
            onClick={event => event.stopPropagation()}>
            <button
              type="button"
              className={styles.cancelClose}
              aria-label="Close"
              onClick={() => setCancelModalOpen(false)}>
              <CloseIcon />
            </button>

            <span className={styles.cancelIcon}>
              <WarningIcon />
            </span>

            <h2 id="cancel-order-title" className={styles.cancelTitle}>
              And do you want to cancel this order?
            </h2>
            <p className={styles.cancelSubtitle}>This action cannot be undone.</p>

            <div className={styles.cancelItemCard}>
              <p className={styles.cancelOrderLabel}>Order #{order.order_number}</p>
              {order.items.map(item => {
                const image = images[item.product_id];
                return (
                  <div key={item.variant_id} className={styles.cancelItemRow}>
                    <div className={styles.cancelItemImage}>
                      {image ? (
                        <Image
                          src={mediaUrl(image.url)}
                          alt={image.alt_text ?? item.product_name}
                          fill
                          sizes="56px"
                          style={{ objectFit: 'contain' }}
                        />
                      ) : (
                        <div className={styles.cancelItemImageEmpty}>
                          <PackageIcon />
                        </div>
                      )}
                    </div>
                    <div className={styles.cancelItemDetails}>
                      <p className={styles.cancelItemName}>{item.product_name}</p>
                      <p className={styles.cancelItemMeta}>
                        {item.variant_name} · Qty: {item.quantity}
                      </p>
                    </div>
                    <p className={styles.cancelItemPrice}>{formatMoney(item.subtotal, order.currency)}</p>
                  </div>
                );
              })}
            </div>

            <div className={styles.cancelActions}>
              <button
                type="button"
                className={styles.cancelKeepBtn}
                disabled={cancelling}
                onClick={() => setCancelModalOpen(false)}>
                Keep Order
              </button>
              <button type="button" className={styles.cancelConfirmBtn} disabled={cancelling} onClick={confirmCancel}>
                {cancelling ? 'Cancelling…' : 'Yes, Cancel Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
