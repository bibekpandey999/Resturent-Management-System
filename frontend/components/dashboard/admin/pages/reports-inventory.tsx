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

export default function InventoryReportsPage() {
  const { data: lowStock = [] } = useQuery<Ingredient[]>({ queryKey: ['low-stock'], queryFn: () => api.getLowStockIngredients() });
  const { data: movements = [] } = useQuery<StockMovement[]>({ queryKey: ['stock-movements'], queryFn: () => api.getStockMovements() });

  return (
    <div className="space-y-6">
      <DashboardHeader title="Inventory Reports" description="Monitor stock performance and inventory movements." />
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard title="Low stock items" value={lowStock.length} />
        <MetricCard title="Movement entries" value={movements.length} />
        <MetricCard title="Last updated" value={movements.length ? formatDate(movements[0].createdAt) : 'N/A'} />
      </div>
      <PageSection title="Low Stock Items">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Min stock</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lowStock.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.currentStock}</TableCell>
                <TableCell>{item.minimumStock}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </PageSection>
    </div>
  );
}
