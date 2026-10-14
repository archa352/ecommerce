import { useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

export default function SidebarProfile({ onNavigate }: { onNavigate: () => void }) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const name = user?.name ?? user?.email ?? user?.phone ?? "Admin";
  useEffect(() => {
    if (!open) return;
    menu.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus();
    const outside = (event: PointerEvent) => {
      if (!container.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation(); setOpen(false); trigger.current?.focus();
      }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", escape); };
  }, [open]);
  const navigate = () => { setOpen(false); onNavigate(); };
  return <div className="sidebar-profile" ref={container} onBlur={(event) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node)) setOpen(false);
  }}>
    {open && <div id={menuId} className="sidebar-profile-menu" role="menu" aria-label="Account" ref={menu} onKeyDown={(event) => {
      const items = Array.from(menu.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []);
      const index = items.indexOf(document.activeElement as HTMLElement);
      const next = event.key === "ArrowDown" ? (index + 1) % items.length : event.key === "ArrowUp" ? (index + items.length - 1) % items.length : event.key === "Home" ? 0 : event.key === "End" ? items.length - 1 : -1;
      if (next >= 0) { event.preventDefault(); items[next]?.focus(); }
    }}>
      <Link role="menuitem" to="/profile" onClick={navigate}>Profile</Link>
      <Link role="menuitem" to="/settings" onClick={navigate}>Settings</Link>
      <button type="button" role="menuitem" className="sidebar-signout" onClick={() => { navigate(); logout(); }}>Sign out</button>
    </div>}
    <button type="button" className="sidebar-profile-trigger" ref={trigger} aria-haspopup="menu" aria-expanded={open} aria-controls={open ? menuId : undefined} onClick={() => setOpen(!open)} onKeyDown={(event) => {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") { event.preventDefault(); setOpen(true); }
    }}>
      <span className="account-avatar" aria-hidden="true">{name.slice(0, 1).toUpperCase()}</span>
      <span className="account-detail">Signed in as {name}<small>{user?.role}</small></span>
      <span className="profile-chevron" aria-hidden="true">⌃</span>
    </button>
  </div>;
}
