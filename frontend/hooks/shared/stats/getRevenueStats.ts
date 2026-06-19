import { statsApi } from "@/lib/api/stats.api";
import { useQuery } from "@tanstack/react-query";

export const useRevenueStats = () => {
  return useQuery({
    queryKey: ["revenue-stats"],
    queryFn: () => statsApi.getRevenueStats(),  
  });
};