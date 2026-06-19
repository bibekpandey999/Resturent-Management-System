export interface TDashboardStats {
  totalRevenue: number;
  revenueChange: number;
  totalOrders: number;
  ordersChange: number;
  averageOrderValue: number;
  activeOrders: number;
}

export interface TTableStats {
  total: number;
  available: number;
  occupied: number;
  reserved: number;
}
