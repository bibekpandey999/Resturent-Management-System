import { z } from "zod";
import { ingredientUnits } from "@/data/measuringUnits";

export const createIngredientSchema = z.object({
  name: z.string().min(1, "Ingredient name is required").trim(),
  category: z.string().min(1, "Category is required").trim().optional(),
  unit: z.enum(ingredientUnits, {
    required_error: "Unit is required",
    invalid_type_error: "Invalid unit selected",
  }),
  currentStock: z.coerce.number().min(0, "Stock cannot be negative").default(0),
  minimumStock: z.coerce
    .number()
    .min(0, "Minimum stock cannot be negative")
    .default(0),
  isActive: z.boolean().default(true),
});

export type TCreateIngredientSchema = z.infer<typeof createIngredientSchema>;

export const getIngredientByIdSchema = z.object({
  _id: z.string(),
  name: z.string(),
  unit: z.string(),
  currentStock: z.number(),
  minimumStock: z.number(),
  stockValue: z.number(),
  category: z.string().optional(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type TGetIngredientByIdSchema = z.infer<typeof getIngredientByIdSchema>;

export const getAllIngredients = z.array(getIngredientByIdSchema);

export type TGetAllIngredientSchema = z.infer<typeof getAllIngredients>;

export const updateIngredientSchema = z.object({
  name: z.string().optional(),
  unit: z.enum(ingredientUnits).optional(),
  currentStock: z.number().min(0).optional(),
  minimumStock: z.number().min(0).optional(),
  stockValue: z.number().min(0).optional(),
  category: z.string().optional(),
  isActive: z.boolean().optional(),
});
export type TUpdateIngredientSchema = z.infer<typeof updateIngredientSchema>;

export const deleteIngredientSchema = z.object({
  _id: z.string(),
});

export type TDeleteIngredientSchema = z.infer<typeof deleteIngredientSchema>;
