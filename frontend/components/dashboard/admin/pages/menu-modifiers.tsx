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

export default function ModifiersPage() {
  const { data: modifiers = [] } = useQuery<MenuModifier[]>({ queryKey: ['menu-modifiers'], queryFn: () => api.getModifiers() });

  return (
    <div className="space-y-6">
      <DashboardHeader title="Menu Modifiers" description="Configure optional add-ons, sizes and choices for menu items." />
      <PageSection title="Modifier Sets">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {modifiers.map((modifier) => (
            <Card key={modifier.id} className="bg-card border-border">
              <CardHeader>
                <CardTitle>{modifier.name}</CardTitle>
                <CardDescription>{modifier.required ? 'Required selection' : 'Optional selection'}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Max selections: {modifier.maxSelections}</p>
                <p className="text-sm text-muted-foreground">Options: {modifier.options.length}</p>
                <p className="text-sm text-muted-foreground">Linked items: {modifier.itemIds.length}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageSection>
    </div>
  );
}
