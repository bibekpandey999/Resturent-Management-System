import { apiClient } from "@/utils/apiClient";
import {
  TCreateReservationSchema,
  TDeleteReservationSchema,
} from "../validations/reservation.validation";
import { UsePaginationParams } from "../types/usePagination";

export const createReservationApi = async (data: TCreateReservationSchema) => {
  const res = await apiClient.post("/reservation", data);
  return res.data;
};

const getAllReservationApi = async (params: UsePaginationParams) => {
  const response = await apiClient.get("/reservation", {
    params,
  });
  return response.data;
};

export const getReservationByIdApi = async (id: string) => {
  const res = await apiClient.get(`/reservation/${id}`);
  return res.data;
};

export const updateReservationApi = async (
  id: string,
  data: Partial<TCreateReservationSchema>,
) => {
  const res = await apiClient.put(`/reservation/${id}`, data);
  return res.data;
};

export const getReservationStatsApi = async () => {
  const res = await apiClient.get("/reservation/stats");
  return res.data;
};

export const deleteReservationApi = async (
  reservationId: TDeleteReservationSchema["_id"],
) => {
  const response = await apiClient.delete(`/reservation/${reservationId}`);
  return response.data;
};

export const reservationApi = {
  createReservationApi,
  getAllReservationApi,
  getReservationByIdApi,
  updateReservationApi,
  getReservationStatsApi,
  deleteReservationApi,
};
