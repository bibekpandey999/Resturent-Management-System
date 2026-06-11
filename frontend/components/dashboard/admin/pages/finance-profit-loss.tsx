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

export default function FinanceProfitLossPage() {
  const { data: revenueData = [] } = useQuery<RevenueData[]>({ queryKey: ['revenue-data'], queryFn: () => api.getRevenueData() });
  const { data: expenses = [] } = useQuery<Expense[]>({ queryKey: ['expenses'], queryFn: () => api.getExpenses() });
  const revenueTotal = revenueData.reduce((sum, point) => sum + point.revenue, 0);
  const expenseTotal = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const profit = revenueTotal - expenseTotal;

  return (
    <div className="space-y-6">
      <DashboardHeader title="Profit & Loss" description="Compare income and costs across the business." />
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard title="Revenue" value={`$${revenueTotal.toFixed(2)}`} />
        <MetricCard title="Expenses" value={`$${expenseTotal.toFixed(2)}`} />
        <MetricCard title="Profit" value={`$${profit.toFixed(2)}`} />
      </div>
      <PageSection title="Revenue vs Expenses">
        <RevenueChart data={revenueData} title="Revenue Trend" description="Revenue data used to compare with expense spend." />
      </PageSection>
    </div>
  );
}
