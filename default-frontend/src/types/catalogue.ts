export type CatalogueStatus = 'DRAFT' | 'ACTIVE' | 'ARCHIVED';

export type ProductGender = 'MEN' | 'WOMEN' | 'UNISEX';

/** Sort orders `/storefront/products` accepts. Search uses its own vocabulary. */
export type ProductSort = 'newest' | 'name_asc' | 'name_desc' | 'price_low' | 'price_high';

export interface CategoryStorefront {
  id: string;
  name: string;
  description: string | null;
}

export interface ProductImageStorefront {
  id: string;
  url: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
}

export interface VariantStorefront {
  id: string;
  product_id: string;
  sku: string;
  name: string;
  price: string;
  options: Record<string, string>;
  in_stock: boolean;
  available_quantity: number;
}

/** An option and the values an in-stock variant actually offers. */
export interface StorefrontOption {
  name: string;
  values: string[];
}

export interface ProductSummaryStorefront {
  id: string;
  category_id: string;
  name: string;
  short_description: string | null;
  brand: string | null;
  is_featured: boolean;
  primary_image: ProductImageStorefront | null;
  price_from: string | null;
  price_to: string | null;
  in_stock: boolean;
}

export interface ProductStorefront {
  id: string;
  category: CategoryStorefront;
  name: string;
  short_description: string | null;
  description: string | null;
  brand: string | null;
  is_featured: boolean;
  seo_title: string | null;
  seo_description: string | null;
  images: ProductImageStorefront[];
  options: StorefrontOption[];
  variants: VariantStorefront[];
  price_from: string | null;
  price_to: string | null;
  in_stock: boolean;
}

export interface ProductListQuery {
  page?: number;
  page_size?: number;
  category_id?: string;
  search?: string;
  brand?: string;
  featured?: boolean;
  min_price?: string;
  max_price?: string;
  sort?: ProductSort;
}
