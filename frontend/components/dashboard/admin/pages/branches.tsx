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

export default function BranchesPage() {
  const { data: branches = [] } = useQuery<Branch[]>({ queryKey: ['branches'], queryFn: () => api.getBranches() });
  const [filter, setFilter] = useState('');
  const [newBranch, setNewBranch] = useState({ name: '', address: '', phone: '', managerId: '', isActive: true });

  const filtered = useMemo(
    () =>
      branches.filter((branch) =>
        [branch.name, branch.address, branch.email, branch.phone]
          .join(' ')
          .toLowerCase()
          .includes(filter.toLowerCase()),
      ),
    [branches, filter],
  );

  const handleCreateBranch = () => {
    setNewBranch({ name: '', address: '', phone: '', managerId: '', isActive: true });
  };

  return (
    <div className="space-y-6">
      <DashboardHeader title="Branch Management" description="Add, update, and monitor venue locations." />

      <PageSection title="Add Branch">
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <Label htmlFor="new-branch-name">Branch name</Label>
            <Input
              id="new-branch-name"
              value={newBranch.name}
              onChange={(event) => setNewBranch({ ...newBranch, name: event.target.value })}
              placeholder="Branch name"
            />
          </div>
          <div>
            <Label htmlFor="new-branch-phone">Phone</Label>
            <Input
              id="new-branch-phone"
              value={newBranch.phone}
              onChange={(event) => setNewBranch({ ...newBranch, phone: event.target.value })}
              placeholder="Contact phone"
            />
          </div>
          <div className="lg:col-span-2">
            <Label htmlFor="new-branch-address">Address</Label>
            <Input
              id="new-branch-address"
              value={newBranch.address}
              onChange={(event) => setNewBranch({ ...newBranch, address: event.target.value })}
              placeholder="Full location address"
            />
          </div>
          <div>
            <Label htmlFor="new-branch-manager">Manager ID</Label>
            <Input
              id="new-branch-manager"
              value={newBranch.managerId}
              onChange={(event) => setNewBranch({ ...newBranch, managerId: event.target.value })}
              placeholder="Manager name or ID"
            />
          </div>
          <div>
            <Label htmlFor="new-branch-status">Status</Label>
            <select
              id="new-branch-status"
              className="mt-2 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={newBranch.isActive ? 'active' : 'inactive'}
              onChange={(event) => setNewBranch({ ...newBranch, isActive: event.target.value === 'active' })}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
        <CardFooter className="justify-end pt-4">
          <Button onClick={handleCreateBranch}>Add branch</Button>
        </CardFooter>
      </PageSection>

      <PageSection title="Branch Locations">
        <div className="space-y-4">
          <SearchField id="branch-search" label="Search branches" value={filter} onChange={setFilter} placeholder="Search by name or address" />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Manager</TableHead>
                <TableHead>Opened</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((branch) => (
                <TableRow key={branch.id}>
                  <TableCell>{branch.name}</TableCell>
                  <TableCell>{branch.address}</TableCell>
                  <TableCell>{branch.phone}</TableCell>
                  <TableCell>
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusStyle(branch.isActive ? 'active' : 'cancelled')}`}>
                      {branch.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell>{branch.managerId ?? 'Unassigned'}</TableCell>
                  <TableCell>{formatDate(branch.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </PageSection>
    </div>
  );
}
