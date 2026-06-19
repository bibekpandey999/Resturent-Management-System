"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPurchaseSchema = exports.getPurchaseByIdSchema = exports.updatePurchaseSchema = exports.createPurchaseSchema = exports.purchaseItemSchema = void 0;
const zod_1 = require("zod");
exports.purchaseItemSchema = zod_1.z.object({
    ingredientId: zod_1.z
        .string()
        .min(1, "Ingredient is required"),
    quantity: zod_1.z
        .number()
        .min(1, "Quantity must be at least 1"),
    unitPrice: zod_1.z
        .number()
        .min(0, "Unit price must be 0 or greater"),
});
exports.createPurchaseSchema = zod_1.z.object({
    supplierId: zod_1.z
        .string()
        .min(1, "Supplier is required"),
    invoiceNumber: zod_1.z
        .string()
        .min(1, "Invoice number is required"),
    purchaseDate: zod_1.z
        .string(),
    notes: zod_1.z
        .string()
        .optional(),
    items: zod_1.z
        .array(exports.purchaseItemSchema)
        .min(1, "At least one item is required"),
});
exports.updatePurchaseSchema = zod_1.z.object({
    supplierId: zod_1.z.string().optional(),
    invoiceNumber: zod_1.z.string().optional(),
    purchaseDate: zod_1.z.date().optional(),
    items: zod_1.z.array(exports.purchaseItemSchema).optional(),
});
exports.getPurchaseByIdSchema = zod_1.z.object({
    _id: zod_1.z.string(),
    supplierId: zod_1.z.string(),
    invoiceNumber: zod_1.z.string(),
    purchaseDate: zod_1.z.date(),
    notes: zod_1.z.string().optional(),
    totalAmount: zod_1.z.number(),
    items: zod_1.z.array(zod_1.z.object({
        ingredientId: zod_1.z.string(),
        quantity: zod_1.z.number(),
        unitPrice: zod_1.z.number(),
        totalPrice: zod_1.z.number(),
    })),
});
exports.getAllPurchaseSchema = zod_1.z.array(exports.getPurchaseByIdSchema);
