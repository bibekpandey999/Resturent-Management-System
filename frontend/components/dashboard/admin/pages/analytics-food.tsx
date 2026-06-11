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

export default function FoodAnalyticsPage() {
  const { data: salesByCategory = [] } = useQuery<SalesByCategory[]>({ queryKey: ['sales-by-category'], queryFn: () => api.getSalesByCategory() });
  const { data: topItems = [] } = useQuery<any[]>({ queryKey: ['top-selling-items'], queryFn: () => api.getTopSellingItems() });

  return (
    <div className="space-y-6">
      <DashboardHeader title="Food Analytics" description="Track menu category performance and top selling dishes." />
      <div className="grid gap-4 lg:grid-cols-3">
        <MetricCard title="Top item" value={topItems[0]?.name ?? 'N/A'} />
        <MetricCard title="Top revenue" value={`$${topItems[0]?.revenue.toFixed(2) ?? '0.00'}`} />
        <MetricCard title="Category count" value={salesByCategory.length} />
      </div>
      <PageSection title="Top Selling Items">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Revenue</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>${item.revenue.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </PageSection>
    </div>
  );
}
