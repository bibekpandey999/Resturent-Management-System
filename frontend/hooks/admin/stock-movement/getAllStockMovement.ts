"use client";

import { stockMovementApi } from "@/lib/api/stock-movement.api";
import { UsePaginationParams } from "@/lib/types/usePagination";
import { useQuery } from "@tanstack/react-query";

export function useAllStockMovement({ page = 1, limit, search }: UsePaginationParams) {
  return useQuery({
    queryKey: ["stock-movement", page, limit, search],
    queryFn: () => stockMovementApi.getAllStockMovementsApi({page, limit, search}),  
  });
}
