'use client';

import Image from 'next/image';
import Link from 'next/link';
import { type CSSProperties, useState } from 'react';

import { formatDate, formatMoney } from '@/lib/format';
import type { Offer } from '@/types/orders';

import styles from './CampaignBanner.module.css';

/* The headline figure of an offer, split the way the banner sets it: a big
   number with a short word turned on its side next to it ("40%" + "OFF"). */
function offerFigure(offer: Offer): { figure: string; side: string } {
  const value = Number(offer.discount_value);
  switch (offer.discount_type) {
    case 'PERCENTAGE':
      return { figure: `${value}%`, side: 'off' };
    case 'FIXED_AMOUNT':
      return {
        figure: new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: offer.currency,
          maximumFractionDigits: 0,
        }).format(value),
        side: 'off',
      };
    case 'FREE_SHIPPING':
      return { figure: 'Free', side: 'ship' };
    case 'BOGO':
      return value === 100
        ? { figure: `${offer.buy_quantity}+${offer.get_quantity}`, side: 'free' }
        : { figure: `${value}%`, side: 'off' };
  }
}

/* The small line set above the figure: who or what the offer is for. */
function offerLabel(offer: Offer): string {
  if (offer.discount_type === 'BOGO') return `Buy ${offer.buy_quantity}, get ${offer.get_quantity}`;
  if (offer.first_order_only) return 'First order';
  if (offer.min_order_amount && Number(offer.min_order_amount) > 0) {
    return `Over ${formatMoney(offer.min_order_amount, offer.currency).replace(/\.00$/, '')}`;
  }
  if (offer.min_quantity) return `${offer.min_quantity}+ items`;
  if (offer.category_ids.length) return 'Selected styles';
  return 'Sitewide';
}

function offerTerms(offers: Offer[]): string {
  const endings = offers
    .flatMap(offer => (offer.expires_at ? [`${offerLabel(offer)} ends ${formatDate(offer.expires_at)}`] : []));
  return ['No code needed. The best eligible offer applies automatically at checkout.', ...endings].join(' · ');
}

function Figure({ offer, small = false }: { offer: Offer; small?: boolean }) {
  const { figure, side } = offerFigure(offer);
  return (
    <span className={`${styles.figure} ${small ? styles.figureSmall : ''}`}>
      <span className={styles.figureValue}>{figure}</span>
      <span className={styles.figureSide}>{side}</span>
    </span>
  );
}

/* With no live offers the band still runs, carrying the campaign lines. */
const TICKER_LINES = ['New festive arrivals', 'Made for moments', 'Embroidered by hand'];

function TickerGroup({ offers, duplicate = false }: { offers: Offer[]; duplicate?: boolean }) {
  return (
    <div className={styles.tickerGroup} aria-hidden={duplicate || undefined}>
      {offers.length > 0
        ? offers.map(offer => (
            <span className={styles.tickerOffer} key={offer.code}>
              <span className={styles.tickerLabel}>{offerLabel(offer)}</span>
              <Figure offer={offer} small />
            </span>
          ))
        : TICKER_LINES.map(line => (
            <span className={styles.tickerLabel} key={line}>{line}</span>
          ))}
      <span className={styles.tickerBrand}>The festive edit</span>
    </div>
  );
}

export function CampaignBanner({ offers }: { offers: Offer[] }) {
  const [paused, setPaused] = useState(false);
  const featured = offers.slice(0, 3);

  return (
    <section className={styles.campaign} aria-labelledby="campaign-title">
      <div className={styles.stage}>
        <div className={styles.imageWrap}>
          <Image
            src="/images/banner.png"
            alt="Two friends sharing a moment in embroidered Zeen ethnic wear."
            fill
            className={styles.artworkImage}
            sizes="(max-width: 720px) 100vw, 60vw"
            priority
          />
        </div>

        <div className={styles.content}>
          <div className={styles.titleMark}>
            <svg className={styles.ring} viewBox="0 0 120 120" aria-hidden="true">
              <defs>
                <path id="campaign-ring" d="M60 60 m-44 0 a44 44 0 1 1 88 0 a44 44 0 1 1 -88 0" />
              </defs>
              <text>
                <textPath href="#campaign-ring">Zeen · Made for moments · Zeen · Made for moments ·</textPath>
              </text>
            </svg>
            <h1 id="campaign-title" className={styles.title}>
              Festive<br />edit
            </h1>
          </div>

          {featured.length > 0 ? (
            <ul
              className={styles.offers}
              style={{ '--count': featured.length } as CSSProperties}
              aria-label="Current offers"
            >
              {featured.map(offer => (
                <li key={offer.code} className={styles.offer}>
                  <span className={styles.offerLabel}>{offerLabel(offer)}</span>
                  <Figure offer={offer} />
                  <Link href="/shop-list" className={styles.offerButton}>
                    Shop now
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.intro}>Everyday ease. A little celebration. Discover styles that feel like you.</p>
          )}

          {featured.length > 0 ? (
            <p className={styles.terms}>{offerTerms(featured)}</p>
          ) : (
            <Link href="/shop-list" className={styles.offerButton}>
              Explore the collection
            </Link>
          )}
        </div>

        <div className={styles.ticker} aria-label={offers.length > 0 ? 'Current offers' : 'Campaign highlights'}>
          <div className={`${styles.tickerTrack} ${paused ? styles.paused : ''}`}>
            <TickerGroup offers={offers} />
            <TickerGroup offers={offers} duplicate />
          </div>
          <button
            type="button"
            className={styles.tickerControl}
            onClick={() => setPaused(value => !value)}
            aria-label={paused ? 'Play' : 'Pause'}
            aria-pressed={paused}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              {paused ? <path d="M5 2.5 13 8l-8 5.5Z" /> : <path d="M4 3h3v10H4zm5 0h3v10H9z" />}
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
