"use client";

import { expensesApi } from "@/lib/api/expenses.api";
import { UsePaginationParams } from "@/lib/types/usePagination";
import { useQuery } from "@tanstack/react-query";

export function useAllExpenses({ page = 1, limit, search, category, supplier }: UsePaginationParams) {
  return useQuery({
    queryKey: ["expenses", page, limit, search, category, supplier],
    queryFn: () => expensesApi.getAllExpensesApi({page, limit, search, category, supplier}),  
  });
}
