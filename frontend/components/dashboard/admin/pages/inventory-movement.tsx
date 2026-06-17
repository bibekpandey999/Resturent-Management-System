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

export default function StockMovementPage() {
  const { data: movements = [] } = useQuery<StockMovement[]>({ queryKey: ['stock-movements'], queryFn: () => api.getStockMovements() });
  const [filter, setFilter] = useState('');
  const filtered = useMemo(
    () =>
      movements.filter((movement) =>
        [movement.type, movement.reason, movement.referenceNumber, movement.user?.name]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(filter.toLowerCase()),
      ),
    [movements, filter],
  );

  return (
    <div className="space-y-6">
      <DashboardHeader title="Stock Movement" description="Audit inventory adjustments, transfers and waste entries." />
      <PageSection title="Movement Log">
        <div className="space-y-4">
          <SearchField id="movement-search" label="Search movement" value={filter} onChange={setFilter} placeholder="Search by type, reason, or user" />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ingredient</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((movement) => (
                <TableRow key={movement.id}>
                  <TableCell>{movement.ingredient?.name ?? movement.ingredientId}</TableCell>
                  <TableCell>
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusStyle(movement.type)}`}>
                      {movement.type}
                    </span>
                  </TableCell>
                  <TableCell>{movement.quantity}</TableCell>
                  <TableCell>{movement.reason}</TableCell>
                  <TableCell>{movement.user?.name ?? movement.userId}</TableCell>
                  <TableCell>{formatDate(movement.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </PageSection>
    </div>
  );
}
