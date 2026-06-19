import { z } from "zod";
import { INGREDIENT_UNITS } from "../../utils/measuringUnits";

export const createIngredientSchema = z.object({
  name: z.string().min(1, "Ingredient name is required").trim(),
  category: z.string().min(1, "Category is required").trim().optional(),
  unit: z.enum(INGREDIENT_UNITS, {
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

export const getIngredientByIdSchema = z.object({
  _id: z.string(),
  name: z.string(),
  unit: z.string(),
  currentStock: z.number(),
  minimumStock: z.number(),
  lastStockInDate: z.string().optional(),
  category: z.string().optional(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const getAllIngredients = z.array(getIngredientByIdSchema);

export const updateIngredientSchema = z.object({
  name: z.string().optional(),
  unit: z.enum(INGREDIENT_UNITS).optional(),
  currentStock: z.number().min(0).optional(),
  minimumStock: z.number().min(0).optional(),
  category: z.string().optional(),
  isActive: z.boolean().optional(),
});
