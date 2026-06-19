"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { MetricCard, PageSection } from "@/components/dashboard/admin/shared";
import { useRevenueChart } from "@/hooks/admin/analytics/getRevenueAnalytic";
import { useRevenueStats } from "@/hooks/shared/stats/getRevenueStats";

export default function FinanceRevenuePage() {
  const [period, setPeriod] = useState<"7d" | "30d" | "90d" | "1y" | "all">(
    "30d",
  );
  const { data: getRevenue } = useRevenueChart(period);
  const revenueData = getRevenue?.data;
  const { data: stats } = useRevenueStats();

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Revenue"
        description="Monitor top-level revenue trends and daily performance."
      />
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          title="Today revenue"
          value={`Rs ${stats?.data?.totalRevenue?.toLocaleString() ?? 0}`}
        />

        <MetricCard title="Orders today" value={stats?.data?.todayOrders ?? 0} />

        <MetricCard
          title="Reservations today"
          value={stats?.data?.reservationsToday ?? 0}
        />
      </div>
      <PageSection title="Revenue Trend">
        <RevenueChart
          data={revenueData ?? []}
          period={period}
          setPeriod={setPeriod}
          title="Revenue Trend"
          description="Last seven days of revenue."
        />
      </PageSection>
    </div>
  );
}
