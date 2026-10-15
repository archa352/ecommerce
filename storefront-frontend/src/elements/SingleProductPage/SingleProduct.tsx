'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { mediaUrl } from '@/lib/media';
import { STOREFRONT_CURRENCY } from '@/lib/currency';
import { formatMoney, formatPriceRange } from '@/lib/format';
import type { ProductStorefront, ProductSummaryStorefront, VariantStorefront } from '@/types/catalogue';

import homeStyles from '@/app/(storefront)/(home)/home/_components/luxe/Home.module.css';
import listingStyles from '@/app/(storefront)/(shop)/shop-list/_components/luxe/Listing.module.css';
import productStyles from './luxe/Product.module.css';

type Props = {
  product: ProductStorefront;
  rating: number;
  related: ProductSummaryStorefront[];
};

/** Option values the shopper has picked, keyed by option name. */
type Selection = Record<string, string>;

/**
 * Start on the first in-stock variant, falling back to the first of any.
 *
 * Landing on a sold-out combination when a sellable one exists would read
 * as the whole product being unavailable.
 */
function initialSelection(product: ProductStorefront): Selection {
  const variant = product.variants.find(entry => entry.in_stock) ?? product.variants[0];
  return variant ? { ...variant.options } : {};
}

function findVariant(product: ProductStorefront, selection: Selection): VariantStorefront | null {
  const names = product.options.map(option => option.name);

  return (
    product.variants.find(variant => names.every(name => variant.options[name] === selection[name])) ??
    null
  );
}

/**
 * Which of a set of values can be painted as a swatch.
 *
 * Option values are free text on the backend -- "Black" is a CSS colour but
 * "Sand Dune" is not, and a chip with an unpaintable value would render as
 * an invisible blank, so those fall back to showing the name.
 *
 * `CSS.supports` doesn't exist during server rendering, so this starts
 * empty (everything renders as a chip, same on the server and on React's
 * first client pass) and fills in after mount -- checking eagerly there
 * would make the server and the first client render disagree, which React
 * "fixes" by discarding the server markup for that subtree.
 */
const EMPTY_VALUES: string[] = [];

function usePaintableValues(values: string[]): Set<string> {
  const [paintable, setPaintable] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    if (typeof CSS === 'undefined' || !CSS.supports) return;
    setPaintable(new Set(values.filter(value => CSS.supports('color', value.replace(/\s+/g, '')))));
  }, [values]);

  return paintable;
}

