import { useState } from "react";
import type { FormEvent } from "react";
import { createPost, deletePost, getPost, listPosts, updatePost } from "../../../api/cms";
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
import type { BlogPost } from "../../../types/cms";
import { emptyToNull, formatDate } from "../../../utils/formatters";
import MediaPicker from "./MediaPicker";
import { SLUG } from "./PagesTab";
import MarkdownPreview from "../../../components/common/MarkdownPreview";
import ContentRowActions from "./ContentRowActions";
import PublishControls, { LiveState } from "./PublishControls";

function BlogTab() {
  const { can } = useAuth();
  const canEdit = can(P.cmsManage);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const posts = useApi(() => listPosts({ status, page }), [status, page]);
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const action = useAction();

  return (
    <div className="panel">
      <div className="filters">
        <select aria-label="Status" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
          <option value="">All articles</option>
          <option value="DRAFT">Drafts</option>
          <option value="PUBLISHED">Published / scheduled</option>
        </select>
        {canEdit && <button className="primary" onClick={() => setEditingId("new")}>New article</button>}
      </div>
      <StatusMessage status={action.status} />
      <DataTable
        rows={posts.data as unknown as BlogPost[] | null}
        loading={posts.loading}
        error={posts.error}
        empty="No articles yet — click “New article” to write one."
        rowKey={(p) => p.id}
        onRowClick={(p) => setEditingId(p.id)}
        columns={[
          { key: "title", header: "Title" },
          { key: "author_name", header: "Author", render: (p) => p.author_name ?? "-" },
          { key: "tags", header: "Tags", render: (p) => p.tags.join(", ") || "-" },
          { key: "state", header: "State", render: (p) => <LiveState item={p} /> },
          { key: "published_at", header: "Publish date", render: (p) => formatDate(p.published_at) },
          {
            key: "actions",
            header: "",
            render: (p) => (
              <ContentRowActions
                kind="blog"
                row={p}
                path={`/blog/${p.slug}`}
                action={action}
                onEdit={() => setEditingId(p.id)}
                onDelete={() => deletePost(p.id)}
                onChanged={posts.reload}
              />
            ),
          },
        ]}
      />
      <Pagination meta={posts.meta} onPageChange={setPage} />
      {editingId && <PostEditor postId={editingId === "new" ? null : editingId} canEdit={canEdit} onClose={() => { setEditingId(null); posts.reload(); }} onCreated={setEditingId} />}
    </div>
  );
}

function PostEditor({ postId, canEdit, onClose, onCreated }: { postId: string | null; canEdit: boolean; onClose: () => void; onCreated: (id: string) => void }) {
  const loaded = useApi(() => (postId ? getPost(postId) : Promise.resolve({ success: true, message: "", data: null, meta: null })), [postId]);
  const action = useAction();
  const post = loaded.data;
  return (
    <Modal title={post ? `Edit “${post.title}”` : "New article"} onClose={onClose} wide>
      <StatusMessage status={action.status} />
      {loaded.error && <div className="status status-error">{loaded.error}</div>}
      {post && <PublishControls kind="blog" item={post} action={action} onDone={loaded.reload} />}
      {(post || !postId) && (
        <PostForm
          key={post?.updated_at ?? "new"}
          post={post}
          canEdit={canEdit}
          busy={action.busy}
          onSubmit={async (data) => {
            const saved = await action.run(() => (post ? updatePost(post.id, data) : createPost(data)), "Article saved", "Could not save article");
            if (saved && !post) onCreated(saved.data.id);
            else if (saved) loaded.reload();
          }}
        />
      )}
      {post && canEdit && (
        <div className="form-actions" style={{ marginTop: 12 }}>
          <ConfirmButton message="Delete this article permanently?" onConfirm={() => action.run(async () => { await deletePost(post.id); onClose(); }, "Deleted", "Could not delete")}>Delete article</ConfirmButton>
        </div>
      )}
    </Modal>
  );
}

