"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { api } from "@/lib/api/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { statusStyle, MetricCard, PageSection, SearchField, TableBadge, formatDate } from "@/components/dashboard/admin/shared";
import type { AdminDashboardStats, Branch, Expense, Ingredient, MenuCategory, MenuItem, MenuModifier, Notification, Order, PurchaseOrder, Reservation, Role, SalesByCategory, StaffMember, StockMovement, Supplier, Table as DiningTable, TableSection, ManagedUser, RevenueData } from "@/lib/types";

export default function OrdersPage() {
  const { data: orders = [] } = useQuery<Order[]>({ queryKey: ['orders'], queryFn: () => api.getOrders() });
  const activeOrders = (orders: Order[]) => orders.filter(order => order.status === 'pending' || order.status === 'preparing' || order.status === 'ready' || order.status === 'served');

  return (
    <div className="space-y-6">
      <DashboardHeader title="Active Orders" description="Monitor orders currently in progress." />
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard title="Open orders" value={activeOrders(orders).length} />
        <MetricCard title="Completed" value={orders.filter((order) => order.status === 'completed').length} />
        <MetricCard title="Cancelled" value={orders.filter((order) => order.status === 'cancelled').length} />
      </div>
      <PageSection title="Order Queue">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Table</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Waiter</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activeOrders(orders).map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.orderNumber}</TableCell>
                <TableCell>{order.table.number}</TableCell>
                <TableCell>
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusStyle(order.status)}`}>
                    {order.status}
                  </span>
                </TableCell>
                <TableCell>{order.waiter.name}</TableCell>
                <TableCell>${order.total.toFixed(2)}</TableCell>
                <TableCell>{formatDate(order.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </PageSection>
    </div>
  );
}
