"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { TableGrid, TableStats } from "@/components/dashboard/table-grid";
import { OrderList } from "@/components/dashboard/order-card";
import { StatsCard } from "@/components/dashboard/stats-card";
import { api } from "@/lib/api/mock-data";
import { Button } from "@/components/ui/button";
import { Plus, ClipboardList, Table2, Clock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import type { Table } from "@/lib/types";
import { useState } from "react";

export default function WaiterDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [showTablePrompt, setShowTablePrompt] = useState(false);

  const handleNewOrder = () => {
    setShowTablePrompt(true);
  };

  const { data: tables } = useQuery({
    queryKey: ["tables"],
    queryFn: api.getTables,
  });

  const { data: orders } = useQuery({
    queryKey: ["active-orders"],
    queryFn: api.getActiveOrders,
  });

  const handleTableClick = (table: Table) => {
    if (table.status !== "available") {
      toast({
        title: "Table unavailable",
        description:
          "Please select an available table before creating an order.",
      });
      return;
    }

    router.push(`/dashboard/waiter/menu?tableId=${table.id}`);
  };

  const myOrders =
    orders?.filter((o) => o.waiterId === "2" || o.waiterId === "5") || [];
  const readyOrders = myOrders.filter((o) => o.status === "ready");

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        <DashboardHeader
          title="Tables"
          description="Manage tables and take orders"
        >
          <Button className="touch-target" onClick={handleNewOrder}>
            <Plus className="size-4 mr-2" />
            New Order
          </Button>
        </DashboardHeader>

        {showTablePrompt && (
          <div className="rounded-md border border-red-500 p-4 bg-muted/30 text-sm text-muted-foreground">
            Please choose an available table from the below listing to create an order.
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 grid-cols-3">
        <StatsCard
          title="My Active Orders"
          value={myOrders.length}
          icon={<ClipboardList className="size-4" />}
        />
        <StatsCard
          title="Ready for Pickup"
          value={readyOrders.length}
          icon={<Clock className="size-4" />}
        />
        <StatsCard
          title="Available Tables"
          value={tables?.filter((t) => t.status === "available").length || 0}
          icon={<Table2 className="size-4" />}
        />
      </div>

      {/* Table Status */}
      {tables && <TableStats tables={tables} />}

      {/* Tables Grid */}
      {tables && (
        <TableGrid
          tables={tables}
          onTableClick={handleTableClick}
          title="Floor Plan"
        />
      )}

      {/* Orders Ready */}
      {readyOrders.length > 0 && (
        <OrderList orders={readyOrders} title="Orders Ready for Pickup" />
      )}

      {/* My Active Orders */}
      {myOrders.length > 0 && (
        <OrderList orders={myOrders} title="My Active Orders" />
      )}
    </div>
  );
}
