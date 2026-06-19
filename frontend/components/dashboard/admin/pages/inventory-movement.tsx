"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  PageSection,
  SearchField,
  statusStyle,
  formatDate,
} from "@/components/dashboard/admin/shared";

import { useAllStockMovement } from "@/hooks/admin/stock-movement/getAllStockMovement";
import { TStockMovement } from "@/lib/types/stock-movement.types";

export default function StockMovementPage() {
  const { data: stockMovements = [], isLoading } = useAllStockMovement({});
  const movements = stockMovements?.data || [];

  const [filter, setFilter] = useState("");

  const filtered = useMemo(() => {
    return movements.filter((m: TStockMovement) =>
      [m.type, m.ingredient.name, m.quantity?.toString()]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(filter.toLowerCase()),
    );
  }, [movements, filter]);

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Stock Movement"
        description="Audit inventory adjustments, purchases, sales and wastage."
      />

      <PageSection title="Movement Log">
        <div className="space-y-4">
          <SearchField
            id="movement-search"
            label="Search movement"
            value={filter}
            onChange={setFilter}
            placeholder="Search ingredient, type, user..."
          />

          {isLoading && (
            <p className="text-sm text-muted-foreground">
              Loading stock movements...
            </p>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ingredient</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No data found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((movement: TStockMovement) => (
                  <TableRow key={movement._id}>
                    <TableCell>{movement.ingredient.name}</TableCell>

                    <TableCell>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${statusStyle(
                          movement.type,
                        )}`}
                      >
                        {movement.type}
                      </span>
                    </TableCell>
                    <TableCell>{movement.quantity}</TableCell>
                    <TableCell>{formatDate(movement.createdAt)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </PageSection>
    </div>
  );
}
