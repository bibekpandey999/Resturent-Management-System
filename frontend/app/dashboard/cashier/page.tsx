'use client';

import { useQuery } from '@tanstack/react-query';
import { DashboardHeader } from '@/components/layout/dashboard-header';
import { StatsCard } from '@/components/dashboard/stats-card';
import { OrderList } from '@/components/dashboard/order-card';
import { TableStats } from '@/components/dashboard/table-grid';
import { api } from '@/lib/api/mock-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  DollarSign, 
  Receipt, 
  CreditCard, 
  Clock,
  CheckCircle2,
  Printer
} from 'lucide-react';
import type { Order } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function CashierDashboard() {
  const { data: orders } = useQuery({
    queryKey: ['active-orders'],
    queryFn: api.getActiveOrders,
  });

  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: api.getDashboardStats,
  });

  const { data: tables } = useQuery({
    queryKey: ['tables'],
    queryFn: api.getTables,
  });

  // Orders ready for checkout (served status)
  const checkoutReady = orders?.filter(o => o.status === 'served') || [];
  
  // Today's completed orders (mock - in real app would filter by date)
  const todayRevenue = stats?.totalRevenue || 0;
  const todayOrders = stats?.totalOrders || 0;

  const handleCheckout = (order: Order) => {
    console.log('[v0] Processing checkout for order:', order.id);
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Checkout"
        description="Process payments and manage bills"
      >
        <Button variant="outline" className="touch-target">
          <Printer className="size-4 mr-2" />
          Print Report
        </Button>
      </DashboardHeader>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatsCard
          title="Today&apos;s Revenue"
          value={`$${todayRevenue.toLocaleString()}`}
          icon={<DollarSign className="size-4" />}
        />
        <StatsCard
          title="Orders Processed"
          value={todayOrders}
          icon={<Receipt className="size-4" />}
        />
        <StatsCard
          title="Ready for Checkout"
          value={checkoutReady.length}
          icon={<CreditCard className="size-4" />}
        />
        <StatsCard
          title="Avg. Transaction"
          value={`$${stats?.averageOrderValue.toFixed(2) || '0.00'}`}
          icon={<Clock className="size-4" />}
        />
      </div>

      {/* Table Status */}
      {tables && <TableStats tables={tables} />}

      {/* Checkout Ready Orders */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Ready for Checkout</CardTitle>
            <CardDescription>Tables waiting to pay</CardDescription>
          </CardHeader>
          <CardContent>
            {checkoutReady.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No tables ready for checkout
              </p>
            ) : (
              <div className="space-y-4">
                {checkoutReady.map((order) => (
                  <div 
                    key={order.id}
                    className="rounded-lg border border-primary/30 bg-primary/5 p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex size-12 items-center justify-center rounded-lg bg-primary/20 text-lg font-bold text-primary">
                          {order.table.number}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{order.orderNumber}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.items.length} items - {order.waiter.name}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
                        Ready to Pay
                      </Badge>
                    </div>
                    
                    <Separator className="my-3" />
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-muted-foreground">
                        <span>Subtotal</span>
                        <span>${order.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Tax</span>
                        <span>${order.tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold text-foreground">
                        <span>Total</span>
                        <span>${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex gap-2">
                      <Button 
                        className="flex-1 touch-target"
                        onClick={() => handleCheckout(order)}
                      >
                        <CreditCard className="size-4 mr-2" />
                        Process Payment
                      </Button>
                      <Button variant="outline" className="touch-target">
                        <Printer className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Transactions</CardTitle>
            <CardDescription>Today&apos;s completed payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Mock recent transactions */}
              {[
                { id: '1', table: 6, amount: 87.50, time: '2 min ago', method: 'Card' },
                { id: '2', table: 1, amount: 45.00, time: '15 min ago', method: 'Cash' },
                { id: '3', table: 5, amount: 156.75, time: '32 min ago', method: 'Card' },
                { id: '4', table: 8, amount: 92.30, time: '45 min ago', method: 'Card' },
              ].map((tx) => (
                <div 
                  key={tx.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-success/20">
                      <CheckCircle2 className="size-5 text-success" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Table {tx.table}</p>
                      <p className="text-xs text-muted-foreground">{tx.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">${tx.amount.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">{tx.method}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Orders (not yet ready for checkout) */}
      {orders && (
        <OrderList
          orders={orders.filter(o => o.status !== 'served')}
          title="Active Orders"
          emptyMessage="No active orders"
        />
      )}
    </div>
  );
}
