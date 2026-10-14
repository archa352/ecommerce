import { useState } from "react";
import type { FormEvent } from "react";
import { createPage, deletePage, getPage, listPages, updatePage } from "../../../api/cms";
import { useAuth } from "../../../auth/AuthContext";
import { P } from "../../../auth/permissions";
import ConfirmButton from "../../../components/common/ConfirmButton";
import DataTable from "../../../components/common/DataTable";
import Field from "../../../components/common/Field";
import Modal from "../../../components/common/Modal";
import Pagination from "../../../components/common/Pagination";
import StatusMessage from "../../../components/common/StatusMessage";
import { useAction } from "../../../hooks/useAction";
import { useApi } from "../../../hooks/useApi";
import type { CmsPage, PageType } from "../../../types/cms";
import { PAGE_TYPES } from "../../../types/cms";
import { emptyToNull, formatDate, label } from "../../../utils/formatters";
import MarkdownPreview from "../../../components/common/MarkdownPreview";
import ContentRowActions from "./ContentRowActions";
import { StorefrontPages } from "./OverviewTab";
import PublishControls, { LiveState } from "./PublishControls";

export const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

function PagesTab() {
  const { can } = useAuth();
  const canEdit = can(P.cmsManage);
  const [page, setPage] = useState(1);
  const pages = useApi(() => listPages({ page }), [page]);
  const action = useAction();
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [previewing, setPreviewing] = useState(false);
  const open = (id: string | "new", preview = false) => {
    setPreviewing(preview);
    setEditingId(id);
  };

  return (
    <>
    <div className="panel">
      <div className="panel-title">
        <p className="muted">Extra pages you write here appear on the website at /pages/… — link them from a menu so customers can find them.</p>
        {canEdit && <button className="primary" onClick={() => open("new")}>New page</button>}
      </div>
      <StatusMessage status={action.status} />
      <DataTable
        rows={pages.data as unknown as CmsPage[] | null}
        loading={pages.loading}
        error={pages.error}
        empty="No pages created in the CMS yet. Your website's existing pages are listed below."
        rowKey={(p) => p.id}
        onRowClick={(p) => open(p.id)}
        columns={[
          { key: "title", header: "Title" },
          { key: "slug", header: "URL", render: (p) => `/pages/${p.slug}` },
          { key: "page_type", header: "Type", render: (p) => label(p.page_type) },
          { key: "state", header: "State", render: (p) => <LiveState item={p} /> },
          { key: "updated_at", header: "Updated", render: (p) => formatDate(p.updated_at) },
          {
            key: "actions",
            header: "Actions",
            render: (p) => (
              <ContentRowActions
                kind="pages"
                row={p}
                path={`/pages/${p.slug}`}
                action={action}
                onEdit={() => open(p.id)}
                onPreview={() => open(p.id, true)}
                onDelete={() => deletePage(p.id)}
                onChanged={pages.reload}
              />
            ),
          },
        ]}
      />
      <Pagination meta={pages.meta} onPageChange={setPage} />
      {editingId && (
        <PageEditor
          pageId={editingId === "new" ? null : editingId}
          canEdit={canEdit}
          startInPreview={previewing}
          onClose={() => { setEditingId(null); pages.reload(); }}
          onCreated={(id) => setEditingId(id)}
        />
      )}
    </div>
    <StorefrontPages />
    </>
  );
}

