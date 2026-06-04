import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, ChefHat, CheckCircle2 } from 'lucide-react';
import type { Order, OrderItem, OrderStatus } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';

interface KitchenOrderCardProps {
  order: Order;
  onMarkReady?: (order: Order) => void;
  onMarkItemReady?: (order: Order, item: OrderItem) => void;
}

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-warning/20 text-warning border-warning/30' },
  preparing: { label: 'Preparing', className: 'bg-info/20 text-info border-info/30' },
  ready: { label: 'Ready', className: 'bg-success/20 text-success border-success/30' },
  served: { label: 'Served', className: 'bg-primary/20 text-primary border-primary/30' },
  completed: { label: 'Completed', className: 'bg-muted text-muted-foreground border-muted' },
  cancelled: { label: 'Cancelled', className: 'bg-destructive/20 text-destructive border-destructive/30' },
};

export function KitchenOrderCard({ order, onMarkReady, onMarkItemReady }: KitchenOrderCardProps) {
  const timeAgo = formatDistanceToNow(order.createdAt, { addSuffix: false });
  const status = statusConfig[order.status];
  
  // Filter items that need kitchen attention (not drinks/beverages)
  const kitchenItems = order.items.filter(
    item => !item.menuItem.categoryId.includes('cat-5') // Exclude beverages
  );
  
  const allItemsReady = kitchenItems.every(item => item.status === 'ready' || item.status === 'served');
  const isPriority = parseInt(timeAgo) > 20; // More than 20 minutes

  return (
    <Card className={cn(
      'bg-card border-2 transition-all',
      isPriority && order.status !== 'ready' ? 'border-destructive/50' : 'border-border',
      order.status === 'ready' && 'border-success/50'
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              'flex size-14 items-center justify-center rounded-xl text-2xl font-bold',
              isPriority && order.status !== 'ready' ? 'bg-destructive/20 text-destructive' : 'bg-secondary text-foreground'
            )}>
              {order.table.number}
            </div>
            <div>
              <CardTitle className="text-lg text-foreground">{order.orderNumber}</CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="size-3" />
                <span>{timeAgo} ago</span>
                {isPriority && order.status !== 'ready' && (
                  <Badge variant="destructive" className="text-xs">PRIORITY</Badge>
                )}
              </div>
            </div>
          </div>
          <Badge variant="outline" className={cn('text-sm', status.className)}>
            {status.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {kitchenItems.map((item) => {
            const itemStatus = statusConfig[item.status];
            const isReady = item.status === 'ready' || item.status === 'served';
            
            return (
              <div 
                key={item.id} 
                className={cn(
                  'flex items-center justify-between rounded-lg border p-3 transition-colors',
                  isReady ? 'border-success/30 bg-success/5' : 'border-border bg-secondary/30'
                )}
              >
                <div className="flex items-center gap-3">
                  <span className={cn(
                    'flex size-8 items-center justify-center rounded-full text-sm font-bold',
                    isReady ? 'bg-success/20 text-success' : 'bg-primary/20 text-primary'
                  )}>
                    {item.quantity}x
                  </span>
                  <div>
                    <p className={cn(
                      'font-medium',
                      isReady ? 'text-success line-through' : 'text-foreground'
                    )}>
                      {item.menuItem.name}
                    </p>
                    {item.notes && (
                      <p className="text-xs text-warning">{item.notes}</p>
                    )}
                  </div>
                </div>
                {!isReady && onMarkItemReady && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="touch-target"
                    onClick={() => onMarkItemReady(order, item)}
                  >
                    <CheckCircle2 className="size-4 mr-1" />
                    Ready
                  </Button>
                )}
                {isReady && (
                  <CheckCircle2 className="size-5 text-success" />
                )}
              </div>
            );
          })}
        </div>
        
        {order.notes && (
          <div className="mt-4 rounded-lg border border-warning/30 bg-warning/10 p-3">
            <p className="text-sm text-warning">Note: {order.notes}</p>
          </div>
        )}
        
        {allItemsReady && order.status !== 'ready' && onMarkReady && (
          <Button 
            className="w-full mt-4 touch-target" 
            onClick={() => onMarkReady(order)}
          >
            <ChefHat className="size-4 mr-2" />
            Mark Order Ready
          </Button>
        )}
        
        {order.status === 'ready' && (
          <div className="mt-4 rounded-lg bg-success/20 p-3 text-center">
            <p className="text-sm font-medium text-success">Order ready for pickup!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface KitchenDisplayProps {
  orders: Order[];
  onMarkReady?: (order: Order) => void;
  onMarkItemReady?: (order: Order, item: OrderItem) => void;
}

export function KitchenDisplay({ orders, onMarkReady, onMarkItemReady }: KitchenDisplayProps) {
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const preparingOrders = orders.filter(o => o.status === 'preparing');
  const readyOrders = orders.filter(o => o.status === 'ready');

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className={statusConfig.pending.className}>
          Pending: {pendingOrders.length}
        </Badge>
        <Badge variant="outline" className={statusConfig.preparing.className}>
          Preparing: {preparingOrders.length}
        </Badge>
        <Badge variant="outline" className={statusConfig.ready.className}>
          Ready: {readyOrders.length}
        </Badge>
      </div>

      {/* Orders Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...pendingOrders, ...preparingOrders, ...readyOrders].map((order) => (
          <KitchenOrderCard
            key={order.id}
            order={order}
            onMarkReady={onMarkReady}
            onMarkItemReady={onMarkItemReady}
          />
        ))}
      </div>

      {orders.length === 0 && (
        <Card className="bg-card border-border">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ChefHat className="size-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-foreground">No active orders</p>
            <p className="text-sm text-muted-foreground">New orders will appear here</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
