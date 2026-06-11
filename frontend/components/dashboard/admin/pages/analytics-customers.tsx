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

export default function CustomersAnalyticsPage() {
  const { data: reservations = [] } = useQuery<Reservation[]>({ queryKey: ['reservations'], queryFn: () => api.getReservations() });
  const { data: orders = [] } = useQuery<Order[]>({ queryKey: ['orders'], queryFn: () => api.getOrders() });

  return (
    <div className="space-y-6">
      <DashboardHeader title="Customer Analytics" description="Analyze customer visits, reservations and order volume." />
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard title="Reservations" value={reservations.length} />
        <MetricCard title="Total orders" value={orders.length} />
        <MetricCard title="Average spend" value={`$${(orders.reduce((acc, order) => acc + order.total, 0) / Math.max(orders.length, 1)).toFixed(2)}`} />
      </div>
      <PageSection title="Recent Customers">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Guest</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Reservation</TableHead>
              <TableHead>Order count</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reservations.slice(0, 8).map((reservation) => (
              <TableRow key={reservation.id}>
                <TableCell>{reservation.customerName}</TableCell>
                <TableCell>{reservation.customerPhone}</TableCell>
                <TableCell>{`${formatDate(reservation.date)} ${reservation.time}`}</TableCell>
                <TableCell>{orders.filter((order) => order.tableId === reservation.tableId).length}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </PageSection>
    </div>
  );
}
