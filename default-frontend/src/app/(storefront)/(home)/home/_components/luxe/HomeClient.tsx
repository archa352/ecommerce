'use client';

import Image from 'next/image';
import Link from 'next/link';
import { type CSSProperties, useEffect, useRef, useState } from 'react';

import { STOREFRONT_CURRENCY } from '@/lib/currency';
import { mediaUrl } from '@/lib/media';
import { formatPriceRange } from '@/lib/format';
import type { CategoryStorefront, ProductStorefront, ProductSummaryStorefront } from '@/types/catalogue';

import styles from './Home.module.css';
import {
  ArrowRightIcon,
  BagIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  GiftIcon,
  HandshakeIcon,
  MinusIcon,
  PlusIcon,
  StarIcon,
  TruckIcon,
} from './Icons';

const ALL_FILTER = 'All';

const CATEGORY_FALLBACK = ['Casual Wear', 'Ethnic Wear', 'Cotton', 'Rayon', 'Printed'];
const CATEGORY_IMAGES = [
  '/home/home2.jpg',
  '/home/home3.jpg',
  '/home/home4.jpg',
  '/home/home5.jpg',
  '/home/home6.jpg',
];

const GRID_IMAGES = ['/home/home1.jpg', '/home/home2.jpg', '/home/home3.jpg', '/home/home4.jpg', '/home/home5.jpg'];

/* One slide per outfit. The thumbnail rail, the counter and the main frame
   all read from this, so they cannot drift apart. */
const HERO_SLIDES = [
  { image: '/home/home6.jpg', alt: 'Model in a green embroidered kurta with dupatta and maroon palazzo' },
  { image: '/home/home3.jpg', alt: 'Model in a pink floral kurta and matching palazzo' },
  { image: '/home/home5.jpg', alt: 'Model in a maroon printed kurta with cream block-print palazzo' },
];

const CAMPAIGN_IMAGES = [
  '/home/home1.jpg',
  '/home/home2.jpg',
  '/home/home3.jpg',
  '/home/home4.jpg',
  '/home/home5.jpg',
  '/home/home6.jpg',
];

/**
 * Stand in for the seeded catalogue's placeholder photography.
 *
 * The dev catalogue ships picsum URLs -- landscapes and street scenes that
 * have nothing to do with the collection. Until real product shots are
 * loaded, those fall back to the brand's own campaign images so the page
 * reads as one shoot. Any real catalogue URL passes through untouched, so
 * this stops applying on its own once photography lands.
 */
function campaignImage(url: string | null | undefined, index: number): string {
  if (url && !url.includes('picsum.photos')) return mediaUrl(url);
  return CAMPAIGN_IMAGES[index % CAMPAIGN_IMAGES.length];
}

const SIZE_FALLBACK = ['S', 'M', 'L', 'XL'];
const COLOR_SWATCHES = ['/home/home1.jpg', '/home/home2.jpg', '/home/home3.jpg', '/home/home4.jpg'];

const TESTIMONIALS = [
  {
    quote:
      '“Exactly what I was looking for — soft cotton, a clean fit, and comfortable enough to wear all day at work. It has become my everyday churidar.”',
    name: 'Rosella Milly',
    thumb: '/home/home3.jpg',
  },
  {
    quote:
      '“From the stitching to the finishing at the hem, every detail feels considered. Six washes in and the colour has not faded.”',
    name: 'Amara Whitfield',
    thumb: '/home/home2.jpg',
  },
  {
    quote:
      '“I ordered the wrong size and the exchange was picked up and replaced within days. Rare to see that kind of service from a new label.”',
    name: 'Delphine Cross',
    thumb: '/home/home5.jpg',
  },
];

const COMMITMENTS = [
  {
    icon: GiftIcon,
    title: 'Considered Fabrics',
    text: 'Cotton, rayon and blends chosen for how they wear through the day.',
  },
  {
    icon: TruckIcon,
    title: 'Free Shipping Across India',
    text: 'Complimentary delivery on every order, packed with care.',
  },
  {
    icon: HandshakeIcon,
    title: 'Secure Payment',
    text: 'UPI, cards, net banking, wallets and Cash on Delivery.',
  },
];

