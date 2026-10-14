import { useState } from "react";
import { Link } from "react-router-dom";
import { getReport } from "../../../api/reports";
import { listOrders } from "../../../api/orders";
import { listPayments } from "../../../api/payments";
import { getCodReport } from "../../../api/cod";
import { getGstReport } from "../../../api/tax";
import { request } from "../../../api/client";
import { useAuth } from "../../../auth/AuthContext";
import { P } from "../../../auth/permissions";
import StatCard from "../../../components/admin/StatCard";
import DataTable from "../../../components/common/DataTable";
import Pagination from "../../../components/common/Pagination";
import Modal from "../../../components/common/Modal";
import { useApi } from "../../../hooks/useApi";
import { ORDER_STATUSES, PAYMENT_METHODS } from "../../../types/order";
import type { InventoryMovement } from "../../../types/catalogue";
import { formatDate, formatMoney, formatPct, label } from "../../../utils/formatters";
import ReportTable from "./ReportTable";
import type { ReportRow as Row } from "./ReportTable";
import { columnsFor } from "./ReportColumns";
import { ReportExports } from "./ReportExports";

export function InventoryReport() {
  const { can } = useAuth();
  const [status, setStatus] = useState("all");
  const [variant, setVariant] = useState<string | null>(null);
  const query = { stock_status: status };
  const report = useApi(() => getReport<Row[]>("inventory", query), [status]);
  const safeRows = report.data?.map(({ unit_price: _price, stock_value: _value, ...row }) => { void _price; void _value; return row; }) ?? null;
  return <>
    <div className="filters"><select aria-label="Report stock status" value={status} onChange={(e) => setStatus(e.target.value)}><option value="all">All stock</option><option value="in">In stock</option><option value="low">Low stock</option><option value="out">Out of stock</option></select></div>
    <div className="panel"><ReportTable key={status} name="inventory" query={query} localOnly filename={`inventory-${status}`} rows={safeRows} loading={report.loading} error={report.error} rowKey={(row) => String(row.variant_id)} columns={[
      ...columnsFor(safeRows ?? [], ["product_id", "variant_id"]),
      ...(can(P.catalogueView) ? [{ key: "history", header: "History", render: (row: Row) => <button onClick={() => setVariant(String(row.variant_id))}>Movements</button> }] : []),
    ]} /></div>
    <p className="muted">Cost-based valuation is unavailable: the API’s unit price and stock value are selling-price estimates, not inventory costs.</p>
    {variant && <Modal title="Stock movement history" onClose={() => setVariant(null)} wide><MovementHistory id={variant} /></Modal>}
  </>;
}
function MovementHistory({ id }: { id: string }) {
  const [page, setPage] = useState(1);
  const rows = useApi(() => request<InventoryMovement[]>(`/catalogue/variants/${id}/inventory/movements`, { query: { page, page_size: 50 } }), [id, page]);
  return <>
    <p className="muted">This API provides quantity changes and reasons, but no movement timestamps or date filtering.</p>
    <DataTable rows={rows.loading ? null : rows.data} loading={rows.loading} error={rows.error} rowKey={(row) => row.id} columns={[
      { key: "delta", header: "Quantity change" }, { key: "reason", header: "Reason" }, { key: "reference", header: "Reference" }, { key: "note", header: "Note" },
    ]} />
    {!rows.loading && !rows.error && <Pagination meta={rows.meta} onPageChange={setPage} />}
  </>;
}
export function OrderReports({ range }: { range: object }) {
  const { can } = useAuth();
  return can(P.ordersView) ? <OrderData key={JSON.stringify(range)} range={range} /> : <p className="state">Order reports require orders.view permission.</p>;
}
function OrderData({ range }: { range: object }) {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [method, setMethod] = useState("");
  const [draft, setDraft] = useState("");
  const [search, setSearch] = useState("");
  const base = { ...range, payment_method: method, search };
  const counts = useApi(async () => {
    const statuses = ["", "CONFIRMED", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED"];
    const responses = await Promise.all(statuses.map((stage) => listOrders({ ...base, status: stage, page: 1, page_size: 1 })));
    return { ...responses[0], data: Object.fromEntries(statuses.map((stage, i) => [stage || "total", responses[i].meta?.total_items ?? null])), meta: null };
  }, [JSON.stringify(base)]);
  const query = { ...base, status, page, page_size: 50 };
  const rows = useApi(() => listOrders(query), [JSON.stringify(query)]);
  const d = counts.data;
  return <>
    {counts.error && <p role="alert">{counts.error}</p>}
    {d && !counts.loading && <div className="stat-grid">
      {Object.entries(d).map(([stage, count]) => <StatCard key={stage} label={stage === "total" ? "Total orders" : label(stage)} value={count ?? "—"} />)}
      <StatCard label="Cancellation rate" value={formatPct(d.total && d.CANCELLED !== null ? d.CANCELLED / d.total * 100 : null)} />
    </div>}
    <p className="muted">Totals cover the selected dates, search and payment method across all order statuses.</p>
    <form className="filters" onSubmit={(e) => { e.preventDefault(); setSearch(draft.trim()); setPage(1); }}>
      <input aria-label="Search orders report" placeholder="Order, customer, product or SKU" value={draft} onChange={(e) => setDraft(e.target.value)} /><button>Search</button>
      <select aria-label="Order report status" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}><option value="">All statuses</option>{ORDER_STATUSES.map((stage) => <option key={stage} value={stage}>{label(stage)}</option>)}</select>
      <select aria-label="Order payment method" value={method} onChange={(e) => { setMethod(e.target.value); setPage(1); }}><option value="">All payment methods</option>{PAYMENT_METHODS.map((value) => <option key={value} value={value}>{label(value)}</option>)}</select>
    </form>
    <div className="panel">
      <ReportExports query={query} rows={rows.loading ? [] : rows.data ?? []} pageOnly filename={`orders-page-${page}`} />
      <DataTable rows={rows.loading ? null : rows.data} loading={rows.loading} error={rows.error} rowKey={(row) => row.id} columns={[
        { key: "order_number", header: "Order", render: (row) => <Link to={`/orders/${row.id}`}>{row.order_number}</Link> }, { key: "status", header: "Status" }, { key: "payment_method", header: "Payment method" },
        { key: "total_amount", header: "Total", render: (row) => formatMoney(row.total_amount, row.currency) }, { key: "created_at", header: "Placed", render: (row) => formatDate(row.created_at) },
      ]} />
      {!rows.loading && !rows.error && <Pagination meta={rows.meta} onPageChange={setPage} />}
    </div>
    <p className="muted">Delay counts, fulfilment-time aggregates and structured cancellation reasons require backend reporting support.</p>
  </>;
}
export function PaymentReports() {
  return useAuth().can(P.paymentsView) ? <PaymentData /> : <p className="state">Payment reports require payments.view permission.</p>;
}
function PaymentData() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const counts = useApi(async () => {
    const states = ["PAID", "PENDING", "FAILED", "REFUNDED"];
    const responses = await Promise.all(states.map((state) => listPayments({ status: state, page: 1, page_size: 1 })));
    return { ...responses[0], data: Object.fromEntries(states.map((state, i) => [state, responses[i].meta?.total_items ?? null])), meta: null };
  }, []);
  const query = { status, page, page_size: 50 };
  const rows = useApi(() => listPayments(query), [status, page]);
  return <>
    <p className="muted">All-time payment records. This API has no date-range, payment-method totals or refunded-amount aggregate.</p>
    {counts.error && <p role="alert">{counts.error}</p>}
    {!counts.loading && counts.data && <div className="stat-grid">{Object.entries(counts.data).map(([state, count]) => <StatCard key={state} label={label(state)} value={count ?? "—"} hint="Payment records" />)}</div>}
    <div className="filters"><select aria-label="Payment report status" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}><option value="">All statuses</option>{["PENDING", "PROCESSING", "PAID", "FAILED", "CANCELLED", "REFUND_PENDING", "REFUNDED", "PARTIALLY_REFUNDED", "EXPIRED"].map((state) => <option key={state} value={state}>{label(state)}</option>)}</select></div>
    <div className="panel"><ReportExports query={query} rows={rows.loading ? [] : rows.data ?? []} pageOnly filename={`payments-page-${page}`} />
      <DataTable rows={rows.loading ? null : rows.data} loading={rows.loading} error={rows.error} rowKey={(row) => row.id} columns={[
        { key: "order_id", header: "Order", render: (row) => <Link to={`/orders/${row.order_id}`}>{row.order_id}</Link> }, { key: "status", header: "Status" }, { key: "provider", header: "Provider" }, { key: "purpose", header: "Purpose" },
        { key: "amount", header: "Payment amount", render: (row) => formatMoney(row.amount, row.currency) }, { key: "created_at", header: "Created", render: (row) => formatDate(row.created_at) },
      ]} />
      {!rows.loading && !rows.error && <Pagination meta={rows.meta} onPageChange={setPage} />}
    </div>
  </>;
}
export function CodReports({ range }: { range: { start_date: string; end_date: string } }) {
  const report = useApi(() => getCodReport(range.start_date, range.end_date), [range]);
  const d = report.data;
  if (report.error) return <p role="alert">{report.error}</p>;
  if (!d || report.loading) return <div className="state">Loading…</div>;
  const completed = Number(d.delivered_orders) + Number(d.returned_orders);
  return <div className="panel">
    <ReportExports query={range} rows={[d]} filename={`cod-${range.start_date}-${range.end_date}`} />
    <div className="stat-grid">
      <StatCard label="COD orders" value={d.total_orders} /><StatCard label="Delivered" value={d.delivered_orders} /><StatCard label="Returned" value={d.returned_orders} />
      <StatCard label="COD return rate" value={formatPct(completed > 0 ? Number(d.returned_orders) / completed * 100 : null)} hint="Returned / (delivered + returned)" />
      <StatCard label="Collections" value={formatMoney(d.cash_collected)} /><StatCard label="Remitted" value={formatMoney(d.cash_remitted)} /><StatCard label="Outstanding settlements" value={formatMoney(d.cash_outstanding)} />
      <StatCard label="Net COD revenue" value={formatMoney(d.net_revenue)} hint="Cash + advances collected" />
    </div>
  </div>;
}
export function GstReports({ range }: { range: { start_date: string; end_date: string } }) {
  const report = useApi(() => getGstReport(range.start_date, range.end_date), [range]);
  const d = report.data;
  if (report.error) return <p role="alert">{report.error}</p>;
  if (!d || report.loading) return <div className="state">Loading…</div>;
  const rows = d.by_rate as unknown as Row[];
  return <div className="panel">
    <ReportTable heading={<h3>GST by rate</h3>} query={range} localOnly filename={`gst-${range.start_date}-${range.end_date}`} rows={rows} rowKey={(row) => `${row.gst_type}:${row.gst_rate}`} columns={columnsFor(rows, [], d.currency)} summary={<div className="stat-grid">
      <StatCard label="Orders" value={d.order_count} /><StatCard label="Taxable amount" value={formatMoney(d.taxable_amount, d.currency)} /><StatCard label="GST collected" value={formatMoney(d.tax_amount, d.currency)} />
      <StatCard label="CGST" value={formatMoney(d.cgst_amount, d.currency)} /><StatCard label="SGST" value={formatMoney(d.sgst_amount, d.currency)} /><StatCard label="IGST" value={formatMoney(d.igst_amount, d.currency)} />
    </div>} />
    <p className="muted">Monthly/date-range summaries are available. HSN-wise schedules and filing-ready accountant reports require backend support.</p>
  </div>;
}
