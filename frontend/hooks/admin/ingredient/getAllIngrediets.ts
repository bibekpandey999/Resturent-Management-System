"use client";

import { ingredientApi } from "@/lib/api/ingredient.api";
import { UsePaginationParams } from "@/lib/types/usePagination";
import { useQuery } from "@tanstack/react-query";

export function useAllIngredient({ page = 1, limit, search }: UsePaginationParams) {
  return useQuery({
    queryKey: ["inventories", page, limit, search],
    queryFn: () => ingredientApi.getAllIngredientApi({page, limit, search}),  
  });
}
