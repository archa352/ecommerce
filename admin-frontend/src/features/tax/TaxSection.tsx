import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { downloadInvoicePdf, listOrders } from "../../api/orders";
import { getGst, getGstReport, getTax, updateGst, updateTax } from "../../api/tax";
import { useAuth } from "../../auth/AuthContext";
import { P } from "../../auth/permissions";
import StatCard from "../../components/common/StatCard";
import Badge from "../../components/common/Badge";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import DataTable from "../../components/common/DataTable";
import Field from "../../components/common/Field";
import PageHeader from "../../components/common/PageHeader";
import Pagination from "../../components/common/Pagination";
import StatusMessage from "../../components/common/StatusMessage";
import { useAction } from "../../hooks/useAction";
import { useApi } from "../../hooks/useApi";
import { useUnsavedChanges } from "../../hooks/useUnsavedChanges";
import type { GstSettings, TaxSettings } from "../../types/settings";
import { saveCsv } from "../../utils/csv";
import { dateDaysAgo, emptyToNull, formatDate, formatMoney, label } from "../../utils/formatters";
import InvoiceModal from "../orders/InvoiceModal";
import "./tax.css";

// Same patterns the backend enforces (app/pricing/constants.py).
const GSTIN = /^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
const SAC = /^\d{4}(\d{2}){0,2}$/;

function TaxSection() {
  const { can } = useAuth();
  const [gstDirty, setGstDirty] = useState(false);
  const [taxDirty, setTaxDirty] = useState(false);
  const { pendingLeave, cancelLeave, discardLeave } = useUnsavedChanges(gstDirty || taxDirty, () => { setGstDirty(false); setTaxDirty(false); });
  return (
    <div className="tax-page">
      <PageHeader title="GST & invoicing" subtitle="Seller details printed on invoices, and GST recorded on orders" />
      <div className="tax-settings-grid">
        <GstForm canEdit={can(P.settingsManage)} onDirtyChange={setGstDirty} />
        <TaxSwitchForm canEdit={can(P.settingsManage)} onDirtyChange={setTaxDirty} />
      </div>
      {can(P.reports) && <GstReportPanel />}
      {can(P.ordersView) && <InvoicesPanel />}
      {pendingLeave && <ConfirmDialog title="Unsaved changes" message="You have unsaved changes. Do you want to discard them?" cancelLabel="Continue editing" confirmLabel="Discard changes" onCancel={cancelLeave} onConfirm={discardLeave} />}
    </div>
  );
}

function GstForm({ canEdit, onDirtyChange }: { canEdit: boolean; onDirtyChange: (dirty: boolean) => void }) {
  const gst = useApi(() => getGst(), []);
  if (gst.error) return <div className="status status-error">{gst.error}</div>;
  if (!gst.data) return <div className="state">Loading…</div>;
  return <GstSettingsForm initial={gst.data} canEdit={canEdit} onDirtyChange={onDirtyChange} />;
}

function GstSettingsForm({ initial, canEdit, onDirtyChange }: { initial: GstSettings; canEdit: boolean; onDirtyChange: (dirty: boolean) => void }) {
  const [form, setForm] = useState<GstSettings>(initial);
  const [attempted, setAttempted] = useState(false);
  const [baseline, setBaseline] = useState(JSON.stringify(initial));
  useEffect(() => onDirtyChange(canEdit && JSON.stringify(form) !== baseline), [form, baseline, canEdit, onDirtyChange]);
  const action = useAction();
  const set = (k: keyof GstSettings) => (e: { target: { value: string } }) => setForm({ ...form, [k]: e.target.value });
  const gstinError = form.gstin?.trim() && !GSTIN.test(form.gstin.trim().toUpperCase()) ? "GSTIN must be 15 characters, e.g. 29ABCDE1234F1Z5." : null;
  const prefixError = !form.invoice_prefix.trim() ? "Invoice prefix is required." : null;
  const sacError = form.shipping_sac_code?.trim() && !SAC.test(form.shipping_sac_code.trim()) ? "Shipping SAC code must be 4, 6 or 8 digits." : null;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setAttempted(true);
    const gstin = form.gstin?.trim().toUpperCase() ?? "";
    if (gstinError || prefixError || sacError) return;
    const sac = form.shipping_sac_code?.trim() ?? "";
    setAttempted(false);
    action.run(async () => {
      const r = await updateGst({ gstin: emptyToNull(gstin), legal_name: emptyToNull(form.legal_name ?? ""), address: emptyToNull(form.address ?? ""), state: emptyToNull(form.state ?? ""), invoice_prefix: form.invoice_prefix.trim(), shipping_sac_code: emptyToNull(sac) });
      setForm(r.data);
      setBaseline(JSON.stringify(r.data));
    }, "GST details saved", "Could not save GST details");
  };
  return (
    <form className="panel form" onSubmit={submit} noValidate>
      <h3>Seller GST details</h3>
      <p className="muted">With a GSTIN and state set, orders in the same state get CGST + SGST and other states get IGST. Rates come from each product's (or its category's) HSN and GST rate.</p>
      <StatusMessage status={action.status} />
      <fieldset disabled={!canEdit} className="form-grid" style={{ border: 0, padding: 0, margin: 0 }}>
        <Field label="GSTIN" error={attempted ? gstinError : null}><input value={form.gstin ?? ""} onChange={set("gstin")} /></Field>
        <Field label="Legal name"><input value={form.legal_name ?? ""} onChange={set("legal_name")} /></Field>
        <Field label="State" hint={form.state_code ? `State code ${form.state_code}` : "State name or 2-digit GST code; blank = taken from the GSTIN"}><input value={form.state ?? ""} onChange={set("state")} /></Field>
        <Field label="Invoice prefix" required error={attempted ? prefixError : null} hint="Changing this also changes the displayed number of past invoices." guidance="This prefix appears before invoice numbers." guidanceDismissible><input value={form.invoice_prefix} onChange={set("invoice_prefix")} /></Field>
        <Field label="Shipping SAC code" error={attempted ? sacError : null}><input value={form.shipping_sac_code ?? ""} onChange={set("shipping_sac_code")} /></Field>
        <Field label="Registered address" wide><textarea value={form.address ?? ""} onChange={set("address")} /></Field>
      </fieldset>
      {attempted && (gstinError || prefixError || sacError) && <div className="status status-error" role="alert">Please correct the GST details before continuing.</div>}
      {canEdit && <div className="form-actions"><button className="primary" disabled={action.busy}>Save</button></div>}
    </form>
  );
}

