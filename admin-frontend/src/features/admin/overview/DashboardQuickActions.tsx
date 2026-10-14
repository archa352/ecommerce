import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { listCategories } from "../../../api/categories";
import { createCoupon } from "../../../api/coupons";
import { useAuth } from "../../../auth/AuthContext";
import { P } from "../../../auth/permissions";
import Modal from "../../../components/common/Modal";
import StatusMessage from "../../../components/common/StatusMessage";
import { useAction } from "../../../hooks/useAction";
import { useApi } from "../../../hooks/useApi";
import CouponForm from "../coupons/CouponForm";
import HomeSectionsTab from "../cms/HomeSectionsTab";

export default function DashboardQuickActions() {
  const { can } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!menuOpen) return;
    container.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus();
    const outside = (event: PointerEvent) => { if (!container.current?.contains(event.target as Node)) setMenuOpen(false); };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") { event.stopPropagation(); setMenuOpen(false); trigger.current?.focus(); } };
    document.addEventListener("pointerdown", outside); document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", escape); };
  }, [menuOpen]);
  const [open, setOpen] = useState<"coupon" | "homepage" | null>(null);
  return <div className="header-quick-actions" ref={container} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setMenuOpen(false); }}>
    <button type="button" ref={trigger} className="header-icon-button" aria-label="Quick Actions" title="Quick Actions" aria-haspopup="menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="m13 2-9 12h7l-1 8 10-12h-7l1-8z" /></svg>
    </button>
    {menuOpen && <div className="header-quick-menu" role="menu" aria-label="Quick actions" onKeyDown={(event) => {
      const items = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('[role="menuitem"]'));
      const index = items.indexOf(document.activeElement as HTMLElement);
      const next = event.key === "ArrowDown" ? (index + 1) % items.length : event.key === "ArrowUp" ? (index + items.length - 1) % items.length : event.key === "Home" ? 0 : event.key === "End" ? items.length - 1 : -1;
      if (next >= 0) { event.preventDefault(); items[next]?.focus(); }
    }}>
      {can(P.catalogueManage) && <Link role="menuitem" to="/products/new" onClick={() => setMenuOpen(false)}>Add Product</Link>}
      {can(P.couponsManage) && <button role="menuitem" onClick={() => { setMenuOpen(false); setOpen("coupon"); }}>Create Coupon</button>}
      {can(P.ordersView) && <Link role="menuitem" to="/orders" onClick={() => setMenuOpen(false)}>View Orders</Link>}
      {can(P.catalogueView) && <Link role="menuitem" to="/inventory" onClick={() => setMenuOpen(false)}>Manage Inventory</Link>}
      {can(P.cmsView) && <button role="menuitem" onClick={() => { setMenuOpen(false); setOpen("homepage"); }}>Manage Homepage</button>}
      {can(P.reports) && <Link role="menuitem" to="/reports" onClick={() => setMenuOpen(false)}>View Reports</Link>}
      {![P.catalogueManage, P.couponsManage, P.ordersView, P.catalogueView, P.cmsView, P.reports].some(can) && <p className="muted">No available actions</p>}
    </div>}
    {open === "coupon" && <NewCoupon onClose={() => setOpen(null)} />}
    {open === "homepage" && <Modal title="Manage Homepage" onClose={() => setOpen(null)} wide><HomeSectionsTab /></Modal>}
  </div>;
}
function NewCoupon({ onClose }: { onClose: () => void }) {
  const categories = useApi(listCategories, []);
  const action = useAction();
  return <Modal title="Create Coupon" onClose={onClose} showCloseButton={false}>
    <StatusMessage status={action.status} />
    {categories.loading && <p role="status">Loading categories…</p>}
    {categories.error && <p role="alert">{categories.error}</p>}
    {categories.data && <CouponForm coupon={null} categories={categories.data} busy={action.busy} onCancel={onClose} onSubmit={(payload) => {
      void action.run(async () => { await createCoupon(payload); onClose(); }, null, "Could not create coupon");
    }} />}
  </Modal>;
}
