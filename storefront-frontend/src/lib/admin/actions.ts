'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { adminApi } from '@/lib/api/admin';
import { ApiError, ApiUnreachableError } from '@/lib/api/errors';
import { getActionAccessToken } from '@/lib/auth/session';
import type { CheckoutState } from '@/lib/orders/state';
import type { OrderStatus } from '@/types/orders';

/** The backend rejects anything that is not a plain decimal amount. */
function isMoney(value: string): boolean {
  return /^\d+(\.\d{1,2})?$/.test(value);
}

function toState(error: unknown): CheckoutState {
  if (error instanceof ApiError) return { status: 'error', message: error.message };
  if (error instanceof ApiUnreachableError) {
    return { status: 'error', message: 'Could not reach the API. Try again.' };
  }
  throw error;
}

/** Transitions are validated by the backend; an illegal one comes back 400. */
export async function updateOrderStatus(
  _previous: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  const token = await getActionAccessToken();
  if (!token) return { status: 'error', message: 'Sign in again.' };

  const orderId = String(formData.get('order_id') ?? '');
  const status = String(formData.get('status') ?? '') as OrderStatus;

  try {
    await adminApi.updateOrderStatus(token, orderId, status);
  } catch (error) {
    return toState(error);
  }

  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath('/admin/orders');
  revalidatePath('/admin');
  return { status: 'success', message: 'Status updated' };
}

export async function moderateReview(
  _previous: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  const token = await getActionAccessToken();
  if (!token) return { status: 'error', message: 'Sign in again.' };

  const reviewId = String(formData.get('review_id') ?? '');
  const approve = formData.get('is_approved') === 'true';

  try {
    await adminApi.moderateReview(token, reviewId, approve);
  } catch (error) {
    return toState(error);
  }

  revalidatePath('/admin/reviews');
  return { status: 'success', message: approve ? 'Review approved' : 'Review hidden' };
}

/**
 * The delivery charge and the free-shipping threshold.
 *
 * Both are PUT together because the endpoint replaces the whole settings
 * row; sending one without the other would blank the other.
 */
export async function updateShippingSettings(
  _previous: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  const token = await getActionAccessToken();
  if (!token) return { status: 'error', message: 'Sign in again.' };

  const shippingAmount = String(formData.get('shipping_amount') ?? '').trim();
  const freeMinimum = String(formData.get('free_shipping_minimum') ?? '').trim();

  if (!isMoney(shippingAmount)) {
    return { status: 'error', message: 'Enter the delivery charge as a number, e.g. 100.00' };
  }
  if (freeMinimum && !isMoney(freeMinimum)) {
    return { status: 'error', message: 'Enter the free-shipping minimum as a number, or leave it blank.' };
  }

  try {
    await adminApi.updateShippingSettings(token, {
      shipping_amount: shippingAmount,
      free_shipping_minimum: freeMinimum || null,
      is_active: formData.get('is_active') === 'on',
    });
  } catch (error) {
    return toState(error);
  }

  revalidatePath('/admin/settings');
  return { status: 'success', message: 'Shipping updated' };
}

/** The tax rate applied at checkout, as a percentage. */
export async function updateTaxSettings(
  _previous: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  const token = await getActionAccessToken();
  if (!token) return { status: 'error', message: 'Sign in again.' };

  const percentage = String(formData.get('tax_percentage') ?? '').trim();

  if (!isMoney(percentage)) {
    return { status: 'error', message: 'Enter the tax rate as a number, e.g. 18.00' };
  }

  try {
    await adminApi.updateTaxSettings(token, {
      tax_percentage: percentage,
      is_active: formData.get('is_active') === 'on',
    });
  } catch (error) {
    return toState(error);
  }

  revalidatePath('/admin/settings');
  return { status: 'success', message: 'Tax updated' };
}

/**
 * Archive a product and every variant under it.
 *
 * "Delete" is the backend's word for archiving: the row survives so past
 * orders still resolve their items, it just leaves the storefront. The
 * product page is gone afterwards, so this ends on the listing.
 */
export async function archiveProduct(
  _previous: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  const token = await getActionAccessToken();
  if (!token) return { status: 'error', message: 'Sign in again.' };

  const productId = String(formData.get('product_id') ?? '');

  try {
    await adminApi.deleteProduct(token, productId);
  } catch (error) {
    return toState(error);
  }

  revalidatePath('/admin/products');
  revalidatePath(`/admin/products/${productId}`);
  redirect('/admin/products');
}

