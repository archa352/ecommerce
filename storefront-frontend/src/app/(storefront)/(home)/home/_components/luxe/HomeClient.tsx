'use client';

import Image from 'next/image';
import Link from 'next/link';
import { type CSSProperties, useCallback, useEffect, useRef, useState } from 'react';

import { STOREFRONT_CURRENCY } from '@/lib/currency';
import { formatPriceRange } from '@/lib/format';
import { mediaUrl } from '@/lib/media';
import { categorySlug } from '@/lib/catalogue/slug';
import { collectionPath } from '@/app/(storefront)/(shop)/collections/_components/collectionQuery';
import type { CategoryStorefront, ProductSummaryStorefront } from '@/types/catalogue';
import type { StorefrontBannerItem } from '@/types/cms';
import type { Offer } from '@/types/orders';

import styles from './Home.module.css';
import { CampaignBanner } from './CampaignBanner';
import { CampaignSplit } from './CampaignSplit';
import { HomeIntro } from './HomeIntro';
import { ArrowLeftIcon, ArrowRightIcon } from './Icons';

const CAROUSEL_COPIES = 3;
const CAROUSEL_SPEED = 24; // CSS pixels per second

/** Native scroll remains available to touch, wheel, and assistive technology. */
function useAutoCarousel(direction: 1 | -1, itemCount: number) {
  const trackRef = useRef<HTMLDivElement>(null);
  const loopStart = useRef(0);
  const loopEnd = useRef(0);
  const visible = useRef(false);
  const hovered = useRef(false);
  const interacting = useRef(false);
  const lastInputAt = useRef(0);
  const drag = useRef<{ pointerId: number; x: number; scrollLeft: number; moved: boolean } | null>(null);
  const reduceMotion = useRef(false);
  const suppressClick = useRef(false);

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const originalStart = track.querySelector<HTMLElement>('[data-cycle-start="3"]');
    const followingStart = track.querySelector<HTMLElement>('[data-cycle-start="4"]');
    if (!originalStart || !followingStart) return;
    const width = followingStart.offsetLeft - originalStart.offsetLeft;
    loopStart.current = originalStart.offsetLeft;
    loopEnd.current = loopStart.current + width;
    track.scrollLeft = loopStart.current;
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || itemCount === 0) return;
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    reduceMotion.current = motionQuery.matches;
    let frame = 0;
    let previous = 0;
    const stop = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      previous = 0;
    };
    const tick = (now: number) => {
      if (previous && visible.current && !hovered.current && !interacting.current &&
          !reduceMotion.current && now - lastInputAt.current > 900 && loopEnd.current > loopStart.current) {
        const trackElement = trackRef.current;
        if (trackElement) {
          const delta = Math.min(now - previous, 40) * CAROUSEL_SPEED / 1000;
          trackElement.scrollLeft += direction * delta;
          const cycle = loopEnd.current - loopStart.current;
          if (trackElement.scrollLeft < loopStart.current || trackElement.scrollLeft >= loopEnd.current) {
            const offset = trackElement.scrollLeft - loopStart.current;
            const wrappedOffset = ((offset % cycle) + cycle) % cycle;
            trackElement.scrollLeft = loopStart.current + wrappedOffset;
          }
        }
      }
      previous = now;
      frame = requestAnimationFrame(tick);
    };
    const start = () => {
      if (!frame && visible.current && !reduceMotion.current) frame = requestAnimationFrame(tick);
    };
    const onMotionChange = () => {
      reduceMotion.current = motionQuery.matches;
      if (reduceMotion.current) stop();
      else start();
    };
    motionQuery.addEventListener('change', onMotionChange);
    measure();
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(track);
    const observer = new IntersectionObserver(([entry]) => {
      visible.current = entry.isIntersecting;
      if (visible.current) start();
      else stop();
    }, { threshold: 0.01 });
    observer.observe(track);
    return () => {
      stop();
      observer.disconnect();
      resizeObserver.disconnect();
      motionQuery.removeEventListener('change', onMotionChange);
    };
  }, [direction, itemCount, measure]);

  const interact = useCallback(() => { lastInputAt.current = performance.now(); }, []);
  const step = useCallback((amount: -1 | 1) => {
    const track = trackRef.current;
    const card = track?.querySelector<HTMLElement>('[data-cycle-start="3"]');
    if (!track || !card) return;
    const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 0;
    track.scrollBy({ left: amount * (card.offsetWidth + gap), behavior: 'smooth' });
    interact();
  }, [interact]);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    drag.current = { pointerId: event.pointerId, x: event.clientX, scrollLeft: event.currentTarget.scrollLeft, moved: false };
    interacting.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const current = drag.current;
    if (!current || current.pointerId !== event.pointerId) return;
    const distance = event.clientX - current.x;
    if (Math.abs(distance) > 4) current.moved = true;
    if (current.moved) {
      event.preventDefault();
      event.currentTarget.scrollLeft = current.scrollLeft - distance;
    }
  };
  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current || drag.current.pointerId !== event.pointerId) return;
    suppressClick.current = drag.current.moved;
    drag.current = null;
    interacting.current = false;
    interact();
  };
  const onClickCapture = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!suppressClick.current) return;
    event.preventDefault();
    event.stopPropagation();
    suppressClick.current = false;
  };

  return {
    trackRef, step,
    handlers: {
      onPointerDown, onPointerMove, onPointerUp,
      onPointerCancel: onPointerUp,
      onClickCapture,
      onMouseEnter: () => { hovered.current = true; },
      onMouseLeave: () => { hovered.current = false; interact(); },
      onWheel: interact,
      onTouchStart: () => { interacting.current = true; interact(); },
      onTouchEnd: () => { interacting.current = false; interact(); },
      onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight' || event.key === 'Home' || event.key === 'End') interact();
      },
    },
  };
}

