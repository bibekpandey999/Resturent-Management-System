"use client";

import { supplierApi } from "@/lib/api/supplier.api";
import { UsePaginationParams } from "@/lib/types/usePagination";
import { useQuery } from "@tanstack/react-query";

export function useAllSuppliers({ page = 1, limit, search }: UsePaginationParams) {
  return useQuery({
    queryKey: ["supplier", page, limit, search],
    queryFn: () => supplierApi.getAllSuppliersApi({page, limit, search}),  
  });
}