/** Archive one variant, leaving the product and its siblings alone. */
export async function archiveVariant(
  _previous: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  const token = await getActionAccessToken();
  if (!token) return { status: 'error', message: 'Sign in again.' };

  const variantId = String(formData.get('variant_id') ?? '');
  const productId = String(formData.get('product_id') ?? '');

  try {
    await adminApi.deleteVariant(token, variantId);
  } catch (error) {
    return toState(error);
  }

  revalidatePath(`/admin/products/${productId}`);
  return { status: 'success', message: 'Variant archived' };
}

/**
 * Remove one product image for good.
 *
 * Unlike the rest of the catalogue this is a real delete, and the backend
 * refuses to take a product's last image -- that refusal arrives as the
 * message shown next to the button.
 */
export async function deleteProductImage(
  _previous: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  const token = await getActionAccessToken();
  if (!token) return { status: 'error', message: 'Sign in again.' };

  const imageId = String(formData.get('image_id') ?? '');
  const productId = String(formData.get('product_id') ?? '');

  try {
    await adminApi.deleteProductImage(token, imageId);
  } catch (error) {
    return toState(error);
  }

  revalidatePath(`/admin/products/${productId}`);
  return { status: 'success', message: 'Image deleted' };
}

/**
 * Archive a category.
 *
 * The backend refuses while live products still sit in it; that comes back
 * as a 409 whose message names the reason, so it is shown as-is.
 */
export async function archiveCategory(
  _previous: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  const token = await getActionAccessToken();
  if (!token) return { status: 'error', message: 'Sign in again.' };

  const categoryId = String(formData.get('category_id') ?? '');

  try {
    await adminApi.deleteCategory(token, categoryId);
  } catch (error) {
    return toState(error);
  }

  revalidatePath('/admin/categories');
  revalidatePath('/admin/products');
  return { status: 'success', message: 'Category archived' };
}

/** Deactivate a coupon, keeping the usage history it has already accrued. */
export async function deactivateCoupon(
  _previous: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  const token = await getActionAccessToken();
  if (!token) return { status: 'error', message: 'Sign in again.' };

  const couponId = String(formData.get('coupon_id') ?? '');

  try {
    await adminApi.deleteCoupon(token, couponId);
  } catch (error) {
    return toState(error);
  }

  revalidatePath('/admin/coupons');
  return { status: 'success', message: 'Coupon deactivated' };
}

/* ------------------------------------------------------------------ *
 * Catalogue writes
 *
 * Every form posts strings; these coerce them to the shapes the backend
 * declares and let its validation own the rules. An empty text input means
 * "not set" (null) rather than the empty string, which several fields
 * reject outright.
 * ------------------------------------------------------------------ */

function text(formData: FormData, key: string): string | null {
  const value = String(formData.get(key) ?? '').trim();
  return value === '' ? null : value;
}

function required(formData: FormData, key: string): string {
  return String(formData.get(key) ?? '').trim();
}

function count(formData: FormData, key: string): number | null {
  const value = text(formData, key);
  if (value === null) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.trunc(parsed) : null;
}

function checked(formData: FormData, key: string): boolean {
  return formData.get(key) === 'on';
}

export async function createCategory(
  _previous: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  const token = await getActionAccessToken();
  if (!token) return { status: 'error', message: 'Sign in again.' };

  try {
    await adminApi.createCategory(token, {
      name: required(formData, 'name'),
      description: text(formData, 'description'),
      status: checked(formData, 'active') ? 'ACTIVE' : 'DRAFT',
    });
  } catch (error) {
    return toState(error);
  }

  revalidatePath('/admin/categories');
  return { status: 'success', message: 'Category created' };
}

export async function updateCategory(
  _previous: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  const token = await getActionAccessToken();
  if (!token) return { status: 'error', message: 'Sign in again.' };

  const categoryId = required(formData, 'category_id');

  try {
    await adminApi.updateCategory(token, categoryId, {
      name: required(formData, 'name'),
      description: text(formData, 'description'),
      status: checked(formData, 'active') ? 'ACTIVE' : 'DRAFT',
    });
  } catch (error) {
    return toState(error);
  }

  revalidatePath('/admin/categories');
  return { status: 'success', message: 'Category updated' };
}