function GstReportPanel() {
  const [start, setStart] = useState(dateDaysAgo(30));
  const [end, setEnd] = useState(dateDaysAgo(0));
  const validRange = !!start && !!end && start <= end;
  const report = useApi(() => validRange ? getGstReport(start, end) : Promise.reject(new Error("Choose a valid date range: To must be on or after From.")), [start, end]);
  const r = report.loading ? null : report.data;
  return (
    <div className="panel tax-report-panel">
      <div className="panel-title">
        <h3>GST report</h3>
        {r && <button type="button" onClick={() => saveCsv(`gst-${start}-to-${end}.csv`, r.by_rate)}>Export CSV</button>}
      </div>
      <p className="muted tax-help">Order tax saved at checkout for non-cancelled orders in this date range. Payment collection is separate.</p>
      <div className="filters tax-date-filters">
        <Field label="From"><input type="date" value={start} onChange={(e) => setStart(e.target.value)} /></Field>
        <Field label="To"><input type="date" min={start} value={end} onChange={(e) => setEnd(e.target.value)} /></Field>
      </div>
      {report.loading && <div className="state">Loading GST report…</div>}
      {!report.loading && report.error && <div className="status status-error">{report.error}</div>}
      {r && (
        <>
          <div className="stat-grid tax-stat-grid">
            <StatCard label="Orders in period" value={r.order_count} />
            <StatCard label="Taxable value" value={formatMoney(r.taxable_amount)} />
            <StatCard label="CGST" value={formatMoney(r.cgst_amount)} />
            <StatCard label="SGST" value={formatMoney(r.sgst_amount)} />
            <StatCard label="IGST" value={formatMoney(r.igst_amount)} />
            <StatCard label="GST on orders" value={formatMoney(r.tax_amount)} />
          </div>
          <DataTable
            rows={r.by_rate}
            empty="No GST in this period."
            rowKey={(x) => `${x.gst_type}-${x.gst_rate}-${x.component ?? "ITEMS"}`}
            columns={[
              { key: "component", header: "Component", render: (x) => x.component === "CHARGES_AND_ADJUSTMENTS" ? "Charges / adjustments" : "Items" },
              { key: "gst_type", header: "Supply", render: (x) => (x.gst_type ? label(x.gst_type) : <span title="Placed before the seller GST state was set">Not set</span>) },
              { key: "gst_rate", header: "Rate %", align: "right", render: (x) => x.gst_rate ?? "-" },
              { key: "taxable_amount", header: "Taxable", align: "right", render: (x) => formatMoney(x.taxable_amount) },
              { key: "cgst_amount", header: "CGST", align: "right", render: (x) => formatMoney(x.cgst_amount) },
              { key: "sgst_amount", header: "SGST", align: "right", render: (x) => formatMoney(x.sgst_amount) },
              { key: "igst_amount", header: "IGST", align: "right", render: (x) => formatMoney(x.igst_amount) },
            ]}
          />
        </>
      )}
    </div>
  );
}

