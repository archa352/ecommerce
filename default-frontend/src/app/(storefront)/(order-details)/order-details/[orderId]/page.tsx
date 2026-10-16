import { notFound, redirect } from 'next/navigation';

import homeStyles from '@/app/(storefront)/(home)/home/_components/luxe/Home.module.css';
import LuxeFooter from '@/components/luxe/LuxeFooter';
import LuxeHeader from '@/components/luxe/LuxeHeader';
import MobileBottomNav from '@/components/luxe/MobileBottomNav';
import { catalogueApi } from '@/lib/api/catalogue';
import { orderApi } from '@/lib/api/orders';
import { getAccessToken } from '@/lib/auth/session';

import OrderDetails, { type OrderItemImages } from '../_components/OrderDetails';

/**
 * One order, in full -- every item, the real summary breakdown, status,
 * delivery address and payment, all from `GET /orders/{id}` (unchanged).
 *
 * That endpoint carries no product images (`OrderItemRead` has none), so
 * each line's image is resolved the same frontend-only way My Orders does:
 * the existing public `GET /storefront/products/{id}` the product page
 * already uses, one call per distinct product in the order, deduplicated.
 */
export default async function OrderDetailsPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;

  const token = await getAccessToken();
  if (!token) redirect(`/signin?next=${encodeURIComponent(`/order-details/${orderId}`)}`);

  const order = await orderApi.get(token, orderId).catch(() => null);
  if (!order) notFound();

  const productIds = Array.from(new Set(order.items.map(item => item.product_id)));

  const images: OrderItemImages = {};
  await Promise.all(
    productIds.map(async productId => {
      const product = await catalogueApi.getProduct(productId).catch(() => null);
      const primary = product?.images.find(image => image.is_primary) ?? product?.images[0] ?? null;
      if (primary) images[productId] = { url: primary.url, alt_text: primary.alt_text };
    }),
  );

  return (
    <div className={homeStyles.page}>
      <LuxeHeader />
      <OrderDetails order={order} images={images} />
      <LuxeFooter />
      <MobileBottomNav />
    </div>
  );
}
