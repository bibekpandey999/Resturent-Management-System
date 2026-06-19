import { initContract } from "@ts-rest/core";
import { z } from "zod";
import {
  createReservationSchema,
  getAllReservationSchema,
  getReservationByIdSchema,
  updateReservationSchema,
} from "./reservation.schema";
import { errorSchema, successSchema } from "../commonSchema";

const c = initContract();

export const reservationContract = c.router({
  createReservation: {
    method: "POST",
    path: "/reservation",
    summary: "Create a new table reservation",
    body: createReservationSchema,
    responses: {
      201: successSchema,
      400: errorSchema,
      500: errorSchema,
    },
  },

  getAllReservation: {
    method: "GET",
    path: "/reservation",
    summary: "Get all reservations with pagination, search and filters",
    query: z.object({
      page: z.coerce.number().optional(),
      limit: z.coerce.number().optional(),
      search: z.string().optional(),
      status: z.string().optional(),
      date: z.string().optional(),
    }),
    responses: {
      200: z.object({
        data: getAllReservationSchema,
        pagination: z.object({
          page: z.number(),
          limit: z.number(),
          total: z.number(),
          totalPages: z.number(),
        }),
      }),
    },
  },

  getReservationByID: {
    method: "GET",
    path: "/reservation/:reservationId",
    summary: "Get detailed reservation information by reservation ID",
    responses: {
      200: getReservationByIdSchema,
      404: errorSchema,
    },
  },

  getReservationStats: {
    method: "GET",
    path: "/reservation/stats",
    summary: "Get reservation statistics (total, confirmed, pending, cancelled)",
    responses: {
      200: z.object({
        total: z.number(),
        confirmed: z.number(),
        pending: z.number(),
        cancelled: z.number(),
      }),
    },
  },

  updateReservation: {
    method: "PUT",
    path: "/reservation/:reservationId",
    summary: "Update reservation details by ID",
    pathParams: z.object({
      reservationId: z.string(),
    }),
    body: updateReservationSchema,
    responses: {
      200: successSchema,
      400: errorSchema,
      404: errorSchema,
      500: errorSchema,
    },
  },

  deleteReservation: {
    method: "DELETE",
    path: "/reservation/:reservationId",
    summary: "Delete a reservation permanently by ID",
    responses: {
      200: z.object({
        success: z.boolean(),
      }),
    },
    body: z.object({}),
  },
});