'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DashboardHeader } from '@/components/layout/dashboard-header';
import { TableGrid, TableStats } from '@/components/dashboard/table-grid';
import { api } from '@/lib/api/mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Table, TableStatus } from '@/lib/types';

const tableStatusOptions: { value: TableStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All tables' },
  { value: 'available', label: 'Available' },
  { value: 'occupied', label: 'Occupied' },
  { value: 'reserved', label: 'Reserved' },
  { value: 'cleaning', label: 'Cleaning' },
  { value: 'out-of-service', label: 'Out of service' },
];

export default function CashierTablesPage() {
  const { data: tables = [] } = useQuery({ queryKey: ['tables'], queryFn: api.getTables });
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TableStatus | 'all'>('all');
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);

  const filteredTables = useMemo(() => {
    return tables.filter((table) => {
      const matchesSearch = query.trim().length === 0 ||
        table.number.toString().includes(query) ||
        table.section.toLowerCase().includes(query.toLowerCase());

      const matchesStatus = statusFilter === 'all' || table.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [tables, query, statusFilter]);

  return (
    <div className="space-y-6 mb-12">
      <DashboardHeader title="Cashier Tables" description="Review table statuses and locate active seating at a glance." />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Total Tables</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-foreground">{tables.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Occupied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-foreground">{tables.filter((table) => table.status === 'occupied').length}</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Available</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-foreground">{tables.filter((table) => table.status === 'available').length}</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Reserved</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-foreground">{tables.filter((table) => table.status === 'reserved').length}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Table controls</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Search by table number or section</label>
            <Input
              placeholder="Enter table number or section"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Filter by status</label>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as TableStatus | 'all')}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a status" />
              </SelectTrigger>
              <SelectContent>
                {tableStatusOptions.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <TableStats tables={filteredTables} />
          <TableGrid tables={filteredTables} onTableClick={(table) => setSelectedTable(table)} />
        </div>

        <div className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Selected table</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedTable ? (
                <div className="space-y-4">
                  <div className="rounded-lg border border-border bg-background p-4">
                    <p className="text-sm text-muted-foreground">Table number</p>
                    <p className="text-3xl font-semibold text-foreground">{selectedTable.number}</p>
                  </div>

                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Section</span>
                      <span>{selectedTable.section}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Capacity</span>
                      <span>{selectedTable.capacity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status</span>
                      <Badge className={
                        selectedTable.status === 'available'
                          ? 'bg-success/20 text-success'
                          : selectedTable.status === 'occupied'
                          ? 'bg-primary/20 text-primary'
                          : selectedTable.status === 'reserved'
                          ? 'bg-warning/20 text-warning'
                          : 'bg-muted text-muted-foreground'
                      }>
                        {selectedTable.status.replace(/-/g, ' ')}
                      </Badge>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">Tap any table card to view its details.</p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Quick actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full">Refresh table list</Button>
              <Button variant="outline" className="w-full">Reset filters</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
