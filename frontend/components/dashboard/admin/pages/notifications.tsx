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

export default function NotificationsPage() {
  const { data: notifications = [] } = useQuery<Notification[]>({ queryKey: ['notifications'], queryFn: () => api.getNotifications() });

  return (
    <div className="space-y-6">
      <DashboardHeader title="Notifications" description="Monitor system alerts, inventory triggers and important updates." />
      <PageSection title="Recent notifications">
        <div className="space-y-3">
          {notifications.map((notification) => (
            <Card key={notification.id} className="bg-card border-border">
              <CardHeader>
                <CardTitle>{notification.title}</CardTitle>
                <CardDescription>{formatDate(notification.createdAt)}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{notification.message}</p>
              </CardContent>
              <CardFooter>
                <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusStyle(notification.type)}`}>
                  {notification.category}
                </span>
              </CardFooter>
            </Card>
          ))}
        </div>
      </PageSection>
    </div>
  );
}
