import type { OrderStatus, PaymentStatus } from '@/types/orders';

export interface PeriodMetric {
  order_count: number;
  revenue: string;
  previous_order_count: number;
  previous_revenue: string;
  order_count_change_pct: number | null;
  revenue_change_pct: number | null;
}

export interface SalesOverview {
  today: PeriodMetric;
  week: PeriodMetric;
  month: PeriodMetric;
  total_order_count: number;
  total_revenue: string;
}

export interface OrderStatusSummary {
  total: number;
  today: number;
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  returned: number;
  other: number;
}

export interface InventoryVariantItem {
  product_id: string;
  product_name: string;
  variant_id: string | null;
  sku: string;
  available_quantity: number;
  low_stock_threshold: number;
}

export interface InventoryOverview {
  low_stock_count: number;
  out_of_stock_count: number;
  low_stock_variants: InventoryVariantItem[];
  out_of_stock_variants: InventoryVariantItem[];
}

export interface CustomerOverview {
  total: number;
  new_today: number;
  new_this_month: number;
}

export interface ProductsOverview {
  total: number;
}

export interface PaymentOverview {
  paid_count: number;
  pending_count: number;
  failed_count: number;
  refunded_count: number;
  today_paid_amount: string;
}

export interface RecentOrderSummary {
  order_id: string;
  order_number: string;
  customer_email: string | null;
  total_amount: string;
  currency: string;
  order_status: OrderStatus;
  payment_status: PaymentStatus;
  created_at: string;
}

export interface DashboardOverview {
  sales: SalesOverview;
  orders: OrderStatusSummary;
  products: ProductsOverview;
  inventory: InventoryOverview;
  customers: CustomerOverview;
  payments: PaymentOverview;
  recent_orders: RecentOrderSummary[];
}

export interface SalesTrendItem {
  date: string;
  order_count: number;
  revenue: string;
}

export interface TopSellingProductItem {
  product_id: string;
  product_name: string;
  quantity_sold: number;
  revenue_generated: string;
}

export type DiscountType = 'PERCENTAGE' | 'FIXED_AMOUNT';

export interface Coupon {
  id: string;
  code: string;
  discount_type: DiscountType;
  discount_value: string;
  currency: string;
  min_order_amount: string | null;
  max_discount_amount: string | null;
  starts_at: string | null;
  expires_at: string | null;
  usage_limit: number | null;
  per_customer_usage_limit: number | null;
  times_used: number;
  is_active: boolean;
  created_at: string;
}

export interface ShippingSettings {
  shipping_amount: string;
  free_shipping_minimum: string | null;
  is_active: boolean;
}

export interface TaxSettings {
  tax_percentage: string;
  is_active: boolean;
}
