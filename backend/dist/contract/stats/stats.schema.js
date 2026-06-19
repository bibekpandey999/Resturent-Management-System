"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.revenueStatsSchema = exports.revenueChartSchema = exports.revenueChartItemSchema = exports.tableStatsSchema = exports.dashboardStatsSchema = void 0;
const zod_1 = require("zod");
exports.dashboardStatsSchema = zod_1.z.object({
    totalRevenue: zod_1.z.number(),
    revenueChange: zod_1.z.number(),
    totalOrders: zod_1.z.number(),
    ordersChange: zod_1.z.number(),
    averageOrderValue: zod_1.z.number(),
    activeOrders: zod_1.z.number(),
});
exports.tableStatsSchema = zod_1.z.object({
    total: zod_1.z.number(),
    available: zod_1.z.number(),
    occupied: zod_1.z.number(),
    reserved: zod_1.z.number(),
});
exports.revenueChartItemSchema = zod_1.z.object({
    date: zod_1.z.string(),
    revenue: zod_1.z.number(),
    orders: zod_1.z.number(),
});
exports.revenueChartSchema = zod_1.z.object({
    success: zod_1.z.boolean(),
    data: zod_1.z.array(exports.revenueChartItemSchema),
});
exports.revenueStatsSchema = zod_1.z.object({
    totalRevenue: zod_1.z.number(),
    todayOrders: zod_1.z.number(),
    reservationsToday: zod_1.z.number(),
});
