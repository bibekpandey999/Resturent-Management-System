import { z } from "zod";

export const createReservationSchema = z.object({
  customerName: z
    .string()
    .min(1, "Customer name is required")
    .max(100, "Name is too long"),

  customerPhone: z
    .string()
    .min(7, "Phone number is too short")
    .max(15, "Phone number is too long")
    .regex(/^[0-9+\- ]+$/, "Invalid phone number format"),

  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),

  time: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:mm)"),

  partySize: z
    .number()
    .int("Party size must be a whole number")
    .min(1, "Party size must be at least 1")
    .max(50, "Party size too large"),

  tableId: z.string().min(1, "Table selection is required"),

  status: z.enum(["confirmed", "pending", "cancelled"]).default("confirmed"),
});

export type TCreateReservationSchema = z.infer<typeof createReservationSchema>;

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

export type TGetReservationByIdSchema = z.infer<
  typeof getReservationByIdSchema
>;

export const getAllReservationSchema = z.array(getReservationByIdSchema);

export type TGetAllReservationSchema = z.infer<typeof getAllReservationSchema>;

export const updateReservationSchema = z.object({
  customerName: z.string().optional(),
  customerPhone: z.string().optional(),
  date: z.string().optional(),
  time: z.string().optional(),
  partySize: z.number().optional(),
  tableId: z.string().optional(),
  status: z.enum(["confirmed", "pending", "cancelled"]).optional(),
});

export type TUpdateReservationSchema = z.infer<typeof updateReservationSchema>;

export const deleteReservationSchema = z.object({
  _id: z.string().uuid("Invalid Resrvation ID"),
});

export type TDeleteReservationSchema = z.infer<typeof deleteReservationSchema>;