/** Options arrive as parallel name/value rows; blank pairs are dropped. */
function optionPairs(formData: FormData): { name: string; value: string }[] {
  const names = formData.getAll('option_name').map(entry => String(entry).trim());
  const values = formData.getAll('option_value').map(entry => String(entry).trim());

  return names
    .map((name, index) => ({ name, value: values[index] ?? '' }))
    .filter(pair => pair.name !== '' && pair.value !== '');
}

/**
 * Images the API will accept. It re-encodes and shrinks them itself, so the
 * only checks worth doing here are the ones that would waste a round trip.
 */
const UPLOAD_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

/**
 * A product must be created with an image, but a file can only be uploaded
 * against a product that already exists. This URL bridges those two rules:
 * it is attached at creation and deleted moments later, once the real
 * upload has taken its place. `.invalid` is reserved and never resolves, so
 * one left behind by a failure is unmistakable.
 */
const PENDING_UPLOAD_URL = 'https://pending-upload.invalid/image';

function checkUpload(file: FormDataEntryValue | null): { file: File } | { error: string } {
  if (!(file instanceof File) || file.size === 0) {
    return { error: 'Choose an image file for the product.' };
  }
  if (!UPLOAD_TYPES.includes(file.type)) {
    return { error: 'Upload a JPEG, PNG or WebP image.' };
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return { error: 'Images must be 5MB or smaller.' };
  }
  return { file };
}

/**
 * Create a product, give it its first photo, and stock its first variant.
 *
 * A product with no variant has no price and nothing to put in a basket, so
 * the storefront would list it as an unbuyable card. Creating the opening
 * variant here means everything the shopper needs exists the moment the
 * form is submitted.
 *
 * The images dance is forced by two backend rules that disagree: a product
 * must be created with an image, but a file can only be uploaded to a
 * product that already exists. So: create with the placeholder, upload the
 * real file, then drop the placeholder -- permitted only because the upload
 * has made it the second image rather than the last one.
 */
export async function createProduct(
  _previous: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  const token = await getActionAccessToken();
  if (!token) return { status: 'error', message: 'Sign in again.' };

  const upload = checkUpload(formData.get('image'));
  if ('error' in upload) return { status: 'error', message: upload.error };

  let productId: string;
  let placeholderId: string | undefined;

  try {
    const product = await adminApi.createProduct(token, {
      category_id: required(formData, 'category_id'),
      name: required(formData, 'name'),
      short_description: text(formData, 'short_description'),
      description: text(formData, 'description'),
      brand: text(formData, 'brand'),
      status: checked(formData, 'active') ? 'ACTIVE' : 'DRAFT',
      gender: (text(formData, 'gender') as 'MEN' | 'WOMEN' | 'UNISEX' | null) ?? null,
      is_featured: checked(formData, 'is_featured'),
      seo_title: text(formData, 'seo_title'),
      seo_description: text(formData, 'seo_description'),
      images: [{ url: PENDING_UPLOAD_URL, alt_text: null, is_primary: true }],
    });
    productId = product.id;
    placeholderId = product.images.find(image => image.url === PENDING_UPLOAD_URL)?.id;
  } catch (error) {
    return toState(error);
  }

  let uploadFailed = false;

  try {
    const body = new FormData();
    body.set('file', upload.file);
    const alt = text(formData, 'image_alt');
    if (alt) body.set('alt_text', alt);

    const stored = await adminApi.uploadProductImage(token, productId, body);
    await adminApi.setPrimaryImage(token, stored.id);
    if (placeholderId) await adminApi.deleteProductImage(token, placeholderId);
  } catch {
    /* The product is already saved, so this cannot be undone by failing the
       whole form. The product page says what happened instead. */
    uploadFailed = true;
  }

  /* The variant is what gives the product a price and something to sell.
     A failure here still leaves a usable product, so it reports rather than
     discards -- the product page can add one. */
  let variantFailed = false;

  try {
    await adminApi.createVariant(token, productId, {
      sku: required(formData, 'sku'),
      name: text(formData, 'variant_name') ?? 'Default',
      price: required(formData, 'price'),
      status: checked(formData, 'active') ? 'ACTIVE' : 'DRAFT',
      options: optionPairs(formData),
      initial_quantity: count(formData, 'initial_quantity') ?? 0,
      low_stock_threshold: count(formData, 'low_stock_threshold') ?? 0,
    });
  } catch {
    variantFailed = true;
  }

  const problems = [uploadFailed && 'upload', variantFailed && 'variant'].filter(Boolean);

  revalidatePath('/admin/products');
  redirect(
    `/admin/products/${productId}${problems.length ? `?failed=${problems.join(',')}` : ''}`,
  );
}

