// lib/validations/supplier.validation.ts

import { z } from "zod";

export const createSupplierSchema = z.object({
  name: z.string().min(1, "Supplier name is required"),
  contactPerson: z.string().min(1, "Contact person is required"),
  phone: z
    .string()
    .min(10, "Must be exactly 10 digits")
    .max(10, "Must be exactly 10 digits")
    .regex(/^[0-9+\- ]+$/, "Invalid phone number"),

  email: z.string().email("Invalid email format"),
  address: z.string().min(1, "Address is required"),
  isActive: z.boolean().default(true),
});
export type TCreateSupplierSchema = z.infer<typeof createSupplierSchema>;

export const getSupplierByIdSchema = z.object({
  _id: z.string(),
  name: z.string(),
  contactPerson: z.string(),
  phone: z
    .string(),
  email: z.string(),
  address: z.string(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type TGetSupplierByIdSchema = z.infer<typeof getSupplierByIdSchema>;

const getAllSupplierSchema = z.array(getSupplierByIdSchema);

export type TAllSupplierSchema = z.infer<typeof getAllSupplierSchema>;

export const updateSupplierSchema = z.object({
  name: z.string().optional(),
  contactPerson: z.string().optional(),
  phone: z
    .string()
    .regex(/^[0-9+\- ]+$/, "Invalid phone number").optional(),

  email: z.string().email("Invalid email").optional(),
  address: z.string().optional(),
  isActive: z.boolean().default(true),
});

export type TUpdateSupplierSchema = z.infer<typeof updateSupplierSchema>;


export const deleteSupplierSchema = z.object({
  _id: z.string().uuid("Invalid Supplier ID"),
});

export type TDeleteSupplierSchema = z.infer<typeof deleteSupplierSchema>;