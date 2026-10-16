import Link from 'next/link';

import { formatMoney } from '@/lib/format';
import { paymentMethodLabel, pendingOnlinePayment } from '@/lib/payments/online';
import type { Order } from '@/types/orders';

import styles from './OrderSuccess.module.css';
import PayNowButton from './PayNowButton';

function CheckIcon() {
  return (
    <svg className={styles.checkIcon} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="21" stroke="currentColor" strokeWidth="2" />
      <path
        d="M15 24.5 21 30.5 33 17.5"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 12h16M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Order confirmation, rendered entirely from the real order the route
 * loaded -- order number, total and payment method all come straight off
 * `order`, nothing here is a placeholder.
 */
export default function OrderSuccess({ order }: { order: Order }) {
  const paymentLabel = paymentMethodLabel(order);
  const awaitingPayment = pendingOnlinePayment(order);
  const paidOnline = order.payment?.provider === 'RAZORPAY' && order.payment_status === 'PAID';

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <CheckIcon />

        {awaitingPayment ? (
          <>
            <h1 className={styles.heading}>Complete Your Payment</h1>
            <p className={styles.thanks}>Your order is saved, but not paid yet.</p>
            <p className={styles.subtext}>
              Pay now to confirm order #{order.order_number}. If money was taken from your account, it will show here
              within a few minutes -- please don&apos;t pay twice.
            </p>
          </>
        ) : (
          <>
            <h1 className={styles.heading}>Order Placed Successfully</h1>
            <p className={styles.thanks}>Thank you for your order!</p>
            <p className={styles.subtext}>
              {paidOnline ? 'We have received your payment and your order is confirmed. ' : 'Your order has been successfully placed. '}
              We&apos;ll keep you updated on your order status.
            </p>
          </>
        )}

        <div className={styles.infoCard}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Order Number</span>
            <span className={styles.infoValue}>#{order.order_number}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Total Amount</span>
            <span className={styles.infoValue}>{formatMoney(order.total_amount, order.currency)}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Payment Method</span>
            <span className={styles.infoValue}>{paymentLabel}</span>
          </div>
        </div>

        <div className={styles.actions}>
          {awaitingPayment ? (
            <>
              <PayNowButton request={awaitingPayment} className={styles.primaryBtn} />
              <Link href={`/invoice/${order.id}`} className={styles.secondaryBtn}>
                View My Order
              </Link>
            </>
          ) : (
            <>
              <Link href={`/invoice/${order.id}`} className={styles.primaryBtn}>
                View My Order
                <ArrowIcon />
              </Link>
              <Link href="/" className={styles.secondaryBtn}>
                Continue Shopping
              </Link>
            </>
          )}
        </div>

        <p className={styles.caption}>
          Thank you for shopping with ZEEN
          <span className={styles.captionRule} />
        </p>
      </div>
    </div>
  );
}
