"use client";

'use client';

import { useQuery } from '@tanstack/react-query';
import { DollarSign, ShoppingCart, TrendingUp, Users } from 'lucide-react';
import { DashboardHeader } from '@/components/layout/dashboard-header';
import { StatsCard } from '@/components/dashboard/stats-card';
import { RevenueChart } from '@/components/dashboard/revenue-chart';
import { OrderList } from '@/components/dashboard/order-card';
import { ActivityFeed } from '@/components/dashboard/activity-feed';
import { TableStats } from '@/components/dashboard/table-grid';
import { api } from '@/lib/api/mock-data';
import { Button } from '@/components/ui/button';
import { Plus, Download } from 'lucide-react';
import type { DashboardStats, RevenueData, Order, ActivityLog, Table } from '@/lib/types';

export default function AdminDashboard() {
  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: () => api.getDashboardStats(),
  });

  const { data: revenueData } = useQuery<RevenueData[]>({
    queryKey: ['revenue-data'],
    queryFn: () => api.getRevenueData(),
  });

  const { data: orders } = useQuery<Order[]>({
    queryKey: ['active-orders'],
    queryFn: () => api.getActiveOrders(),
  });

  const { data: activities } = useQuery<ActivityLog[]>({
    queryKey: ['activity-log'],
    queryFn: () => api.getActivityLog(),
  });

  const { data: tables } = useQuery<Table[]>({
    queryKey: ['tables'],
    queryFn: () => api.getTables(),
  });

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Dashboard"
        description="Overview of your restaurant performance"
      >
      </DashboardHeader>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value={stats ? `$${stats.totalRevenue.toLocaleString()}` : '-'}
          change={stats?.revenueChange}
          icon={<DollarSign className="size-4" />}
        />
        <StatsCard
          title="Total Orders"
          value={stats?.totalOrders || '-'}
          change={stats?.ordersChange}
          icon={<ShoppingCart className="size-4" />}
        />
        <StatsCard
          title="Avg. Order Value"
          value={stats ? `$${stats.averageOrderValue.toFixed(2)}` : '-'}
          icon={<TrendingUp className="size-4" />}
        />
        <StatsCard
          title="Active Orders"
          value={stats?.activeOrders || '-'}
          icon={<Users className="size-4" />}
        />
      </div>

      {/* Table Status */}
      {tables && <TableStats tables={tables} />}

      {/* Charts and Activity */}
      <div className="grid gap-6 lg:grid-cols-7">
        <div className="lg:col-span-4">
          {revenueData && <RevenueChart data={revenueData} />}
        </div>
        <div className="lg:col-span-3">
          {activities && <ActivityFeed activities={activities} />}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="grid gap-6 lg:grid-cols-2">
        {orders && (
          <OrderList
            orders={orders.slice(0, 5)}
            title="Recent Orders"
            emptyMessage="No active orders"
          />
        )}
        {orders && (
          <OrderList
            orders={orders.filter(o => o.status === 'ready')}
            title="Ready for Pickup"
            emptyMessage="No orders ready"
          />
        )}
      </div>
    </div>
  );
}

