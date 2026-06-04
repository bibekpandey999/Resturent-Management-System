'use client';

import { useQuery } from '@tanstack/react-query';
import { DashboardHeader } from '@/components/layout/dashboard-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api/mock-data';
import type { Order } from '@/lib/types';

function getNotificationText(order: Order) {
  switch (order.status) {
    case 'pending':
      return `New order ${order.orderNumber} has been sent to the kitchen.`;
    case 'preparing':
      return `Order ${order.orderNumber} is being prepared.`;
    case 'ready':
      return `Order ${order.orderNumber} is ready for pickup.`;
    case 'served':
      return `Order ${order.orderNumber} has been served.`;
    default:
      return `Order ${order.orderNumber} was updated.`;
  }
}

export default function WaiterNotificationsPage() {
  const { data: activeOrders } = useQuery({
    queryKey: ['active-orders'],
    queryFn: api.getActiveOrders,
  });

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Notifications"
        description="Keep track of kitchen updates for your waiter orders."
      />

      {activeOrders?.length ? (
        <div className="space-y-4">
          {activeOrders.map((order) => (
            <Card key={order.id} className="border-border">
              <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <CardTitle className="text-foreground">{order.orderNumber}</CardTitle>
                  <p className="text-sm text-muted-foreground">Table {order.table.number} — {order.table.section}</p>
                </div>
                <Badge variant="outline" className="capitalize">
                  {order.status}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <p className="text-sm text-muted-foreground">{getNotificationText(order)}</p>
                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                  <span>{order.items.length} items</span>
                  <span>Server: {order.waiter.name}</span>
                  <span>Total: ${order.total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-border">
          <CardContent>
            <p className="text-center text-muted-foreground">No waiter notifications available yet.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
