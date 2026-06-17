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

export default function SalesReportsPage() {
  const { data: items = [] } = useQuery<MenuItem[]>({ queryKey: ['menu-items'], queryFn: () => api.getMenuItems() });
  const { data: categories = [] } = useQuery<MenuCategory[]>({ queryKey: ['menu-categories'], queryFn: () => api.getMenuCategories() });
  const topCategories = useMemo(
    () => categories.slice(0, 3).map((category) => ({ name: category.name, count: category.itemCount ?? 0 })),
    [categories],
  );

  return (
    <div className="space-y-6">
      <DashboardHeader title="Sales Reports" description="Review top performing categories and item volumes." />
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard title="Menu items" value={items.length} />
        <MetricCard title="Categories" value={categories.length} />
        <MetricCard title="Top category" value={topCategories[0]?.name ?? 'N/A'} />
      </div>
      <PageSection title="Top Categories">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Item count</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topCategories.map((category) => (
              <TableRow key={category.name}>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </PageSection>
    </div>
  );
}
