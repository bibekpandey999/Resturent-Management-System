import { initServer } from "@ts-rest/express";

import { reservationMutationHandler } from "./reservation.mutation";

import { reservationQueryHandler } from "./reservation.query";
import { reservationContract } from "../../contract/reservation/reservation.contract";

const s = initServer();

export const reservationRouter = s.router(reservationContract, {
  createReservation: reservationMutationHandler.createReservation,
  updateReservation: reservationMutationHandler.updateReservation,
  deleteReservation: reservationMutationHandler.deleteReservation,

  getAllReservation: reservationQueryHandler.getAllReservation,
  getReservationByID: reservationQueryHandler.getReservationByID,
  getReservationStats: reservationQueryHandler.getReservationStats,
});