const CATEGORY_FALLBACK = ['Casual Wear', 'Ethnic Wear', 'Cotton', 'Rayon', 'Printed'];

/** Editorial fallbacks for the category strip when the catalogue cannot be read at all. */
const CAMPAIGN_IMAGES = [
  '/home/home1.jpg',
  '/home/home2.jpg',
  '/home/home3.jpg',
  '/home/home4.jpg',
  '/home/home5.jpg',
  '/home/home6.jpg',
];

/**
 * The product's own photograph, or null when it has none worth showing.
 *
 * The dev seed data ships picsum URLs -- landscapes and street scenes that
 * have nothing to do with the garment. Those count as no photograph, so a
 * product is never shown under another product's (or a campaign) image.
 */
function productImage(product: ProductSummaryStorefront): string | null {
  const url = product.primary_image?.url;
  if (!url || url.includes('picsum.photos')) return null;
  return mediaUrl(url) ?? url;
}

function money(product: { price_from: string | null; price_to: string | null }) {
  // Same wording as the collection cards for a product with no priced variant yet.
  return formatPriceRange(product.price_from, product.price_to, STOREFRONT_CURRENCY) || 'Price on request';
}

function badge(product: ProductSummaryStorefront): string | null {
  if (product.is_featured) return 'Best seller';
  if (!product.in_stock) return 'Sold out';
  return null;
}

/** Adds `revealed` to each tile as it enters the viewport (once). */
function useReveal(deps: unknown[]) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const tiles = Array.from(root.querySelectorAll<HTMLElement>('[data-tile]:not([data-clone])'));
    const show = (tile: HTMLElement) => tile.classList.add(styles.tileRevealed);

    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      tiles.forEach(show);
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          show(entry.target as HTMLElement);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    );
    tiles.forEach(tile => observer.observe(tile));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}

function ProductTiles({ products, label }: { products: { product: ProductSummaryStorefront; image: string }[]; label: string }) {
  const { trackRef, step, handlers } = useAutoCarousel(-1, products.length);
  const revealRef = useReveal([products]);

  const cards = (clone: boolean, copy: number) => products.map(({ product, image }, i) => {
    const tag = badge(product);
    return (
      <Link
        key={`${clone ? 'clone-' : ''}${product.id}`}
        href={product.slug ? `/products/${encodeURIComponent(product.slug)}` : `/single-product/${product.id}`}
        className={`${styles.tile} ${clone ? '' : styles.tileReveal}`}
        data-tile
        data-clone={clone ? '' : undefined}
        data-cycle-start={i === 0 ? copy : undefined}
        aria-hidden={clone ? true : undefined}
        inert={clone || undefined}
        style={{ '--col': i % 4 } as CSSProperties}
      >
        <div className={styles.tileMedia}>
          {tag && <span className={styles.tileBadge}>{tag}</span>}
          <Image src={image} alt={product.primary_image?.alt_text ?? product.name} fill sizes="(max-width: 991px) 50vw, 25vw" className={styles.tileImage} />
        </div>
        <p className={styles.tileName}>{product.name}</p>
        <p className={styles.tilePrice}>{money(product)}</p>
      </Link>
    );
  });

  return (
    <section className={`${styles.tiles} ${styles.editorialWrap}`} aria-label={label}>
      <div className={styles.productTilesHead}>
        <h2 className={styles.editorialTitle}>More from the collection</h2>
        <div className={styles.categoryArrows}>
          <button type="button" className={styles.categoryArrow} onClick={() => step(-1)} aria-label="Previous products"><ArrowLeftIcon size={16} /></button>
          <button type="button" className={styles.categoryArrow} onClick={() => step(1)} aria-label="Next products"><ArrowRightIcon size={16} /></button>
        </div>
      </div>
      <div className={styles.tileGrid} ref={node => {
        trackRef.current = node;
        revealRef.current = node;
      }} role="region" aria-label={label} data-product-track {...handlers}>
        {[0, 1, 2].flatMap(copy => cards(true, copy))}
        {cards(false, CAROUSEL_COPIES)}
        {[4, 5, 6].flatMap(copy => cards(true, copy))}
      </div>
    </section>
  );
}