// Every order has a GST invoice built from what it froze at checkout (same data as the PDF).
function InvoicesPanel() {
  const [start, setStart] = useState(dateDaysAgo(30));
  const [end, setEnd] = useState(dateDaysAgo(0));
  const [page, setPage] = useState(1);
  const validRange = !!start && !!end && start <= end;
  const orders = useApi(() => validRange ? listOrders({ start_date: start, end_date: end, page }) : Promise.reject(new Error("Choose a valid date range: To must be on or after From.")), [start, end, page]);
  const action = useAction();
  const [viewing, setViewing] = useState<string | null>(null);
  return (
    <div className="panel tax-invoices-panel">
      <h3>Invoices</h3>
      <p className="muted tax-help">Invoices are available from saved order details. Payment status is shown separately; a pending payment is not paid.</p>
      <StatusMessage status={action.status} />
      <div className="filters tax-date-filters">
        <Field label="From"><input type="date" value={start} onChange={(e) => { setStart(e.target.value); setPage(1); }} /></Field>
        <Field label="To"><input type="date" min={start} value={end} onChange={(e) => { setEnd(e.target.value); setPage(1); }} /></Field>
      </div>
      <DataTable
        rows={orders.loading ? null : orders.data}
        loading={orders.loading}
        error={orders.error}
        empty="No orders in this period."
        rowKey={(o) => o.id}
        columns={[
          { key: "order_number", header: "Order" },
          { key: "created_at", header: "Invoice date", render: (o) => formatDate(o.created_at) },
          { key: "status", header: "Order status", render: (o) => <Badge value={o.status} /> },
          { key: "payment_status", header: "Payment", render: (o) => <Badge value={o.payment_status} /> },
          { key: "invoice", header: "Invoice", render: () => "Available" },
          { key: "total_amount", header: "Total", align: "right", render: (o) => formatMoney(o.total_amount, o.currency) },
          {
            key: "x",
            header: "",
            render: (o) => (
              <div className="toolbar">
                <button onClick={() => setViewing(o.id)}>View</button>
                <button disabled={action.busy} onClick={() => action.run(() => downloadInvoicePdf(o.id), null, "Invoice PDF failed")}>PDF</button>
              </div>
            ),
          },
        ]}
      />
      <Pagination meta={orders.loading ? null : orders.meta} onPageChange={setPage} />
      {viewing && <InvoiceModal orderId={viewing} onClose={() => setViewing(null)} />}
    </div>
  );
}

function TaxSwitchForm({ canEdit, onDirtyChange }: { canEdit: boolean; onDirtyChange: (dirty: boolean) => void }) {
  const tax = useApi(() => getTax(), []);
  if (tax.error) return <div className="status status-error">{tax.error}</div>;
  if (!tax.data) return null;
  return <TaxSwitchFields initial={tax.data} canEdit={canEdit} onDirtyChange={onDirtyChange} />;
}

function TaxSwitchFields({ initial, canEdit, onDirtyChange }: { initial: TaxSettings; canEdit: boolean; onDirtyChange: (dirty: boolean) => void }) {
  const [form, setForm] = useState<TaxSettings>(initial);
  const [attempted, setAttempted] = useState(false);
  const [baseline, setBaseline] = useState(JSON.stringify(initial));
  useEffect(() => onDirtyChange(canEdit && JSON.stringify(form) !== baseline), [form, baseline, canEdit, onDirtyChange]);
  const action = useAction();
  const rateError = !form.tax_percentage.trim() ? "Default rate is required." : !(Number(form.tax_percentage) >= 0 && Number(form.tax_percentage) <= 100) ? "Default rate must be between 0 and 100%." : null;
  return (
    <form className="panel form" onSubmit={(e) => { e.preventDefault(); setAttempted(true); if (rateError) return; setAttempted(false); action.run(async () => { const r = await updateTax(form); setForm(r.data); setBaseline(JSON.stringify(r.data)); }, "Saved", "Could not save"); }} noValidate>
      <h3>Tax switch &amp; default rate</h3>
      <p className="tax-classification-note">When tax is on, checkout uses this default rate for shipping/COD charges and for items missing both product and category GST rates. HSN codes are not inferred. Review each product/category classification before invoicing.</p>
      <StatusMessage status={action.status} />
      <fieldset disabled={!canEdit} className="form-grid" style={{ border: 0, padding: 0, margin: 0 }}>
        <Field label="Default rate %" required error={attempted ? rateError : null}><input type="number" min="0" max="100" step="0.01" value={form.tax_percentage} onChange={(e) => setForm({ ...form, tax_percentage: e.target.value })} /></Field>
        <label className="check"><input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} /> Charge tax on orders</label>
      </fieldset>
      {attempted && rateError && <div className="status status-error" role="alert">Please correct the default tax rate before continuing.</div>}
      {canEdit && <div className="form-actions"><button disabled={action.busy}>Save</button></div>}
    </form>
  );
}

export default TaxSection;
