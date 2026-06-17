"use client";

import { TOrder } from "@/lib/types/order.types";

export default function OrderInvoicePrint({
  order,
}: {
  order: TOrder | null;
}) {
  if (!order) return null;

  return (
    <div
      className="bg-white text-black p-4"
      style={{ width: "80mm" }}
    >
      <div className="text-center">
        <h2 className="font-bold">
          Restaurant Invoice
        </h2>
      </div>

      <hr className="my-2" />

      <p>Order: {order.orderNumber}</p>
      <p>Table: {order.table?.name}</p>
      <p>Customer: {order.customerName || "Guest"}</p>
      <p>Date: {new Date(order.createdAt).toLocaleString()}</p>

      <hr className="my-2" />

      {order.items.map((item, idx) => (
        <div
          key={idx}
          className="flex justify-between text-sm"
        >
          <span>
            {item.quantity}x{" "}
            {item.menuItem ?? "Item"}
          </span>

          <span>
            Rs {(item.price * item.quantity).toFixed(2)}
          </span>
        </div>
      ))}

      <hr className="my-2" />

      <div className="flex justify-between">
        <span>Total</span>
        <span>Rs {order.total.toFixed(2)}</span>
      </div>
    </div>
  );
}