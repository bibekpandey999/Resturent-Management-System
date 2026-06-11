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

export default function MenuCategoriesPage() {
  const { data: categories = [] } = useQuery<MenuCategory[]>({ queryKey: ['menu-categories'], queryFn: () => api.getMenuCategories() });
  const [filter, setFilter] = useState('');
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });

  const filtered = useMemo(
    () =>
      categories.filter((category) =>
        [category.name, category.description]
          .join(' ')
          .toLowerCase()
          .includes(filter.toLowerCase()),
      ),
    [categories, filter],
  );

  const handleCreateCategory = () => {
    setNewCategory({ name: '', description: '' });
  };

  return (
    <div className="space-y-6">
      <DashboardHeader title="Menu Categories" description="Manage category structure for the ordering menu." />

      <PageSection title="Add Category">
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <Label htmlFor="new-category-name">Category name</Label>
            <Input
              id="new-category-name"
              value={newCategory.name}
              onChange={(event) => setNewCategory({ ...newCategory, name: event.target.value })}
              placeholder="e.g. Main Course"
            />
          </div>
          <div>
            <Label htmlFor="new-category-description">Description</Label>
            <Input
              id="new-category-description"
              value={newCategory.description}
              onChange={(event) => setNewCategory({ ...newCategory, description: event.target.value })}
              placeholder="Optional category description"
            />
          </div>
        </div>
        <CardFooter className="justify-end pt-4">
          <Button onClick={handleCreateCategory}>Create category</Button>
        </CardFooter>
      </PageSection>

      <PageSection title="Category Catalog">
        <div className="space-y-4">
          <SearchField id="category-search" label="Search categories" value={filter} onChange={setFilter} placeholder="Search by name or description" />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((category) => (
              <Card key={category.id} className="bg-card border-border">
                <CardHeader>
                  <CardTitle>{category.name}</CardTitle>
                  <CardDescription>{category.description ?? 'No description available'}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <TableBadge label={`${category.itemCount ?? 0} items`} />
                    <TableBadge label={category.isActive ? 'Active' : 'Inactive'} />
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
