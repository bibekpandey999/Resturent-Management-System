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

export default function SectionsPage() {
  const { data: sections = [] } = useQuery<TableSection[]>({ queryKey: ['sections'], queryFn: () => api.getSections() });
  const [filter, setFilter] = useState('');
  const [newSection, setNewSection] = useState({ name: '', description: '', isActive: true });

  const filtered = useMemo(
    () =>
      sections.filter((section) =>
        [section.name, section.description]
          .join(' ')
          .toLowerCase()
          .includes(filter.toLowerCase()),
      ),
    [sections, filter],
  );

  const handleCreateSection = () => {
    setNewSection({ name: '', description: '', isActive: true });
  };

  return (
    <div className="space-y-6">
      <DashboardHeader title="Table Sections" description="Organize seating sections and monitor section capacity." />

      <PageSection title="Create Section">
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <Label htmlFor="section-name">Section name</Label>
            <Input
              id="section-name"
              value={newSection.name}
              onChange={(event) => setNewSection({ ...newSection, name: event.target.value })}
              placeholder="Enter section name"
            />
          </div>
          <div>
            <Label htmlFor="section-active">Status</Label>
            <select
              id="section-active"
              className="mt-2 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={newSection.isActive ? 'active' : 'inactive'}
              onChange={(event) => setNewSection({ ...newSection, isActive: event.target.value === 'active' })}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="lg:col-span-2">
            <Label htmlFor="section-description">Description</Label>
            <Input
              id="section-description"
              value={newSection.description}
              onChange={(event) => setNewSection({ ...newSection, description: event.target.value })}
              placeholder="Brief description"
            />
          </div>
        </div>
        <CardFooter className="justify-end pt-4">
          <Button onClick={handleCreateSection}>Create section</Button>
        </CardFooter>
      </PageSection>

      <PageSection title="Restaurant Sections">
        <div className="space-y-4">
          <SearchField id="section-search" label="Search sections" value={filter} onChange={setFilter} placeholder="Search by name or description" />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((section) => (
              <Card key={section.id} className="bg-card border-border">
                <CardHeader>
                  <CardTitle>{section.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{section.description ?? 'Standard dining section'}</p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs">
                    <TableBadge label={`${section.tableCount} tables`} />
                    <TableBadge label={section.isActive ? 'Active' : 'Inactive'} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </PageSection>
    </div>
  );
}
