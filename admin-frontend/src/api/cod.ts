import type { BlacklistEntry, CodCollection, CodSettings } from "../types/settings";
import { request } from "./client";

export const getCodSettings = () => request<CodSettings>("/admin/cod/settings");
export const updateCodSettings = (data: CodSettings) =>
  request<CodSettings>("/admin/cod/settings", { method: "PUT", body: data });
export const listBlacklist = (query: object) => request<BlacklistEntry[]>("/admin/cod/blacklist", { query });
export const addBlacklist = (phone: string, reason: string | null) =>
  request<BlacklistEntry>("/admin/cod/blacklist", { method: "POST", body: { phone, reason } });
export const removeBlacklist = (id: string) => request<null>(`/admin/cod/blacklist/${id}`, { method: "DELETE" });
export const getCodReport = (start_date: string, end_date: string) =>
  request<Record<string, string | number>>("/admin/cod/report", { query: { start_date, end_date } });
export const listCollections = (query: object) => request<CodCollection[]>("/admin/cod/collections", { query });
export const recordRemittance = (payment_ids: string[], reference: string, remitted_on: string | null) =>
  request<{ remitted: number; amount: string }>("/admin/cod/remittances", {
    method: "POST",
    body: { payment_ids, reference, remitted_on },
  });
