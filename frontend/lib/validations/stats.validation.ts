import { z } from "zod";

export const dashboardStatsSchema = z.object({
  totalRevenue: z.number(),
  revenueChange: z.number(),
  totalOrders: z.number(),
  ordersChange: z.number(),
  averageOrderValue: z.number(),
  activeOrders: z.number(),
});

export type TDashboardStats = z.infer<
  typeof dashboardStatsSchema
>;

export const tableStatsSchema = z.object({
  total: z.number(),
  available: z.number(),
  occupied: z.number(),
  reserved: z.number(),
});

export type TTableStats = z.infer<
  typeof tableStatsSchema
>;

export const revenueChartItemSchema = z.object({
  date: z.string(),
  revenue: z.number(),
  orders: z.number(),
});

export const revenueChartSchema = z.object({
  success: z.boolean(),
  data: z.array(revenueChartItemSchema),
});