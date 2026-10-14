import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { listCategories } from "../../../api/categories";
import { archiveProduct, downloadImportTemplate, importProducts, listProducts } from "../../../api/products";
import { useAuth } from "../../../auth/AuthContext";
import { P } from "../../../auth/permissions";
import Badge from "../../../components/common/Badge";
import ConfirmButton from "../../../components/common/ConfirmButton";
import DataTable from "../../../components/common/DataTable";
import Modal from "../../../components/common/Modal";
import PageHeader from "../../../components/common/PageHeader";
import GuidedControl from "../../../components/admin/GuidedControl";
import Pagination from "../../../components/common/Pagination";
import StatusMessage from "../../../components/common/StatusMessage";
import { useAction } from "../../../hooks/useAction";
import { useAdminRefresh } from "../../../hooks/AdminRefreshContext";
import { useApi } from "../../../hooks/useApi";
import type { PageMeta } from "../../../types/api";
import type { ImportResult, Product } from "../../../types/catalogue";
import ProductImage from "./ProductImage";
import "./products.css";

const PAGE_SIZE = 20;
const FETCH_SIZE = 100;
type ProductLoad = { key: string; rows: Product[] | null; error: string | null };

async function loadProducts(query: object): Promise<Product[]> {
  const first = await listProducts({ ...query, page: 1, page_size: FETCH_SIZE });
  if (!first.meta) throw new Error("Product pagination is unavailable.");
  const pages: Product[][] = [first.data];
  for (let page = 2; page <= first.meta.total_pages; page += 4) {
    const batch = await Promise.all(Array.from(
      { length: Math.min(4, first.meta.total_pages - page + 1) },
      (_, offset) => listProducts({ ...query, page: page + offset, page_size: FETCH_SIZE }),
    ));
    pages.push(...batch.map((result) => result.data));
  }
  const rows = pages.flat();
  if (rows.length !== first.meta.total_items || new Set(rows.map((row) => row.id)).size !== rows.length) {
    throw new Error("Products changed while loading. Refresh to try again.");
  }
  return rows;
}

