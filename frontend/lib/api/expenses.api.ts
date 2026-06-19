import { apiClient } from "@/utils/apiClient";
import {
  TCreateExpenseSchema,
  TDeleteExpenseSchema,
  TGetExpenseByIdSchema,
} from "../validations/expenses.validation";
import { UsePaginationParams } from "../types/usePagination";

export const createExpenseApi = async (data: TCreateExpenseSchema) => {
  const res = await apiClient.post("/expense", data);
  return res.data;
};

const getAllExpensesApi = async (params: UsePaginationParams) => {
  const response = await apiClient.get("/expense", {
    params,
  });
  return response.data;
};

const getExpensesByIdApi = async (expensesId: TGetExpenseByIdSchema["_id"]) => {
  const response = await apiClient.get(`/expense/${expensesId}`);
  return response.data;
};

const updateExpensesApi = async (expensesId: string, formData: FormData) => {
  const response = await apiClient.put(`/expense/${expensesId}`, formData, {});
  return response.data;
};

const deleteExpensesApi = async (expensesId: TDeleteExpenseSchema["_id"]) => {
  const response = await apiClient.delete(`/expense/${expensesId}`);
  return response.data;
};

export const expensesApi = {
  createExpenseApi,
  getAllExpensesApi,
  getExpensesByIdApi,
  updateExpensesApi,
  deleteExpensesApi,
};
