'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { useEffect, useRef, useState, useTransition } from 'react';

import { signInWithWidgetToken } from '@/lib/auth/actions';

import styles from './Auth.module.css';

const DEFAULT_OTP_LENGTH = 6;
const RESEND_SECONDS = 60;
const COUNTRY_CODE = '91';

const WIDGET_ID = process.env.NEXT_PUBLIC_MSG91_WIDGET_ID;
const TOKEN_AUTH = process.env.NEXT_PUBLIC_MSG91_TOKEN_AUTH;

/**
 * MSG91's widget, driven from our own markup.
 *
 * `exposeMethods` tells it not to render any UI of its own and to hang these
 * three helpers off `window` instead, which is what lets the code below keep
 * the storefront's styling while MSG91 owns the SMS.
 */
declare global {
  interface Window {
    initSendOTP?: (config: Record<string, unknown>) => void;
    sendOtp?: (
      identifier: string,
      success: (data: unknown) => void,
      failure: (error: unknown) => void,
    ) => void;
    verifyOtp?: (
      otp: string,
      success: (data: unknown) => void,
      failure: (error: unknown) => void,
    ) => void;
    getWidgetData?: () => { otpLength?: number } | undefined;
    retryOtp?: (
      channel: string | null,
      success: (data: unknown) => void,
      failure: (error: unknown) => void,
    ) => void;
  }
}

/** MSG91 returns the token on `message`, and errors in a few shapes. */
function readToken(data: unknown): string {
  if (typeof data === 'string') return data;
  if (data && typeof data === 'object' && 'message' in data) {
    const message = (data as { message: unknown }).message;
    if (typeof message === 'string') return message;
  }
  return '';
}

function readError(error: unknown, fallback: string): string {
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as { message: unknown }).message;
    if (typeof message === 'string') return message;
  }
  return fallback;
}

/**
 * The storefront's single customer entry point.
 *
 * Sign-in and registration are one flow: the backend creates an account for
 * any verified number that does not have one, so asking someone whether they
 * are new would be a question with no consequence.
 *
 * Both steps live on this page because the widget's state is client-side --
 * navigating to a separate verify route would throw away the pending code.
 */
