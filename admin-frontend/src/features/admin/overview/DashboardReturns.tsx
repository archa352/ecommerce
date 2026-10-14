import { useState } from "react";
import { Link } from "react-router-dom";
import { getCodReport } from "../../../api/cod";
import { getReport } from "../../../api/reports";
import { getOrder, listOrders } from "../../../api/orders";
import { useAuth } from "../../../auth/AuthContext";
import { P } from "../../../auth/permissions";
import StatCard from "../../../components/admin/StatCard";
import { useApi } from "../../../hooks/useApi";
import { formatMoney, formatPct } from "../../../utils/formatters";
import DashboardTable from "./DashboardTable";
import { DASHBOARD_PAGE_SIZE, utcDate } from "./dashboardData";
import type { ReturnsReport } from "./dashboardData";

export default function DashboardReturns({ refresh }: { refresh: number }) {
  const { can } = useAuth();
  const [range, setRange] = useState(() => ({ start_date: utcDate(29), end_date: utcDate() }));
  const valid = !!range.start_date && !!range.end_date && range.start_date <= range.end_date;
  return <section className="panel" aria-label="Returns and COD">
    <h3>Returns & cash on delivery</h3>
    <div className="filters">
      <label>From<input type="date" aria-label="Returns and COD from" value={range.start_date} onChange={(e) => setRange({ ...range, start_date: e.target.value })} /></label>
      <label>To<input type="date" aria-label="Returns and COD to" value={range.end_date} onChange={(e) => setRange({ ...range, end_date: e.target.value })} /></label>
    </div>
    <p className="muted">Selected period, based on order creation dates (UTC).</p>
    {valid ? <div className="grid-2">
      {can(P.reports) ? <Returns key={`returns:${range.start_date}:${range.end_date}`} range={range} refresh={refresh} /> : <p>Report access is required to view top returned products.</p>}
      {can(P.paymentsView) ? <Cod key={`cod:${range.start_date}:${range.end_date}`} range={range} refresh={refresh} /> : <p>Payment access is required to view COD reporting.</p>}
    </div> : <p role="alert">Select a valid date range; From must be on or before To.</p>}
    <p className="muted">Return requests, pending returns, and approved/rejected returns are unavailable: the existing API records returned orders, but has no return-request approval workflow.</p>
  </section>;
}
function Returns({ range, refresh }: { range: { start_date: string; end_date: string }; refresh: number }) {
  const { can } = useAuth();
  const report = useApi(() => getReport<ReturnsReport>("returns", range), [range, refresh]);
  return <div>
    <h4>Completed returns</h4>
    {!report.loading && report.data && <div className="stat-grid">
      <StatCard label="Completed returns" value={report.data.returned_orders} hint="Returned orders in selected period" />
      <StatCard label="Return rate" value={formatPct(report.data.return_rate)} hint="Returned / (delivered + returned)" />
    </div>}
    <h4>Top returned products</h4>
    <DashboardTable rows={report.data?.by_product ?? null} loading={report.loading} error={report.error} empty="No returned products in this period." rowKey={(row) => row.product_id} columns={[
      { key: "product_name", header: "Product", render: (row) => can(P.catalogueView) ? <Link to={`/products/${row.product_id}`}>{row.product_name}</Link> : row.product_name },
      { key: "units_returned", header: "Units returned", align: "right" }, { key: "orders", header: "Orders", align: "right" },
    ]} />
  </div>;
}
function Cod({ range, refresh }: { range: { start_date: string; end_date: string }; refresh: number }) {
  const report = useApi(() => getCodReport(range.start_date, range.end_date), [range, refresh]);
  const d = report.data;
  const completed = d ? Number(d.delivered_orders) + Number(d.returned_orders) : 0;
  return <div><div className="panel-title"><h4>COD summary</h4><Link to="/cod">Manage COD</Link></div>
    {report.loading && <p role="status">Loading COD…</p>}
    {report.error && <p role="alert">{report.error}</p>}
    {!report.loading && d && <div className="stat-grid">
      <StatCard label="COD orders" value={d.total_orders} />
      <StatCard label="COD delivered" value={d.delivered_orders} />
      <StatCard label="Completed returns (COD returned)" value={d.returned_orders} hint="COD returned orders; counted once" />
      <StatCard label="COD revenue" value={formatMoney(d.net_revenue)} hint="Cash + advances collected" />
      <StatCard label="COD collection" value={formatMoney(d.cash_collected)} hint="Cash received from delivered COD orders" />
      <StatCard label="COD return rate" value={formatPct(completed > 0 ? Number(d.returned_orders) / completed * 100 : null)} hint="Returned / (delivered + returned)" />
    </div>}
    {!report.loading && d && <CodReturnedProducts range={range} refresh={refresh} />}
  </div>;
}

function CodReturnedProducts({ range, refresh }: { range: { start_date: string; end_date: string }; refresh: number }) {
  const { can } = useAuth();
  return <section aria-label="COD top returned products"><h4>Top returned products — COD</h4>
    {can(P.ordersView) ? <CodProductRows range={range} refresh={refresh} /> : <p className="muted">Order access is required for the COD returned-product breakdown.</p>}
  </section>;
}

function CodProductRows({ range, refresh }: { range: { start_date: string; end_date: string }; refresh: number }) {
  const { can } = useAuth();
  const products = useApi(async () => {
    const query = { ...range, status: "RETURNED", payment_method: "CASH_ON_DELIVERY", page_size: DASHBOARD_PAGE_SIZE };
    const first = await listOrders({ ...query, page: 1 });
    if (!first.meta) throw new Error("COD returned-order pagination metadata is unavailable.");
    const orders = new Map(first.data.map((order) => [order.id, order]));
    for (let page = 2; page <= first.meta.total_pages; page++) {
      const response = await listOrders({ ...query, page });
      response.data.forEach((order) => orders.set(order.id, order));
    }
    if (orders.size !== first.meta.total_items) throw new Error("Returned orders changed while loading. Refresh to retry.");
    const totals = new Map<string, { product_id: string; product_name: string; units_returned: number; orderIds: Set<string> }>();
    const ids = [...orders.keys()];
    // Bound concurrent detail requests; never present partial totals as complete.
    for (let start = 0; start < ids.length; start += 5) {
      const details = await Promise.all(ids.slice(start, start + 5).map(getOrder));
      for (const { data: order } of details) {
        if (order.status !== "RETURNED" || order.payment_method !== "CASH_ON_DELIVERY") throw new Error("Returned orders changed while loading. Refresh to retry.");
        for (const item of order.items) {
          const product = totals.get(item.product_id) ?? { product_id: item.product_id, product_name: item.product_name, units_returned: 0, orderIds: new Set<string>() };
          product.units_returned += item.quantity;
          product.orderIds.add(order.id);
          totals.set(item.product_id, product);
        }
      }
    }
    const rows = [...totals.values()].map((product) => ({ ...product, orders: product.orderIds.size })).sort((a, b) => b.units_returned - a.units_returned || a.product_id.localeCompare(b.product_id));
    return { ...first, data: rows, meta: null };
  }, [range, refresh]);
  return <DashboardTable rows={products.data} loading={products.loading} error={products.error} empty="No COD returned products in this period." rowKey={(row) => row.product_id} columns={[
    { key: "product_name", header: "Product", render: (row) => can(P.catalogueView) ? <Link to={`/products/${row.product_id}`}>{row.product_name}</Link> : row.product_name },
    { key: "units_returned", header: "Units returned", align: "right" }, { key: "orders", header: "Orders", align: "right" },
  ]} />;
}
