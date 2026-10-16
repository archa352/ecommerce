/**
 * Currency for storefront prices.
 *
 * The tenant's currency is a column on the backend, but no storefront
 * endpoint exposes it -- it only rides on orders and coupons. So catalogue
 * prices are formatted with a configured currency, while anything that
 * carries its own (an order, a coupon) uses that instead.
 */
export const STOREFRONT_CURRENCY = process.env.NEXT_PUBLIC_CURRENCY ?? 'INR';
