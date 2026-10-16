import homeStyles from '@/app/(storefront)/(home)/home/_components/luxe/Home.module.css';
import LuxeFooter from '@/components/luxe/LuxeFooter';
import LuxeHeader from '@/components/luxe/LuxeHeader';
import MobileBottomNav from '@/components/luxe/MobileBottomNav';
import ProtectedRoute from '@/components/ProtectedRoute';
import { catalogueApi } from '@/lib/api/catalogue';
import { orderApi } from '@/lib/api/orders';
import { getAccessToken } from '@/lib/auth/session';

import MyOrders, { type OrderItemImage, type OrderRow } from './_components/MyOrders';

/**
 * The orders LIST endpoint returns no items and no image (`OrderSummaryRead`
 * on the backend, unchanged) -- so a product thumbnail and item count have
 * to come from calls the frontend already makes elsewhere:
 *
 *  1. GET /orders (list)          -- the rows themselves
 *  2. GET /orders/{id} (existing) -- each order's real items, for a count
 *     and the first line's product_id
 *  3. GET /storefront/products/{id} (existing, public, already used by the
 *     product page) -- that product's real primary image
 *
 * No backend route, schema or serializer changes. Image lookups are
 * deduplicated by product_id so the same product across several orders is
 * only fetched once.
 */
export default async function MyOrdersPage() {
  const token = await getAccessToken();

  const summaries = token
    ? await orderApi
        .list(token, { page_size: 50 })
        .then(page => page.items)
        .catch(() => [])
    : [];

  const details = await Promise.all(
    summaries.map(summary => (token ? orderApi.get(token, summary.id).catch(() => null) : null)),
  );

  const productIds = Array.from(
    new Set(details.flatMap(detail => (detail?.items[0] ? [detail.items[0].product_id] : []))),
  );

  const images = new Map<string, OrderItemImage>();
  await Promise.all(
    productIds.map(async productId => {
      const product = await catalogueApi.getProduct(productId).catch(() => null);
      const primary = product?.images.find(image => image.is_primary) ?? product?.images[0] ?? null;
      if (primary) images.set(productId, { url: primary.url, alt_text: primary.alt_text });
    }),
  );

  const orders: OrderRow[] = summaries.map((summary, index) => {
    const detail = details[index];
    const firstProductId = detail?.items[0]?.product_id ?? null;

    return {
      ...summary,
      item_count: detail?.items.length ?? 0,
      preview_image: firstProductId ? (images.get(firstProductId) ?? null) : null,
    };
  });

  return (
    <div className={homeStyles.page}>
      <LuxeHeader />
      <ProtectedRoute>
        <MyOrders orders={orders} />
      </ProtectedRoute>
      <LuxeFooter />
      <MobileBottomNav />
    </div>
  );
}
