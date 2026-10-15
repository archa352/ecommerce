/**
 * The catalogue as staff see it.
 *
 * `/catalogue/*` carries the fields the storefront is never shown -- draft
 * and archived rows, SEO copy, per-variant stock -- so these are separate
 * types from the storefront's, not an extension of them.
 */

/** Shared by categories, products and variants. ARCHIVED is a soft delete. */
export type CatalogueStatus = 'DRAFT' | 'ACTIVE' | 'ARCHIVED';

export type ProductGender = 'MEN' | 'WOMEN' | 'UNISEX';

export interface CategoryAdmin {
  id: string;
  tenant_id: string;
  name: string;
  description: string | null;
  status: CatalogueStatus;
}

export interface ProductImageAdmin {
  id: string;
  tenant_id: string;
  product_id: string;
  url: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
}

/** One axis a product varies on, e.g. Color or Size, in display order. */
export interface ProductOption {
  id: string;
  name: string;
  position: number;
}

export interface ProductAdmin {
  id: string;
  tenant_id: string;
  category_id: string;
  name: string;
  short_description: string | null;
  description: string | null;
  brand: string | null;
  status: CatalogueStatus;
  gender: ProductGender | null;
  is_featured: boolean;
  seo_title: string | null;
  seo_description: string | null;
  images: ProductImageAdmin[];
  options: ProductOption[] | null;
}

export interface InventoryAdmin {
  variant_id: string;
  available_quantity: number;
  reserved_quantity: number;
  low_stock_threshold: number;
  /** available minus reserved: what a shopper can actually buy. */
  sellable_quantity: number;
  is_low_stock: boolean;
}

export interface VariantAdmin {
  id: string;
  tenant_id: string;
  product_id: string;
  sku: string;
  name: string;
  price: string;
  status: CatalogueStatus;
  options: Record<string, string>;
  inventory: InventoryAdmin | null;
}

/** One dimension of a variant, e.g. name "Color", value "Black". */
export interface VariantOptionValue {
  name: string;
  value: string;
}

/** A product cannot be created without at least one image. */
export interface ProductImageInput {
  url: string;
  alt_text?: string | null;
  sort_order?: number;
  is_primary?: boolean;
}

export interface ProductInput {
  category_id: string;
  name: string;
  short_description?: string | null;
  description?: string | null;
  brand?: string | null;
  status?: CatalogueStatus;
  gender?: ProductGender | null;
  is_featured?: boolean;
  seo_title?: string | null;
  seo_description?: string | null;
  images?: ProductImageInput[];
}

export interface VariantInput {
  sku: string;
  name: string;
  price: string;
  status?: CatalogueStatus;
  options?: VariantOptionValue[];
  initial_quantity?: number;
  low_stock_threshold?: number;
}

/** Why a stock level changed. Every movement records one. */
export type InventoryReason =
  | 'INITIAL'
  | 'ADJUSTMENT'
  | 'RESTOCK'
  | 'RESERVATION'
  | 'RELEASE'
  | 'FULFILLMENT';

export interface InventoryMovement {
  id: string;
  variant_id: string;
  delta: number;
  reason: InventoryReason;
  reference: string | null;
  note: string | null;
}
