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

export default function FinanceRevenuePage() {
  const { data: revenueData = [] } = useQuery<RevenueData[]>({ queryKey: ['revenue-data'], queryFn: () => api.getRevenueData() });
  const { data: stats } = useQuery<AdminDashboardStats>({ queryKey: ['admin-dashboard-stats'], queryFn: () => api.getAdminDashboardStats() });

  return (
    <div className="space-y-6">
      <DashboardHeader title="Revenue" description="Monitor top-level revenue trends and daily performance." />
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard title="Today revenue" value={stats ? `$${stats.totalRevenue.toLocaleString()}` : '-'} />
        <MetricCard title="Orders today" value={stats?.todayOrders ?? '-'} />
        <MetricCard title="Reservations today" value={stats?.reservationsToday ?? '-'} />
      </div>
      <PageSection title="Revenue Trend">
        <RevenueChart data={revenueData} title="Revenue Trend" description="Last seven days of revenue." />
      </PageSection>
    </div>
  );
}
