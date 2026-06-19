"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateExpenseSchema = exports.getAllExpensesSchema = exports.getExpenseByIdSchema = exports.createExpenseSchema = void 0;
const zod_1 = require("zod");
exports.createExpenseSchema = zod_1.z.object({
    category: zod_1.z.string().min(1, "Category is required"),
    description: zod_1.z.string().min(1, "Description is required"),
    amount: zod_1.z.number().min(0, "Amount must be positive"),
    date: zod_1.z.string().min(1, "Date is required"),
    vendorName: zod_1.z.string().optional(),
});
exports.getExpenseByIdSchema = zod_1.z.object({
    _id: zod_1.z.string(),
    category: zod_1.z.string(),
    description: zod_1.z.string(),
    amount: zod_1.z.number(),
    date: zod_1.z.coerce.date().optional(),
    vendorName: zod_1.z.string().optional(),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
exports.getAllExpensesSchema = zod_1.z.array(exports.getExpenseByIdSchema);
exports.updateExpenseSchema = zod_1.z.object({
    category: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    amount: zod_1.z.number().optional(),
    date: zod_1.z.coerce.date().optional(),
    vendorName: zod_1.z.string().optional(),
});
