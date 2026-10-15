import { apiRequest } from '@/lib/api/client';
import type { Tenant, TokenPair, UserProfile } from '@/types/auth';

export const authApi = {
  /**
   * Exchange an MSG91 widget token for a session.
   *
   * The storefront's only customer sign-in, and registration too: a verified
   * number with no account gets one created here.
   *
   * No phone is sent. MSG91 owns the code -- sending, resending, expiry and
   * attempt limits all sit with the widget -- and the server reads the
   * number from its confirmation of this token, so the browser cannot assert
   * an identity of its choosing.
   */
  widgetLogin(accessToken: string): Promise<TokenPair> {
    return apiRequest<TokenPair>('/auth/widget/login', {
      method: 'POST',
      body: { access_token: accessToken },
      cache: 'no-store',
    });
  },

  /** Admins and staff authenticate with a password, not a code. */
  adminLogin(identifier: string, password: string): Promise<TokenPair> {
    return apiRequest<TokenPair>('/admin/auth/login', {
      method: 'POST',
      body: { identifier, password },
      cache: 'no-store',
    });
  },

  staffLogin(identifier: string, password: string): Promise<TokenPair> {
    return apiRequest<TokenPair>('/staff/auth/login', {
      method: 'POST',
      body: { identifier, password },
      cache: 'no-store',
    });
  },

  /** Rotate a refresh token. Reusing a revoked one revokes every session. */
  refresh(refreshToken: string): Promise<TokenPair> {
    return apiRequest<TokenPair>('/auth/refresh', {
      method: 'POST',
      body: { refresh_token: refreshToken },
      cache: 'no-store',
    });
  },

  logout(refreshToken: string): Promise<null> {
    return apiRequest<null>('/auth/logout', {
      method: 'POST',
      body: { refresh_token: refreshToken },
      cache: 'no-store',
    });
  },

  me(token: string): Promise<UserProfile> {
    return apiRequest<UserProfile>('/auth/me', { token, cache: 'no-store' });
  },

  /** Erase the account. Past orders survive, stripped of the person. */
  deleteAccount(token: string): Promise<null> {
    return apiRequest<null>('/auth/me', { method: 'DELETE', token, cache: 'no-store' });
  },

  listTenants(): Promise<Tenant[]> {
    return apiRequest<Tenant[]>('/auth/tenants', { cache: 'no-store' });
  },
};
