import { apiClient } from "@/utils/apiClient";
import { UsePaginationParams } from "../types/usePagination";
import {
  TDeleteTicketSchema,
  TGetTicketByIdSchema,
} from "../validations/ticket.validation";

const getLiveTicketsApi = async (params: UsePaginationParams) => {
  const response = await apiClient.get("/ticket", {
    params,
  });
  return response.data;
};

const getTicketByIdApi = async (ticketId: TGetTicketByIdSchema["_id"]) => {
  const response = await apiClient.get(`/ticket/${ticketId}`);
  return response.data;
};

const getTicketsByOrderApi = async (tableId: string) => {
  const response = await apiClient.get(`/ticket/table/${tableId}`);
  return response.data;
};

const updateticketStatusApi = async (ticketId: string, status: string) => {
  const response = await apiClient.put(`/ticket/${ticketId}`, {
    status,
  });

  return response.data;
};

const deleteticketApi = async (ticketId: TDeleteTicketSchema["_id"]) => {
  const response = await apiClient.delete(`/ticket/${ticketId}`);
  return response.data;
};
const updateTicketDiscountApi = async (
  ticketId: string,
  payload: { discount: number; discountPercent: number }
) => {
  const response = await apiClient.put(`/ticket/${ticketId}/discount`, payload);

  return response.data;
};

const markTicketPrintedApi = async (ticketId: string) => {
  const response = await apiClient.put(`/ticket/${ticketId}`, {
    printed: true,
  });
  return response.data;
};

export const ticketApi = {
  getLiveTicketsApi,
  getTicketByIdApi,
  updateticketStatusApi,
  updateTicketDiscountApi,
  deleteticketApi,
  getTicketsByOrderApi,
  markTicketPrintedApi,
};


