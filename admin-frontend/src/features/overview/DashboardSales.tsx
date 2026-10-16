import { useState } from "react";
import { getSalesTrend } from "../../api/dashboard";
import { getReport } from "../../api/reports";
import { useAuth } from "../../auth/AuthContext";
import { P } from "../../auth/permissions";
import StatCard from "../../components/common/StatCard";
import { useApi } from "../../hooks/useApi";
import { formatMoney } from "../../utils/formatters";
import DashboardTable from "./DashboardTable";
import { utcDate } from "./dashboardData";
import type { SalesReport, TrendPoint } from "./dashboardData";

export default function DashboardSales({ refresh, view = "trends" }: { refresh: number; view?: "trends" | "sales" }) {
  const { can } = useAuth();
  const [days, setDays] = useState(30);
  const trend = useApi(() => getSalesTrend(days), [days, refresh]);
  return <>
    <section className="panel performance-trends" aria-label="Sales trends" hidden={view !== "trends"}>
      <div className="panel-title"><h3>Sales trends</h3><select aria-label="Trend period" value={days} onChange={(e) => setDays(Number(e.target.value))}>
        {[7, 30, 90, 365].map((value) => <option key={value} value={value}>{value} days</option>)}
      </select></div>
      <p className="muted" title="Orders in fulfilment, grouped by creation date. Dates without recorded sales are omitted by the API.">Fulfilment orders · UTC dates</p>
      {trend.loading && <p role="status">Loading trends…</p>}
      {trend.error && <p role="alert">{trend.error}</p>}
      {!trend.loading && trend.data && <>
        <div className="grid-2"><TrendChart title="Revenue trend" rows={trend.data} metric="revenue" /><TrendChart title="Order trend" rows={trend.data} metric="order_count" /></div>
        <DashboardTable pageSize={5} key={days} rows={trend.data} rowKey={(row) => row.date} empty="No sales in this period." columns={[
          { key: "date", header: "Date (UTC)" }, { key: "order_count", header: "Orders", align: "right" },
          { key: "revenue", header: "Revenue", align: "right", render: (row) => formatMoney(row.revenue) },
        ]} />
      </>}
    </section>
    <div hidden={view !== "sales"}>{can(P.reports) ? <SalesByPeriod refresh={refresh} /> : <section className="panel"><h3>Sales by period</h3><p className="muted">Report access is required for grouped sales and AOV.</p></section>}</div>
  </>;
}
function TrendChart({ title, rows, metric }: { title: string; rows: TrendPoint[]; metric: "revenue" | "order_count" }) {
  const points = rows.map((row) => ({ ...row, value: Number(row[metric]) }));
  const maximum = Math.max(0, ...points.map((point) => point.value));
  const first = points.length ? Date.parse(points[0].date) : 0;
  const last = points.length ? Date.parse(points[points.length - 1].date) : 0;
  const x = (date: string) => last === first ? 300 : 24 + (Date.parse(date) - first) / (last - first) * 552;
  const y = (value: number) => 156 - (maximum > 0 ? value / maximum * 132 : 0);
  return <figure className="dashboard-trend" aria-label={title}>
    <figcaption>{title}</figcaption>
    {points.length ? <>
      <svg viewBox="0 0 600 190" role="img" aria-label={`${title}; exact values in the table below`}>
        <line x1="24" y1="156" x2="576" y2="156" className="trend-axis" />
        <polyline points={points.map((point) => `${x(point.date)},${y(point.value)}`).join(" ")} fill="none" className="trend-line" />
        {points.map((point) => <circle key={point.date} cx={x(point.date)} cy={y(point.value)} r="3" className="trend-point"><title>{point.date}: {metric === "revenue" ? formatMoney(point.value) : point.value}</title></circle>)}
        <text x="24" y="180">{points[0].date}</text><text x="576" y="180" textAnchor="end">{points[points.length - 1].date}</text>
        <text x="24" y="15">{metric === "revenue" ? formatMoney(maximum) : maximum}</text>
      </svg>
      {maximum === 0 && <p className="muted">All recorded values are zero.</p>}
    </> : <p className="muted">No data for this period.</p>}
  </figure>;
}
function SalesByPeriod({ refresh }: { refresh: number }) {
  const [range, setRange] = useState(() => ({ start_date: utcDate(29), end_date: utcDate() }));
  const [group, setGroup] = useState("day");
  const valid = !!range.start_date && !!range.end_date && range.start_date <= range.end_date;
  return <section className="panel" aria-label="Sales by period">
    <h3>Sales by period</h3>
    <div className="filters">
      <label>From<input type="date" aria-label="Sales from" value={range.start_date} onChange={(e) => setRange({ ...range, start_date: e.target.value })} /></label>
      <label>To<input type="date" aria-label="Sales to" value={range.end_date} onChange={(e) => setRange({ ...range, end_date: e.target.value })} /></label>
      <label>Group<select aria-label="Sales grouping" value={group} onChange={(e) => setGroup(e.target.value)}><option value="day">Day</option><option value="week">Week</option><option value="month">Month</option></select></label>
    </div>
    <p className="muted" title="This report counts non-cancelled orders. Sales Performance counts orders in fulfilment.">Non-cancelled orders · UTC dates</p>
    {valid ? <GroupedSales key={`${range.start_date}:${range.end_date}:${group}`} range={range} group={group} refresh={refresh} /> : <p role="alert">Select a valid date range; From must be on or before To.</p>}
  </section>;
}
function GroupedSales({ range, group, refresh }: { range: { start_date: string; end_date: string }; group: string; refresh: number }) {
  const report = useApi(() => getReport<SalesReport>("sales", { ...range, group_by: group }), [range, group, refresh]);
  return <>
    {!report.loading && report.data && <div className="stat-grid">
      <StatCard label="Orders" value={report.data.summary.orders} />
      <StatCard label="Revenue" value={formatMoney(report.data.summary.revenue, report.data.currency)} />
      <StatCard label="AOV" value={formatMoney(report.data.summary.average_order_value, report.data.currency)} />
    </div>}
    <DashboardTable pageSize={5} rows={report.data?.rows ?? null} loading={report.loading} error={report.error} rowKey={(row) => row.period} columns={[
      { key: "period", header: "Period (UTC)" }, { key: "orders", header: "Orders", align: "right" },
      { key: "revenue", header: "Revenue", render: (row) => formatMoney(row.revenue, report.data?.currency) },
      { key: "average_order_value", header: "AOV", render: (row) => formatMoney(row.average_order_value, report.data?.currency) },
    ]} />
  </>;
}
