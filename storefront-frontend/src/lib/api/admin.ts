import { apiRequest, apiRequestPage } from '@/lib/api/client';
import type { Page, PageParams } from '@/types/api';
import type {
  Coupon,
  DashboardOverview,
  SalesTrendItem,
  ShippingSettings,
  TaxSettings,
  TopSellingProductItem,
} from '@/types/admin';
import type {
  CatalogueStatus,
  CategoryAdmin,
  InventoryAdmin,
  InventoryMovement,
  InventoryReason,
  ProductAdmin,
  ProductImageAdmin,
  ProductImageInput,
  ProductInput,
  VariantAdmin,
  VariantInput,
} from '@/types/catalogue-admin';
import type { Order, OrderStatus, OrderSummary, Payment, PaymentStatus } from '@/types/orders';
import type { Review } from '@/types/reviews';

/**
 * Admin endpoints. Reads generally need STAFF, writes need ADMIN.
 *
 * The backend is the authority on that -- these calls will 403 for the
 * wrong role regardless of what the UI chooses to show.
 */
export const adminApi = {
  dashboard(token: string): Promise<DashboardOverview> {
    return apiRequest<DashboardOverview>('/admin/dashboard', { token, cache: 'no-store' });
  },

  salesTrend(token: string, days = 30): Promise<SalesTrendItem[]> {
    return apiRequest<SalesTrendItem[]>('/admin/dashboard/sales-trend', {
      query: { days },
      token,
      cache: 'no-store',
    });
  },

  topProducts(token: string, options: { days?: number; limit?: number } = {}): Promise<TopSellingProductItem[]> {
    return apiRequest<TopSellingProductItem[]>('/admin/dashboard/top-products', {
      query: { days: options.days, limit: options.limit },
      token,
      cache: 'no-store',
    });
  },

  listOrders(
    token: string,
    query: PageParams & {
      order_number?: string;
      status?: OrderStatus;
      payment_status?: PaymentStatus;
    } = {},
  ): Promise<Page<OrderSummary>> {
    return apiRequestPage<OrderSummary>('/admin/orders', { query: { ...query }, token, cache: 'no-store' });
  },

  getOrder(token: string, orderId: string): Promise<Order> {
    return apiRequest<Order>(`/admin/orders/${orderId}`, { token, cache: 'no-store' });
  },

  /** Transitions are validated server-side; only legal next states succeed. */
  updateOrderStatus(token: string, orderId: string, status: OrderStatus): Promise<Order> {
    return apiRequest<Order>(`/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      body: { status },
      token,
      cache: 'no-store',
    });
  },

  listPayments(
    token: string,
    query: PageParams & { order_id?: string; status?: PaymentStatus } = {},
  ): Promise<Page<Payment>> {
    return apiRequestPage<Payment>('/admin/payments', { query: { ...query }, token, cache: 'no-store' });
  },

  getPayment(token: string, paymentId: string): Promise<Payment> {
    return apiRequest<Payment>(`/admin/payments/${paymentId}`, { token, cache: 'no-store' });
  },

  listCoupons(token: string, query: PageParams & { active_only?: boolean } = {}): Promise<Page<Coupon>> {
    return apiRequestPage<Coupon>('/admin/coupons', { query: { ...query }, token, cache: 'no-store' });
  },

  createCoupon(token: string, body: Record<string, unknown>): Promise<Coupon> {
    return apiRequest<Coupon>('/admin/coupons', { method: 'POST', body, token, cache: 'no-store' });
  },

  updateCoupon(token: string, couponId: string, body: Record<string, unknown>): Promise<Coupon> {
    return apiRequest<Coupon>(`/admin/coupons/${couponId}`, {
      method: 'PUT',
      body,
      token,
      cache: 'no-store',
    });
  },

  getCoupon(token: string, couponId: string): Promise<Coupon> {
    return apiRequest<Coupon>(`/admin/coupons/${couponId}`, { token, cache: 'no-store' });
  },

  /** Deactivates rather than removes: the usage history has to survive. */
  deleteCoupon(token: string, couponId: string): Promise<void> {
    return apiRequest<void>(`/admin/coupons/${couponId}`, {
      method: 'DELETE',
      token,
      cache: 'no-store',
    });
  },

  listReviews(token: string, query: PageParams & { is_approved?: boolean } = {}): Promise<Page<Review>> {
    return apiRequestPage<Review>('/admin/reviews', { query: { ...query }, token, cache: 'no-store' });
  },

  moderateReview(token: string, reviewId: string, isApproved: boolean): Promise<Review> {
    return apiRequest<Review>(`/admin/reviews/${reviewId}`, {
      method: 'PATCH',
      body: { is_approved: isApproved },
      token,
      cache: 'no-store',
    });
  },

  getShippingSettings(token: string): Promise<ShippingSettings> {
    return apiRequest<ShippingSettings>('/admin/shipping', { token, cache: 'no-store' });
  },

  updateShippingSettings(token: string, body: ShippingSettings): Promise<ShippingSettings> {
    return apiRequest<ShippingSettings>('/admin/shipping', {
      method: 'PUT',
      body,
      token,
      cache: 'no-store',
    });
  },

  getTaxSettings(token: string): Promise<TaxSettings> {
    return apiRequest<TaxSettings>('/admin/tax', { token, cache: 'no-store' });
  },

  updateTaxSettings(token: string, body: TaxSettings): Promise<TaxSettings> {
    return apiRequest<TaxSettings>('/admin/tax', { method: 'PUT', body, token, cache: 'no-store' });
  },

  /*
   * The catalogue sits under /catalogue rather than /admin, but it is
   * staff-only and returns the draft and archived rows the storefront's
   * /storefront endpoints filter out -- so it belongs here, not in
   * catalogueApi.
   */

  listCategories(token: string, query: PageParams = {}): Promise<Page<CategoryAdmin>> {
    return apiRequestPage<CategoryAdmin>('/catalogue/categories', {
      query: { ...query },
      token,
      cache: 'no-store',
    });
  },

  listProducts(
    token: string,
    query: PageParams & { category_id?: string; search?: string; status?: CatalogueStatus } = {},
  ): Promise<Page<ProductAdmin>> {
    return apiRequestPage<ProductAdmin>('/catalogue/products', {
      query: { ...query },
      token,
      cache: 'no-store',
    });
  },

  getProduct(token: string, productId: string): Promise<ProductAdmin> {
    return apiRequest<ProductAdmin>(`/catalogue/products/${productId}`, { token, cache: 'no-store' });
  },

  /**
   * Archives the category. The backend refuses while live products still
   * point at it, which surfaces as a 409 rather than a silent no-op.
   */
  createCategory(token: string, body: Partial<CategoryAdmin>): Promise<CategoryAdmin> {
    return apiRequest<CategoryAdmin>('/catalogue/categories', {
      method: 'POST',
      body,
      token,
      cache: 'no-store',
    });
  },

  updateCategory(
    token: string,
    categoryId: string,
    body: Partial<CategoryAdmin>,
  ): Promise<CategoryAdmin> {
    return apiRequest<CategoryAdmin>(`/catalogue/categories/${categoryId}`, {
      method: 'PATCH',
      body,
      token,
      cache: 'no-store',
    });
  },

  deleteCategory(token: string, categoryId: string): Promise<void> {
    return apiRequest<void>(`/catalogue/categories/${categoryId}`, {
      method: 'DELETE',
      token,
      cache: 'no-store',
    });
  },

  /** The backend refuses a product with no images, so `images` is required. */
  createProduct(token: string, body: ProductInput): Promise<ProductAdmin> {
    return apiRequest<ProductAdmin>('/catalogue/products', {
      method: 'POST',
      body,
      token,
      cache: 'no-store',
    });
  },

  updateProduct(token: string, productId: string, body: Partial<ProductInput>): Promise<ProductAdmin> {
    return apiRequest<ProductAdmin>(`/catalogue/products/${productId}`, {
      method: 'PATCH',
      body,
      token,
      cache: 'no-store',
    });
  },

  /** Archives the product and every variant under it, in one transaction. */
  deleteProduct(token: string, productId: string): Promise<void> {
    return apiRequest<void>(`/catalogue/products/${productId}`, {
      method: 'DELETE',
      token,
      cache: 'no-store',
    });
  },

  /** Archives one variant, leaving the product and its siblings alone. */
  deleteVariant(token: string, variantId: string): Promise<void> {
    return apiRequest<void>(`/catalogue/variants/${variantId}`, {
      method: 'DELETE',
      token,
      cache: 'no-store',
    });
  },

  addProductImage(
    token: string,
    productId: string,
    body: ProductImageInput,
  ): Promise<ProductImageAdmin> {
    return apiRequest<ProductImageAdmin>(`/catalogue/products/${productId}/images`, {
      method: 'POST',
      body,
      token,
      cache: 'no-store',
    });
  },

  /** Multipart: the file is stored by the API and served back from /media. */
  uploadProductImage(token: string, productId: string, form: FormData): Promise<ProductImageAdmin> {
    return apiRequest<ProductImageAdmin>(`/catalogue/products/${productId}/images/upload`, {
      method: 'POST',
      formData: form,
      token,
      cache: 'no-store',
    });
  },

  updateProductImage(
    token: string,
    imageId: string,
    body: Partial<ProductImageInput>,
  ): Promise<ProductImageAdmin> {
    return apiRequest<ProductImageAdmin>(`/catalogue/images/${imageId}`, {
      method: 'PATCH',
      body,
      token,
      cache: 'no-store',
    });
  },

  setPrimaryImage(token: string, imageId: string): Promise<ProductImageAdmin> {
    return apiRequest<ProductImageAdmin>(`/catalogue/images/${imageId}/primary`, {
      method: 'POST',
      token,
      cache: 'no-store',
    });
  },

  reorderProductImages(
    token: string,
    productId: string,
    images: { id: string; sort_order: number }[],
  ): Promise<ProductImageAdmin[]> {
    return apiRequest<ProductImageAdmin[]>(`/catalogue/products/${productId}/images/order`, {
      method: 'PUT',
      body: { images },
      token,
      cache: 'no-store',
    });
  },

  /** A real delete -- the backend refuses to take a product's last image. */
  deleteProductImage(token: string, imageId: string): Promise<void> {
    return apiRequest<void>(`/catalogue/images/${imageId}`, {
      method: 'DELETE',
      token,
      cache: 'no-store',
    });
  },

  createVariant(token: string, productId: string, body: VariantInput): Promise<VariantAdmin> {
    return apiRequest<VariantAdmin>(`/catalogue/products/${productId}/variants`, {
      method: 'POST',
      body,
      token,
      cache: 'no-store',
    });
  },

  updateVariant(token: string, variantId: string, body: Partial<VariantInput>): Promise<VariantAdmin> {
    return apiRequest<VariantAdmin>(`/catalogue/variants/${variantId}`, {
      method: 'PATCH',
      body,
      token,
      cache: 'no-store',
    });
  },

  /** Sets stock to an absolute figure, recording the difference as a movement. */
  setInventory(token: string, variantId: string, availableQuantity: number, note?: string) {
    return apiRequest<InventoryAdmin>(`/catalogue/variants/${variantId}/inventory`, {
      method: 'PUT',
      body: { available_quantity: availableQuantity, note: note || null },
      token,
      cache: 'no-store',
    });
  },

  /** Signed change. The backend rejects a delta of zero. */
  adjustInventory(
    token: string,
    variantId: string,
    body: { delta: number; reason?: InventoryReason; reference?: string | null; note?: string | null },
  ): Promise<InventoryAdmin> {
    return apiRequest<InventoryAdmin>(`/catalogue/variants/${variantId}/inventory/adjust`, {
      method: 'POST',
      body,
      token,
      cache: 'no-store',
    });
  },

  setLowStockThreshold(token: string, variantId: string, threshold: number): Promise<InventoryAdmin> {
    return apiRequest<InventoryAdmin>(`/catalogue/variants/${variantId}/inventory/threshold`, {
      method: 'PUT',
      body: { low_stock_threshold: threshold },
      token,
      cache: 'no-store',
    });
  },

  listInventoryMovements(
    token: string,
    variantId: string,
    query: PageParams = {},
  ): Promise<Page<InventoryMovement>> {
    return apiRequestPage<InventoryMovement>(`/catalogue/variants/${variantId}/inventory/movements`, {
      query: { ...query },
      token,
      cache: 'no-store',
    });
  },

  /** Each variant carries its own inventory, so stock needs no second call. */
  listVariants(token: string, productId: string, query: PageParams = {}): Promise<Page<VariantAdmin>> {
    return apiRequestPage<VariantAdmin>(`/catalogue/products/${productId}/variants`, {
      query: { ...query },
      token,
      cache: 'no-store',
    });
  },
};
