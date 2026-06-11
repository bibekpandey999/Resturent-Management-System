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

export default function UsersPage() {
  const { data: users = [] } = useQuery<ManagedUser[]>({ queryKey: ['users'], queryFn: () => api.getUsers() });
  const [filter, setFilter] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'waiter', branchId: '', status: 'active' });

  const roles = useMemo(
    () => Array.from(new Set(users.map((user) => user.role))).sort(),
    [users],
  );

  const filteredUsers = useMemo(
    () =>
      users
        .filter((user) =>
          [user.name, user.email, user.role, user.status]
            .filter(Boolean)
            .some((value) => value.toLowerCase().includes(filter.toLowerCase())),
        )
        .filter((user) => (selectedRole === 'all' ? true : user.role === selectedRole)),
    [users, filter, selectedRole],
  );

  const handleCreateUser = () => {
    setNewUser({ name: '', email: '', role: 'waiter', branchId: '', status: 'active' });
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="User Management"
        description="Manage access, role assignments and employee details."
      >
        {/* <Button>New user</Button> */}
      </DashboardHeader>

      <PageSection title="Register New User">
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <Label htmlFor="new-user-name">Name</Label>
            <Input
              id="new-user-name"
              value={newUser.name}
              onChange={(event) => setNewUser({ ...newUser, name: event.target.value })}
              placeholder="Enter full name"
            />
          </div>
          <div>
            <Label htmlFor="new-user-email">Email</Label>
            <Input
              id="new-user-email"
              type="email"
              value={newUser.email}
              onChange={(event) => setNewUser({ ...newUser, email: event.target.value })}
              placeholder="Enter email"
            />
          </div>
          <div>
            <Label htmlFor="new-user-role">Role</Label>
            <select
              id="new-user-role"
              className="mt-2 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={newUser.role}
              onChange={(event) => setNewUser({ ...newUser, role: event.target.value })}
            >
              <option value="admin">Administrator</option>
              <option value="waiter">Server</option>
              <option value="kitchen">Kitchen Staff</option>
              <option value="cashier">Cashier</option>
            </select>
          </div>
          <div>
            <Label htmlFor="new-user-status">Status</Label>
            <select
              id="new-user-status"
              className="mt-2 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={newUser.status}
              onChange={(event) => setNewUser({ ...newUser, status: event.target.value })}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="lg:col-span-2">
            <Label htmlFor="new-user-branch">Branch</Label>
            <Input
              id="new-user-branch"
              value={newUser.branchId}
              onChange={(event) => setNewUser({ ...newUser, branchId: event.target.value })}
              placeholder="Branch or location"
            />
          </div>
        </div>
        <CardFooter className="justify-end pt-4">
          <Button onClick={handleCreateUser}>Register user</Button>
        </CardFooter>
      </PageSection>

      <div className="grid gap-4 md:grid-cols-[1fr_auto] items-end">
        <SearchField id="user-search" label="Search users" value={filter} onChange={setFilter} placeholder="Search by name, email, role or status" />
        <div>
          <Label htmlFor="user-role-filter">Filter by role</Label>
          <select
            id="user-role-filter"
            className="mt-2 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={selectedRole}
            onChange={(event) => setSelectedRole(event.target.value)}
          >
            <option value="all">All roles</option>
            {roles.map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
      </div>

      <PageSection title="User Directory">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>Last login</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusStyle(user.status)}`}>
                    {user.status}
                  </span>
                </TableCell>
                <TableCell>{user.branchId ?? 'All locations'}</TableCell>
                <TableCell>{user.lastLogin ? formatDate(user.lastLogin) : 'Never'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </PageSection>
    </div>
  );
}
