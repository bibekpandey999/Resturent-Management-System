import { statsApi } from "@/lib/api/stats.api";
import { useQuery } from "@tanstack/react-query";

export const useProfitLossStats = (period: "7d" | "30d" | "90d" | "1y" | "all") => {
  return useQuery({
    queryKey: ["profit-loss-stats", period],
    queryFn: () => statsApi.getProfitLossStatsApi(period),  
  });
};