export async function updateProduct(
  _previous: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  const token = await getActionAccessToken();
  if (!token) return { status: 'error', message: 'Sign in again.' };

  const productId = required(formData, 'product_id');

  try {
    await adminApi.updateProduct(token, productId, {
      category_id: required(formData, 'category_id'),
      name: required(formData, 'name'),
      short_description: text(formData, 'short_description'),
      description: text(formData, 'description'),
      brand: text(formData, 'brand'),
      status: required(formData, 'status') as 'DRAFT' | 'ACTIVE' | 'ARCHIVED',
      gender: (text(formData, 'gender') as 'MEN' | 'WOMEN' | 'UNISEX' | null) ?? null,
      is_featured: checked(formData, 'is_featured'),
      seo_title: text(formData, 'seo_title'),
      seo_description: text(formData, 'seo_description'),
    });
  } catch (error) {
    return toState(error);
  }

  revalidatePath('/admin/products');
  revalidatePath(`/admin/products/${productId}`);
  return { status: 'success', message: 'Product saved' };
}

export async function createVariant(
  _previous: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  const token = await getActionAccessToken();
  if (!token) return { status: 'error', message: 'Sign in again.' };

  const productId = required(formData, 'product_id');

  try {
    await adminApi.createVariant(token, productId, {
      sku: required(formData, 'sku'),
      name: required(formData, 'name'),
      price: required(formData, 'price'),
      status: checked(formData, 'active') ? 'ACTIVE' : 'DRAFT',
      options: optionPairs(formData),
      initial_quantity: count(formData, 'initial_quantity') ?? 0,
      low_stock_threshold: count(formData, 'low_stock_threshold') ?? 0,
    });
  } catch (error) {
    return toState(error);
  }

  revalidatePath(`/admin/products/${productId}`);
  return { status: 'success', message: 'Variant added' };
}

export async function updateVariant(
  _previous: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  const token = await getActionAccessToken();
  if (!token) return { status: 'error', message: 'Sign in again.' };

  const variantId = required(formData, 'variant_id');
  const productId = required(formData, 'product_id');

  try {
    await adminApi.updateVariant(token, variantId, {
      sku: required(formData, 'sku'),
      name: required(formData, 'name'),
      price: required(formData, 'price'),
      status: required(formData, 'status') as 'DRAFT' | 'ACTIVE' | 'ARCHIVED',
    });
  } catch (error) {
    return toState(error);
  }

  revalidatePath(`/admin/products/${productId}`);
  return { status: 'success', message: 'Variant saved' };
}

/** Absolute stock figure. The difference is recorded as a movement. */
export async function setInventory(
  _previous: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  const token = await getActionAccessToken();
  if (!token) return { status: 'error', message: 'Sign in again.' };

  const variantId = required(formData, 'variant_id');
  const productId = required(formData, 'product_id');
  const quantity = count(formData, 'available_quantity');

  if (quantity === null || quantity < 0) {
    return { status: 'error', message: 'Enter the stock on hand as a whole number.' };
  }

  try {
    await adminApi.setInventory(token, variantId, quantity, text(formData, 'note') ?? undefined);
  } catch (error) {
    return toState(error);
  }

  revalidatePath(`/admin/products/${productId}`);
  return { status: 'success', message: 'Stock set' };
}

/** Signed change; the backend rejects zero. */
export async function adjustInventory(
  _previous: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  const token = await getActionAccessToken();
  if (!token) return { status: 'error', message: 'Sign in again.' };

  const variantId = required(formData, 'variant_id');
  const productId = required(formData, 'product_id');
  const delta = count(formData, 'delta');

  if (delta === null || delta === 0) {
    return { status: 'error', message: 'Enter a non-zero change, e.g. 10 or -3.' };
  }

  try {
    await adminApi.adjustInventory(token, variantId, {
      delta,
      reason: delta > 0 ? 'RESTOCK' : 'ADJUSTMENT',
      note: text(formData, 'note'),
    });
  } catch (error) {
    return toState(error);
  }

  revalidatePath(`/admin/products/${productId}`);
  return { status: 'success', message: delta > 0 ? `Added ${delta}` : `Removed ${Math.abs(delta)}` };
}

