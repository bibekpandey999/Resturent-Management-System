"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { MetricCard, PageSection } from "@/components/dashboard/admin/shared";
import { ProfitLossChart } from "../../profit-loss-chart";
import { useProfitLossStats } from "@/hooks/shared/stats/getProfitLossStats";

export default function FinanceProfitLossPage() {
    const [period, setPeriod] = useState<"7d" | "30d" | "90d" | "1y" | "all">(
    "30d",
  );

  const { data: stats } = useProfitLossStats(period);

  const revenueTotal = stats?.data?.totalRevenue ?? 0;
  const expenseTotal = stats?.data?.totalExpenses ?? 0;
  const profit = stats?.data?.netProfit ?? 0;

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Profit & Loss"
        description="Compare income and costs across the business."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          title="Revenue"
          value={`Rs ${revenueTotal.toLocaleString()}`}
        />
        <MetricCard
          title="Expenses"
          value={`Rs ${expenseTotal.toLocaleString()}`}
        />
        <MetricCard title="Net Profit" value={`Rs ${profit.toLocaleString()}`} />
      </div>

      <PageSection title="Revenue vs Expenses">
        <ProfitLossChart
          data={stats?.data?.revenueSeries ?? []}
          period={period}
          setPeriod={setPeriod}
          title="Profit vs Loss Trend"
          description="Daily comparison of revenue, expenses and profit."
        />
      </PageSection>
    </div>
  );
}
