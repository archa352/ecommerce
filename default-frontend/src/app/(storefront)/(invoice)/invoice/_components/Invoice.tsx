'use client';

import { useState } from 'react';

import { formatDate, formatMoney } from '@/lib/format';
import type { Order } from '@/types/orders';

/**
 * The seller block.
 *
 * The backend exposes no tenant profile to the storefront -- name, address
 * and GSTIN live nowhere an API can be asked for them -- so they are
 * configured here rather than invented per render.
 */
const SELLER = {
  name: 'Zeen',
  address: '4th Floor, Cinnamon House, Kozhikode, Kerala 673001',
  gstin: '32AACCA1234B1Z8',
  email: 'billing@zeen.com',
  phone: '+91 495 123 4567',
};

/** An invoice for one order, rendered from the order the backend holds. */
export default function Invoice({ order }: { order: Order }) {
  const [isPrinting, setIsPrinting] = useState(false);

  const seller = SELLER;
  const address = order.delivery_address;
  const money = (amount: string) => formatMoney(amount, order.currency);

  const handleDownloadPdf = () => {
    setIsPrinting(true);

    setTimeout(() => {
      window.print();

      setTimeout(() => {
        setIsPrinting(false);
      }, 500);
    }, 100);
  };

  return (
    <div className="invoice-page">
      {/* Actions */}
      <div className="invoice-actions print:hidden">
        <button type="button" onClick={handleDownloadPdf} disabled={isPrinting} className="invoice-download-button">
          {isPrinting ? 'Preparing...' : 'Download PDF'}
        </button>

        <button type="button" onClick={() => window.print()} className="invoice-print-button">
          Print
        </button>
      </div>

      {/* Invoice */}
      <div className="invoice-sheet">
        {/* Header */}
        <div className="invoice-header">
          <div className="invoice-brand">
            <div className="invoice-brand-mark">
              <span>Z</span>
            </div>

            <div>
              <p className="invoice-seller-name">{seller.name}</p>

              <p className="invoice-seller-email">{seller.email}</p>
            </div>
          </div>

          <div className="invoice-title-block">
            <h1 className="invoice-title">INVOICE</h1>

            <p className="invoice-number invoice-mono">{order.order_number}</p>
          </div>
        </div>

        {/* Details */}
        <div className="invoice-details-grid">
          {/* Billed From */}
          <div className="invoice-bill-container">
            <div>
              <p className="invoice-label">Billed from</p>

              <p className="invoice-party-name">{seller.name}</p>

              <p className="invoice-party-line">{seller.address}</p>

              <p className="invoice-party-line">{seller.phone}</p>

              <p className="invoice-gstin">GSTIN: {seller.gstin}</p>
            </div>

            {/* Billed To */}
            <div>
              <p className="invoice-label">Billed to</p>

              <p className="invoice-party-name">{address.full_name}</p>

              <p className="invoice-party-line">
                {address.address_line_1}
                {address.address_line_2 ? `, ${address.address_line_2}` : ''}
              </p>

              <p className="invoice-party-line">
                {address.city}, {address.state} {address.postal_code}
              </p>

              <p className="invoice-party-line">{address.phone}</p>
            </div>
          </div>

          {/* Invoice Details */}
          <div>
            <p className="invoice-label">Invoice details</p>

            <div className="invoice-meta-grid">
              <span className="invoice-meta-key">Order ID</span>

              <span className="invoice-meta-value invoice-mono">{order.order_number}</span>

              <span className="invoice-meta-key">Issued</span>

              <span className="invoice-meta-value">{formatDate(order.created_at)}</span>

              <span className="invoice-meta-key">Status</span>

              <span className="invoice-meta-value">{order.status}</span>
            </div>
          </div>

          {/* Payment */}
          <div>
            <p className="invoice-label">Payment</p>

            <span className="invoice-status-badge">
              <span className="invoice-status-dot" />

              {order.payment_status}
            </span>

            <p className="invoice-payment-method">
              {order.payment ? order.payment.provider : 'Cash on delivery'}
            </p>
          </div>
        </div>

        {/* Items */}
        <div className="invoice-items-section">
          <div className="invoice-table-scroll">
            <table className="invoice-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Size</th>
                  <th className="invoice-th-center">Qty</th>
                  <th className="invoice-th-right">Price</th>
                  <th className="invoice-th-right">Amount</th>
                </tr>
              </thead>

              <tbody>
                {order.items.map(item => (
                  <tr key={item.variant_id}>
                    <td className="invoice-item-title">{item.product_name}</td>

                    <td className="invoice-item-muted">{item.variant_name}</td>

                    <td className="invoice-item-muted invoice-td-center">{item.quantity}</td>

                    <td className="invoice-item-muted invoice-td-right invoice-mono">
                      {money(item.unit_price)}
                    </td>

                    <td className="invoice-item-amount invoice-td-right invoice-mono">
                      {money(item.subtotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="invoice-totals-row">
            <div className="invoice-totals-box">
              <div className="invoice-totals-line">
                <span>Subtotal</span>

                <span className="invoice-totals-value invoice-mono">{money(order.subtotal)}</span>
              </div>

              {Number(order.discount_amount) > 0 && (
                <div className="invoice-totals-line">
                  <span>Discount{order.coupon_code ? ` (${order.coupon_code})` : ''}</span>

                  <span className="invoice-totals-value invoice-mono">−{money(order.discount_amount)}</span>
                </div>
              )}

              <div className="invoice-totals-line">
                <span>Shipping</span>

                <span className="invoice-totals-value invoice-mono">
                  {Number(order.shipping_amount) === 0 ? 'Free' : money(order.shipping_amount)}
                </span>
              </div>

              <div className="invoice-totals-line">
                <span>Tax</span>

                <span className="invoice-totals-value invoice-mono">{money(order.tax_amount)}</span>
              </div>

              <div className="invoice-grand-total">
                <span className="invoice-grand-total-label">Total</span>

                <span className="invoice-grand-total-value invoice-mono">{money(order.total_amount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="invoice-footer">
          <div>
            <p className="invoice-thanks">Thank you for your business.</p>

            <p className="invoice-contact">Questions about this invoice? Contact {seller.email}</p>
          </div>

          <p className="invoice-footer-number invoice-mono">{order.order_number}</p>
        </div>
      </div>
    </div>
  );
}
