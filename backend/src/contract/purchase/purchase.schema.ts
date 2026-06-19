import { z } from "zod";

export const purchaseItemSchema = z.object({
  ingredientId: z
    .string()
    .min(1, "Ingredient is required"),
  quantity: z
    .number()
    .min(1, "Quantity must be at least 1"),
  unitPrice: z
    .number()
    .min(0, "Unit price must be 0 or greater"),
});

export const createPurchaseSchema = z.object({
  supplierId: z
    .string()
    .min(1, "Supplier is required"),
  invoiceNumber: z
    .string()
    .min(1, "Invoice number is required"),
  purchaseDate: z
    .string(),
  notes: z
    .string()
    .optional(),
  items: z
    .array(purchaseItemSchema)
    .min(1, "At least one item is required"),
});

export const updatePurchaseSchema = z.object({
  supplierId: z.string().optional(),
  invoiceNumber: z.string().optional(),
  purchaseDate: z.date().optional(),
  items: z.array(purchaseItemSchema).optional(),
});

export const getPurchaseByIdSchema = z.object({
  _id: z.string(),
  supplierId: z.string(),
  invoiceNumber: z.string(),
  purchaseDate: z.date(),
  notes: z.string().optional(),
  totalAmount: z.number(),
  items: z.array(
    z.object({
      ingredientId: z.string(),
      quantity: z.number(),
      unitPrice: z.number(),
      totalPrice: z.number(),
    }),
  ),
});

export const getAllPurchaseSchema = z.array(getPurchaseByIdSchema);
