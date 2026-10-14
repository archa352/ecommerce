import type { DashboardOverview } from "../../types/dashboard";
import { formatMoney } from "../../utils/formatters";

type Comparison = NonNullable<DashboardOverview["insights"]>["comparison"];

// Three actual comparison points, not an interpolated revenue time series.
export default function RevenueComparison({ comparison }: { comparison: Comparison }) {
  const points = [
    { label: "Same day last week", value: comparison.last_week_revenue },
    { label: "Yesterday", value: comparison.yesterday_revenue },
    { label: "Today", value: comparison.today_revenue },
  ];
  const maximum = Math.max(0, ...points.map((point) => Number(point.value)));
  return (
    <section className="panel revenue-comparison" aria-label="Revenue comparison">
      <div className="panel-title"><div><span className="eyebrow">Sales performance</span><h3>Revenue comparison</h3></div><span className="chart-key"><i />Revenue</span></div>
      <p className="muted">Today, yesterday and the same day last week</p>
      <div className="comparison-chart">
        {points.map((point, index) => (
          <div className={`comparison-column${index === 2 ? " current" : ""}`} key={point.label}>
            <strong>{formatMoney(point.value)}</strong>
            <div className="comparison-track" aria-hidden="true"><div className="comparison-bar" style={{ height: `${maximum > 0 ? Math.max(0, Number(point.value)) / maximum * 100 : 0}%` }} /></div>
            <span>{point.label}</span>
          </div>
        ))}
      </div>
      {maximum === 0 && <p className="muted">No revenue recorded for these comparison days.</p>}
    </section>
  );
}