function ProductSection() {
  const navigate = useNavigate();
  const { can } = useAuth();
  const canManage = can(P.catalogueManage);
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState(params.get("search") ?? "");
  const [importing, setImporting] = useState(false);
  const [lastArchived, setLastArchived] = useState<{ id: string; name: string } | null>(null);
  const categories = useApi(() => listCategories(), []);
  const refresh = useAdminRefresh();
  const [reload, setReload] = useState(0);
  const serverKey = JSON.stringify([params.get("search"), params.get("category_id"), params.get("featured"), params.get("sort") ?? "newest", params.get("status"), refresh?.version ?? 0, reload]);
  const [loaded, setLoaded] = useState<ProductLoad>({ key: "", rows: null, error: null });
  useEffect(() => {
    let active = true;
    const [term, category, featured, sort, status] = JSON.parse(serverKey) as [string | null, string | null, string | null, string, string | null];
    refresh?.begin();
    void loadProducts({ search: term, category_id: category, featured, sort, status }).then((rows) => {
      if (active) setLoaded({ key: serverKey, rows, error: null });
    }).catch((error: Error) => {
      if (active) setLoaded({ key: serverKey, rows: null, error: error.message });
    }).finally(() => refresh?.end());
    return () => { active = false; };
    // serverKey contains the workspace refresh version; begin/end are stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverKey]);
  const loading = loaded.key !== serverKey;
  const records = loading ? null : loaded.rows;
  const selectedStatus = params.get("status") ?? "";
  const filtered = useMemo(() => records?.filter((product) =>
    (!selectedStatus || product.status === selectedStatus)
  ) ?? [], [records, selectedStatus]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const requestedPage = Number(params.get("page") ?? 1);
  const page = Number.isFinite(requestedPage) ? Math.min(Math.max(1, requestedPage), totalPages) : 1;
  const rows = records ? filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE) : null;
  const meta: PageMeta | null = records ? { page, page_size: PAGE_SIZE, total_items: filtered.length, total_pages: totalPages } : null;
  const action = useAction();
  const categoryName = (id: string) => categories.data?.find((c) => c.id === id)?.name ?? "-";
  const clearFilters = () => { setSearch(""); setParams(new URLSearchParams()); };

  const setFilter = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete("page");
    setParams(next);
  };

  return (
    <div className="record-page products-page">
      <PageHeader
        title="Products"
        actions={canManage && (<><button onClick={() => setImporting(true)}>Bulk upload</button><Link className="btn" to="/products/new">New product</Link></>)}
      />
      <StatusMessage status={action.status} />
      {lastArchived && <p className="product-archive-link">Archived {lastArchived.name}. <Link to={`/products/${lastArchived.id}`}>View archived product</Link></p>}
      <form className="filters product-filters" onSubmit={(e: FormEvent) => { e.preventDefault(); setFilter("search", search.trim()); }}>
        <GuidedControl className="guided-control--wide" hint="Find products by name." dismissible><input type="search" placeholder="Search products" value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search products" /></GuidedControl>
        <button>Search</button>
        <GuidedControl hint="Limit results to one product category."><select aria-label="Category" value={params.get("category_id") ?? ""} onChange={(e) => setFilter("category_id", e.target.value)}>
          <option value="">All categories</option>
          {categories.data?.map((c) => <option key={c.id} value={c.id}>{c.parent_id ? `↳ ${c.name}` : c.name}</option>)}
        </select></GuidedControl>
        <select aria-label="Sort" value={params.get("sort") ?? "newest"} onChange={(e) => setFilter("sort", e.target.value)}>
          <option value="newest">Newest</option>
          <option value="name_asc">Name A–Z</option>
          <option value="name_desc">Name Z–A</option>
        </select>
        <GuidedControl hint="Show active, draft or archived products."><select aria-label="Product status" value={params.get("status") ?? ""} onChange={(e) => setFilter("status", e.target.value)}>
          <option value="">All statuses</option><option value="ACTIVE">Active</option><option value="DRAFT">Draft</option><option value="ARCHIVED">Archived</option>
        </select></GuidedControl>
        <GuidedControl hint="Show only products marked as featured."><label className="check"><input type="checkbox" checked={params.get("featured") === "true"} onChange={(e) => setFilter("featured", e.target.checked ? "true" : "")} /> Featured only</label></GuidedControl>
        <button type="button" onClick={clearFilters} disabled={!params.toString() && !search}>Clear Filters</button>
      </form>
      <div className="panel record-table-panel product-table-panel">
        <DataTable
          rows={rows}
          loading={loading}
          error={loading ? null : loaded.error}
          empty={selectedStatus === "ARCHIVED" ? "No archived products match these filters." : "No products found."}
          rowKey={(p) => p.id}
          onRowClick={(p) => navigate(`/products/${p.id}`)}
          columns={[
            { key: "img", header: "", render: (p) => { const img = p.images.find((i) => i.is_primary) ?? p.images[0]; return <ProductImage className="thumb" url={img?.url} />; } },
            { key: "id", header: "Product ID", render: (p) => <span className="product-list-id" title={p.id}>{p.id}</span> },
            { key: "name", header: "Name", render: (p) => <Link to={`/products/${p.id}`} className="product-code" onClick={(event) => event.stopPropagation()}>{p.name}</Link> },
            { key: "category", header: "Category", render: (p) => categoryName(p.category_id) },
            { key: "fabric", header: "Fabric", render: (p) => p.fabric ?? "-" },
            { key: "status", header: "Status", render: (p) => <Badge value={p.status} /> },
            { key: "is_featured", header: "Featured", render: (p) => (p.is_featured ? "Yes" : "") },
            {
              key: "x",
              header: "",
              render: (p) =>
                canManage && p.status !== "ARCHIVED" && (
                  <ConfirmButton message={`Archive ${p.name}? Shoppers will no longer see it.`} disabled={action.busy} onConfirm={() => action.run(async () => { await archiveProduct(p.id); setLastArchived({ id: p.id, name: p.name }); setReload((value) => value + 1); }, "Product archived", "Could not archive")}>Archive</ConfirmButton>
                ),
            },
          ]}
        />
        <Pagination meta={meta} onPageChange={(nextPage) => setParams((prev) => { const n = new URLSearchParams(prev); n.set("page", String(nextPage)); return n; })} />
      </div>
      {importing && <ImportModal onClose={() => setImporting(false)} onImported={() => setReload((value) => value + 1)} />}
    </div>
  );
}

function ImportModal({ onClose, onImported }: { onClose: () => void; onImported: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);
  const action = useAction();

  const run = async (dryRun: boolean) => {
    if (!file) return;
    const response = await action.run(() => importProducts(file, dryRun), null, "Import failed");
    if (!response) return;
    setResult(response.data);
    if (!dryRun && response.data.errors.length === 0) {
      action.setStatus({ type: "success", text: `Imported ${response.data.products} products and ${response.data.variants} variants.` });
      onImported();
    }
  };

  return (
    <Modal title="Bulk product upload" onClose={onClose} wide>
      <div className="form">
        <p className="muted">
          Upload an Excel file (<strong>.xlsx</strong>) or a CSV, one row per variant (size/colour). Rows with the same product name and category become one product.
          Nothing is created unless every row is valid; existing SKUs are never overwritten.
        </p>
        <div className="toolbar">
          <button className="link" onClick={() => action.run(() => downloadImportTemplate("xlsx"), null, "Could not download template")}>Excel template</button>
          <button className="link" onClick={() => action.run(() => downloadImportTemplate("csv"), null, "Could not download template")}>CSV template</button>
        </div>
        <input
          type="file"
          accept=".xlsx,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
          onChange={(e) => {
            const chosen = e.target.files?.[0] ?? null;
            setResult(null);
            if (chosen && !/\.(xlsx|csv)$/i.test(chosen.name)) {
              setFile(null);
              action.setStatus({ type: "error", text: "Choose an Excel .xlsx or a .csv file." });
              return;
            }
            setFile(chosen);
          }}
          aria-label="Product file"
        />
        <StatusMessage status={action.status} />
        {result && (
          <div className="panel">
            <p>{result.rows} rows → {result.products} products, {result.variants} variants {result.dry_run && "(check only, nothing saved)"}</p>
            {result.errors.length > 0 ? (
              <DataTable rows={result.errors} rowKey={(e) => `${e.row}-${e.message}`} columns={[{ key: "row", header: "Row" }, { key: "message", header: "Problem" }]} />
            ) : result.dry_run && <p className="status status-success">All rows are valid.</p>}
          </div>
        )}
        <div className="form-actions">
          <button onClick={() => run(true)} disabled={!file || action.busy}>Check file</button>
          <button className="primary" onClick={() => run(false)} disabled={!file || action.busy || !result || !result.dry_run || result.errors.length > 0}>Import</button>
        </div>
      </div>
    </Modal>
  );
}

export default ProductSection;
