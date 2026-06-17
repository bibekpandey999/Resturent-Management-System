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

export default function ReservationsPage() {
  const { data: reservations = [] } = useQuery<Reservation[]>({ queryKey: ['reservations'], queryFn: () => api.getReservations() });
  const [filter, setFilter] = useState('');
  const [newReservation, setNewReservation] = useState({ customerName: '', customerPhone: '', date: '', time: '', partySize: 2, tableId: '', status: 'confirmed' });

  const filtered = useMemo(
    () =>
      reservations.filter((reservation) =>
        [reservation.customerName, reservation.customerPhone, reservation.status]
          .join(' ')
          .toLowerCase()
          .includes(filter.toLowerCase()),
      ),
    [reservations, filter],
  );

  const handleCreateReservation = () => {
    setNewReservation({ customerName: '', customerPhone: '', date: '', time: '', partySize: 2, tableId: '', status: 'confirmed' });
  };

  return (
    <div className="space-y-6">
      <DashboardHeader title="Reservations" description="Track upcoming guests, booking details, and table assignments." />

      <PageSection title="New Reservation">
        <div className="grid gap-4 lg:grid-cols-3">
          <div>
            <Label htmlFor="reservation-name">Guest name</Label>
            <Input
              id="reservation-name"
              value={newReservation.customerName}
              onChange={(event) => setNewReservation({ ...newReservation, customerName: event.target.value })}
              placeholder="Guest name"
            />
          </div>
          <div>
            <Label htmlFor="reservation-phone">Phone</Label>
            <Input
              id="reservation-phone"
              value={newReservation.customerPhone}
              onChange={(event) => setNewReservation({ ...newReservation, customerPhone: event.target.value })}
              placeholder="Contact phone"
            />
          </div>
          <div>
            <Label htmlFor="reservation-date">Date</Label>
            <Input
              id="reservation-date"
              type="date"
              value={newReservation.date}
              onChange={(event) => setNewReservation({ ...newReservation, date: event.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="reservation-time">Time</Label>
            <Input
              id="reservation-time"
              type="time"
              value={newReservation.time}
              onChange={(event) => setNewReservation({ ...newReservation, time: event.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="reservation-party-size">Party size</Label>
            <Input
              id="reservation-party-size"
              type="number"
              value={newReservation.partySize}
              onChange={(event) => setNewReservation({ ...newReservation, partySize: Number(event.target.value) })}
            />
          </div>
          <div>
            <Label htmlFor="reservation-table">Table</Label>
            <Input
              id="reservation-table"
              value={newReservation.tableId}
              onChange={(event) => setNewReservation({ ...newReservation, tableId: event.target.value })}
              placeholder="Table ID"
            />
          </div>
          <div className="lg:col-span-3">
            <Label htmlFor="reservation-status">Status</Label>
            <select
              id="reservation-status"
              className="mt-2 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={newReservation.status}
              onChange={(event) => setNewReservation({ ...newReservation, status: event.target.value })}
            >
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        <CardFooter className="justify-end pt-4">
          <Button onClick={handleCreateReservation}>Confirm reservation</Button>
        </CardFooter>
      </PageSection>

      <PageSection title="Reservation Schedule">
        <div className="space-y-4">
          <SearchField id="reservation-search" label="Search reservations" value={filter} onChange={setFilter} placeholder="Search by guest, phone or status" />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Guest</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Party</TableHead>
                <TableHead>Table</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((reservation) => (
                <TableRow key={reservation.id}>
                  <TableCell>{reservation.customerName}</TableCell>
                  <TableCell>{reservation.customerPhone}</TableCell>
                  <TableCell>{`${formatDate(reservation.date)} ${reservation.time}`}</TableCell>
                  <TableCell>{reservation.partySize}</TableCell>
                  <TableCell>{reservation.tableId ?? 'TBD'}</TableCell>
                  <TableCell>
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusStyle(reservation.status)}`}>
                      {reservation.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </PageSection>
    </div>
  );
}
