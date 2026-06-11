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

export default function SettingsPage() {
  const [companyName, setCompanyName] = useState('DineFlow Restaurant');
  const [email, setEmail] = useState('contact@dineflow.example');
  const [phone, setPhone] = useState('+1 555 0100');
  const [taxRate, setTaxRate] = useState('8.5');
  const [serviceCharge, setServiceCharge] = useState('10');

  return (
    <div className="space-y-6">
      <DashboardHeader title="Settings" description="Update restaurant configuration, billing defaults and system preferences." />
      <PageSection title="Restaurant Profile">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-4">
            <div>
              <Label htmlFor="company-name">Restaurant name</Label>
              <Input id="company-name" value={companyName} onChange={(event) => setCompanyName(event.target.value)} />
            </div>
            <div>
              <Label htmlFor="email">Business email</Label>
              <Input id="email" value={email} onChange={(event) => setEmail(event.target.value)} />
            </div>
            <div>
              <Label htmlFor="phone">Phone number</Label>
              <Input id="phone" value={phone} onChange={(event) => setPhone(event.target.value)} />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="tax-rate">Tax rate (%)</Label>
              <Input id="tax-rate" value={taxRate} onChange={(event) => setTaxRate(event.target.value)} />
            </div>
            <div>
              <Label htmlFor="service-charge">Service charge (%)</Label>
              <Input id="service-charge" value={serviceCharge} onChange={(event) => setServiceCharge(event.target.value)} />
            </div>
            <div>
              <Label htmlFor="timezone">Timezone</Label>
              <Input id="timezone" value="UTC" readOnly />
            </div>
          </div>
        </div>
        <CardFooter className="justify-end pt-4">
          <Button>Save settings</Button>
        </CardFooter>
      </PageSection>
    </div>
  );
}