const SingleProduct = ({ product, rating, related }: Props) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selection, setSelection] = useState<Selection>(() => initialSelection(product));
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState<string | null>(null);

  const { addToCart, pending } = useCart();
  const { isVariantSaved, toggleVariant, pending: wishlistPending } = useWishlist();

  const variant = useMemo(() => findVariant(product, selection), [product, selection]);
  const saved = variant ? isVariantSaved(variant.id) : false;

  const images = product.images.length > 0 ? product.images : null;
  const stockCount = variant ? variant.available_quantity : 0;
  const price = variant ? variant.price : product.price_from;

  const colorOption = product.options.find(option => option.name.toLowerCase() === 'color');
  const sizeOption = product.options.find(option => option.name.toLowerCase() === 'size');
  const otherOptions = product.options.filter(
    option => option !== colorOption && option !== sizeOption,
  );
  const paintableColors = usePaintableValues(colorOption?.values ?? EMPTY_VALUES);

  function choose(name: string, value: string) {
    setSelection(previous => ({ ...previous, [name]: value }));
    setQuantity(1);
    setMessage(null);
  }

  async function handleAddToCart() {
    if (!variant) {
      setMessage('That combination is not available.');
      return;
    }

    await addToCart(variant.id, quantity);
    setMessage('Added to your cart');
  }

  async function handleToggleWishlist() {
    if (!variant) return;

    const wasSaved = saved;
    const error = await toggleVariant(variant.id);

    setMessage(error ?? (wasSaved ? 'Removed from your wishlist' : 'Saved to your wishlist'));
  }

  return (
    <>
      <div className={productStyles.layout}>
        {/* Gallery */}
        <div className={productStyles.gallery}>
          <div className={productStyles.galleryMain}>
            {images ? (
              <Image
                src={mediaUrl(images[selectedImage].url)}
                alt={images[selectedImage].alt_text ?? product.name}
                fill
                sizes="(max-width: 720px) 100vw, 50vw"
                className={productStyles.galleryMainImg}
                priority
              />
            ) : (
              <div className={productStyles.galleryMainEmpty}>No image yet</div>
            )}
          </div>

          {images && images.length > 1 && (
            <div className={productStyles.thumbRow}>
              {images.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedImage(index)}
                  className={`${productStyles.thumb} ${selectedImage === index ? productStyles.thumbActive : ''}`}
                  aria-label={`Show image ${index + 1}`}
                  aria-current={selectedImage === index}
                >
                  <Image
                    src={mediaUrl(item.url)}
                    alt={item.alt_text ?? product.name}
                    fill
                    sizes="76px"
                    className={productStyles.thumbImg}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className={productStyles.info}>
          <span className={productStyles.category}>{product.category.name}</span>
          <h1 className={productStyles.title}>{product.name}</h1>
          <p className={productStyles.price}>
            {price != null
              ? formatMoney(price, STOREFRONT_CURRENCY)
              : formatPriceRange(product.price_from, product.price_to, STOREFRONT_CURRENCY) || 'Price on request'}
          </p>

          <div className={productStyles.stars}>
            {Array.from({ length: 5 }).map((_, index) => {
              if (index < Math.floor(rating)) return <i key={index} className="fa-solid fa-star filled" />;
              if (index < rating) return <i key={index} className="fa-solid fa-star-half-stroke filled" />;
              return <i key={index} className="fa-regular fa-star" />;
            })}
          </div>

          {colorOption && (
            <div className={productStyles.optionGroup}>
              <span className={productStyles.optionLabel}>Color</span>
              <div className={productStyles.swatchRow}>
                {colorOption.values.map(value => {
                  const active = selection[colorOption.name] === value;

                  return paintableColors.has(value) ? (
                    <button
                      key={value}
                      type="button"
                      title={value}
                      onClick={() => choose(colorOption.name, value)}
                      className={`${productStyles.swatch} ${active ? productStyles.swatchActive : ''}`}
                      style={{ backgroundColor: value.replace(/\s+/g, '') }}
                    />
                  ) : (
                    <button
                      key={value}
                      type="button"
                      onClick={() => choose(colorOption.name, value)}
                      className={`${productStyles.chip} ${active ? productStyles.chipActive : ''}`}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {sizeOption && (
            <div className={productStyles.optionGroup}>
              <span className={productStyles.optionLabel}>Size</span>
              <div className={productStyles.swatchRow}>
                {sizeOption.values.map(value => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => choose(sizeOption.name, value)}
                    className={`${productStyles.chip} ${selection[sizeOption.name] === value ? productStyles.chipActive : ''}`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          )}

          {otherOptions.map(option => (
            <div className={productStyles.optionGroup} key={option.name}>
              <span className={productStyles.optionLabel}>{option.name}</span>
              <div className={productStyles.swatchRow}>
                {option.values.map(value => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => choose(option.name, value)}
                    className={`${productStyles.chip} ${selection[option.name] === value ? productStyles.chipActive : ''}`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className={productStyles.stockRow}>
            <span className={`${productStyles.stockDot} ${stockCount === 0 ? productStyles.stockDotOut : ''}`} />
            <span className={stockCount === 0 ? productStyles.stockOut : productStyles.stockIn}>
              {stockCount === 0 ? 'Out of stock' : 'In stock'}
            </span>
          </div>

          <div className={productStyles.actionsRow}>
            <div className={productStyles.qtyStepper}>
              <button
                type="button"
                className={productStyles.qtyBtn}
                onClick={() => setQuantity(prev => (prev <= 1 ? prev : prev - 1))}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                –
              </button>
              <span className={productStyles.qtyValue}>{quantity}</span>
              <button
                type="button"
                className={productStyles.qtyBtn}
                onClick={() => setQuantity(prev => (prev < stockCount ? prev + 1 : prev))}
                disabled={quantity >= stockCount}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={pending || stockCount === 0}
              className={productStyles.addToCartBtn}
            >
              {stockCount === 0 ? 'Out of stock' : pending ? 'Adding...' : 'Add to Cart'}
            </button>

            <button
              type="button"
              onClick={handleToggleWishlist}
              disabled={wishlistPending || !variant}
              aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
              title={saved ? 'Remove from wishlist' : 'Save to wishlist'}
              className={homeStyles.btnCircle}
            >
              <i
                className={`heart-icon feather ${saved ? 'icon-heart-on dz-heart-fill' : 'icon-heart dz-heart'}`}
                style={{ color: saved ? '#a9714a' : 'inherit' }}
              />
            </button>
          </div>

          {message && <p className={productStyles.message}>{message}</p>}

          <div className={productStyles.descriptionBlock}>
            <p className={productStyles.descriptionHeading}>Description</p>
            <p className={productStyles.descriptionText}>{product.description ?? product.short_description ?? ''}</p>
          </div>
        </div>
      </div>

      {/* Similar Products */}
      {related.length > 0 && (
        <div className={productStyles.relatedSection}>
          <h2 className={homeStyles.h2} style={{ marginBottom: 32 }}>
            You Might Also Like
          </h2>

          <div className={homeStyles.productGrid}>
            {related.map(item => (
              <Link key={item.id} href={`/single-product/${item.id}`} className={homeStyles.productCard}>
                <div className={listingStyles.cardMedia}>
                  {item.primary_image ? (
                    <Image
                      src={mediaUrl(item.primary_image.url)}
                      alt={item.primary_image.alt_text ?? item.name}
                      fill
                      sizes="(max-width: 720px) 50vw, (max-width: 1080px) 33vw, 25vw"
                      className={listingStyles.cardImg}
                    />
                  ) : (
                    <div className={homeStyles.productMediaEmpty}>No image yet</div>
                  )}
                </div>
                <p className={homeStyles.productName}>{item.name}</p>
                <p className={homeStyles.productPrice}>
                  {formatPriceRange(item.price_from, item.price_to, STOREFRONT_CURRENCY) || 'Price on request'}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default SingleProduct;