function money(product: { price_from: string | null; price_to: string | null } | null | undefined) {
  if (!product) return '';
  return formatPriceRange(product.price_from, product.price_to, STOREFRONT_CURRENCY);
}

export default function HomeClient({
  products,
  categories,
  spotlightProduct,
}: {
  products: ProductSummaryStorefront[];
  categories: CategoryStorefront[];
  spotlightProduct: ProductStorefront | null;
}) {
  // The catalogue drives the option lists, so they are read before the state
  // that has to be seeded from them.
  const sizeOption = spotlightProduct?.options.find(option => /size/i.test(option.name));
  const colorOption = spotlightProduct?.options.find(option => /colou?r/i.test(option.name));
  const sizes = sizeOption?.values.length ? sizeOption.values : SIZE_FALLBACK;

  /* Variants carry no imagery of their own, so each colour borrows one of the
     product's photos and falls back to a stock swatch when there are fewer
     photos than colours. */
  const colors = colorOption?.values.length
    ? colorOption.values.map((value, i) => ({
        value,
        image: campaignImage(spotlightProduct?.images[i]?.url ?? spotlightProduct?.images[0]?.url, i),
      }))
    : COLOR_SWATCHES.map((image, i) => ({ value: `Option ${i + 1}`, image }));

  const filters = [ALL_FILTER, ...categories.slice(0, 3).map(category => category.name)];

  const [heroThumb, setHeroThumb] = useState(0);
  const [activeFilter, setActiveFilter] = useState(ALL_FILTER);
  const [size, setSize] = useState(sizes[0]);
  const [color, setColor] = useState(0);
  const [qty, setQty] = useState(1);
  const [testiIndex, setTestiIndex] = useState(0);
  const pageRef = useRef<HTMLDivElement>(null);

  const heroProduct = products[0];
  const gridProducts = products.slice(0, 5);

  // Filtering happens over the page already fetched, so switching tabs costs
  // no round trip.
  const activeCategory = categories.find(category => category.name === activeFilter);
  const signatureProducts = (
    activeCategory ? products.filter(product => product.category_id === activeCategory.id) : products
  ).slice(0, 4);

  /* The strip is the live taxonomy. Categories carry no image of their own,
     so each tile borrows the primary photo of a product filed under it. */
  const categoryImages = new Map<string, string>();
  for (const product of products) {
    const url = product.primary_image?.url;
    if (url && !categoryImages.has(product.category_id)) categoryImages.set(product.category_id, url);
  }

  const strip = (
    categories.length
      ? categories.slice(0, 5).map(category => ({ label: category.name, id: category.id }))
      : CATEGORY_FALLBACK.map(label => ({ label, id: label }))
  ).map((category, i) => ({
    label: category.label,
    image: campaignImage(categoryImages.get(category.id), i + 1),
  }));

  const spotlightImages = spotlightProduct?.images?.length
    ? spotlightProduct.images.slice(0, 3).map(img => img.url)
    : [];
  const spotlightMainImage = '/home/1.png';
  const spotlightDetail1 = '/home/2.jpg';
  const spotlightDetail2 = '/home/3.jpg';

  const testimonial = TESTIMONIALS[testiIndex];

  /*
   * Scroll reveals run in CSS wherever the browser supports scroll-driven
   * animations. This covers the browsers that do not: it flags the root,
   * which is what switches the hidden state on, then reveals each element
   * once. Nothing here runs -- and nothing is ever hidden -- otherwise.
   */
  useEffect(() => {
    const root = pageRef.current;
    if (!root) return;

    const nativeTimelines =
      typeof CSS !== 'undefined' &&
      typeof CSS.supports === 'function' &&
      CSS.supports('animation-timeline: view()');

    if (nativeTimelines || typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    root.setAttribute('data-js-reveal', '');

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute('data-revealed', '');
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.08 },
    );

    root.querySelectorAll('[data-reveal]').forEach(node => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.page} ref={pageRef}>
      {/* ---------------------------------- Hero ---------------------------------- */}
      <section className={styles.hero}>
        <div className={styles.heroWatermark}>CHURIDARS ZEEN</div>
        <div className={`${styles.container} ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>New Arrival</span>
            <h1 className={styles.heroTitle}>The Art of Everyday Luxury</h1>
            <p className={styles.heroDesc}>
              Discover the new churidar collection, thoughtfully cut in premium fabrics for everyday
              ease.
            </p>
            <Link href={heroProduct ? `/single-product/${heroProduct.id}` : '/shop-list'} className={styles.pill}>
              Explore Collection
              <span className={styles.pillIcon}>
                <ArrowRightIcon size={15} />
              </span>
            </Link>

            <div className={styles.heroSide}>
              <div className={styles.heroThumbRow}>
                {HERO_SLIDES.map((slide, i) => (
                  <button
                    key={slide.image}
                    type="button"
                    className={`${styles.heroThumb} ${i === heroThumb ? styles.active : ''}`}
                    onClick={() => setHeroThumb(i)}
                    aria-label={`Show slide ${i + 1}`}
                    aria-pressed={i === heroThumb}
                  >
                    <img src={slide.image} alt="" />
                  </button>
                ))}
              </div>
              <div className={styles.heroCounter}>
                <button
                  type="button"
                  className={styles.btnCircle}
                  onClick={() => setHeroThumb(v => Math.max(0, v - 1))}
                  disabled={heroThumb === 0}
                  aria-label="Previous"
                >
                  <ChevronLeftIcon size={16} />
                </button>
                <span>
                  {String(heroThumb + 1).padStart(2, '0')}/{String(HERO_SLIDES.length).padStart(2, '0')}
                </span>
                <button
                  type="button"
                  className={styles.btnCircleDark}
                  onClick={() => setHeroThumb(v => Math.min(HERO_SLIDES.length - 1, v + 1))}
                  disabled={heroThumb >= HERO_SLIDES.length - 1}
                  aria-label="Next"
                >
                  <ChevronRightIcon size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------- Signature pieces ---------------------------------- */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHead} data-reveal>
            <div>
              <span className={styles.eyebrow}>Featured</span>
              <h2 className={styles.h2}>Our Signature Pieces</h2>
            </div>
            <div className={styles.filterRow}>
              {filters.map(f => (
                <button
                  key={f}
                  type="button"
                  className={`${styles.filterPill} ${activeFilter === f ? styles.active : ''}`}
                  onClick={() => setActiveFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {signatureProducts.length > 0 ? (
            <div className={styles.productGrid}>
              {signatureProducts.map((product, i) => (
                <Link
                  key={product.id}
                  href={`/single-product/${product.id}`}
                  className={styles.productCard}
                  data-reveal
                  style={{ '--reveal-delay': `${i * 80}ms` } as CSSProperties}
                >
                  <div className={styles.productMedia}>
                    {product.primary_image ? (
                      <Image
                        src={campaignImage(product.primary_image.url, i)}
                        alt={product.primary_image.alt_text ?? product.name}
                        width={480}
                        height={520}
                      />
                    ) : (
                      <div className={styles.productMediaEmpty}>No image yet</div>
                    )}
                  </div>
                  <p className={styles.productName}>{product.name}</p>
                  <p className={styles.productPrice}>{money(product)}</p>
                </Link>
              ))}
            </div>
          ) : (
            <p className={styles.productPrice}>New pieces are on their way — check back soon.</p>
          )}
        </div>
      </section>

      {/* ---------------------------------- Category price grid ---------------------------------- */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHead} data-reveal>
            <div>
              <span className={styles.eyebrow}>Our Collection</span>
              <h2 className={styles.h2}>Shop by Category</h2>
            </div>
          </div>

          <div className={styles.priceCardGrid}>
            <div className={styles.introCard} data-reveal>
              <h3 className={styles.introTitle}>Made to Be Worn Often</h3>
              <p className={styles.introText}>
                Each design reflects our commitment to timeless style, exceptional craftsmanship, and everyday
                functionality.
              </p>
              <Link href="/shop-list" className={styles.pill}>
                Shop Now
                <span className={styles.pillIcon}>
                  <ArrowRightIcon size={15} />
                </span>
              </Link>
            </div>

            {gridProducts.map((product, i) => (
              <Link
                key={product.id}
                href={`/single-product/${product.id}`}
                className={styles.priceCard}
                data-reveal
                style={{ '--reveal-delay': `${(i + 1) * 80}ms` } as CSSProperties}
              >
                <div className={styles.priceMedia}>
                  <img src={campaignImage(product.primary_image?.url, i)} alt={product.name} />
                </div>
                <div className={styles.priceRow}>
                  <span className={styles.priceName}>{product.name}</span>
                  <span className={styles.priceValue}>{money(product)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------- Spotlight ---------------------------------- */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.spotlightHead} data-reveal>
            <span className={styles.eyebrow}>New Collection</span>
            <h2 className={styles.h2}>Designed to Last Beyond Trends</h2>
            <hr className={styles.spotlightRule} />
          </div>

          <div className={styles.spotlightGrid}>
            <div className={styles.spotlightModel} data-reveal="scale">
              <img src={spotlightMainImage} alt={spotlightProduct?.name ?? 'Featured piece'} />
            </div>

            <div className={styles.spotlightDetails} data-reveal>
              <div className={styles.spotlightDetail}>
                <img src={spotlightDetail1} alt="" />
              </div>
              <div className={styles.spotlightDetail}>
                <img src={spotlightDetail2} alt="" />
              </div>
            </div>

            <div className={styles.spotlightInfo} data-reveal>
              <p className={styles.spotlightCategory}>{spotlightProduct?.category.name ?? 'Featured Piece'}</p>
              <h3 className={styles.spotlightTitle}>{spotlightProduct?.name ?? 'The Signature Piece'}</h3>
              <p className={styles.spotlightPrice}>{spotlightProduct ? money(spotlightProduct) : '—'}</p>

              <div className={styles.optionRow}>
                <span className={styles.optionLabel}>Size: {size}</span>
                <span className={styles.sizeGuide}>Size Guide</span>
              </div>
              <div className={styles.sizeRow}>
                {sizes.map(s => (
                  <button
                    key={s}
                    type="button"
                    className={`${styles.sizeBtn} ${size === s ? styles.active : ''}`}
                    onClick={() => setSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className={styles.optionRow}>
                <span className={styles.optionLabel}>Color: {colors[color]?.value ?? '--'}</span>
              </div>
              <div className={styles.colorRow}>
                {colors.map((swatch, i) => (
                  <button
                    key={swatch.value}
                    type="button"
                    className={`${styles.colorSwatch} ${color === i ? styles.active : ''}`}
                    onClick={() => setColor(i)}
                    aria-label={swatch.value}
                  >
                    <img src={swatch.image} alt="" />
                  </button>
                ))}
              </div>

              <div className={styles.buyRow}>
                <div className={styles.qtyStepper}>
                  <button type="button" onClick={() => setQty(v => Math.max(1, v - 1))} aria-label="Decrease quantity">
                    <MinusIcon />
                  </button>
                  <span>{qty}</span>
                  <button type="button" onClick={() => setQty(v => v + 1)} aria-label="Increase quantity">
                    <PlusIcon />
                  </button>
                </div>
                <Link href={spotlightProduct ? `/single-product/${spotlightProduct.id}` : '/shop-list'} className={styles.addToCartBtn}>
                  <BagIcon size={15} />
                  Add to Cart
                </Link>
              </div>
              <Link href={spotlightProduct ? `/single-product/${spotlightProduct.id}` : '/shop-list'} className={styles.buyItNowBtn}>
                Buy It Now
                <ArrowRightIcon size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------- Category strip ---------------------------------- */}
      <section className={styles.sectionTight}>
        <div className={styles.container}>
          <div className={styles.catStrip}>
            {strip.map((cat, i) => (
              <Link
                key={cat.label}
                href="/shop-list"
                className={styles.catCard}
                data-reveal
                style={{ '--reveal-delay': `${i * 70}ms` } as CSSProperties}
              >
                <div className={styles.catImage}>
                  <img src={cat.image} alt={cat.label} />
                </div>
                <span className={styles.catLabel}>{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------- Testimonials ---------------------------------- */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.testiGrid}>
            <div className={styles.testiLeft}>
              <span className={styles.eyebrow}>Testimonial</span>
              <h2 className={`${styles.h2} ${styles.testiHeading}`}>What Our Customers Say</h2>

              <div className={styles.testiTop}>
                <div className={styles.testiSub}>
                  <span>Loved by Women Across India</span>
                  <div className={styles.testiRule} />
                </div>
                <div className={styles.testiArrows}>
                  <button
                    type="button"
                    className={styles.btnCircle}
                    onClick={() => setTestiIndex(v => (v - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeftIcon size={15} />
                  </button>
                  <button
                    type="button"
                    className={styles.btnCircleDark}
                    onClick={() => setTestiIndex(v => (v + 1) % TESTIMONIALS.length)}
                    aria-label="Next testimonial"
                  >
                    <ChevronRightIcon size={15} />
                  </button>
                </div>
              </div>

              <div className={styles.testiCard} data-reveal>
                <div className={styles.testiThumb}>
                  <img src={testimonial.thumb} alt={testimonial.name} />
                </div>
                <div className={styles.stars}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon key={i} size={14} />
                  ))}
                </div>
                <p className={styles.testiQuote}>{testimonial.quote}</p>
                <p className={styles.testiName}>{testimonial.name}</p>
              </div>
            </div>

            <div className={styles.testiHero} data-reveal="scale">
              <img src="/home/home1.jpg" alt="Customer wearing a Zeen printed churidar" />
              <div className={styles.testiBadge}>
                <span className={styles.testiBadgeNum}>15K+</span>
                <span className={styles.testiBadgeText}>
                  Satisfied
                  <br />
                  Customers
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------- Commitment ---------------------------------- */}
      <section className={`${styles.section} ${styles.commitment}`}>
        <div className={styles.container}>
          <div className={styles.commitmentHead} data-reveal>
            <span className={styles.eyebrow}>Our Commitment</span>
            <h2 className={styles.h2}>Luxury Beyond the Product</h2>
          </div>

          <div className={styles.commitGrid}>
            {COMMITMENTS.map((item, i) => (
              <div
                key={item.title}
                className={styles.commitItem}
                data-reveal
                style={{ '--reveal-delay': `${i * 110}ms` } as CSSProperties}
              >
                <div className={styles.commitIcon}>
                  <item.icon />
                </div>
                <h3 className={styles.commitTitle}>{item.title}</h3>
                <p className={styles.commitText}>{item.text}</p>
              </div>
            ))}
          </div>

          <div className={styles.commitStrip}>
            <div className={styles.commitStripImg}>
              <img src="/home/home2.jpg" alt="" />
            </div>
            <div className={styles.commitStripImg}>
              <img src="/home/home4.jpg" alt="" />
            </div>
            <div className={styles.commitStripImg}>
              <img src="/home/home6.jpg" alt="" />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------- CTA ---------------------------------- */}
      <div className={styles.ctaWrap} data-reveal>
        <Link href="/shop-list" className={styles.pill}>
          Shop Now
          <span className={styles.pillIcon}>
            <ArrowRightIcon size={15} />
          </span>
        </Link>
      </div>
    </div>
  );
}
