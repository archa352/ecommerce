import type { ReportRow } from "./ReportTable";
import { formatMoney } from "../../../utils/formatters";

export default function ReportTrends({ rows }: { rows: ReportRow[] }) {
  return <div className="grid-2">
    {[{ key: "orders", title: "Order trend" }, { key: "revenue", title: "Revenue trend" }].map(({ key, title }) => {
      const max = Math.max(0, ...rows.map((row) => Number(row[key])));
      const first = rows.length ? Date.parse(String(rows[0].period)) : 0;
      const last = rows.length ? Date.parse(String(rows[rows.length - 1].period)) : 0;
      const x = (index: number) => last > first ? 24 + (Date.parse(String(rows[index].period)) - first) / (last - first) * 552 : 300;
      const y = (row: ReportRow) => 124 - (max > 0 ? Number(row[key]) / max * 100 : 0);
      return <figure key={key} aria-label={title} style={{ margin: "12px 0" }}><figcaption>{title}</figcaption>
        {rows.length ? <svg role="img" aria-label={`${title}; exact values in the report table`} viewBox="0 0 600 156" style={{ width: "100%", maxHeight: 160 }}>
          <line x1="24" x2="576" y1="124" y2="124" stroke="var(--line)" />
          <polyline points={rows.map((row, index) => `${x(index)},${y(row)}`).join(" ")} fill="none" stroke="var(--accent)" strokeWidth="2" />
          {rows.map((row, index) => <circle key={String(row.period)} cx={x(index)} cy={y(row)} r="3" fill="var(--accent)"><title>{row.period}: {key === "revenue" ? formatMoney(row[key]) : row[key]}</title></circle>)}
          <text x="24" y="149" fontSize="12" fill="var(--muted)">{rows[0].period}</text><text x="576" y="149" textAnchor="end" fontSize="12" fill="var(--muted)">{rows[rows.length - 1].period}</text>
        </svg> : <p className="muted">No recorded sales in this period.</p>}
      </figure>;
    })}
  </div>;
}
