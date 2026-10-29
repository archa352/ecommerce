import type { Metadata } from 'next';

import styles from '../Info.module.css';

export const metadata: Metadata = {
  title: 'About | ZEEN',
  description:
    'ZEEN makes everyday and ethnic wear for women — considered fabrics, careful finishing and quiet modern ease.',
};

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <div className={styles.wrap}>
        <p className={styles.kicker}>Our Story</p>
        <h1 className={styles.title}>Quiet clothes, made to be lived in.</h1>
        <p className={styles.lead}>
          ZEEN began with a simple idea: everyday and ethnic wear for women that feels as
          considered as it looks. No noise, no excess — just fabric, cut and finish that earn
          their place in your wardrobe.
        </p>
        <div className={styles.body}>
          <h2 className={styles.sectionTitle}>What we make</h2>
          <p>
            Churidars, kurtas and easy separates, cut in fabrics chosen for how they wear over
            time. Each piece is finished by hand where it matters, so the details hold up long
            after the first wash.
          </p>
          <h2 className={styles.sectionTitle}>How we work</h2>
          <p>
            We keep our edits small and our runs considered. Fewer, better pieces mean less waste
            and more care in every step — from the mill to the studio to your door.
          </p>
          <h2 className={styles.sectionTitle}>Sustainability</h2>
          <p>
            We favour natural fibres, work with partners who share our standards, and design for
            longevity rather than the season. Clothes meant to last are the most sustainable ones
            we can make.
          </p>
        </div>
      </div>
    </div>
  );
}
