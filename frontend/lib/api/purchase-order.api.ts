import { apiClient } from "@/utils/apiClient";
import { UsePaginationParams } from "../types/usePagination";
import {
  TCreatePurchaseOrderSchema,
  TDeletePurchaseOrderSchema,
  TUpdatePurchaseOrderSchema,
} from "../validations/purchase-order.validation";

export const createPurchaseOrderApi = async (
  data: TCreatePurchaseOrderSchema,
) => {
  const res = await apiClient.post("/purchase", data);
  return res.data;
};

export const getAllPurchaseOrdersApi = async (params: UsePaginationParams) => {
  const res = await apiClient.get("/purchase", {
    params,
  });
  return res.data;
};

export const getPurchaseOrderByIdApi = async (id: string) => {
  const res = await apiClient.get(`/purchase/${id}`);
  return res.data;
};

export const updatePurchaseOrderApi = async (
  id: string,
  data: TUpdatePurchaseOrderSchema,
) => {
  const res = await apiClient.put(`/purchase/${id}`, data);
  return res.data;
};

export const deletePurchaseOrderApi = async (
  purchaseOrderId: TDeletePurchaseOrderSchema["_id"],
) => {
  const response = await apiClient.delete(`/purchase/${purchaseOrderId}`);
  return response.data;
};

export const purchaseOrderApi = {
  createPurchaseOrderApi,
  getAllPurchaseOrdersApi,
  getPurchaseOrderByIdApi,
  updatePurchaseOrderApi,
  deletePurchaseOrderApi,
};
