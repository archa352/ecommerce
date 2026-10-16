import AdminShell from '@/components/admin/AdminShell';
import { authApi } from '@/lib/api/auth';
import { requireStaff } from '@/lib/auth/require-staff';

/** Shown while the tenant's real name is unavailable. */
const FALLBACK_STORE_NAME = 'Store';

/**
 * The name of the store this staff member administers.
 *
 * Cosmetic -- every query is already scoped by the backend from the token --
 * so a failure here costs the name in the sidebar, not the page.
 */
async function storeNameFor(tenantId: string): Promise<string> {
  const tenant = await authApi.currentTenant().catch(() => null);
  return tenant?.id === tenantId ? tenant.name : FALLBACK_STORE_NAME;
}

/**
 * Every /admin route is staff-only and wears the same shell.
 *
 * The gate lives here so no page can forget it; pages call requireStaff()
 * again for their own token, and the backend authorises each call besides.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = await requireStaff();
  const storeName = await storeNameFor(user.tenant_id);

  return (
    <AdminShell user={user} storeName={storeName}>
      {children}
    </AdminShell>
  );
}
