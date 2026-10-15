'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useActionState, useEffect, useRef, useState } from 'react';

import { requestOtp, verifyOtp } from '@/lib/auth/actions';
import { initialAuthState } from '@/lib/auth/form-state';

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

/**
 * Verify the code and start a session.
 *
 * Verification posts to a server action rather than fetching from here: the
 * token pair it returns has to land in httpOnly cookies, which only the
 * server can write. On success the action redirects, so there is no
 * "verified" state to render.
 */
export default function OtpVerification() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const phone = searchParams.get('phone') || '';
  const next = searchParams.get('next') || '/my-account';

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [seconds, setSeconds] = useState<number>(RESEND_SECONDS);

  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const [state, formAction, pending] = useActionState(verifyOtp, initialAuthState);
  const [resendState, resendAction, resending] = useActionState(requestOtp, initialAuthState);

  /*
   * -----------------------------------------
   * OTP COUNTDOWN
   * -----------------------------------------
   */

  useEffect(() => {
    if (!phone) {
      router.push('/signin');
    }
  }, [phone, router]);

  useEffect(() => {
    if (seconds <= 0) return;

    const timer = setTimeout(() => {
      setSeconds(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [seconds]);

  /*
   * -----------------------------------------
   * OTP INPUT
   * -----------------------------------------
   */

  const updateDigit = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    setOtp(previous => {
      const next = [...previous];
      next[index] = value;
      return next;
    });

    if (value && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (event.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;

    event.preventDefault();

    const digits = Array(OTP_LENGTH).fill('');
    pasted.split('').forEach((digit, index) => {
      digits[index] = digit;
    });

    setOtp(digits);
    inputsRef.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const code = otp.join('');
  const message = state.fieldErrors?.otp ?? state.error ?? resendState.error;

  /*
   * -----------------------------------------
   * UI
   * -----------------------------------------
   */

  return (
    <div className="otpverification-page">
      <div className="otpverification-container">
        <div className="otpverification-card">
          <h1 className="otpverification-title">Verify your account</h1>

          <p className="otpverification-description">
            Enter the 6-digit OTP sent to {phone || 'your phone number'}.
          </p>

          <form action={formAction}>
            <input type="hidden" name="phone" value={phone} />
            <input type="hidden" name="next" value={next} />
            <input type="hidden" name="otp" value={code} />

            {/* OTP INPUTS */}

            <div className="otpverification-otp-row" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={element => {
                    inputsRef.current[index] = element;
                  }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={e => updateDigit(index, e.target.value)}
                  onKeyDown={e => handleKeyDown(e, index)}
                  className={`otpverification-otp-input${message ? ' otpverification-otp-input-error' : ''}`}
                  autoComplete={index === 0 ? 'one-time-code' : 'off'}
                />
              ))}
            </div>

            {/* ERROR */}

            {message && <p className="otpverification-error-text">{message}</p>}

            {/* VERIFY */}

            <button
              type="submit"
              disabled={code.length !== OTP_LENGTH || pending}
              className="otpverification-verify-button">
              {pending ? 'Verifying...' : 'Verify'}
            </button>
          </form>

          {/* RESEND */}

          <div className="otpverification-resend-wrap">
            {seconds > 0 ? (
              <p className="otpverification-resend-text">
                Resend code in <span className="otpverification-resend-count">{seconds}s</span>
              </p>
            ) : (
              <form action={resendAction}>
                <input type="hidden" name="phone" value={phone} />

                <button
                  type="submit"
                  disabled={resending}
                  onClick={() => {
                    setOtp(Array(OTP_LENGTH).fill(''));
                    setSeconds(RESEND_SECONDS);
                  }}
                  className="otpverification-resend-button">
                  {resending ? 'Sending...' : 'Resend code'}
                </button>
              </form>
            )}
          </div>
        </div>

        <p className="otpverification-edit-text">
          Wrong details?{' '}
          <Link href="/signin" className="otpverification-edit-link">
            Go back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
