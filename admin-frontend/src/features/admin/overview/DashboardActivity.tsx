import { useState } from "react";
import { Link } from "react-router-dom";
import { listAuditLogs } from "../../../api/audit";
import { useAuth } from "../../../auth/AuthContext";
import { P } from "../../../auth/permissions";
import DataTable from "../../../components/common/DataTable";
import Pagination from "../../../components/common/Pagination";
import { useApi } from "../../../hooks/useApi";
import { formatDate, label } from "../../../utils/formatters";
import { DASHBOARD_PAGE_SIZE } from "./dashboardData";

export default function DashboardActivity({ refresh }: { refresh: number }) {
  const [action, setAction] = useState("adjust_inventory");
  return <>
    <section className="panel" aria-label="Stock changes"><h3>Stock changes</h3>
      <select aria-label="Stock change type" value={action} onChange={(e) => setAction(e.target.value)}>
        <option value="adjust_inventory">Stock adjustments</option><option value="set_inventory">Stock levels and thresholds</option>
      </select>
      <ActivityRows key={action} entity="variant" action={action} refresh={refresh} />
    </section>
  </>;
}
function ActivityRows({ entity, action, refresh }: { entity: string; action: string; refresh: number }) {
  const { can } = useAuth();
  const [page, setPage] = useState(1);
  const logs = useApi(async () => {
    const response = await listAuditLogs({ entity_type: entity, action, page, page_size: DASHBOARD_PAGE_SIZE });
    const lastPage = Math.max(1, response.meta?.total_pages ?? page);
    if (page > lastPage) setPage((current) => current === page ? lastPage : current);
    return response;
  }, [entity, action, page, refresh]);
  return <>
    <DataTable rows={logs.loading ? null : logs.data} loading={logs.loading} error={logs.error} empty="No recorded changes." rowKey={(row) => row.id} columns={[
      { key: "created_at", header: "When", render: (row) => formatDate(row.created_at) },
      { key: "action", header: "Change", render: (row) => can(P.catalogueView) ? <Link to={entity === "product" && row.entity_id ? `/products/${row.entity_id}` : "/inventory"}>{row.summary || label(row.action)}</Link> : row.summary || label(row.action) },
      { key: "actor_name", header: "By", render: (row) => row.actor_name ?? "Deleted user" },
    ]} />
    {!logs.loading && !logs.error && <Pagination meta={logs.meta} onPageChange={setPage} />}
  </>;
}
