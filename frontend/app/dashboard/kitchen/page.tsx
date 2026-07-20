'use client';

import { DashboardHeader } from '@/components/layout/dashboard-header';
import { KitchenDisplay } from '@/components/dashboard/kitchen-display';
import { StatsCard } from '@/components/dashboard/stats-card';
import { useEffect, useRef } from 'react';
import { useLiveTickets } from '@/hooks/cahsier/getAllTicket';
import { TTicket, TTicketItem, Status } from '@/lib/types/ticket.types';
import { ticketApi } from '@/lib/api/ticket.api';
import { Button } from '@/components/ui/button';
import { RefreshCw, ChefHat, Clock, AlertTriangle } from 'lucide-react';

export default function KitchenDashboard() {
  const { data: ticketData, refetch, isRefetching } = useLiveTickets({ status: 'pending' });
  const orders: TTicket[] = ticketData?.data ?? [];

  const printedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    orders.forEach((ticket) => {
      if (!ticket.printed && !printedRef.current.has(ticket._id)) {
        printedRef.current.add(ticket._id);
        printTicket(ticket);

        ticketApi.markTicketPrintedApi(ticket._id).catch((err) => {
          console.error('Failed to mark ticket as printed:', err);
        });
      }
    });
  }, [orders]);

  // function printTicket(ticket: TTicket) {
  //   const receiptWindow = window.open('', '_blank', 'width=300,height=600');
  //   if (!receiptWindow) return;

  //   const itemsHtml = ticket.items
  //     .map(
  //       (item) => `
  //         <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:2px;">
  //           <span>${item.quantity} x ${item.name}</span>
  //         </div>`
  //     )
  //     .join('');

  //   receiptWindow.document.write(`
  //     <html>
  //       <head>
  //         <style>
  //           @page { size: 80mm auto; margin: 0; }
  //           body { width: 80mm; margin: 0; padding: 8px; font-family: monospace; }
  //           h2 { font-size: 16px; text-align: center; margin: 0 0 8px 0; }
  //           .line { border-top: 1px dashed #000; margin: 8px 0; }
  //           .row { display: flex; justify-content: space-between; font-size: 12px; }
  //         </style>
  //       </head>
  //       <body>
  //         <h2>KITCHEN ORDER</h2>
  //         <div class="row"><span>Ticket #</span><span>${ticket.ticketNumber}</span></div>
  //         <div class="row"><span>Table</span><span>${ticket.table?.tableName ?? ''}</span></div>
  //         <div class="line"></div>
  //         ${itemsHtml}
  //         <div class="line"></div>
  //         <p style="font-size:10px;text-align:center;">${new Date().toLocaleTimeString()}</p>
  //       </body>
  //     </html>
  //   `);
  //   receiptWindow.document.close();
  //   receiptWindow.focus();
  //   receiptWindow.print();
  //   receiptWindow.close();
  // }

  function printTicket(ticket: TTicket) {
  const itemsHtml = ticket.items
    .map(
      (item) => `
        <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:2px;">
          <span>${item.quantity} x ${item.name}</span>
        </div>`
    )
    .join('');

  const html = `
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
  `;

  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) return;
  doc.open();
  doc.write(html);
  doc.close();

  iframe.contentWindow?.focus();
  iframe.contentWindow?.print();

  setTimeout(() => {
    document.body.removeChild(iframe);
  }, 1000);
}

  const handleMarkReady = (order: TTicket) => {
    console.log('[v0] Mark order ready:', order._id);
  };

  const handleMarkItemReady = (order: TTicket, item: TTicketItem) => {
    console.log('[v0] Mark item ready:', order._id, item.menuItemId);
  };

  const handleChangeItemStatus = (order: TTicket, item: TTicketItem, status: Status) => {
    console.log('[v0] Change item status:', order._id, item.menuItemId, status);
  };

  const handleChangeOrderStatus = (order: TTicket, status: Status) => {
    console.log('[v0] Change order status:', order.ticketNumber, status);
  };

  const pendingCount = orders?.filter(o => o.status === 'pending').length || 0;
  const preparingCount = orders?.filter(o => o.status === 'preparing').length || 0;
  const readyCount = orders?.filter(o => o.status === 'ready').length || 0;

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

      <div className="grid gap-4 md:grid-cols-4 grid-cols-2">
        <StatsCard title="Pending Orders" value={pendingCount} icon={<Clock className="size-4" />} />
        <StatsCard title="Preparing" value={preparingCount} icon={<ChefHat className="size-4" />} />
        <StatsCard title="Ready" value={readyCount} icon={<ChefHat className="size-4" />} />
        <StatsCard title="Priority (>20min)" value={priorityCount} icon={<AlertTriangle className="size-4" />} />
      </div>

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