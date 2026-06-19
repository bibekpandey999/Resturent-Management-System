import { apiClient } from "@/utils/apiClient";
import { UsePaginationParams } from "../types/usePagination";

export const getAllStockMovementsApi = async (params: UsePaginationParams) => {
  const res = await apiClient.get("/stock-movement", {
    params,
  });
  return res.data;
};

export const getStockMovementByIdApi = async (id: string) => {
  const res = await apiClient.get(`/stock-movement/${id}`);
  return res.data;
};

export const stockMovementApi = {
  getAllStockMovementsApi,
  getStockMovementByIdApi,
};
