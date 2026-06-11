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

export default function StaffReportsPage() {
  const { data: staff = [] } = useQuery<StaffMember[]>({ queryKey: ['staff'], queryFn: () => api.getStaff() });

  return (
    <div className="space-y-6">
      <DashboardHeader title="Staff Reports" description="Analyze team activity, hires, and schedule coverage." />
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard title="Staff members" value={staff.length} />
        <MetricCard title="Active" value={staff.filter((member) => member.isActive).length} />
        <MetricCard title="Average salary" value={`$${Math.round(staff.reduce((sum, member) => sum + (member.salary || 0), 0) / Math.max(staff.length, 1)).toFixed(0)}`} />
      </div>
      <PageSection title="Staff Directory">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Hired</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staff.map((member) => (
              <TableRow key={member.id}>
                <TableCell>{member.name}</TableCell>
                <TableCell>{member.role}</TableCell>
                <TableCell>{member.phone ?? 'N/A'}</TableCell>
                <TableCell>
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusStyle(member.isActive ? 'active' : 'cancelled')}`}>
                    {member.isActive ? 'Active' : 'Inactive'}
                  </span>
                </TableCell>
                <TableCell>{formatDate(member.hireDate)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </PageSection>
    </div>
  );
}
