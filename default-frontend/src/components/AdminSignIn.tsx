'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useActionState } from 'react';

import { passwordLogin } from '@/lib/auth/actions';
import { initialAuthState } from '@/lib/auth/form-state';

/**
 * Sign in an admin or staff member.
 *
 * Unlike shoppers, staff authenticate with a password against
 * /admin/auth/login. The action puts the returned pair in the same httpOnly
 * cookies the storefront uses, so one session covers both.
 */
export default function AdminSignIn() {
  const [state, formAction, pending] = useActionState(passwordLogin, initialAuthState);

  return (
    <div className="login-page-wrapper">
      <div className="login-page-card">
        <div className="login-page-grid">
          {/* ================= LEFT IMAGE ================= */}

          <div className="login-page-image-panel">
            <Image
              src="/assets/cloth-0.webp"
              alt="Portrait against a light neutral backdrop"
              width={500}
              height={500}
              className="login-page-image"
              priority
            />
          </div>

          {/* ================= RIGHT FORM ================= */}

          <div className="login-page-form-panel">
            <div className="login-page-form-inner">
              <h1 className="login-page-heading">Sign in</h1>

              {/* ================= LOGIN FORM ================= */}

              <form className="login-page-fields" action={formAction} noValidate>
                {/* Email or phone */}

                <div>
                  <input
                    type="text"
                    name="identifier"
                    placeholder="Enter your email"
                    maxLength={60}
                    autoComplete="username"
                    className="login-page-input"
                  />

                  {state.fieldErrors?.identifier && (
                    <p className="login-page-error">{state.fieldErrors.identifier}</p>
                  )}
                </div>

                {/* Password */}

                <div>
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    maxLength={128}
                    autoComplete="current-password"
                    className="login-page-input"
                  />

                  {state.fieldErrors?.password && (
                    <p className="login-page-error">{state.fieldErrors.password}</p>
                  )}
                </div>

                {state.error && <p className="login-page-error">{state.error}</p>}

                <button type="submit" className="login-page-submit-button" disabled={pending}>
                  {pending ? 'Signing in...' : 'Sign in'}
                </button>
              </form>

              {/* ================= DIVIDER ================= */}

              {/* ================= GOOGLE ================= */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========================= Google Icon ========================= */

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1v-.01z"
      />

      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A10.99 10.99 0 0 0 12 23z"
      />

      <path
        fill="#FBBC05"
        d="M5.84 14.09A6.6 6.6 0 0 1 5.5 12c0-.73.12-1.43.34-2.09V7.07H2.18A10.99 10.99 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z"
      />

      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1a10.99 10.99 0 0 0-9.82 6.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}
