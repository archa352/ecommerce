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
    const tiles = Array.from(root.querySelectorAll<HTMLElement>('[data-tile]'));
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
  const gridRef = useReveal([products]);

  return (
    <section className={`${styles.tiles} ${styles.editorialWrap}`} aria-label={label}>
      <div className={styles.tileGrid} ref={gridRef}>
        {products.map(({ product, image }, i) => {
          const tag = badge(product);
          return (
            <Link
              key={product.id}
              href={product.slug ? `/products/${encodeURIComponent(product.slug)}` : `/single-product/${product.id}`}
              className={`${styles.tile} ${styles.tileReveal}`}
              data-tile
              style={{ '--col': i % 4 } as CSSProperties}
            >
              <div className={styles.tileMedia}>
                {tag && <span className={styles.tileBadge}>{tag}</span>}
                <Image
                  src={image}
                  alt={product.primary_image?.alt_text ?? product.name}
                  fill
                  sizes="(max-width: 991px) 50vw, 25vw"
                  className={styles.tileImage}
                />
              </div>
              <p className={styles.tileName}>{product.name}</p>
              <p className={styles.tilePrice}>{money(product)}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function CategoryCarousel({ items }: { items: { label: string; href: string; image: string }[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setEdges({
      start: track.scrollLeft <= 2,
      end: track.scrollLeft + track.clientWidth >= track.scrollWidth - 2,
    });
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure, items.length]);

  const step = (direction: 1 | -1) => {
    const track = trackRef.current;
    const card = track?.firstElementChild as HTMLElement | null;
    if (!track || !card) return;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    track.scrollBy({ left: direction * (card.offsetWidth + gap), behavior: 'smooth' });
  };

  return (
    <section className={`${styles.categorySection} ${styles.editorialWrap}`} aria-labelledby="home-categories">
      <div className={styles.categoryHead}>
        <h2 id="home-categories" className={styles.editorialTitle}>
          Categories
        </h2>
        <div className={styles.categoryArrows}>
          <button type="button" className={styles.categoryArrow} onClick={() => step(-1)} disabled={edges.start} aria-label="Previous categories">
            <ArrowLeftIcon size={16} />
          </button>
          <button type="button" className={styles.categoryArrow} onClick={() => step(1)} disabled={edges.end} aria-label="Next categories">
            <ArrowRightIcon size={16} />
          </button>
        </div>
      </div>

      <div className={styles.categoryTrack} ref={trackRef} onScroll={measure}>
        {items.map((item, i) => (
          <Link key={`${item.label}-${i}`} href={item.href} className={styles.categoryCard}>
            <Image src={item.image} alt="" fill sizes="(max-width: 991px) 45vw, 20vw" className={styles.categoryImage} />
            <span className={styles.categoryLabel}>{item.label}</span>
          </Link>
        ))}
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
      <CategoryCarousel items={categoryItems} />

      <section className={`${styles.brandStatement} ${styles.editorialWrap}`} aria-label="About ZEEN">
        <p className={styles.brandStatementText}>
          <span>Where timeless Indian traditions meet</span>{' '}
          <span>
            contemporary elegance, <span className={styles.brandStatementAccent}>ZEEN</span> brings
          </span>{' '}
          <span>you styles that celebrate your individuality</span>{' '}
          <span>and make every moment beautiful.</span>
        </p>
      </section>

      <CampaignSplit />

      {edit.length > 0 && <ProductTiles products={edit} label="More from the collection" />}
    </div>
  );
}
