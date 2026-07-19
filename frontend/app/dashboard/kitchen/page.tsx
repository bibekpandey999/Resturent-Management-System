'use client';

import { useQuery } from '@tanstack/react-query';
import { DashboardHeader } from '@/components/layout/dashboard-header';
import { KitchenDisplay } from '@/components/dashboard/kitchen-display';
import { StatsCard } from '@/components/dashboard/stats-card';
import { useEffect, useRef } from 'react';
import { useLiveTickets } from '@/hooks/cahsier/getAllTicket';
import { TTicket } from '@/lib/types/ticket.types';
import { Button } from '@/components/ui/button';
import { RefreshCw, ChefHat, Clock, AlertTriangle } from 'lucide-react';
import type { Order, OrderItem } from '@/lib/types';
import Link from 'next/link';



export default function KitchenDashboard() {


  

const { data: ticketData, refetch, isRefetching } = useLiveTickets({ status: 'pending' });
const orders: TTicket[] = ticketData?.data ?? [];

const printedRef = useRef<Set<string>>(new Set());

useEffect(() => {
  orders.forEach((ticket) => {
    if (!ticket.printed && !printedRef.current.has(ticket._id)) {
      printedRef.current.add(ticket._id);
      printTicket(ticket);
    }
  });
}, [orders]);

function printTicket(ticket: TTicket) {
  const receiptWindow = window.open('', '_blank', 'width=300,height=600');
  if (!receiptWindow) return;

  const itemsHtml = ticket.items
    .map(
      (item) => `
        <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:2px;">
          <span>${item.quantity} x ${item.name}</span>
        </div>`
    )
    .join('');

  receiptWindow.document.write(`
    <html>
      <head>
        <style>
          @page { size: 80mm auto; margin: 0; }
          body { width: 80mm; margin: 0; padding: 8px; font-family: monospace; }
          h2 { font-size: 16px; text-align: center; margin: 0 0 8px 0; }
          .line { border-top: 1px dashed #000; margin: 8px 0; }
          .row { display: flex; justify-content: space-between; font-size: 12px; }
        </style>
      </head>
      <body>
        <h2>KITCHEN ORDER</h2>
        <div class="row"><span>Ticket #</span><span>${ticket.ticketNumber}</span></div>
        <div class="row"><span>Table</span><span>${ticket.table?.tableName ?? ''}</span></div>
        <div class="line"></div>
        ${itemsHtml}
        <div class="line"></div>
        <p style="font-size:10px;text-align:center;">${new Date().toLocaleTimeString()}</p>
      </body>
    </html>
  `);
  receiptWindow.document.close();
  receiptWindow.focus();
  receiptWindow.print();
  receiptWindow.close();
}

  const handleMarkReady = (order: Order) => {
    // In a real app, this would update the order status via API
      console.log('[v0] Mark order ready:', order.id); 
  };

  const handleMarkItemReady = (order: Order, item: OrderItem) => {
    // In a real app, this would update the item status via API
    console.log('[v0] Mark item ready:', order.id, item.id);
  };

  const handleChangeItemStatus = (order: Order, item: OrderItem, status: Order['status']) => {
    console.log('[v0] Change item status:', order.id, item.id, status);
    // TODO: call API to update item status and refetch
  };

  const handleChangeOrderStatus = (order: Order, status: Order['status']) => {
    console.log('[v0] Change order status:', order.orderNumber, status);
    // TODO: call API to update order status and refetch
  };

  const pendingCount = orders?.filter(o => o.status === 'pending').length || 0;
const preparingCount = 0;
const readyCount = orders?.filter(o => o.status === 'served').length || 0;

  // Calculate priority orders (older than 20 minutes)
const priorityCount = orders?.filter(o => {
  if (!o.createdAt) return false;
  const age = (Date.now() - new Date(o.createdAt).getTime()) / (1000 * 60);
  return age > 20 && o.status !== 'completed';
}).length || 0;

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Kitchen Display"
        description="Manage and track incoming orders"
      >
        <div className="flex items-center gap-2"> 
          <Button 
            variant="outline" 
            className="touch-target"
            onClick={() => refetch()}
            disabled={isRefetching}
          >
            <RefreshCw className={`size-4 mr-2 ${isRefetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </DashboardHeader>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4 grid-cols-2">
        <StatsCard
          title="Pending Orders"
          value={pendingCount}
          icon={<Clock className="size-4" />}
        />
        <StatsCard
          title="Preparing"
          value={preparingCount}
          icon={<ChefHat className="size-4" />}
        />
        <StatsCard
          title="Ready"
          value={readyCount}
          icon={<ChefHat className="size-4" />}
        />
        <StatsCard
          title="Priority (>20min)"
          value={priorityCount}
          icon={<AlertTriangle className="size-4" />}
        />
      </div>

      {/* Kitchen Orders Display */}
      {orders && (
        <KitchenDisplay
          orders={orders}
          onMarkReady={handleMarkReady}
          onMarkItemReady={handleMarkItemReady}
          onChangeItemStatus={handleChangeItemStatus}
          onChangeOrderStatus={handleChangeOrderStatus}
        />
      )}
    </div>
  );
}
