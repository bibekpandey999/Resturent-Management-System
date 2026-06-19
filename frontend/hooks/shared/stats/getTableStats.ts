"use client";

import { statsApi } from "@/lib/api/stats.api";
import { useQuery } from "@tanstack/react-query";

export function useTableStats() {
  return useQuery({
    queryKey: ["table-stats"],
    queryFn: () => statsApi.getTableStats(),  
  });
}