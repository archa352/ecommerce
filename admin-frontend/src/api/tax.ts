import type { GstReport, GstSettings, TaxSettings } from "../types/settings";
import { request } from "./client";

export const getTax = () => request<TaxSettings>("/admin/tax");
export const updateTax = (data: TaxSettings) => request<TaxSettings>("/admin/tax", { method: "PUT", body: data });
export const getGst = () => request<GstSettings>("/admin/gst");
export const updateGst = (data: Partial<GstSettings>) =>
  request<GstSettings>("/admin/gst", { method: "PUT", body: data });
export const getGstReport = (start_date: string, end_date: string) =>
  request<GstReport>("/admin/gst/report", { query: { start_date, end_date } });
