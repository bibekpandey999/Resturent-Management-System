"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReservationSchema = exports.getAllReservationSchema = exports.getReservationByIdSchema = exports.createReservationSchema = void 0;
const zod_1 = require("zod");
exports.createReservationSchema = zod_1.z.object({
    customerName: zod_1.z.string(),
    customerPhone: zod_1.z.string(),
    date: zod_1.z.string(),
    time: zod_1.z.string(),
    partySize: zod_1.z.number(),
    tableId: zod_1.z.string(),
    status: zod_1.z.enum(["confirmed", "pending", "cancelled"]),
});
exports.getReservationByIdSchema = zod_1.z.object({
    _id: zod_1.z.string().optional(),
    customerName: zod_1.z.string(),
    customerPhone: zod_1.z.string(),
    date: zod_1.z.string(),
    time: zod_1.z.string(),
    partySize: zod_1.z.number(),
    tableId: zod_1.z.string(),
    status: zod_1.z.enum(["confirmed", "pending", "cancelled"]),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
exports.getAllReservationSchema = zod_1.z.array(exports.getReservationByIdSchema);
exports.updateReservationSchema = zod_1.z.object({
    customerName: zod_1.z.string().optional(),
    customerPhone: zod_1.z.string().optional(),
    date: zod_1.z.string().optional(),
    time: zod_1.z.string().optional(),
    partySize: zod_1.z.number().optional(),
    tableId: zod_1.z.string().optional(),
    status: zod_1.z.enum(["confirmed", "pending", "cancelled"]).optional(),
});
