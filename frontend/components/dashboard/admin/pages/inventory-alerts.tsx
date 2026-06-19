"use client";

import { useQuery } from "@tanstack/react-query";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { api } from "@/lib/api/mock-data";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { formatDate, PageSection } from "@/components/dashboard/admin/shared";
import { useAllStockMovement } from "@/hooks/admin/stock-movement/getAllStockMovement";
import { TStockMovement } from "@/lib/types/stock-movement.types";
import { useAllIngredient } from "@/hooks/admin/ingredient/getAllIngrediets";
import { TIngredient } from "@/lib/types/ingredient.types";

export default function InventoryAlertsPage() {
  const { data: ingredientData } = useAllIngredient({
    search: "",
  });

  const ingredients = ingredientData?.data || [];

  const lowStockIngredients = ingredients.filter(
    (ingredient: TIngredient) =>
      ingredient.currentStock <= ingredient.minimumStock,
  );

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Low Stock Alerts"
        description="Catch ingredients that need immediate reorder."
      />
      <PageSection title="Alerts">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ingredient</TableHead>
              <TableHead>Current Stock</TableHead>
              <TableHead>Minimum Stock</TableHead>
              <TableHead>Last Added</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lowStockIngredients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No low stock found.
                </TableCell>
              </TableRow>
            ) : (
              lowStockIngredients.map((ingredient: TIngredient) => (
                <TableRow key={ingredient._id}>
                  <TableCell>{ingredient.name}</TableCell>
                  <TableCell className="text-red-600">
                    {ingredient.currentStock}
                  </TableCell>
                  <TableCell>{ingredient.minimumStock}</TableCell>
                  <TableCell>
                    {ingredient.lastStockInDate
                      ? new Date(ingredient.lastStockInDate).toLocaleString()
                      : "-"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </PageSection>
    </div>
  );
}
