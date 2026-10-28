'use client';

import { useEffect, useRef, useState } from 'react';

import styles from './HomeIntro.module.css';

const SEEN_KEY = 'zeen-intro-seen';
const ACTIVE_CLASS = 'zeen-intro-active';
/** Longest the intro waits for the logo artwork before playing regardless. */
const ART_WAIT_MS = 1500;

/** Resolves once the image can paint (or failed, or took too long). */
function ready(src: string): Promise<void> {
  const img = new window.Image();
  img.src = src;
  if (img.complete) return Promise.resolve();
  const decoded = typeof img.decode === 'function' ? img.decode() : Promise.resolve();
  return Promise.race([
    decoded.catch(() => undefined),
    new Promise<void>(resolve => window.setTimeout(resolve, ART_WAIT_MS)),
  ]);
}

/**
 * Opening title card: the official lockup -- the ZEEN bird over the
 * wordmark -- sweeps in, the wordmark then glides into the header logo slot
 * and the veil lifts onto the hero.
 *
 * Plays once per browser session and never under reduced motion; `onDone`
 * fires either way so the hero can run its own entrance.
 */
export function HomeIntro({ onDone }: { onDone: () => void }) {
  const markRef = useRef<HTMLDivElement>(null);
  const symbolRef = useRef<HTMLSpanElement>(null);
  const wordmarkRef = useRef<HTMLSpanElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const [finished, setFinished] = useState(false);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    const html = document.documentElement;
    const mark = markRef.current;
    const symbol = symbolRef.current;
    const wordmark = wordmarkRef.current;
    const veil = veilRef.current;

    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === '1';
    } catch {
      // Storage can be unavailable (private mode); just play the intro.
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const finish = () => {
      html.classList.remove(ACTIVE_CLASS);
      setFinished(true);
      doneRef.current();
    };

    if (seen || reduced || !mark || !symbol || !wordmark || !veil || typeof mark.animate !== 'function') {
      finish();
      return;
    }

    window.scrollTo(0, 0);
    html.classList.add(ACTIVE_CLASS);

    const ease = 'cubic-bezier(0.22, 1, 0.36, 1)';
    const animations: Animation[] = [];
    let cancelled = false;

    const run = async () => {
      // Don't sweep in a blank frame: wait for the artwork to paint.
      await Promise.all([ready('/images/zeen-symbol.png'), ready('/images/zeen-wordmark.png')]);
      if (cancelled) return;

      // 1. The bird sweeps in on its wing line, then the wordmark opens out
      //    from the centre beneath it. Neither is ever stretched -- the logo
      //    book rules out distorting either mark.
      const show = mark.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, fill: 'forwards' });
      const sweep = symbol.animate(
        [
          { opacity: 0, transform: 'translate(-34%, 22%) rotate(-10deg)', clipPath: 'inset(0 100% 0 0)' },
          { opacity: 1, transform: 'none', clipPath: 'inset(0 0 0 0)' },
        ],
        { duration: 850, easing: ease, fill: 'forwards' },
      );
      const open = wordmark.animate(
        [
          { opacity: 0, transform: 'translateY(10px)', clipPath: 'inset(0 50% 0 50%)' },
          { opacity: 1, transform: 'none', clipPath: 'inset(0 0 0 0)' },
        ],
        { duration: 900, delay: 400, easing: ease, fill: 'forwards' },
      );
      animations.push(show, sweep, open);
      await open.finished;
      if (cancelled) return;

      // 2. The header's stacked logo is already in place: the intro bird
      //    folds away as the wordmark docks into its matching header slot.
      const target = document.querySelector<HTMLElement>('[data-home-logo-wordmark]') ??
        document.querySelector<HTMLElement>('[data-home-logo]');
      const from = wordmark.getBoundingClientRect();
      const to = target?.getBoundingClientRect();
      if (to && to.width > 0 && from.width > 0) {
        const scale = to.width / from.width;
        const dx = to.left + to.width / 2 - (from.left + from.width / 2);
        const dy = to.top + to.height / 2 - (from.top + from.height / 2);
        const fold = symbol.animate(
          [
            { opacity: 1, transform: 'none' },
            { opacity: 0, transform: `translate(${dx}px, ${dy}px) scale(${scale})` },
          ],
          { duration: 600, delay: 150, easing: ease, fill: 'forwards' },
        );
        const dock = wordmark.animate(
          [{ transform: 'none' }, { transform: `translate(${dx}px, ${dy}px) scale(${scale})` }],
          { duration: 900, delay: 150, easing: ease, fill: 'forwards' },
        );
        animations.push(fold, dock);
        await dock.finished;
        if (cancelled) return;
      }

      // 3. Hand over to the real logo and lift the veil onto the hero.
      html.classList.remove(ACTIVE_CLASS);
      doneRef.current();
      const lift = veil.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 700, easing: 'ease-out', fill: 'forwards' });
      const fadeMark = mark.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 500, easing: 'ease-out', fill: 'forwards' });
      animations.push(lift, fadeMark);
      await lift.finished;
      if (cancelled) return;
      // Marked only once it has played through, so an interrupted intro
      // (or React's development double-mount) still plays next time.
      try {
        sessionStorage.setItem(SEEN_KEY, '1');
      } catch {
        // Ignored: the intro simply plays again next time.
      }
      setFinished(true);
    };

    run().catch(() => {
      if (!cancelled) finish();
    });

    return () => {
      cancelled = true;
      animations.forEach(animation => animation.cancel());
      html.classList.remove(ACTIVE_CLASS);
    };
  }, []);

  return (
    <div className={`${styles.intro} ${finished ? styles.introDone : ''}`} aria-hidden="true">
      <div className={styles.introVeil} ref={veilRef} />
      <div className={styles.introMark} ref={markRef}>
        <span ref={symbolRef} className={styles.introSymbol} />
        <span ref={wordmarkRef} className={styles.introWordmark} />
      </div>
    </div>
  );
}
