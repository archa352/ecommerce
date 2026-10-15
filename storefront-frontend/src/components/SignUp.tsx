'use client';

import Link from 'next/link';
import { useActionState, useState } from 'react';

import { requestOtp } from '@/lib/auth/actions';
import { initialAuthState } from '@/lib/auth/form-state';

/**
 * Create an account with a phone number.
 *
 * Registration and sign-in are the same call on this backend: a phone with
 * no account gets one on its first successful code verification. There is
 * no customer password, so nothing is collected here beyond the number --
 * a name has no endpoint to be stored against yet.
 */
export default function SignUp() {
  const [agreed, setAgreed] = useState(true);
  const [state, formAction, pending] = useActionState(requestOtp, initialAuthState);

  return (
    <div className="page">
      <div className="card">
        {/* ================= LEFT PANEL ================= */}

        <div className="imageWrap">
          <img src="/assets/cloth-0.webp" alt="Desert dunes at dusk"  className="image" />
        </div>

        {/* ================= RIGHT PANEL ================= */}

        <div className="formWrap">
          <div className="formInner">
            <h1 className="title">Create an account</h1>

            <p className="subtitle">
              Already have an account?{' '}
              <Link href="/signin" className="link">
                Sign In
              </Link>
            </p>

            <form className="form" action={formAction} noValidate>
              {/* ================= PHONE ================= */}

              <div>
                <input
                  maxLength={15}
                  type="tel"
                  name="phone"
                  placeholder="Phone number"
                  className="input"
                  inputMode="numeric"
                  autoComplete="tel"
                />

                {(state.fieldErrors?.phone || state.error) && (
                  <p className="error">{state.fieldErrors?.phone ?? state.error}</p>
                )}
              </div>

              {/* ================= TERMS ================= */}

              <div>
                <label className="checkboxLabel">
                  <button
                    type="button"
                    onClick={() => setAgreed(a => !a)}
                    className={`checkbox ${agreed ? 'checkboxChecked' : ''}`}
                    aria-pressed={agreed}>
                    {agreed && <CheckIcon />}
                  </button>

                  <span className="checkboxText">
                    I agree to the{' '}
                    <a href="#" className="link">
                      Terms &amp; Conditions
                    </a>
                  </span>
                </label>
              </div>

              {/* ================= SUBMIT ================= */}

              <button type="submit" className="submitButton" disabled={!agreed || pending}>
                {pending ? 'Sending code...' : 'Create account'}
              </button>
            </form>

            {/* ================= DIVIDER ================= */}

            <div className="divider">
              <span className="dividerLine" />

              <span className="dividerText">Or register with</span>

              <span className="dividerLine" />
            </div>

            {/* ================= SOCIAL LOGIN ================= */}

            <div className="oauthRow">
              <button className="oauthButton" type="button">
                <GoogleIcon />
                Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================
   Check Icon
========================= */

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* =========================
   Google Icon
========================= */

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
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
