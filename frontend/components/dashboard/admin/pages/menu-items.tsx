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

export default function MenuItemsPage() {
  const { data: categories = [] } = useQuery<MenuCategory[]>({ queryKey: ['menu-categories'], queryFn: () => api.getMenuCategories() });
  const { data: items = [] } = useQuery<MenuItem[]>({ queryKey: ['menu-items'], queryFn: () => api.getMenuItems() });
  const [filter, setFilter] = useState('');
  const [newItem, setNewItem] = useState({ name: '', description: '', categoryId: '', price: 0, preparationTime: 0, status: 'available' });

  const categoryMap = useMemo(() => Object.fromEntries(categories.map((category) => [category.id, category.name])), [categories]);

  const filtered = useMemo(
    () =>
      items.filter((item) =>
        [item.name, item.description, categoryMap[item.categoryId] || '', item.status]
          .join(' ')
          .toLowerCase()
          .includes(filter.toLowerCase()),
      ),
    [items, filter, categoryMap],
  );

  const handleCreateItem = () => {
    setNewItem({ name: '', description: '', categoryId: '', price: 0, preparationTime: 0, status: 'available' });
  };

  return (
    <div className="space-y-6">
      <DashboardHeader title="Food Items" description="Review menu items, availability, and pricing." />

      <PageSection title="Add Menu Item">
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <Label htmlFor="new-item-name">Item name</Label>
            <Input
              id="new-item-name"
              value={newItem.name}
              onChange={(event) => setNewItem({ ...newItem, name: event.target.value })}
              placeholder="Name of the item"
            />
          </div>
          <div>
            <Label htmlFor="new-item-category">Category</Label>
            <select
              id="new-item-category"
              className="mt-2 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={newItem.categoryId}
              onChange={(event) => setNewItem({ ...newItem, categoryId: event.target.value })}
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="new-item-price">Price</Label>
            <Input
              id="new-item-price"
              type="number"
              value={newItem.price}
              onChange={(event) => setNewItem({ ...newItem, price: Number(event.target.value) })}
            />
          </div>
          <div>
            <Label htmlFor="new-item-prep-time">Prep time</Label>
            <Input
              id="new-item-prep-time"
              type="number"
              value={newItem.preparationTime}
              onChange={(event) => setNewItem({ ...newItem, preparationTime: Number(event.target.value) })}
            />
          </div>
          <div className="lg:col-span-2">
            <Label htmlFor="new-item-description">Description</Label>
            <Input
              id="new-item-description"
              value={newItem.description}
              onChange={(event) => setNewItem({ ...newItem, description: event.target.value })}
              placeholder="Optional item description"
            />
          </div>
          <div className="lg:col-span-2">
            <Label htmlFor="new-item-status">Status</Label>
            <select
              id="new-item-status"
              className="mt-2 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={newItem.status}
              onChange={(event) => setNewItem({ ...newItem, status: event.target.value })}
            >
              <option value="available">Available</option>
              <option value="out-of-stock">Out of stock</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
        <CardFooter className="justify-end pt-4">
          <Button onClick={handleCreateItem}>Add item</Button>
        </CardFooter>
      </PageSection>

      <PageSection title="Menu Items">
        <div className="space-y-4">
          <SearchField id="food-search" label="Search food items" value={filter} onChange={setFilter} placeholder="Search by name, category or status" />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Prep Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{categoryMap[item.categoryId] ?? 'Unknown'}</TableCell>
                  <TableCell>${item.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusStyle(item.status)}`}>
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell>{`${item.preparationTime} min`}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </PageSection>
    </div>
  );
}
