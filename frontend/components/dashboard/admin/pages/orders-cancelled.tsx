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

export default function CancelledOrdersPage() {
  const { data: orders = [] } = useQuery<Order[]>({ queryKey: ['orders'], queryFn: () => api.getOrders() });
  const cancelled = useMemo(() => orders.filter((order) => order.status === 'cancelled'), [orders]);

  return (
    <div className="space-y-6">
      <DashboardHeader title="Cancelled Orders" description="Track orders that were voided or cancelled." />
      <PageSection title="Cancelled Orders">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Table</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Waiter</TableHead>
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cancelled.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.orderNumber}</TableCell>
                <TableCell>{order.table.number}</TableCell>
                <TableCell>{order.notes ?? 'Cancelled by staff'}</TableCell>
                <TableCell>{order.waiter.name}</TableCell>
                <TableCell>${order.total.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </PageSection>
    </div>
  );
}
