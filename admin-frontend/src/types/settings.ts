export interface ShippingSettings {
  shipping_amount: string;
  free_shipping_minimum: string | null;
  is_active: boolean;
  min_delivery_days: number;
  max_delivery_days: number;
  restrict_to_listed_pincodes: boolean;
}

export interface TaxSettings {
  tax_percentage: string;
  is_active: boolean;
}

export interface PincodeRule {
  pincode: string;
  is_serviceable: boolean;
  cod_available: boolean;
  min_delivery_days: number | null;
  max_delivery_days: number | null;
  shipping_amount: string | null;
  city: string | null;
  state: string | null;
}

export interface GstSettings {
  gstin: string | null;
  legal_name: string | null;
  address: string | null;
  state: string | null;
  state_code: string | null;
  invoice_prefix: string;
  shipping_sac_code: string | null;
}

export interface CodSettings {
  is_enabled: boolean;
  min_order_amount: string | null;
  max_order_amount: string | null;
  fee_amount: string;
  advance_amount: string | null;
  auto_blacklist_threshold: number | null;
}

export interface CodCollection {
  payment_id: string;
  order_id: string;
  order_number: string;
  amount: string;
  collected_at: string;
  remitted_at: string | null;
  remittance_reference: string | null;
}

export interface Integration {
  key: string;
  name: string;
  purpose: string;
  credentials_configured: boolean;
  integrated: boolean;
  status: string;
  required_settings: string[];
  note: string;
}

export interface GstReport {
  start_date: string;
  end_date: string;
  order_count: number;
  taxable_amount: string;
  cgst_amount: string;
  sgst_amount: string;
  igst_amount: string;
  tax_amount: string;
  // gst_type/gst_rate are null for orders placed before the seller's GST state was set.
  by_rate: { component?: "ITEMS" | "CHARGES_AND_ADJUSTMENTS"; gst_type: "INTRA_STATE" | "INTER_STATE" | null; gst_rate: string | null; taxable_amount: string; cgst_amount: string; sgst_amount: string; igst_amount: string }[];
  currency: string;
}
