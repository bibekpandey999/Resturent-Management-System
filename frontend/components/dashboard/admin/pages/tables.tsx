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

export default function TablesPage() {
  const { data: tables = [] } = useQuery<DiningTable[]>({ queryKey: ['tables'], queryFn: () => api.getTables() });
  const [filter, setFilter] = useState('');
  const [newTable, setNewTable] = useState({ number: 1, section: '', capacity: 4, status: 'available' });

  const filtered = useMemo(
    () =>
      tables.filter((table) =>
        [table.number.toString(), table.section, table.status]
          .join(' ')
          .toLowerCase()
          .includes(filter.toLowerCase()),
      ),
    [tables, filter],
  );

  const handleCreateTable = () => {
    setNewTable({ number: newTable.number + 1, section: '', capacity: 4, status: 'available' });
  };

  return (
    <div className="space-y-6">
      <DashboardHeader title="Table Floorplan" description="Monitor seating availability and layout status." />

      <PageSection title="Add Table">
        <div className="grid gap-4 lg:grid-cols-4">
          <div>
            <Label htmlFor="new-table-number">Table number</Label>
            <Input
              id="new-table-number"
              type="number"
              value={newTable.number}
              onChange={(event) => setNewTable({ ...newTable, number: Number(event.target.value) })}
            />
          </div>
          <div>
            <Label htmlFor="new-table-section">Section</Label>
            <Input
              id="new-table-section"
              value={newTable.section}
              onChange={(event) => setNewTable({ ...newTable, section: event.target.value })}
              placeholder="e.g. Main"
            />
          </div>
          <div>
            <Label htmlFor="new-table-capacity">Capacity</Label>
            <Input
              id="new-table-capacity"
              type="number"
              value={newTable.capacity}
              onChange={(event) => setNewTable({ ...newTable, capacity: Number(event.target.value) })}
            />
          </div>
          <div>
            <Label htmlFor="new-table-status">Status</Label>
            <select
              id="new-table-status"
              className="mt-2 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={newTable.status}
              onChange={(event) => setNewTable({ ...newTable, status: event.target.value })}
            >
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="reserved">Reserved</option>
            </select>
          </div>
        </div>
        <CardFooter className="justify-end pt-4">
          <Button onClick={handleCreateTable}>Add table</Button>
        </CardFooter>
      </PageSection>

      <PageSection title="Table List">
        <div className="space-y-4">
          <SearchField id="table-search" label="Search tables" value={filter} onChange={setFilter} placeholder="Search by number, section or status" />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Table</TableHead>
                <TableHead>Section</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Order</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((table) => (
                <TableRow key={table.id}>
                  <TableCell>{`Table ${table.number}`}</TableCell>
                  <TableCell>{table.section}</TableCell>
                  <TableCell>{table.capacity}</TableCell>
                  <TableCell>
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusStyle(table.status)}`}>
                      {table.status}
                    </span>
                  </TableCell>
                  <TableCell>{table.currentOrderId ?? 'Available'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </PageSection>
    </div>
  );
}
