'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

import styles from './CampaignSplit.module.css';

/** Two pairs of editorial frames; the second pair wipes up over the first. */
const SPLIT_PANELS = [
  { first: '/home/home1.jpg', second: '/home/home5.jpg', caption: 'The festive edit' },
  { first: '/home/3.jpg', second: '/home/home6.jpg', caption: 'Woven for moments' },
];

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const range = (progress: number, from: number, to: number) => clamp((progress - from) / (to - from));
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * Pinned two-up campaign. While the stage is pinned, scroll first pulls the
 * frames out to full bleed, then wipes the second pair up over the first --
 * the right frame leading, the left following.
 */
export function CampaignSplit() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;
    const panels = Array.from(stage.querySelectorAll<HTMLElement>('[data-panel]'));

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      stage.style.setProperty('--inset', '0');
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const progress = travel > 0 ? clamp(-rect.top / travel) : 0;
      // The approach (top edge travelling the last viewport) collapses the inset.
      const approach = clamp(1 - rect.top / window.innerHeight);
      stage.style.setProperty('--inset', String(1 - easeInOut(approach)));
      const wipes = [range(progress, 0.42, 0.78), range(progress, 0.22, 0.58)];
      panels.forEach((panel, i) => panel.style.setProperty('--wipe', String(1 - easeInOut(wipes[i]))));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <section className={styles.split} ref={sectionRef} aria-label="ZEEN campaign">
      <div className={styles.splitStage} ref={stageRef}>
        {SPLIT_PANELS.map(panel => (
          <Link
            key={panel.caption}
            href="/products"
            className={styles.splitPanel}
            data-panel
            aria-label={`${panel.caption} — shop the collection`}
          >
            <span className={styles.splitLayer}>
              <Image src={panel.first} alt="" fill sizes="(max-width: 720px) 100vw, 50vw" className={styles.splitImage} />
            </span>
            <span className={styles.splitLayer}>
              <Image src={panel.second} alt="" fill sizes="(max-width: 720px) 100vw, 50vw" className={styles.splitImage} />
            </span>
            <span className={styles.splitCaption}>{panel.caption}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
