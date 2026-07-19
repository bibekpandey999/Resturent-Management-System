// lib/api/bill.api.ts
import { apiClient } from "@/utils/apiClient";

export interface CreateBillPayload {
  orderId: string;
  tableId: string;
  items: any[];
  subtotal: number;
  tax: number;
  total: number;
  status: string;
}

export const createBill = async (data: CreateBillPayload) => {
  const res = await apiClient.post("/bill", data);
  return res.data;
};

const getAllBillsApi = async (params?: any) => {
  const response = await apiClient.get("/bill", { params });
  return response.data;
};

const getBillByIdApi = async (billId: string) => {
  const response = await apiClient.get(`/bill/${billId}`);
  return response.data;
};

const updateBillStatusApi = async (billId: string, status: string) => {
  const response = await apiClient.put(`/bill/${billId}`, { status });
  return response.data;
};

export const billApi = {
  createBill,
  getAllBillsApi,
  getBillByIdApi,
  updateBillStatusApi,
};