function PageEditor({ pageId, canEdit, startInPreview, onClose, onCreated }: { pageId: string | null; canEdit: boolean; startInPreview: boolean; onClose: () => void; onCreated: (id: string) => void }) {
  const loaded = useApi(() => (pageId ? getPage(pageId) : Promise.resolve({ success: true, message: "", data: null, meta: null })), [pageId]);
  const action = useAction();
  const page = loaded.data;
  return (
    <Modal title={page ? `Edit “${page.title}”` : "New page"} onClose={onClose} wide>
      <StatusMessage status={action.status} />
      {loaded.error && <div className="status status-error">{loaded.error}</div>}
      {page && <PublishControls kind="pages" item={page} action={action} onDone={loaded.reload} />}
      {(page || !pageId) && (
        <PageForm
          // Keyed by id, not by save time: publishing reloads the page and must not
          // wipe changes typed but not saved yet.
          key={page?.id ?? "new"}
          page={page}
          canEdit={canEdit}
          startInPreview={startInPreview}
          busy={action.busy}
          onSubmit={async (data) => {
            const saved = await action.run(() => (page ? updatePage(page.id, data) : createPage(data)), "Page saved", "Could not save page");
            if (saved && !page) onCreated(saved.data.id);
            else if (saved) loaded.reload();
          }}
        />
      )}
      {page && canEdit && (
        <div className="form-actions" style={{ marginTop: 12 }}>
          <ConfirmButton message="Delete this page permanently?" onConfirm={() => action.run(async () => { await deletePage(page.id); onClose(); }, "Page deleted", "Could not delete page")}>Delete page</ConfirmButton>
        </div>
      )}
    </Modal>
  );
}

function PageForm({ page, canEdit, startInPreview, busy, onSubmit }: { page: CmsPage | null; canEdit: boolean; startInPreview: boolean; busy: boolean; onSubmit: (d: object) => void }) {
  const [title, setTitle] = useState(page?.title ?? "");
  const [slug, setSlug] = useState(page?.slug ?? "");
  const [type, setType] = useState<PageType>(page?.page_type ?? "CUSTOM");
  const [body, setBody] = useState(page?.body ?? "");
  const [seoTitle, setSeoTitle] = useState(page?.seo_title ?? "");
  const [seoDescription, setSeoDescription] = useState(page?.seo_description ?? "");
  const [preview, setPreview] = useState(startInPreview);
  const [attempted, setAttempted] = useState(false);
  const titleError = !title.trim() ? "Page title is required." : null;
  const slugError = slug && !SLUG.test(slug) ? "URL slug must use lowercase letters, numbers and single hyphens." : null;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setAttempted(true);
    if (titleError || slugError) return;
    setAttempted(false);
    onSubmit({ title: title.trim(), slug: emptyToNull(slug), page_type: type, body, seo_title: emptyToNull(seoTitle), seo_description: emptyToNull(seoDescription) });
  };

  return (
    <form className="form" onSubmit={submit} noValidate style={{ marginTop: 12 }}>
      <fieldset disabled={!canEdit} style={{ border: 0, padding: 0, margin: 0 }} className="form">
        <div className="form-grid">
          <Field label="Title" required error={attempted ? titleError : null} guidance="Enter the heading customers will see on this page." guidanceDismissible><input value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
          <Field label="URL slug" error={attempted ? slugError : null} hint="Blank = made from the title"><input value={slug} onChange={(e) => setSlug(e.target.value)} /></Field>
          <Field label="Page type">
            <select value={type} onChange={(e) => setType(e.target.value as PageType)}>
              {PAGE_TYPES.map((t) => <option key={t} value={t}>{label(t)}</option>)}
            </select>
          </Field>
        </div>
        <div className="toolbar">
          <button type="button" className={preview ? "" : "primary"} onClick={() => setPreview(false)}>Write</button>
          <button type="button" className={preview ? "primary" : ""} onClick={() => setPreview(true)}>Preview</button>
        </div>
        {preview ? <MarkdownPreview source={body} /> : <Field label="Page text" hint="Tip: ## makes a heading, - starts a bullet, **bold**, [link text](/faq)" wide><textarea value={body} onChange={(e) => setBody(e.target.value)} rows={14} aria-label="Page text" /></Field>}
        <div className="form-grid">
          <Field label="SEO title"><input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} /></Field>
          <Field label="SEO description" wide><textarea value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} /></Field>
        </div>
      </fieldset>
      {attempted && (titleError || slugError) && <div className="status status-error" role="alert">Please complete all required fields before continuing.</div>}
      {canEdit && <div className="form-actions"><button className="primary" disabled={busy}>{page?.status === "PUBLISHED" ? "Save — updates the website" : "Save draft"}</button></div>}
    </form>
  );
}

export default PagesTab;
