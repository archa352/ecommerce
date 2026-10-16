import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { downloadInvoicePdf, listOrders } from "../../../api/orders";
import { activateGst, approveTaxRate, confirmTax, createTaxRate, getGst, getGstReport, getTax, getTaxRateTargets, listTaxRates, updateGst, updateTax } from "../../../api/tax";
import { useAuth } from "../../../auth/AuthContext";
import { P } from "../../../auth/permissions";
import StatCard from "../../../components/admin/StatCard";
import Badge from "../../../components/common/Badge";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import DataTable from "../../../components/common/DataTable";
import Field from "../../../components/common/Field";
import PageHeader from "../../../components/common/PageHeader";
import Pagination from "../../../components/common/Pagination";
import StatusMessage from "../../../components/common/StatusMessage";
import { useAction } from "../../../hooks/useAction";
import { useApi } from "../../../hooks/useApi";
import { useUnsavedChanges } from "../../../hooks/useUnsavedChanges";
import type { GstSettings, TaxSettings } from "../../../types/settings";
import { saveCsv } from "../../../utils/csv";
import { dateDaysAgo, emptyToNull, formatDate, formatMoney, label } from "../../../utils/formatters";
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
      <PageHeader title="Tax & GST settings" subtitle="Business tax details, accountant-confirmed product rates, and order tax records" />
      <div className="tax-settings-grid">
        <GstForm canEdit={can(P.settingsManage)} onDirtyChange={setGstDirty} />
        <TaxSwitchForm canEdit={can(P.settingsManage)} onDirtyChange={setTaxDirty} />
      </div>
      <TaxRateManager canEdit={can(P.settingsManage)} />
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
  const [caConfirmed, setCaConfirmed] = useState(false);
  const [baseline, setBaseline] = useState(JSON.stringify(initial));
  useEffect(() => onDirtyChange(canEdit && JSON.stringify(form) !== baseline), [form, baseline, canEdit, onDirtyChange]);
  const action = useAction();
  const set = (k: keyof GstSettings) => (e: { target: { value: string } }) => setForm({ ...form, [k]: e.target.value });
  const gstinError = form.registration_status === "REGISTERED" && !form.gstin?.trim() ? "GSTIN is required for a registered business." : form.gstin?.trim() && !GSTIN.test(form.gstin.trim().toUpperCase()) ? "GSTIN must be 15 characters, e.g. 29ABCDE1234F1Z5." : null;
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
      const r = await updateGst({ gstin: emptyToNull(gstin), legal_name: emptyToNull(form.legal_name ?? ""), address: emptyToNull(form.address ?? ""), state: emptyToNull(form.state ?? ""), invoice_prefix: form.invoice_prefix.trim(), shipping_sac_code: emptyToNull(sac), registration_status: form.registration_status, accounting_software: form.accounting_software, prices_include_gst: form.prices_include_gst });
      setForm(r.data);
      setBaseline(JSON.stringify(r.data));
    }, "GST details saved", "Could not save GST details");
  };
  return (
    <form className="panel form" onSubmit={submit} noValidate>
      <h3>Business tax &amp; GST settings</h3>
      <p className="muted">Changes return the tax configuration to Pending CA Confirmation. Checkout uses only active, CA-confirmed product/category rates.</p>
      <StatusMessage status={action.status} />
      <fieldset disabled={!canEdit} className="form-grid" style={{ border: 0, padding: 0, margin: 0 }}>
        <Field label="GSTIN" error={attempted ? gstinError : null}><input value={form.gstin ?? ""} onChange={set("gstin")} /></Field>
        <Field label="GST registration status" required><select value={form.registration_status ?? "UNKNOWN"} onChange={(e) => setForm({ ...form, registration_status: e.target.value as GstSettings["registration_status"] })}><option value="REGISTERED">Registered</option><option value="NOT_REGISTERED">Not Registered</option><option value="APPLICATION_PENDING">Application Pending</option><option value="UNKNOWN">Unknown</option></select></Field>
        <Field label="Legal name"><input value={form.legal_name ?? ""} onChange={set("legal_name")} /></Field>
        <Field label="State" hint={form.state_code ? `State code ${form.state_code}` : "State name or 2-digit GST code; blank = taken from the GSTIN"}><input value={form.state ?? ""} onChange={set("state")} /></Field>
        <Field label="Invoice prefix" required error={attempted ? prefixError : null} hint="Changing this also changes the displayed number of past invoices." guidance="This prefix appears before invoice numbers." guidanceDismissible><input value={form.invoice_prefix} onChange={set("invoice_prefix")} /></Field>
        <Field label="Shipping SAC code" error={attempted ? sacError : null}><input value={form.shipping_sac_code ?? ""} onChange={set("shipping_sac_code")} /></Field>
        <Field label="Accounting software"><select value={form.accounting_software ?? "NOT_DECIDED"} onChange={(e) => setForm({ ...form, accounting_software: e.target.value as GstSettings["accounting_software"] })}><option value="TALLY">Tally</option><option value="ZOHO_BOOKS">Zoho Books</option><option value="OTHER">Other</option><option value="NONE">None</option><option value="NOT_DECIDED">Not Decided</option></select></Field>
        <Field label="Prices include GST" hint="Yes extracts GST from the displayed product price. No adds approved GST to the product price at checkout."><select value={String(!!form.prices_include_gst)} onChange={(e) => setForm({ ...form, prices_include_gst: e.target.value === "true" })}><option value="true">Yes</option><option value="false">No</option></select></Field>
        <Field label="Registered address" wide><textarea value={form.address ?? ""} onChange={set("address")} /></Field>
      </fieldset>
      {attempted && (gstinError || prefixError || sacError) && <div className="status status-error" role="alert">Please correct the GST details before continuing.</div>}
      {canEdit && <div className="form-actions"><button className="primary" disabled={action.busy}>Save</button></div>}
      <div className="tax-activation">
        <p><strong>Status:</strong> {label(form.configuration_status ?? "DRAFT")}{form.updated_at ? ` · Updated ${formatDate(form.updated_at)}` : ""}{form.updated_by_id ? ` · Admin ${form.updated_by_id}` : ""}</p>
        {canEdit && form.configuration_status !== "ACTIVE" && <><label className="check"><input type="checkbox" checked={caConfirmed} onChange={(e) => setCaConfirmed(e.target.checked)} /> CA/accountant has confirmed the business tax setup</label><button type="button" disabled={!caConfirmed || action.busy} onClick={() => action.run(async () => { const r = await activateGst(); setForm(r.data); setBaseline(JSON.stringify(r.data)); setCaConfirmed(false); }, "Tax configuration activated", "Could not activate tax configuration")}>Activate configuration</button></>}
      </div>
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
            {!!r.unclassified_tax_amount && Number(r.unclassified_tax_amount) > 0 && <StatCard label="Unclassified tax" value={formatMoney(r.unclassified_tax_amount)} />}
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
              { key: "hsn_code", header: "HSN/SAC", render: (x) => x.hsn_code ?? "-" },
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
  const [confirmed, setConfirmed] = useState(initial.confirmed_by_ca);
  const [caConfirmed, setCaConfirmed] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [baseline, setBaseline] = useState(JSON.stringify(initial));
  useEffect(() => onDirtyChange(canEdit && JSON.stringify(form) !== baseline), [form, baseline, canEdit, onDirtyChange]);
  const action = useAction();
  const rateError = !form.tax_percentage.trim() ? "Default rate is required." : !(Number(form.tax_percentage) >= 0 && Number(form.tax_percentage) <= 100) ? "Default rate must be between 0 and 100%." : null;
  return (
    <form className="panel form" onSubmit={(e) => { e.preventDefault(); setAttempted(true); if (rateError) return; setAttempted(false); action.run(async () => { const r = await updateTax({ tax_percentage: form.tax_percentage, is_active: false }); setForm(r.data); setBaseline(JSON.stringify(r.data)); setConfirmed(false); setCaConfirmed(false); }, "Saved pending confirmation", "Could not save"); }} noValidate>
      <h3>Tax switch &amp; default rate</h3>
      <p className="tax-classification-note">This rate applies only to shipping/COD charges. Product tax rates must be configured separately by product or category. Saving a rate deactivates it until CA confirmation.</p>
      <StatusMessage status={action.status} />
      <fieldset disabled={!canEdit} className="form-grid" style={{ border: 0, padding: 0, margin: 0 }}>
        <Field label="Default rate %" required error={attempted ? rateError : null}><input type="number" min="0" max="100" step="0.01" value={form.tax_percentage} onChange={(e) => setForm({ ...form, tax_percentage: e.target.value })} /></Field>
        <p className="muted">Status: {form.confirmed_by_ca && form.is_active ? "Active" : "Pending accountant confirmation"}</p>
      </fieldset>
      {attempted && rateError && <div className="status status-error" role="alert">Please correct the default tax rate before continuing.</div>}
      {canEdit && <div className="form-actions"><button disabled={action.busy}>Save</button></div>}
      {canEdit && !confirmed && <label className="check"><input type="checkbox" checked={caConfirmed} onChange={(e) => setCaConfirmed(e.target.checked)} /> CA/accountant confirmation is obtained</label>}
      {canEdit && !confirmed && <button type="button" disabled={action.busy || !caConfirmed} onClick={() => action.run(async () => { const r = await confirmTax(); setForm(r.data); setBaseline(JSON.stringify(r.data)); setConfirmed(true); setCaConfirmed(false); }, "Charge tax activated", "Could not activate charge tax")}>Confirm and activate charge tax</button>}
    </form>
  );
}

