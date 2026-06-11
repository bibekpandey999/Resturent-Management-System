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

export default function FinanceExpensesPage() {
  const { data: expenses = [] } = useQuery<Expense[]>({ queryKey: ['expenses'], queryFn: () => api.getExpenses() });
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="space-y-6">
      <DashboardHeader title="Expense Management" description="Track costs and spending categories across operations." />
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard title="Total expenses" value={`$${total.toFixed(2)}`} />
        <MetricCard title="Entries" value={expenses.length} />
        <MetricCard title="Average spend" value={expenses.length ? `$${(total / expenses.length).toFixed(2)}` : '$0.00'} />
      </div>
      <PageSection title="Expense Ledger">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Vendor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>{expense.category}</TableCell>
                <TableCell>{expense.description}</TableCell>
                <TableCell>${expense.amount.toFixed(2)}</TableCell>
                <TableCell>{formatDate(expense.date)}</TableCell>
                <TableCell>{expense.vendorName ?? 'Internal'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </PageSection>
    </div>
  );
}
