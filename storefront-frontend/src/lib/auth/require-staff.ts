import { redirect } from 'next/navigation';

import { getCurrentUser } from '@/lib/auth/current-user';
import { getAccessToken } from '@/lib/auth/session';
import type { UserProfile } from '@/types/auth';

/**
 * Server-side gate for admin pages.
 *
 * Middleware already refuses these routes, but every page repeats the check
 * so a bypass of that gate still renders nothing. The backend authorises
 * each call again regardless, so this is defence in depth rather than the
 * authority.
 */
export async function requireStaff(): Promise<{ user: UserProfile; token: string }> {
  const [user, token] = await Promise.all([getCurrentUser(), getAccessToken()]);

  if (!user || !token) redirect('/admin-signin');
  if (user.role !== 'ADMIN' && user.role !== 'STAFF') redirect('/');

  return { user, token };
}