function TaxRateManager({ canEdit }: { canEdit: boolean }) {
  const rates = useApi(() => listTaxRates(), []);
  const targets = useApi(() => getTaxRateTargets(), []);
  const [targetType, setTargetType] = useState<"product" | "category">("category");
  const [targetId, setTargetId] = useState("");
  const [hsn, setHsn] = useState("");
  const [rate, setRate] = useState("");
  const [effective, setEffective] = useState(new Date().toISOString().slice(0, 10));
  const [confirmFor, setConfirmFor] = useState<string | null>(null);
  const action = useAction();
  const options = targetType === "category" ? targets.data?.categories ?? [] : targets.data?.products ?? [];
  return <section className="panel form tax-rates">
    <h3>Product and category tax rates</h3>
    <p className="muted">Product mappings override category mappings. New rates stay pending until a permitted admin records accountant confirmation. Previous versions remain available for order history.</p>
    {rates.error && <div className="status status-error">{rates.error}</div>}
    {targets.error && <div className="status status-error">{targets.error}</div>}
    {rates.data?.map((item) => <div className="tax-rate-row" key={item.id}>
      <span>{item.product_name ? `Product: ${item.product_name}` : `Category: ${item.category_name ?? item.category_id}`}</span>
      <span>HSN {item.hsn_code} · {item.gst_rate}% · from {item.effective_from}</span>
      <Badge value={item.status} />
      {item.approved_at && <span className="muted">Confirmed {formatDate(item.approved_at)} · Admin {item.approved_by_id ?? "unknown"}</span>}
      {canEdit && item.status === "PENDING" && <><label className="check"><input type="checkbox" checked={confirmFor === item.id} onChange={(e) => setConfirmFor(e.target.checked ? item.id : null)} /> Accountant confirmed</label><button type="button" disabled={action.busy || confirmFor !== item.id} onClick={() => action.run(async () => { await approveTaxRate(item.id); setConfirmFor(null); rates.reload(); }, "Rate activated", "Could not activate rate")}>Approve rate</button></>}
    </div>)}
    {canEdit && <form className="form-grid tax-rate-form" onSubmit={(e) => { e.preventDefault(); if (!targetId || !/^\d{4}(\d{2}){0,2}$/.test(hsn) || !(Number(rate) >= 0 && Number(rate) <= 100) || !effective) return; action.run(async () => { await createTaxRate({ [targetType === "product" ? "product_id" : "category_id"]: targetId, hsn_code: hsn, gst_rate: rate, effective_from: effective }); setHsn(""); setRate(""); setTargetId(""); rates.reload(); }, "Rate saved pending confirmation", "Could not save rate"); }}>
      <Field label="Applies to"><select value={targetType} onChange={(e) => { setTargetType(e.target.value as "product" | "category"); setTargetId(""); }}><option value="category">Category</option><option value="product">Product</option></select></Field>
      <Field label={targetType === "category" ? "Category" : "Product"}><select value={targetId} onChange={(e) => setTargetId(e.target.value)} required><option value="">Select…</option>{options.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></Field>
      <Field label="HSN code"><input value={hsn} onChange={(e) => setHsn(e.target.value)} inputMode="numeric" required /></Field>
      <Field label="GST rate %"><input type="number" min="0" max="100" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} required /></Field>
      <Field label="Effective from"><input type="date" value={effective} onChange={(e) => setEffective(e.target.value)} required /></Field>
      <button className="primary" disabled={action.busy || !targetId}>Save pending rate</button>
    </form>}
    <StatusMessage status={action.status} />
  </section>;
}

export default TaxSection;
