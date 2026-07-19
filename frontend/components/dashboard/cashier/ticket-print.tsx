"use client";

import { TTicket } from "@/lib/types/ticket.types";

export default function OrderTicketPrint({ order }: { order: TTicket }) {
  if (!order) return null;

  return (
    <div className="hidden print:block">
      <div className="receipt-print w-[80mm] bg-white text-black px-3 py-2 text-xs font-sans m-[10px] border border-dashed border-gray-600 rounded">
        {/* Header */}
        <div className="text-center border-b border-gray-200 pb-2">
          <div className="flex items-center justify-between text-[10px]">
            <span>Estd: 2068/2/21</span>
            <span>PAN: 123S34Ft-V21</span>
          </div>
          <h1 className="text-xl font-bold tracking-wider">Local Vibes Cafe & Bar</h1>
          <p className="text-[10px] text-gray-600">
            Butwal 10, Kalikanagar
          </p>
        </div>

        {/* Ticket Info */}
        <div className="py-2 border-b border-gray-200">
          

          <div className="flex justify-between">
            <span>Order</span>
            <span>{order?.orderNumber}</span>
          </div>

          <div className="flex justify-between">
            <span>Time</span>
            <span>
              {order.createdAt
                ? new Date(order.createdAt).toLocaleTimeString()
                : "-"}
            </span>
          </div>
        </div>

        {/* Table / Waiter Info */}
        <div className="py-2 border-b border-gray-200">
          <div className="flex justify-between">
            <span>Table</span>
            <span>{order.table?.tableName || "-"}</span>
          </div>

          <div className="flex justify-between">
            <span>Customer</span>
            <span>{order.order?.customerName || "Guest"}</span>
          </div>


        {/* Items Header */}
        <div className="py-2">
          <div className="grid grid-cols-12 bg-gray-200 text-gray-950 p-1">
            <span className="col-span-8">Item</span>
            <span className="col-span-4 text-right">Qty</span>
          </div>

          {order.items?.map((item: any, idx: number) => (
            <div key={idx} className="grid grid-cols-12 py-1">
              <span className="col-span-8 truncate">{item.name}</span>
              <span className="col-span-4 text-right font-bold">
                x{item.quantity}
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-4 space-y-1">
          <p className="font-semibold">Visit again</p>

          <div className="border-t border-gray-200 mt-2 pt-2 text-[9px]">
            Powered by DineFlow
          </div>
        </div>
      </div>
    </div>
  );
}