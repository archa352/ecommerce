import { cartApi } from '@/lib/api/cart';
import { catalogueApi } from '@/lib/api/catalogue';
import { ApiError } from '@/lib/api/errors';
import { getAccessToken } from '@/lib/auth/session';
import { readGuestCart } from '@/lib/cart/guest-cart';
import type { Cart, CartItem } from '@/types/cart';

const EMPTY_CART: Cart = { id: 'guest', items: [], subtotal: '0.00', item_count: 0 };

/**
 * The cart as the page should show it, whoever is looking.
 *
 * A signed-in shopper's cart is the backend's. A guest's is assembled from
 * the cookie by reading each variant, which keeps prices and stock coming
 * from the API rather than being remembered from when the item was added.
 */
export async function getCart(): Promise<Cart> {
  const token = await getAccessToken();

  if (token) {
    try {
      return await cartApi.get(token);
    } catch (error) {
      if (error instanceof ApiError && error.isUnauthenticated) return EMPTY_CART;
      throw error;
    }
  }

  const lines = await readGuestCart();
  if (lines.length === 0) return EMPTY_CART;

  const variants = await Promise.all(
    lines.map(async (line) => {
      try {
        const variant = await catalogueApi.getVariant(line.variant_id);
        // The variant alone has no product name or image -- both live on
        // the product, fetched separately here so a guest's cart row shows
        // the same real name/photo a signed-in shopper's does.
        const product = await catalogueApi.getProduct(variant.product_id).catch(() => null);
        return { line, variant, product };
      } catch {
        // A variant that has gone away simply drops out of the cart.
        return null;
      }
    }),
  );

  const items: CartItem[] = [];
  let subtotal = 0;

  for (const entry of variants) {
    if (!entry) continue;

    const { line, variant, product } = entry;
    const unitPrice = Number(variant.price);
    const lineTotal = unitPrice * line.quantity;
    subtotal += lineTotal;

    const primaryImage = product ? product.images.find((image) => image.is_primary) ?? product.images[0] : undefined;

    items.push({
      id: variant.id,
      variant_id: variant.id,
      product_id: variant.product_id,
      product_name: product?.name ?? variant.name,
      variant_name: variant.name,
      sku: variant.sku,
      quantity: line.quantity,
      unit_price: variant.price,
      subtotal: lineTotal.toFixed(2),
      image: primaryImage ? { url: primaryImage.url, alt_text: primaryImage.alt_text } : null,
    });
  }

  return {
    id: 'guest',
    items,
    subtotal: subtotal.toFixed(2),
    item_count: items.reduce((total, item) => total + item.quantity, 0),
  };
}

/** Just the badge number, for the header. */
export async function getCartCount(): Promise<number> {
  try {
    const cart = await getCart();
    return cart.item_count;
  } catch {
    return 0;
  }
}
