"use client";

import { statsApi } from "@/lib/api/stats.api";
import { useQuery } from "@tanstack/react-query";

export function useRevenueChart(period: "7d" | "30d" | "90d" | "1y" | "all") {
  return useQuery({
    queryKey: ["revenue-chart", period],
    queryFn: () => statsApi.getRevenueAnalytic(period),
    staleTime: 1000 * 60 * 5,
  });
}
