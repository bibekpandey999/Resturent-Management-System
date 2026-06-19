"use client";

import { ingredientApi } from "@/lib/api/ingredient.api";
import { useQuery } from "@tanstack/react-query";

export function useIngredientById(ingredientId: string) {
  return useQuery({
    queryKey: ["ingredient by Id"],
    queryFn: () => ingredientApi.getIngredientByIdApi(ingredientId),
  });
}