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

export default function SalesAnalyticsPage() {
  const { data: revenueData = [] } = useQuery<RevenueData[]>({ queryKey: ['revenue-data'], queryFn: () => api.getRevenueData() });
  const { data: salesByCategory = [] } = useQuery<SalesByCategory[]>({ queryKey: ['sales-by-category'], queryFn: () => api.getSalesByCategory() });

  return (
    <div className="space-y-6">
      <DashboardHeader title="Sales Analytics" description="Understand top performing days and category performance." />
      <div className="grid gap-4 lg:grid-cols-3">
        <MetricCard title="Revenue trend" value={`$${revenueData.reduce((sum, point) => sum + point.revenue, 0).toFixed(2)}`} />
        <MetricCard title="Categories" value={salesByCategory.length} />
        <MetricCard title="Top category" value={salesByCategory[0]?.category ?? 'N/A'} />
      </div>
      <PageSection title="Revenue Trend">
        <RevenueChart data={revenueData} description="Revenue performance over time." />
      </PageSection>
      <PageSection title="Category Performance">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Sales</TableHead>
              <TableHead>Share</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {salesByCategory.map((item) => (
              <TableRow key={item.category}>
                <TableCell>{item.category}</TableCell>
                <TableCell>${item.sales.toFixed(2)}</TableCell>
                <TableCell>{item.percentage.toFixed(0)}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </PageSection>
    </div>
  );
}
