import { useState } from "react";
import DataTable from "../../../components/common/DataTable";
import type { Column } from "../../../components/common/DataTable";
import Pagination from "../../../components/common/Pagination";
import { DASHBOARD_PAGE_SIZE } from "./dashboardData";

// Reports return complete arrays; slice once instead of fetching/appending overlapping pages.
export default function DashboardTable<T>({ rows, columns, rowKey, empty, loading, error, pageSize = DASHBOARD_PAGE_SIZE }: {
  rows: T[] | null; columns: Column<T>[]; rowKey: (row: T) => string;
  empty?: string; loading?: boolean; error?: string | null; pageSize?: number;
}) {
  const [requestedPage, setPage] = useState(1);
  const total = rows?.length ?? 0;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(requestedPage, pages);
  return <>
    <DataTable rows={loading ? null : rows?.slice((page - 1) * pageSize, page * pageSize) ?? null} columns={columns} rowKey={rowKey} empty={empty} loading={loading} error={error} />
    {!loading && !error && rows && <Pagination meta={{ page, page_size: pageSize, total_items: total, total_pages: pages }} onPageChange={setPage} />}
  </>;
}
