import { z } from "zod";

export const createReservationSchema = z.object({
  customerName: z.string(),
  customerPhone: z.string(),
  date: z.string(),
  time: z.string(),
  partySize: z.number(),
  tableId: z.string(),
  status: z.enum(["confirmed", "pending", "cancelled"]),
});

export const getReservationByIdSchema = z.object({
  _id: z.string().optional(),
  customerName: z.string(),
  customerPhone: z.string(),
  date: z.string(),
  time: z.string(),
  partySize: z.number(),
  tableId: z.string(),
  status: z.enum(["confirmed", "pending", "cancelled"]),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const getAllReservationSchema = z.array(getReservationByIdSchema);

export const updateReservationSchema = z.object({
  customerName: z.string().optional(),
  customerPhone: z.string().optional(),
  date: z.string().optional(),
  time: z.string().optional(),
  partySize: z.number().optional(),
  tableId: z.string().optional(),
  status: z.enum(["confirmed", "pending", "cancelled"]).optional(),
});
