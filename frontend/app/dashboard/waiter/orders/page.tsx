'use client';

import { useQuery } from '@tanstack/react-query';
import { DashboardHeader } from '@/components/layout/dashboard-header';
import { OrderList } from '@/components/dashboard/order-card';
import { api } from '@/lib/api/mock-data';

export default function WaiterOrdersPage() {
  const { data: activeOrders } = useQuery({
    queryKey: ['active-orders'],
    queryFn: api.getActiveOrders,
  });

  const { data: completedOrders } = useQuery({
    queryKey: ['completed-orders'],
    queryFn: api.getCompletedOrders,
  });

  const waiterOrders = activeOrders?.filter(
    order => order.waiterId === '2' || order.waiterId === '5',
  ) ?? [];

  const waiterHistory = completedOrders?.filter(
    order => order.waiterId === '2' || order.waiterId === '5',
  ) ?? [];

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Orders"
        description="View the waiter order queue and completed history."
      />

      <OrderList
        orders={waiterOrders}
        title="Active Orders"
        emptyMessage="No active waiter orders"
      />

      <OrderList
        orders={waiterHistory}
        title="Completed Orders"
        emptyMessage="No completed orders yet"
      />
    </div>
  );
}
