'use client';

import Image from 'next/image';
import { type CSSProperties, useEffect, useState } from 'react';

import { formatMoney } from '@/lib/format';
import { mediaUrl } from '@/lib/media';
import type { StorefrontBannerItem } from '@/types/cms';
import type { Offer } from '@/types/orders';

import styles from './CampaignBanner.module.css';

const FALLBACK_ART = '/home/footer.png';
const FALLBACK_HEADLINE = 'Festive Collection';
const ANNOUNCEMENTS = [
  'The festive edit — embroidered by hand, made for moments',
  'Complimentary shipping across India on every order',
];
const ROTATE_MS = 4500;

function offerCondition(offer: Offer): string {
  if (offer.discount_type === 'BOGO') return `buy ${offer.buy_quantity}, get ${offer.get_quantity}`;
  if (offer.first_order_only) return 'on your first order';
  if (offer.min_order_amount && Number(offer.min_order_amount) > 0) {
    return `over ${formatMoney(offer.min_order_amount, offer.currency).replace(/\.00$/, '')}`;
  }
  if (offer.min_quantity) return `on ${offer.min_quantity}+ items`;
  if (offer.category_ids.length) return 'on selected styles';
  return 'sitewide';
}

function offerFigure(offer: Offer): string {
  const value = Number(offer.discount_value);
  switch (offer.discount_type) {
    case 'PERCENTAGE':
      return `${value}%`;
    case 'FIXED_AMOUNT':
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: offer.currency,
        maximumFractionDigits: 0,
      }).format(value);
    case 'FREE_SHIPPING':
      return 'Free';
    case 'BOGO':
      return value === 100 ? `${offer.buy_quantity}+${offer.get_quantity}` : `${value}%`;
  }
}

function offerUnit(offer: Offer): string {
  return offer.discount_type === 'FREE_SHIPPING' ? 'shipping' : 'off';
}

function announcement(offer: Offer): string {
  return `${offerFigure(offer)} ${offerUnit(offer)} ${offerCondition(offer)}${offer.code ? ` — use code ${offer.code}` : ''}`;
}

/** The headline with each letter wrapped so it can fade in on its own beat. */
function Letters({ text }: { text: string }) {
  let index = 0;
  const words = text.split(' ');
  return (
    <>
      {words.map((word, w) => (
        <span key={w} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
          {Array.from(word).map(char => {
            const i = index++;
            return (
              <span key={i} className={styles.heroLetter} style={{ '--i': i } as CSSProperties}>
                {char}
              </span>
            );
          })}
          {w < words.length - 1 && ' '}
        </span>
      ))}
    </>
  );
}

/**
 * Announcement bar and editorial hero.
 *
 * A campaign image from the CMS takes over the frame; otherwise the house
 * lineup shot carries the page with the headline in the clear band above it.
 * Live offers drive both the rotating announcement and the promo corner.
 */
export function CampaignBanner({ offers, hero, entered }: {
  offers: Offer[];
  hero: (StorefrontBannerItem & { title: string | null; subtitle: string | null }) | null;
  entered: boolean;
}) {
  const cmsImage = mediaUrl(hero?.image_url);
  const mobileImageUrl = mediaUrl(hero?.mobile_image_url);
  const headline = hero?.heading ?? hero?.title ?? FALLBACK_HEADLINE;
  const lines = offers.length > 0 ? offers.map(announcement) : ANNOUNCEMENTS;
  const [line, setLine] = useState(0);

  useEffect(() => {
    if (lines.length < 2) return;
    const id = window.setInterval(() => setLine(i => (i + 1) % lines.length), ROTATE_MS);
    return () => window.clearInterval(id);
  }, [lines.length]);

  const promoLink = hero?.link_url ?? '/products';

  return (
    <section className={entered ? styles.entered : undefined} aria-label="ZEEN festive campaign">
      <div className={styles.announce}>
        <div className={styles.announceInner}>
          <p className={styles.announceText} aria-live="polite">
            <span key={line} className={styles.announceRotor}>
              {lines[line % lines.length]}
            </span>
          </p>
        </div>
      </div>

      <div className={styles.hero}>
        <picture className={`${styles.heroArt} ${cmsImage ? styles.heroArtCms : styles.heroArtFallback} ${mobileImageUrl ? styles.heroArtMobile : ''}`}>
          {mobileImageUrl && <source media="(max-width: 720px)" srcSet={mobileImageUrl} />}
          <Image
            src={cmsImage ?? FALLBACK_ART}
            alt={hero?.alt_text ?? 'Six women in embroidered ZEEN kurta sets standing together.'}
            fill
            priority
            sizes="100vw"
            className={styles.heroImage}
            unoptimized={Boolean(cmsImage)}
          />
        </picture>

        <h1 className={`${styles.heroHeadline} ${cmsImage ? styles.heroHeadlineCms : ''}`} aria-label={headline}>
          <span aria-hidden="true">
            <Letters text={headline} />
          </span>
        </h1>

        <a className={styles.heroPromo} href={promoLink} aria-label="Timeless elegance. Limitless style.">
          <span>TIMELESS ELEGANCE.</span>
          <span>LIMITLESS STYLE.</span>
        </a>
      </div>
    </section>
  );
}