export async function setLowStockThreshold(
  _previous: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  const token = await getActionAccessToken();
  if (!token) return { status: 'error', message: 'Sign in again.' };

  const variantId = required(formData, 'variant_id');
  const productId = required(formData, 'product_id');
  const threshold = count(formData, 'low_stock_threshold');

  if (threshold === null || threshold < 0) {
    return { status: 'error', message: 'Enter the threshold as a whole number.' };
  }

  try {
    await adminApi.setLowStockThreshold(token, variantId, threshold);
  } catch (error) {
    return toState(error);
  }

  revalidatePath(`/admin/products/${productId}`);
  return { status: 'success', message: 'Threshold saved' };
}

/** Add an image the store already hosts somewhere. */
export async function addProductImage(
  _previous: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  const token = await getActionAccessToken();
  if (!token) return { status: 'error', message: 'Sign in again.' };

  const productId = required(formData, 'product_id');

  try {
    await adminApi.addProductImage(token, productId, {
      url: required(formData, 'url'),
      alt_text: text(formData, 'alt_text'),
    });
  } catch (error) {
    return toState(error);
  }

  revalidatePath(`/admin/products/${productId}`);
  return { status: 'success', message: 'Image added' };
}

/**
 * Upload a file the API stores itself.
 *
 * It lands in the container's uploads volume and comes back as a /media
 * URL, so the image survives a rebuild the way the database does.
 */
export async function uploadProductImage(
  _previous: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  const token = await getActionAccessToken();
  if (!token) return { status: 'error', message: 'Sign in again.' };

  const productId = required(formData, 'product_id');
  const file = formData.get('file');

  if (!(file instanceof File) || file.size === 0) {
    return { status: 'error', message: 'Choose an image file to upload.' };
  }

  const upload = new FormData();
  upload.set('file', file);
  const alt = text(formData, 'alt_text');
  if (alt) upload.set('alt_text', alt);

  try {
    await adminApi.uploadProductImage(token, productId, upload);
  } catch (error) {
    return toState(error);
  }

  revalidatePath(`/admin/products/${productId}`);
  return { status: 'success', message: 'Image uploaded' };
}

export async function setPrimaryImage(
  _previous: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  const token = await getActionAccessToken();
  if (!token) return { status: 'error', message: 'Sign in again.' };

  const productId = required(formData, 'product_id');

  try {
    await adminApi.setPrimaryImage(token, required(formData, 'image_id'));
  } catch (error) {
    return toState(error);
  }

  revalidatePath(`/admin/products/${productId}`);
  return { status: 'success', message: 'Primary image set' };
}

export async function createCoupon(
  _previous: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  const token = await getActionAccessToken();
  if (!token) return { status: 'error', message: 'Sign in again.' };

  try {
    await adminApi.createCoupon(token, {
      code: required(formData, 'code'),
      discount_type: required(formData, 'discount_type'),
      discount_value: required(formData, 'discount_value'),
      min_order_amount: text(formData, 'min_order_amount'),
      max_discount_amount: text(formData, 'max_discount_amount'),
      starts_at: text(formData, 'starts_at'),
      expires_at: text(formData, 'expires_at'),
      usage_limit: count(formData, 'usage_limit'),
      per_customer_usage_limit: count(formData, 'per_customer_usage_limit'),
      is_active: checked(formData, 'is_active'),
    });
  } catch (error) {
    return toState(error);
  }

  revalidatePath('/admin/coupons');
  return { status: 'success', message: 'Coupon created' };
}

export async function updateCoupon(
  _previous: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  const token = await getActionAccessToken();
  if (!token) return { status: 'error', message: 'Sign in again.' };

  try {
    await adminApi.updateCoupon(token, required(formData, 'coupon_id'), {
      discount_type: required(formData, 'discount_type'),
      discount_value: required(formData, 'discount_value'),
      min_order_amount: text(formData, 'min_order_amount'),
      max_discount_amount: text(formData, 'max_discount_amount'),
      starts_at: text(formData, 'starts_at'),
      expires_at: text(formData, 'expires_at'),
      usage_limit: count(formData, 'usage_limit'),
      per_customer_usage_limit: count(formData, 'per_customer_usage_limit'),
      is_active: checked(formData, 'is_active'),
    });
  } catch (error) {
    return toState(error);
  }

  revalidatePath('/admin/coupons');
  return { status: 'success', message: 'Coupon saved' };
}
