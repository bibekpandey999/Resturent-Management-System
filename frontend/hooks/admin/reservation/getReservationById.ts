"use client";

import { reservationApi } from "@/lib/api/reservation.api";
import { useQuery } from "@tanstack/react-query";

export function useReservationById(reservationId: string) {
  return useQuery({
    queryKey: ["reservation by Id"],
    queryFn: () => reservationApi.getReservationByIdApi(reservationId),
  });
}