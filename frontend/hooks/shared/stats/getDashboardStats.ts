"use client";

import { statsApi } from "@/lib/api/stats.api";
import { useQuery } from "@tanstack/react-query";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => statsApi.getDashboardStats(),  
  });
}