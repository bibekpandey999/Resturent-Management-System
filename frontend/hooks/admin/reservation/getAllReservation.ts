"use client";

import { reservationApi } from "@/lib/api/reservation.api";
import { UsePaginationParams } from "@/lib/types/usePagination";
import { useQuery } from "@tanstack/react-query";

export function useAllReservation({ page = 1, limit, search }: UsePaginationParams) {
  return useQuery({
    queryKey: ["reservation", page, limit, search],
    queryFn: () => reservationApi.getAllReservationApi({page, limit, search}),  
  });
}