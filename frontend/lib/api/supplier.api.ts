import { apiClient } from "@/utils/apiClient";
import { TCreateSupplier, TUpdateSupplier } from "@/lib/types/supplier.types";
import { UsePaginationParams } from "../types/usePagination";
import { TDeleteSupplierSchema } from "../validations/supplier.validation";

export const createSupplierApi = async (data: TCreateSupplier) => {
  const res = await apiClient.post("/supplier", data);
  return res.data;
};

export const getAllSuppliersApi = async (params: UsePaginationParams) => {
  const res = await apiClient.get("/supplier", {
    params,
  });
  return res.data;
};

export const getSupplierByIdApi = async (id: string) => {
  const res = await apiClient.get(`/supplier/${id}`);
  return res.data;
};

export const updateSupplierApi = async (id: string, data: TUpdateSupplier) => {
  const res = await apiClient.put(`/supplier/${id}`, data);
  return res.data;
};

export const deleteSupplierApi = async (
  supplierId: TDeleteSupplierSchema["_id"],
) => {
  const response = await apiClient.delete(`/supplier/${supplierId}`);
  return response.data;
};

export const supplierApi = {
  createSupplierApi,
  getAllSuppliersApi,
  getSupplierByIdApi,
  updateSupplierApi,
  deleteSupplierApi,
};
