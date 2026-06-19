"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateIngredientSchema = exports.getAllIngredients = exports.getIngredientByIdSchema = exports.createIngredientSchema = void 0;
const zod_1 = require("zod");
const measuringUnits_1 = require("../../utils/measuringUnits");
exports.createIngredientSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Ingredient name is required").trim(),
    category: zod_1.z.string().min(1, "Category is required").trim().optional(),
    unit: zod_1.z.enum(measuringUnits_1.INGREDIENT_UNITS, {
        required_error: "Unit is required",
        invalid_type_error: "Invalid unit selected",
    }),
    currentStock: zod_1.z.coerce.number().min(0, "Stock cannot be negative").default(0),
    minimumStock: zod_1.z.coerce
        .number()
        .min(0, "Minimum stock cannot be negative")
        .default(0),
    isActive: zod_1.z.boolean().default(true),
});
exports.getIngredientByIdSchema = zod_1.z.object({
    _id: zod_1.z.string(),
    name: zod_1.z.string(),
    unit: zod_1.z.string(),
    currentStock: zod_1.z.number(),
    minimumStock: zod_1.z.number(),
    lastStockInDate: zod_1.z.string().optional(),
    category: zod_1.z.string().optional(),
    isActive: zod_1.z.boolean(),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
exports.getAllIngredients = zod_1.z.array(exports.getIngredientByIdSchema);
exports.updateIngredientSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    unit: zod_1.z.enum(measuringUnits_1.INGREDIENT_UNITS).optional(),
    currentStock: zod_1.z.number().min(0).optional(),
    minimumStock: zod_1.z.number().min(0).optional(),
    category: zod_1.z.string().optional(),
    isActive: zod_1.z.boolean().optional(),
});
