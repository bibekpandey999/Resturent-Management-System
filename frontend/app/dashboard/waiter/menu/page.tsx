'use client';

import { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { DashboardHeader } from '@/components/layout/dashboard-header';
import { api } from '@/lib/api/mock-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import type { MenuItem, Table } from '@/lib/types';

export default function WaiterMenuPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const tableId = searchParams.get('tableId');

  const { data: tables } = useQuery({
    queryKey: ['tables'],
    queryFn: api.getTables,
  });

  const { data: menuItems } = useQuery({
    queryKey: ['menu-items'],
    queryFn: api.getMenuItems,
  });

  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState('');

  const selectedTable = useMemo(
    () => tables?.find((table) => table.id === tableId),
    [tables, tableId],
  );

  const availableMenuItems = useMemo(
    () => menuItems?.filter((item) => item.isAvailable) ?? [],
    [menuItems],
  );

  const selectedItems = useMemo(
    () => availableMenuItems.filter((menuItem) => (quantities[menuItem.id] ?? 0) > 0),
    [availableMenuItems, quantities],
  );

  const subtotal = selectedItems.reduce(
    (sum, menuItem) => sum + menuItem.price * (quantities[menuItem.id] ?? 0),
    0,
  );

  const tax = Number((subtotal * 0.1).toFixed(2));
  const total = subtotal + tax;

  const createOrderMutation = useMutation({
    mutationFn: api.createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-orders'] });
      queryClient.invalidateQueries({ queryKey: ['tables'] });
      toast({
        title: 'Order created',
        description: `Order has been sent to kitchen for Table ${selectedTable?.number}.`,
      });
      router.push('/dashboard/waiter/orders');
    },
    onError: () => {
      toast({
        title: 'Unable to create order',
        description: 'Please try again or select a different table.',
      });
    },
  });

  const increaseQuantity = (menuItem: MenuItem) => {
    setQuantities((current) => ({
      ...current,
      [menuItem.id]: (current[menuItem.id] ?? 0) + 1,
    }));
  };

  const decreaseQuantity = (menuItem: MenuItem) => {
    setQuantities((current) => {
      const nextCount = (current[menuItem.id] ?? 0) - 1;
      if (nextCount <= 0) {
        const { [menuItem.id]: _, ...rest } = current;
        return rest;
      }
      return { ...current, [menuItem.id]: nextCount };
    });
  };

  const handleCreateOrder = () => {
    if (!selectedTable || selectedTable.status !== 'available') {
      toast({
        title: 'Select a table',
        description: 'Please open the waiter dashboard and choose an available table first.',
      });
      return;
    }

    if (selectedItems.length === 0) {
      toast({
        title: 'No items selected',
        description: 'Choose at least one menu item before creating the order.',
      });
      return;
    }

    const orderItems = selectedItems.map((menuItem) => ({
      id: `order-item-${menuItem.id}-${Date.now()}`,
      menuItemId: menuItem.id,
      menuItem,
      quantity: quantities[menuItem.id] ?? 1,
      price: menuItem.price,
      status: 'pending' as const,
    }));

    createOrderMutation.mutate({
      tableId: selectedTable.id,
      items: orderItems,
      status: 'pending',
      paymentStatus: 'pending',
      subtotal,
      tax,
      total,
      notes,
      waiterId: '2',
    });
  };

  if (!selectedTable) {
    return (
      <div className="space-y-6">
        <DashboardHeader
          title="Menu"
          description="Choose a table from the waiter dashboard before creating an order."
        />
        <Card className="border-border">
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              No table selected. To start a new waiter order, select an available table on the tables dashboard.
            </p>
            <Button onClick={() => router.push('/dashboard/waiter')}>
              Back to Tables
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Menu"
        description={`Creating order for Table ${selectedTable.number} (${selectedTable.section})`}
      />

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Menu items</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              {availableMenuItems.length === 0 ? (
                <p className="text-sm text-muted-foreground">No menu items available right now.</p>
              ) : (
                availableMenuItems.map((menuItem) => (
                  <div key={menuItem.id} className="rounded-3xl border border-border p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{menuItem.name}</p>
                        <p className="text-sm text-muted-foreground">{menuItem.description}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="outline">${menuItem.price.toFixed(2)}</Badge>
                          <Badge variant="outline">{menuItem.category?.name}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 rounded-full border border-border bg-muted/20 px-3 py-2">
                        <Button size="sm" variant="outline" onClick={() => decreaseQuantity(menuItem)}>
                          -
                        </Button>
                        <span className="min-w-6 text-center text-sm font-semibold">
                          {quantities[menuItem.id] ?? 0}
                        </span>
                        <Button size="sm" variant="outline" onClick={() => increaseQuantity(menuItem)}>
                          +
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Order summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 rounded-3xl border border-border bg-muted/50 p-4">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Table</span>
                  <span>{selectedTable.number}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Section</span>
                  <span>{selectedTable.section}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Status</span>
                  <span className="capitalize">{selectedTable.status}</span>
                </div>
              </div>

              <div className="space-y-3">
                {selectedItems.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No items selected yet.</p>
                ) : (
                  <div className="space-y-2">
                    {selectedItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{item.name} x {quantities[item.id]}</span>
                        <span className="text-sm font-semibold text-foreground">
                          ${(item.price * (quantities[item.id] ?? 0)).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-foreground">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="order-notes">Order notes</Label>
                <Textarea
                  id="order-notes"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Add special requests or instructions"
                  rows={4}
                />
              </div>

              <Button
                size="lg"
                className="w-full"
                onClick={handleCreateOrder}
                disabled={createOrderMutation.isPending || selectedItems.length === 0}
              >
                {createOrderMutation.isPending ? 'Sending to Kitchen...' : 'Create Order'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