export default function SignIn() {
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/';

  const [phone, setPhone] = useState('');
  const [otpLength, setOtpLength] = useState(DEFAULT_OTP_LENGTH);
  const [otp, setOtp] = useState<string[]>(Array(DEFAULT_OTP_LENGTH).fill(''));
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [seconds, setSeconds] = useState(0);
  const [widgetReady, setWidgetReady] = useState(false);
  const [, startTransition] = useTransition();

  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const configured = Boolean(WIDGET_ID && TOKEN_AUTH);
  const code = otp.join('');

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setTimeout(() => setSeconds(s => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  useEffect(() => {
    if (step === 'code') inputsRef.current[0]?.focus();
  }, [step]);

  const startWidget = () => {
    if (!window.initSendOTP || !configured || window.sendOtp) return;

    window.initSendOTP({
      widgetId: WIDGET_ID,
      tokenAuth: TOKEN_AUTH,
      // No UI of MSG91's own -- it hands us sendOtp/verifyOtp/retryOtp on
      // `window` and we drive them from the storefront's own markup.
      exposeMethods: true,
      /*
       * Required. The provider throws "success callback function missing!"
       * without it, and because it defers that check into a setTimeout the
       * throw is asynchronous -- so the widget silently never mounts and
       * the exposed methods never appear. Verification results reach us
       * through the per-call callbacks below, so these two are only here to
       * satisfy the check.
       */
      success: () => undefined,
      failure: () => undefined,
    });

    /*
     * The methods are attached when the widget's component initialises, a
     * tick or two after this call, so readiness is polled rather than
     * assumed.
     */
    let waited = 0;
    const poll = window.setInterval(() => {
      waited += 100;
      if (window.sendOtp) {
        window.clearInterval(poll);
        setWidgetReady(true);

        /*
         * Code length is a per-widget setting in MSG91 -- this one is set to
         * 4 digits -- so the boxes are built from what the widget reports
         * rather than a local guess. Six inputs against a four-digit code
         * can never satisfy the verify button.
         */
        const configured = Number(window.getWidgetData?.()?.otpLength);
        if (Number.isFinite(configured) && configured >= 4 && configured <= 8) {
          setOtpLength(configured);
          setOtp(Array(configured).fill(''));
        }
      } else if (waited >= 8000) {
        window.clearInterval(poll);
        setError('Could not start sign-in. Reload the page and try again.');
      }
    }, 100);
  };

  const sendCode = (event: React.FormEvent) => {
    event.preventDefault();
    const digits = phone.replace(/\D/g, '');

    if (digits.length !== 10) {
      setError('Enter a 10-digit mobile number.');
      return;
    }
    if (!widgetReady || !window.sendOtp) {
      setError('Sign-in is still loading. Try again in a moment.');
      return;
    }

    setError('');
    setBusy(true);
    window.sendOtp(
      `${COUNTRY_CODE}${digits}`,
      () => {
        setBusy(false);
        setStep('code');
        setSeconds(RESEND_SECONDS);
      },
      err => {
        setBusy(false);
        setError(readError(err, 'Could not send the code. Check the number and try again.'));
      },
    );
  };

  const verify = (event: React.FormEvent) => {
    event.preventDefault();
    if (code.length !== otpLength || !window.verifyOtp) return;

    setError('');
    setBusy(true);
    window.verifyOtp(
      code,
      data => {
        const token = readToken(data);

        if (!token) {
          setBusy(false);
          setError('Verification did not return a token. Try again.');
          return;
        }

        /*
         * Inside a transition so Next applies the action's redirect. On
         * success the action redirects and never resolves with a value, so
         * only an actual `error` is worth showing -- treating "no result" as
         * a failure flashed a false error over a login that had worked.
         */
        startTransition(async () => {
          const result = await signInWithWidgetToken(token, next);
          setBusy(false);
          if (result?.error) {
            setError(result.error);
            setOtp(Array(otpLength).fill(''));
          }
        });
      },
      err => {
        setBusy(false);
        setError(readError(err, 'That code was not right. Try again.'));
      },
    );
  };

  const resend = () => {
    if (!window.retryOtp) return;
    setError('');
    setOtp(Array(otpLength).fill(''));
    setSeconds(RESEND_SECONDS);
    window.retryOtp(
      null,
      () => undefined,
      err => setError(readError(err, 'Could not resend the code.')),
    );
  };

  const updateDigit = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    setOtp(previous => {
      const nextDigits = [...previous];
      nextDigits[index] = value;
      return nextDigits;
    });
    if (value && index < otpLength - 1) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (event.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event: React.ClipboardEvent) => {
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, otpLength);
    if (!pasted) return;
    event.preventDefault();
    const digits = Array(otpLength).fill('');
    pasted.split('').forEach((digit, i) => {
      digits[i] = digit;
    });
    setOtp(digits);
    inputsRef.current[Math.min(pasted.length, otpLength - 1)]?.focus();
  };

  return (
    <div className={styles.page}>
      {configured && (
        <Script
          src="https://verify.msg91.com/otp-provider.js"
          strategy="afterInteractive"
          onReady={startWidget}
        />
      )}

      <div className={styles.card}>
        <div className={styles.imagePanel}>
          <img src="/home/home3.jpg" alt="" />
          <div className={styles.imageCaption}>
            <span className={styles.imageCaptionEyebrow}>Zeen</span>
            <p className={styles.imageCaptionText}>
              Everyday and ethnic wear, cut in considered fabrics.
            </p>
          </div>
        </div>

        <div className={styles.formPanel}>
          <div className={styles.formInner}>
            <Link href="/" className={styles.brand}>
              ZEEN
            </Link>

            {!configured ? (
              <>
                <span className={styles.eyebrow}>Account</span>
                <h1 className={styles.title}>Sign-in is not configured</h1>
                <p className={styles.subtitle}>
                  Customer sign-in runs on MSG91. Set <code>NEXT_PUBLIC_MSG91_WIDGET_ID</code> and{' '}
                  <code>NEXT_PUBLIC_MSG91_TOKEN_AUTH</code> for the storefront, and{' '}
                  <code>MSG91_AUTH_KEY</code> for the API, then reload this page.
                </p>
              </>
            ) : step === 'phone' ? (
              <>
                <span className={styles.eyebrow}>Account</span>
                <h1 className={styles.title}>Continue with your mobile number</h1>
                <p className={styles.subtitle}>
                  We&rsquo;ll text you a code. New here? Your account is created the moment
                  it&rsquo;s verified — there is nothing else to fill in.
                </p>

                <form className={styles.form} onSubmit={sendCode} noValidate>
                  <div>
                    <label className={styles.label} htmlFor="phone">
                      Mobile number
                    </label>
                    <div className={styles.phoneField}>
                      <span className={styles.phonePrefix}>+{COUNTRY_CODE}</span>
                      <input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="10-digit mobile number"
                        inputMode="numeric"
                        autoComplete="tel-national"
                        aria-invalid={error ? true : undefined}
                        className={`${styles.input} ${styles.phoneInput} ${error ? styles.inputError : ''}`}
                      />
                    </div>
                    {error && (
                      <p className={styles.error} role="alert">
                        {error}
                      </p>
                    )}
                  </div>

                  <button type="submit" className={styles.submit} disabled={busy}>
                    {busy ? 'Sending code…' : 'Send code'}
                  </button>
                </form>

                <p className={styles.hint}>
                  By continuing you agree to our <Link href="/faqs-1">Terms</Link> and{' '}
                  <Link href="/faqs-1">Privacy Policy</Link>.
                </p>
              </>
            ) : (
              <>
                <span className={styles.eyebrow}>Verify</span>
                <h1 className={styles.title}>Enter your code</h1>
                <p className={styles.subtitle}>
                  We sent a {otpLength}-digit code to +{COUNTRY_CODE} {phone}.
                </p>

                <form className={styles.form} onSubmit={verify} noValidate>
                  <div
                    className={styles.otpRow}
                    style={{ gridTemplateColumns: `repeat(${otpLength}, 1fr)` }}
                    onPaste={handlePaste}>
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
                        aria-label={`Digit ${index + 1}`}
                        autoComplete={index === 0 ? 'one-time-code' : 'off'}
                        className={`${styles.otpInput} ${error ? styles.otpInputError : ''}`}
                      />
                    ))}
                  </div>

                  {error && (
                    <p className={styles.error} role="alert">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    className={styles.submit}
                    disabled={code.length !== otpLength || busy}>
                    {busy ? 'Verifying…' : 'Verify and continue'}
                  </button>
                </form>

                <div className={styles.resend}>
                  {seconds > 0 ? (
                    <p style={{ margin: 0 }}>
                      Resend code in <span className={styles.resendCount}>{seconds}s</span>
                    </p>
                  ) : (
                    <button type="button" onClick={resend} className={styles.resendButton}>
                      Resend code
                    </button>
                  )}
                </div>

                <p className={styles.hint}>
                  Wrong number?{' '}
                  <button
                    type="button"
                    className={styles.linkButton}
                    onClick={() => {
                      setStep('phone');
                      setOtp(Array(otpLength).fill(''));
                      setError('');
                    }}>
                    Change it
                  </button>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
