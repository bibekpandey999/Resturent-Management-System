"use strict";
// lib/validations/supplier.validation.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSupplierSchema = exports.updateSupplierSchema = exports.getSupplierByIdSchema = exports.createSupplierSchema = void 0;
const zod_1 = require("zod");
exports.createSupplierSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Supplier name is required"),
    contactPerson: zod_1.z.string().min(1, "Contact person is required"),
    phone: zod_1.z
        .string()
        .min(10, "Must be exactly 10 digits")
        .max(10, "Must be exactly 10 digits")
        .regex(/^[0-9+\- ]+$/, "Invalid phone number"),
    email: zod_1.z.string().email("Invalid email format"),
    address: zod_1.z.string().min(1, "Address is required"),
    isActive: zod_1.z.boolean().default(true),
});
exports.getSupplierByIdSchema = zod_1.z.object({
    _id: zod_1.z.string(),
    name: zod_1.z.string(),
    contactPerson: zod_1.z.string(),
    phone: zod_1.z.string(),
    email: zod_1.z.string(),
    address: zod_1.z.string(),
    isActive: zod_1.z.boolean(),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
const getAllSupplierSchema = zod_1.z.array(exports.getSupplierByIdSchema);
exports.updateSupplierSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    contactPerson: zod_1.z.string().optional(),
    phone: zod_1.z
        .string()
        .regex(/^[0-9+\- ]+$/, "Invalid phone number")
        .optional(),
    email: zod_1.z.string().email("Invalid email").optional(),
    address: zod_1.z.string().optional(),
    isActive: zod_1.z.boolean().default(true),
});
exports.deleteSupplierSchema = zod_1.z.object({
    _id: zod_1.z.string().uuid("Invalid Supplier ID"),
});
