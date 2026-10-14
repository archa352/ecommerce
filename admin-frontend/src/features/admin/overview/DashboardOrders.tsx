import { useState } from "react";
import { Link } from "react-router-dom";
import { getOrder, listOrders } from "../../../api/orders";
import { useAuth } from "../../../auth/AuthContext";
import { P } from "../../../auth/permissions";
import Badge from "../../../components/common/Badge";
import DataTable from "../../../components/common/DataTable";
import StatCard from "../../../components/admin/StatCard";
import { useApi } from "../../../hooks/useApi";
import { ORDER_STATUSES } from "../../../types/order";
import type { DashboardOverview } from "../../../types/dashboard";
import { formatDate, formatMoney, label } from "../../../utils/formatters";


export default function DashboardOrders({ data, refresh }: { data: DashboardOverview; refresh: number }) {
  const [status, setStatus] = useState("");
  const { can } = useAuth();
  // Keep the original dashboard preview for accounts without order-list access.
  if (!can(P.ordersView)) return <section className="panel" aria-label="Recent orders">
    <h3>Recent orders</h3><p className="muted">Dashboard preview; order access is required for the full paginated list.</p>
    <DataTable rows={data.recent_orders.slice(0, 5)} empty="No orders yet." rowKey={(row) => row.order_id} columns={[
      { key: "order_number", header: "Order" }, { key: "customer_email", header: "Customer email" },
      { key: "customer_phone", header: "Customer phone", render: () => "Unavailable" },
      { key: "order_status", header: "Status", render: (row) => <Badge value={row.order_status} /> },
      { key: "payment_status", header: "Payment", render: (row) => <Badge value={row.payment_status} /> },
      { key: "total_amount", header: "Total", render: (row) => formatMoney(row.total_amount, row.currency) },
      { key: "created_at", header: "Placed", render: (row) => formatDate(row.created_at) },
    ]} />
    <p className="muted">Phone numbers require order-detail access; the dashboard preview does not provide them.</p>
  </section>;
  return <>
    <section className="panel" aria-label="Recent orders">
      <div className="panel-title"><h3>Recent orders</h3><Link to="/orders">View all orders</Link></div>
      <div className="filters"><label>Status<select aria-label="Dashboard order status" value={status} onChange={(e) => setStatus(e.target.value)}><option value="">All statuses</option>{ORDER_STATUSES.map((value) => <option key={value} value={value}>{label(value)}</option>)}</select></label></div>
      <RecentOrders key={status} status={status} data={data} refresh={refresh} />
    </section>
  </>;
}
export function OrderIndicators({ data, refresh }: { data: DashboardOverview; refresh: number }) {
  const { can } = useAuth();
  const allowed = can(P.ordersView);
  const delivery = useApi(() => allowed ? listOrders({ status: "OUT_FOR_DELIVERY", page: 1, page_size: 5 }) : Promise.resolve({ success: true, message: "Order access required", data: [], meta: null }), [refresh, allowed]);
  return <section className="panel" aria-label="Order indicators">
    <h3>Order indicators</h3>
    <div className="stat-grid">
      <StatCard label="New orders" value={data.insights?.attention.new_orders ?? data.orders.pending} hint="Awaiting confirmation" />
      <StatCard label="Pending confirmation" value={data.insights?.attention.new_orders ?? data.orders.pending} />
      <StatCard label="Packing pending" value={data.insights?.attention.awaiting_packing ?? "Unavailable"} hint="Confirmed + processing" />
      <StatCard label="Shipping pending" value={data.insights?.attention.awaiting_shipment ?? "Unavailable"} hint="Packed, not shipped" />
      <StatCard label="Cancelled orders" value={data.orders.cancelled} />
      <StatCard label="Out for delivery" value={delivery.loading ? "Loading…" : delivery.meta?.total_items ?? "Unavailable"} />
    </div>
    {delivery.error && <p role="alert">Out for delivery: {delivery.error}</p>}
  </section>;
}
function RecentOrders({ status, data, refresh }: { status: string; data: DashboardOverview; refresh: number }) {
  const orders = useApi(() => listOrders({ status, page: 1, page_size: 5 }), [status, refresh]);
  const ids = orders.loading ? [] : orders.data?.slice(0, 5).map((order) => order.id) ?? [];
  const phones = useApi(async () => {
    const values: Record<string, string | null> = {};
    for (let start = 0; start < ids.length; start += 5) {
      const batch = ids.slice(start, start + 5);
      const details = await Promise.allSettled(batch.map(getOrder));
      details.forEach((detail, index) => {
        values[batch[index]] = detail.status === "fulfilled" ? detail.value.data.delivery_address?.phone ?? null : null;
      });
    }
    return { success: true, message: "Order contact phones", data: values, meta: null };
  }, [ids.join(","), refresh]);
  return <>
    <DataTable rows={orders.loading ? null : orders.data?.slice(0, 5) ?? null} loading={orders.loading} error={orders.error} empty="No orders match these filters." rowKey={(row) => row.id} columns={[
      { key: "order_number", header: "Order", render: (row) => <Link to={`/orders/${row.id}`}>{row.order_number}</Link> },
      { key: "customer_email", header: "Customer email", render: (row) => data.recent_orders.find((recent) => recent.order_id === row.id)?.customer_email ?? "—" },
      { key: "customer_phone", header: "Customer phone", render: (row) => phones.loading ? "Loading…" : phones.data?.[row.id] ?? "Unavailable" },
      { key: "status", header: "Status", render: (row) => <Badge value={row.status} /> },
      { key: "payment_status", header: "Payment", render: (row) => <Badge value={row.payment_status} /> },
      { key: "total_amount", header: "Total", align: "right", render: (row) => formatMoney(row.total_amount, row.currency) },
      { key: "created_at", header: "Placed", render: (row) => formatDate(row.created_at) },
    ]} />
    <p className="muted">Phone numbers are the delivery contact supplied by existing order details; account phone numbers are not included in the order-list API.</p>
  </>;
}
