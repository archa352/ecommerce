import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import RevenueComparison from "./RevenueComparison";
import { mockFetch, ok, profile, route } from "../../test/fetchMock";
import { renderApp } from "../../test/renderApp";
import { NAV_GROUPS } from "../../routes";

const comparison = {
  today_orders: 3, yesterday_orders: 2, last_week_orders: 1,
  today_revenue: "2000", yesterday_revenue: "1000", last_week_revenue: "500",
  orders_vs_yesterday_pct: 50, revenue_vs_yesterday_pct: 100,
  orders_vs_last_week_pct: 200, revenue_vs_last_week_pct: 300,
};

describe("Admin redesign", () => {
  it("scales only the three revenue values supplied by the API", () => {
    const { container } = render(<RevenueComparison comparison={comparison} />);
    const chart = screen.getByRole("region", { name: "Revenue comparison" });
    expect(within(chart).getByText("Same day last week")).toBeInTheDocument();
    expect(within(chart).getByText("Yesterday")).toBeInTheDocument();
    expect(within(chart).getByText("Today")).toBeInTheDocument();
    expect(Array.from(container.querySelectorAll<HTMLElement>(".comparison-bar")).map((bar) => bar.style.height)).toEqual(["25%", "50%", "100%"]);
  });

  it("shows a truthful zero-revenue state without fabricated bars", () => {
    const { container } = render(<RevenueComparison comparison={{ ...comparison, today_revenue: "0", yesterday_revenue: "0", last_week_revenue: "0" }} />);
    expect(screen.getByText("No revenue recorded for these comparison days.")).toBeInTheDocument();
    expect(Array.from(container.querySelectorAll<HTMLElement>(".comparison-bar")).every((bar) => bar.style.height === "0%" )).toBe(true);
  });

  it("keeps every admin navigation destination and dismisses the mobile menu with Escape", async () => {
    mockFetch(
      route("GET", "/auth/me", () => ok(profile({ role: "ADMIN", permissions: NAV_GROUPS.flatMap((group) => group.items.flatMap((item) => item.permission ? [item.permission] : [])) }))),
      route("GET", "/admin/orders", () => ok([])),
    );
    renderApp("/orders");
    const nav = await screen.findByRole("navigation", { name: "Admin sections" });
    for (const item of NAV_GROUPS.flatMap((group) => group.items)) {
      expect(within(nav).getByRole("link", { name: item.label })).toHaveAttribute("href", item.path);
    }
    const toggle = screen.getByRole("button", { name: "Toggle menu" });
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    await userEvent.keyboard("{Escape}");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveFocus();
    await userEvent.click(toggle);
    await userEvent.click(within(nav).getByRole("link", { name: "Orders" }));
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });
});