function CategoryCarousel({ items }: { items: { label: string; href: string; image: string }[] }) {
  const { trackRef, step, handlers } = useAutoCarousel(1, items.length);

  return (
    <section className={`${styles.categorySection} ${styles.editorialWrap}`} aria-labelledby="home-categories">
      <div className={styles.categoryHead}>
        <h2 id="home-categories" className={styles.editorialTitle}>
          Categories
        </h2>
        <div className={styles.categoryArrows}>
          <button type="button" className={styles.categoryArrow} onClick={() => step(-1)} aria-label="Previous categories">
            <ArrowLeftIcon size={16} />
          </button>
          <button type="button" className={styles.categoryArrow} onClick={() => step(1)} aria-label="Next categories">
            <ArrowRightIcon size={16} />
          </button>
        </div>
      </div>

      <div className={styles.categoryTrack} ref={trackRef} data-category-track {...handlers}>
        {[0, 1, 2].flatMap(copy => items.map((item, i) => (
          <Link key={`before-${copy}-${item.label}-${i}`} href={item.href} className={styles.categoryCard} data-cycle-start={i === 0 ? String(copy) : undefined} aria-hidden="true" inert>
            <Image src={item.image} alt="" fill sizes="(max-width: 991px) 45vw, 20vw" className={styles.categoryImage} />
            <span className={styles.categoryLabel}>{item.label}</span>
          </Link>
        )))}
        {items.map((item, i) => (
          <Link key={`${item.label}-${i}`} href={item.href} className={styles.categoryCard} data-cycle-start={i === 0 ? String(CAROUSEL_COPIES) : undefined}>
            <Image src={item.image} alt="" fill sizes="(max-width: 991px) 45vw, 20vw" className={styles.categoryImage} />
            <span className={styles.categoryLabel}>{item.label}</span>
          </Link>
        ))}
        {[4, 5, 6].flatMap(copy => items.map((item, i) => (
          <Link key={`after-${copy}-${item.label}-${i}`} href={item.href} className={styles.categoryCard} data-cycle-start={i === 0 ? String(copy) : undefined} aria-hidden="true" inert>
            <Image src={item.image} alt="" fill sizes="(max-width: 991px) 45vw, 20vw" className={styles.categoryImage} />
            <span className={styles.categoryLabel}>{item.label}</span>
          </Link>
        )))}
      </div>
    </section>
  );
}

export default function HomeClient({
  products,
  categories,
  offers,
  hero,
}: {
  products: ProductSummaryStorefront[];
  categories: CategoryStorefront[];
  offers: Offer[];
  hero: (StorefrontBannerItem & { title: string | null; subtitle: string | null }) | null;
}) {
  const [entered, setEntered] = useState(false);
  const onIntroDone = useCallback(() => setEntered(true), []);

  /* Only products with their own photograph are shown, each under that
     photograph and linking to that product. */
  const photographed = products.flatMap(product => {
    const image = productImage(product);
    return image ? [{ product, image }] : [];
  });

  /* Categories carry no image of their own, so each card borrows the photo
     of a product filed under it -- and a category with no photographed
     product is left out rather than shown under an unrelated picture. */
  const categoryImages = new Map<string, string>();
  for (const { product, image } of photographed) {
    if (!categoryImages.has(product.category_id)) categoryImages.set(product.category_id, image);
  }

  const categoryItems = categories.length
    ? categories.flatMap(category => {
        const image = categoryImages.get(category.id);
        return image
          ? [{ label: category.name, href: collectionPath(categorySlug(category.name)), image }]
          : [];
      })
    : CATEGORY_FALLBACK.map((label, i) => ({
        label,
        href: '/products',
        image: CAMPAIGN_IMAGES[(i + 1) % CAMPAIGN_IMAGES.length],
      }));

  const edit = photographed.slice(0, 8);

  return (
    <div className={styles.editorialHome} data-editorial-home>
      <HomeIntro onDone={onIntroDone} />
      <CampaignBanner offers={offers} hero={hero} entered={entered} />

      <section className={`${styles.brandStatement} ${styles.editorialWrap}`} aria-label="About ZEEN">
        <p className={styles.brandStatementText}>
          Where timeless Indian traditions meet contemporary elegance,{' '}
          <span className={styles.brandStatementAccent}>ZEEN</span>{' '}
          brings you styles that celebrate your individuality and make every moment beautiful.
        </p>
      </section>

      <CampaignSplit />

      <CategoryCarousel items={categoryItems} />

      {edit.length > 0 && <ProductTiles products={edit} label="More from the collection" />}
    </div>
  );
}
