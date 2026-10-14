import type { DashboardOverview, TopProduct, SalesTrendPoint } from "../types/dashboard";
import { request } from "./client";

export const getDashboardOverview = () => request<DashboardOverview>("/admin/dashboard");
export const getTopProducts = (days = 7, limit = 10) =>
  request<TopProduct[]>("/admin/dashboard/top-products", { query: { days, limit } });

// Existing dashboard endpoint; no backend changes are needed.
export const getSalesTrend = (days = 30) =>
  request<SalesTrendPoint[]>("/admin/dashboard/sales-trend", { query: { days } });
