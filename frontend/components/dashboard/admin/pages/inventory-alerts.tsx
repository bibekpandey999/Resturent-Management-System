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

export default function InventoryAlertsPage() {
  const { data: alerts = [] } = useQuery<Ingredient[]>({ queryKey: ['low-stock'], queryFn: () => api.getLowStockIngredients() });

  return (
    <div className="space-y-6">
      <DashboardHeader title="Low Stock Alerts" description="Catch ingredients that need immediate reorder." />
      <PageSection title="Alerts">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ingredient</TableHead>
              <TableHead>Current Stock</TableHead>
              <TableHead>Minimum Stock</TableHead>
              <TableHead>Reorder Level</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alerts.map((ingredient) => (
              <TableRow key={ingredient.id}>
                <TableCell>{ingredient.name}</TableCell>
                <TableCell>{ingredient.currentStock}</TableCell>
                <TableCell>{ingredient.minimumStock}</TableCell>
                <TableCell>{ingredient.reorderLevel}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </PageSection>
    </div>
  );
}
