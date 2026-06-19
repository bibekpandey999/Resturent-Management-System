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
    .string()
    .min(1, "Purchase date is required"),
  notes: z
    .string()
    .optional(),
  items: z
    .array(purchaseItemSchema)
    .min(1, "At least one item is required"),
});

export type TCreatePurchaseOrderSchema = z.infer<typeof createPurchaseSchema>;

export const updatePurchaseSchema = z.object({
  supplierId: z.string().optional(),
  invoiceNumber: z.string().optional(),
  purchaseDate: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(purchaseItemSchema).optional(),
});

export type TUpdatePurchaseOrderSchema = z.infer<typeof updatePurchaseSchema>;

export const getPurchaseByIdSchema = z.object({
  _id: z.string(),
  supplierId: z.string(),
  invoiceNumber: z.string(),
  purchaseDate: z.string(),
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

export type TGetPurchaseOrderByIdSchema = z.infer<typeof getPurchaseByIdSchema>;

export const getAllPurchaseSchema = z.array(getPurchaseByIdSchema);

export type TGetAllPurchaseOrderSchema = z.infer<typeof getAllPurchaseSchema>;

export const deletePurchaseSchema = z.object({
  _id: z.string().min(1, "Invalid purchase ID"),
});

export type TDeletePurchaseOrderSchema = z.infer<typeof deletePurchaseSchema>;