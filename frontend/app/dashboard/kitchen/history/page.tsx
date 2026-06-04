'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DashboardHeader } from '@/components/layout/dashboard-header';
import { api } from '@/lib/api/mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Order } from '@/lib/types';

export default function KitchenHistoryPage() {
  const [search, setSearch] = useState('');

  const { data: orders = [], refetch, isFetching } = useQuery<Order[]>({
    queryKey: ['kitchen-history'],
    queryFn: api.getCompletedOrders,
  });

  const filteredOrders = useMemo(
    () =>
      orders.filter(order => {
        const term = search.trim().toLowerCase();
        if (!term) return true;

        return (
          order.orderNumber.toLowerCase().includes(term) ||
          order.table.number.toString().includes(term) ||
          order.waiter.name.toLowerCase().includes(term) ||
          order.status.toLowerCase().includes(term)
        );
      }),
    [orders, search],
  );

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Kitchen Order History"
        description="Review completed kitchen orders and track fulfillment details."
      >
        <Button
          variant="outline"
          className="touch-target"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          Refresh
        </Button>
      </DashboardHeader>

      <Card>
        <CardHeader>
          <CardTitle>Completed Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Search by order number, table, waiter, or status.
              </p>
              <Input
                value={search}
                onChange={event => setSearch(event.target.value)}
                placeholder="Search kitchen history"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">
                {filteredOrders.length} orders
              </span>
            </div>
          </div>

          <Table className="mt-6">
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Table</TableHead>
                <TableHead>Waiter</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Completed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map(order => (
                  <TableRow key={order.id}>
                    <TableCell>{order.orderNumber}</TableCell>
                    <TableCell>{order.table.number}</TableCell>
                    <TableCell>{order.waiter.name}</TableCell>
                    <TableCell className="capitalize text-muted-foreground">
                      {order.status}
                    </TableCell>
                    <TableCell className="text-right">
                      ${order.total.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      {order.completedAt
                        ? order.completedAt.toLocaleString()
                        : '—'}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="p-6 text-center text-sm text-muted-foreground">
                    No completed kitchen orders match your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
