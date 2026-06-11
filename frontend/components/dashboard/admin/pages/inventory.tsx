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

export default function InventoryPage() {
  const { data: ingredients = [] } = useQuery<Ingredient[]>({ queryKey: ['ingredients'], queryFn: () => api.getIngredients() });
  const [filter, setFilter] = useState('');
  const [newIngredient, setNewIngredient] = useState({ name: '', category: '', unit: '', currentStock: 0, reorderLevel: 0, supplierId: '' });

  const filtered = useMemo(
    () =>
      ingredients.filter((item) =>
        [item.name, item.category, item.supplierId]
          .join(' ')
          .toLowerCase()
          .includes(filter.toLowerCase()),
      ),
    [ingredients, filter],
  );

  const lowStock = ingredients.filter((item) => item.currentStock <= item.minimumStock).length;

  const handleCreateIngredient = () => {
    setNewIngredient({ name: '', category: '', unit: '', currentStock: 0, reorderLevel: 0, supplierId: '' });
  };

  return (
    <div className="space-y-6">
      <DashboardHeader title="Inventory Overview" description="Track ingredient stock levels and reorder thresholds." />

      <PageSection title="Add Ingredient">
        <div className="grid gap-4 lg:grid-cols-3">
          <div>
            <Label htmlFor="ingredient-name">Ingredient</Label>
            <Input
              id="ingredient-name"
              value={newIngredient.name}
              onChange={(event) => setNewIngredient({ ...newIngredient, name: event.target.value })}
              placeholder="Ingredient name"
            />
          </div>
          <div>
            <Label htmlFor="ingredient-category">Category</Label>
            <Input
              id="ingredient-category"
              value={newIngredient.category}
              onChange={(event) => setNewIngredient({ ...newIngredient, category: event.target.value })}
              placeholder="Category"
            />
          </div>
          <div>
            <Label htmlFor="ingredient-unit">Unit</Label>
            <Input
              id="ingredient-unit"
              value={newIngredient.unit}
              onChange={(event) => setNewIngredient({ ...newIngredient, unit: event.target.value })}
              placeholder="e.g. kg, pcs"
            />
          </div>
          <div>
            <Label htmlFor="ingredient-stock">Stock</Label>
            <Input
              id="ingredient-stock"
              type="number"
              value={newIngredient.currentStock}
              onChange={(event) => setNewIngredient({ ...newIngredient, currentStock: Number(event.target.value) })}
            />
          </div>
          <div>
            <Label htmlFor="ingredient-reorder">Reorder level</Label>
            <Input
              id="ingredient-reorder"
              type="number"
              value={newIngredient.reorderLevel}
              onChange={(event) => setNewIngredient({ ...newIngredient, reorderLevel: Number(event.target.value) })}
            />
          </div>
          <div>
            <Label htmlFor="ingredient-supplier">Supplier</Label>
            <Input
              id="ingredient-supplier"
              value={newIngredient.supplierId}
              onChange={(event) => setNewIngredient({ ...newIngredient, supplierId: event.target.value })}
              placeholder="Supplier ID"
            />
          </div>
        </div>
        <CardFooter className="justify-end pt-4">
          <Button onClick={handleCreateIngredient}>Add ingredient</Button>
        </CardFooter>
      </PageSection>

      <div className="grid gap-4 md:grid-cols-[1fr_auto] items-end">
        <SearchField id="inventory-search" label="Search inventory" value={filter} onChange={setFilter} placeholder="Search by ingredient, category or supplier" />
        <div className="flex gap-2">
          <div className="bg-card rounded-full flex gap-2 items-center border-border px-4 py-3">
            <span className="text-sm text-muted-foreground">Low stock items</span>
            <span className="text-sm font-semibold">{lowStock}</span>
          </div>
        </div>
      </div>

      <PageSection title="Ingredient Inventory">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ingredient</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Reorder Level</TableHead>
              <TableHead>Supplier</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((ingredient) => (
              <TableRow key={ingredient.id}>
                <TableCell>{ingredient.name}</TableCell>
                <TableCell>{ingredient.category}</TableCell>
                <TableCell>{ingredient.currentStock} {ingredient.unit}</TableCell>
                <TableCell>{ingredient.reorderLevel}</TableCell>
                <TableCell>{ingredient.supplierId ?? 'Unknown'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </PageSection>
    </div>
  );
}
