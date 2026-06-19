import { z } from "zod";

export const createExpenseSchema = z.object({
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
  amount: z.number().min(0, "Amount must be positive"),
  date: z.string().min(1, "Date is required"),
  vendorName: z.string().optional(),
});

export const getExpenseByIdSchema = z.object({
  _id: z.string(),
  category: z.string(),
  description: z.string(),
  amount: z.number(),
  date: z.coerce.date().optional(),
  vendorName: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const getAllExpensesSchema = z.array(getExpenseByIdSchema);

export const updateExpenseSchema = z.object({
  category: z.string().optional(),
  description: z.string().optional(),
  amount: z.number().optional(),
  date: z.coerce.date().optional(),
  vendorName: z.string().optional(),
});
