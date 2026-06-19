"use client";

import { purchaseOrderApi } from "@/lib/api/purchase-order.api";
import { UsePaginationParams } from "@/lib/types/usePagination";
import { useQuery } from "@tanstack/react-query";

export function useAllPurchaseOrder({ page = 1, limit = 10, search }: UsePaginationParams) {
  return useQuery({
    queryKey: ["purchase-order", page, limit, search],
    queryFn: () => purchaseOrderApi.getAllPurchaseOrdersApi({page, limit, search}),  
  });
}
