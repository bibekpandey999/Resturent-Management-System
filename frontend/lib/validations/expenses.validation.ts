import { z } from "zod";



export const createExpenseSchema = z.object({
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
  amount: z.number().min(0, "Amount must be positive"),
  date: z.string().min(1, "Date is required"),
  vendorName: z.string().optional(),
});

export type TCreateExpenseSchema = z.infer<typeof createExpenseSchema>;

export const getExpenseByIdSchema = z.object({
  _id: z.string(),
  category: z.string(),
  description: z.string(),
  amount: z.number(),
  date: z.string(),
  vendorName: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type TGetExpenseByIdSchema = z.infer<typeof getExpenseByIdSchema>;

export const getAllExpensesSchema = z.array(getExpenseByIdSchema);

export type TGetAllExpensesSchema = z.infer<typeof getAllExpensesSchema>;

export type TUpdateExpenseSchema = z.infer<typeof createExpenseSchema>;

export const deleteExpenseSchema = z.object({
  _id: z.string(),
});

export type TDeleteExpenseSchema = z.infer<typeof deleteExpenseSchema>;
