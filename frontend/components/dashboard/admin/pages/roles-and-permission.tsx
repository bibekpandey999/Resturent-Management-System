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

export default function RolesPage() {
  const { data: roles = [] } = useQuery<Role[]>({ queryKey: ['roles'], queryFn: () => api.getRoles() });
  const [newRole, setNewRole] = useState({ name: '', description: '', permissions: '' });

  const handleCreateRole = () => {
    setNewRole({ name: '', description: '', permissions: '' });
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Roles & Permissions"
        description="Review role assignments and permission coverage across your team."
      >
        {/* <Button>New role</Button> */}
      </DashboardHeader>

      <PageSection title="Create New Role">
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <Label htmlFor="new-role-name">Role name</Label>
            <Input
              id="new-role-name"
              value={newRole.name}
              onChange={(event) => setNewRole({ ...newRole, name: event.target.value })}
              placeholder="e.g. Floor manager"
            />
          </div>
          <div>
            <Label htmlFor="new-role-description">Description</Label>
            <Input
              id="new-role-description"
              value={newRole.description}
              onChange={(event) => setNewRole({ ...newRole, description: event.target.value })}
              placeholder="Describe the role responsibilities"
            />
          </div>
          <div className="lg:col-span-2">
            <Label htmlFor="new-role-permissions">Permissions</Label>
            <Input
              id="new-role-permissions"
              value={newRole.permissions}
              onChange={(event) => setNewRole({ ...newRole, permissions: event.target.value })}
              placeholder="List permissions separated by commas"
            />
          </div>
        </div>
        <CardFooter className="justify-end pt-4">
          <Button onClick={handleCreateRole}>Create role</Button>
        </CardFooter>
      </PageSection>

      <PageSection title="Role Overview">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {roles.map((role) => (
            <Card key={role.id} className="bg-card border-border">
              <CardHeader>
                <CardTitle>{role.name}</CardTitle>
                <CardDescription>{role.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Permissions: {role.permissions.length}</p>
                <p className="text-sm text-muted-foreground">Users: {role.userCount}</p>
                <p className="text-sm text-muted-foreground">Created {formatDate(role.createdAt)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageSection>
    </div>
  );
}
