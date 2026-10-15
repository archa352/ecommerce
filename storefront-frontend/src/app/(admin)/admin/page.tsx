import type { Metadata } from 'next';

import DashboardMetrics from '@/components/admin/DashboardMetrics';
import InventoryAlerts from '@/components/admin/InventoryAlerts';
import PageHeader from '@/components/admin/PageHeader';
import OrderPipeline from '@/components/admin/OrderPipeline';
import RecentOrders from '@/components/admin/RecentOrders';
import SalesTrendChart from '@/components/admin/SalesTrendChart';
import TopProducts from '@/components/admin/TopProducts';
import { adminApi } from '@/lib/api/admin';
import { requireStaff } from '@/lib/auth/require-staff';
import { STOREFRONT_CURRENCY } from '@/lib/currency';
import type { DashboardOverview, SalesTrendItem, TopSellingProductItem } from '@/types/admin';

export const metadata: Metadata = {
  title: 'Dashboard | Zeen Admin',
  description: 'Sales, orders, inventory and customers for your store.',
};

/** The window both the trend chart and the top-products list report on. */
const TREND_DAYS = 30;
const TOP_PRODUCT_LIMIT = 5;

/**
 * Every figure here is scoped to the signed-in staff member's tenant.
 *
 * The scoping is the backend's: it reads the tenant off the token rather
 * than off anything the page sends, so there is no tenant parameter to get
 * wrong and no way for this page to ask for another store's numbers.
 */
export default async function AdminDashboardPage() {
  const { token } = await requireStaff();

  /* The overview is the page; the trend and the top sellers are extras, so
     a failure there costs a panel rather than the whole dashboard. */
  const [overview, trend, topProducts] = await Promise.all([
    adminApi.dashboard(token).catch((): DashboardOverview | null => null),
    adminApi.salesTrend(token, TREND_DAYS).catch((): SalesTrendItem[] => []),
    adminApi
      .topProducts(token, { days: TREND_DAYS, limit: TOP_PRODUCT_LIMIT })
      .catch((): TopSellingProductItem[] => []),
  ]);

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Today's trading, at a glance." />

      {overview === null ? (
        <div className="card">
          <div className="card-body text-center py-40">
            <p className="mb-0">Could not load the dashboard.</p>
            <p className="text-sm text-neutral-500 mb-0">
              The API did not answer. Reload once it is reachable again.
            </p>
          </div>
        </div>
      ) : (
        <>
          <DashboardMetrics overview={overview} currency={STOREFRONT_CURRENCY} />

          <section className="row gy-4 mt-1">
            <SalesTrendChart data={trend} currency={STOREFRONT_CURRENCY} days={TREND_DAYS} />
            <OrderPipeline orders={overview.orders} />
            <RecentOrders orders={overview.recent_orders} />
            <TopProducts products={topProducts} currency={STOREFRONT_CURRENCY} days={TREND_DAYS} />
            <InventoryAlerts inventory={overview.inventory} />
          </section>
        </>
      )}
    </>
  );
}