function PostForm({ post, canEdit, busy, onSubmit }: { post: BlogPost | null; canEdit: boolean; busy: boolean; onSubmit: (d: object) => void }) {
  const [f, setF] = useState({
    title: post?.title ?? "",
    slug: post?.slug ?? "",
    excerpt: post?.excerpt ?? "",
    content: post?.content ?? "",
    featured_image_url: post?.featured_image_url ?? "",
    author_name: post?.author_name ?? "",
    category: post?.category ?? "",
    tags: post?.tags.join(", ") ?? "",
    seo_title: post?.seo_title ?? "",
    seo_description: post?.seo_description ?? "",
  });
  const [preview, setPreview] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((prev) => ({ ...prev, [k]: e.target.value }));
  const [uploading, setUploading] = useState(false);
  const titleError = !f.title.trim() ? "Article title is required." : null;
  const slugError = f.slug && !SLUG.test(f.slug) ? "URL slug must use lowercase letters, numbers and single hyphens." : null;
  const imageError = f.featured_image_url && !/^(\/|https?:\/\/)/.test(f.featured_image_url) ? "Featured image must start with / or https://" : null;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setAttempted(true);
    if (titleError || slugError || imageError) return;
    setAttempted(false);
    onSubmit({
      title: f.title.trim(),
      slug: emptyToNull(f.slug),
      excerpt: emptyToNull(f.excerpt),
      content: f.content,
      featured_image_url: emptyToNull(f.featured_image_url),
      author_name: emptyToNull(f.author_name),
      category: emptyToNull(f.category),
      tags: f.tags.split(",").map((t) => t.trim()).filter(Boolean),
      seo_title: emptyToNull(f.seo_title),
      seo_description: emptyToNull(f.seo_description),
    });
  };

  return (
    <form className="form" onSubmit={submit} noValidate style={{ marginTop: 12 }}>
      <fieldset disabled={!canEdit} className="form" style={{ border: 0, padding: 0, margin: 0 }}>
        <div className="form-grid">
          <Field label="Title" required error={attempted ? titleError : null} guidance="Enter the title customers will see for this article." guidanceDismissible><input value={f.title} onChange={set("title")} /></Field>
          <Field label="URL slug" error={attempted ? slugError : null} hint="Blank = made from the title"><input value={f.slug} onChange={set("slug")} /></Field>
          <Field label="Author"><input value={f.author_name} onChange={set("author_name")} /></Field>
          <Field label="Category"><input value={f.category} onChange={set("category")} /></Field>
          <Field label="Tags" hint="Comma separated"><input value={f.tags} onChange={set("tags")} /></Field>
          <MediaPicker label="Featured image" hint="Shown at the top of the article and in the article list" value={f.featured_image_url} onChange={(v) => setF((prev) => ({ ...prev, featured_image_url: v }))} onUploadingChange={setUploading} />
          <Field label="Excerpt" wide><textarea value={f.excerpt} onChange={set("excerpt")} /></Field>
        </div>
        <div className="toolbar">
          <button type="button" className={preview ? "" : "primary"} onClick={() => setPreview(false)}>Write</button>
          <button type="button" className={preview ? "primary" : ""} onClick={() => setPreview(true)}>Preview</button>
        </div>
        {preview ? <MarkdownPreview source={f.content} /> : <Field label="Article text" hint="Tip: ## makes a heading, - starts a bullet, **bold**, [link text](/faq)" wide><textarea value={f.content} onChange={set("content")} rows={16} aria-label="Article text" /></Field>}
        <div className="form-grid">
          <Field label="SEO title"><input value={f.seo_title} onChange={set("seo_title")} /></Field>
          <Field label="SEO description" wide><textarea value={f.seo_description} onChange={set("seo_description")} /></Field>
        </div>
      </fieldset>
      {attempted && (titleError || slugError || imageError) && <div className="status status-error" role="alert">{imageError || "Please complete all required fields before continuing."}</div>}
      {canEdit && <div className="form-actions"><button className="primary" disabled={busy || uploading}>{uploading ? "Waiting for the picture to finish uploading…" : "Save"}</button></div>}
    </form>
  );
}

export default BlogTab;
