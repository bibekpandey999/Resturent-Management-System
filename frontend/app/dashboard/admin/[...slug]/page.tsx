'use client';

import { use, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DashboardHeader } from '@/components/layout/dashboard-header';
import { RevenueChart } from '@/components/dashboard/revenue-chart';
import { api } from '@/lib/api/mock-data';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  Building2,
  ClipboardList,
  DollarSign,
  FileSearch,
  Grid3X3,
  History,
  Package,
  PieChart,
  Receipt,
  Settings,
  ShoppingCart,
  Truck,
  Users,
} from 'lucide-react';
import type {
  ActivityLog,
  AdminDashboardStats,
  Branch,
  Expense,
  Ingredient,
  MenuCategory,
  MenuItem,
  MenuModifier,
  Notification,
  Order,
  Permission,
  PurchaseOrder,
  Reservation,
  Role,
  SalesByCategory,
  StaffMember,
  StockMovement,
  Supplier,
  Table as DiningTable,
  TableSection,
  User,
  ManagedUser,
  Recipe,
  RevenueData,
} from '@/lib/types';

function statusStyle(status: string) {
  switch (status) {
    case 'active':
    case 'paid':
    case 'approved':
    case 'received':
    case 'confirmed':
      return 'bg-emerald-100 text-emerald-700';
    case 'pending':
    case 'out-of-stock':
    case 'draft':
      return 'bg-amber-100 text-amber-700';
    case 'cancelled':
    case 'refunded':
    case 'hidden':
      return 'bg-rose-100 text-rose-700';
    case 'completed':
    case 'served':
      return 'bg-sky-100 text-sky-700';
    case 'preparing':
    case 'in':
      return 'bg-blue-100 text-blue-700';
    case 'out':
    case 'adjustment':
    case 'waste':
      return 'bg-violet-100 text-violet-700';
    default:
      return 'bg-muted/20 text-muted-foreground';
  }
}

function MetricCard({ title, value, description }: { title: string; value: string | number; description?: string }) {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-semibold text-foreground">{value}</p>
      </CardContent>
    </Card>
  );
}

function PageSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function SearchField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  return (
    <div className="grid gap-2 sm:grid-cols-[1fr_auto] sm:items-end">
      <div>
        <Label htmlFor="search">{label}</Label>
        <Input
          id="search"
          value={value}
          onChange={event => onChange(event.target.value)}
          placeholder={placeholder ?? 'Search...'}
        />
      </div>
    </div>
  );
}

function TableBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex rounded-full bg-muted px-2 py-1 text-xs font-medium text-foreground/80">{label}</span>
  );
}

function formatDate(value?: string | Date) {
  if (!value) return '-';
  const date = typeof value === 'string' ? new Date(value) : value;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function UsersPage() {
  const { data: users = [] } = useQuery<ManagedUser[]>({ queryKey: ['users'], queryFn: () => api.getUsers() });
  const [filter, setFilter] = useState('');
  const filteredUsers = useMemo(
    () => users.filter((user) =>
      [user.name, user.email, user.role, user.status]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(filter.toLowerCase())),
    ),
    [users, filter],
  );

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="User Management"
        description="Manage access, role assignments and employee details."
      >
        <Button variant="outline">Invite user</Button>
        <Button>New user</Button>
      </DashboardHeader>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard title="Total Users" value={users.length} />
        <MetricCard title="Active" value={users.filter((user) => user.status === 'active').length} />
        <MetricCard title="Inactive" value={users.filter((user) => user.status !== 'active').length} />
      </div>

      <PageSection title="User Directory">
        <div className="space-y-4">
          <SearchField label="Search users" value={filter} onChange={setFilter} placeholder="Search by name, email, role or status" />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Last login</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusStyle(user.status)}`}>
                      {user.status}
                    </span>
                  </TableCell>
                  <TableCell>{user.branchId ?? 'All locations'}</TableCell>
                  <TableCell>{user.lastLogin ? formatDate(user.lastLogin) : 'Never'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </PageSection>
    </div>
  );
}

function RolesPage() {
  const { data: roles = [] } = useQuery<Role[]>({ queryKey: ['roles'], queryFn: () => api.getRoles() });

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Roles & Permissions"
        description="Review role assignments and permission coverage across your team."
      >
        <Button variant="outline">Permission matrix</Button>
        <Button>New role</Button>
      </DashboardHeader>

      <PageSection title="Role Overview">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {roles.map((role) => (
            <Card key={role.id} className="bg-card border-border">
              <CardHeader>
                <CardTitle>{role.name}</CardTitle>
                <CardDescription>{role.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Permissions: {role.permissions.length}</p>
                <p className="text-sm text-muted-foreground">Users: {role.userCount}</p>
                <p className="text-sm text-muted-foreground">Created {formatDate(role.createdAt)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageSection>
    </div>
  );
}

function BranchesPage() {
  const { data: branches = [] } = useQuery<Branch[]>({ queryKey: ['branches'], queryFn: () => api.getBranches() });
  const [filter, setFilter] = useState('');
  const filtered = useMemo(
    () => branches.filter((branch) =>
      [branch.name, branch.address, branch.email, branch.phone]
        .join(' ')
        .toLowerCase()
        .includes(filter.toLowerCase()),
    ),
    [branches, filter],
  );

  return (
    <div className="space-y-6">
      <DashboardHeader title="Branch Management" description="Add, update, and monitor venue locations." />
      <PageSection title="Branch Locations">
        <div className="space-y-4">
          <SearchField label="Search branches" value={filter} onChange={setFilter} placeholder="Search by name or address" />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Manager</TableHead>
                <TableHead>Opened</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((branch) => (
                <TableRow key={branch.id}>
                  <TableCell>{branch.name}</TableCell>
                  <TableCell>{branch.address}</TableCell>
                  <TableCell>{branch.phone}</TableCell>
                  <TableCell>
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusStyle(branch.isActive ? 'active' : 'cancelled')}`}>
                      {branch.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell>{branch.managerId ?? 'Unassigned'}</TableCell>
                  <TableCell>{formatDate(branch.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </PageSection>
    </div>
  );
}

function TablesPage() {
  const { data: tables = [] } = useQuery<DiningTable[]>({ queryKey: ['tables'], queryFn: () => api.getTables() });
  const [filter, setFilter] = useState('');
  const filtered = useMemo(
    () => tables.filter((table) =>
      [table.number.toString(), table.section, table.status]
        .join(' ')
        .toLowerCase()
        .includes(filter.toLowerCase()),
    ),
    [tables, filter],
  );

  return (
    <div className="space-y-6">
      <DashboardHeader title="Table Floorplan" description="Monitor seating availability and layout status." />
      <PageSection title="Table List">
        <div className="space-y-4">
          <SearchField label="Search tables" value={filter} onChange={setFilter} placeholder="Search by number, section or status" />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Table</TableHead>
                <TableHead>Section</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Order</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((table) => (
                <TableRow key={table.id}>
                  <TableCell>{`Table ${table.number}`}</TableCell>
                  <TableCell>{table.section}</TableCell>
                  <TableCell>{table.capacity}</TableCell>
                  <TableCell>
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusStyle(table.status)}`}>
                      {table.status}
                    </span>
                  </TableCell>
                  <TableCell>{table.currentOrderId ?? 'Available'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </PageSection>
    </div>
  );
}

function SectionsPage() {
  const { data: sections = [] } = useQuery<TableSection[]>({ queryKey: ['sections'], queryFn: () => api.getSections() });

  return (
    <div className="space-y-6">
      <DashboardHeader title="Table Sections" description="Organize seating sections and monitor section capacity." />
      <PageSection title="Restaurant Sections">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {sections.map((section) => (
            <Card key={section.id} className="bg-card border-border">
              <CardHeader>
                <CardTitle>{section.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{section.description ?? 'Standard dining section'}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  <TableBadge label={`${section.tableCount} tables`} />
                  <TableBadge label={section.isActive ? 'Active' : 'Inactive'} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageSection>
    </div>
  );
}

function ReservationsPage() {
  const { data: reservations = [] } = useQuery<Reservation[]>({ queryKey: ['reservations'], queryFn: () => api.getReservations() });
  const [filter, setFilter] = useState('');
  const filtered = useMemo(
    () => reservations.filter((reservation) =>
      [reservation.customerName, reservation.customerPhone, reservation.status]
        .join(' ')
        .toLowerCase()
        .includes(filter.toLowerCase()),
    ),
    [reservations, filter],
  );

  return (
    <div className="space-y-6">
      <DashboardHeader title="Reservations" description="Track upcoming guests, booking details, and table assignments." />
      <PageSection title="Reservation Schedule">
        <div className="space-y-4">
          <SearchField label="Search reservations" value={filter} onChange={setFilter} placeholder="Search by guest, phone or status" />
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

function MenuCategoriesPage() {
  const { data: categories = [] } = useQuery<MenuCategory[]>({ queryKey: ['menu-categories'], queryFn: () => api.getMenuCategories() });

  return (
    <div className="space-y-6">
      <DashboardHeader title="Menu Categories" description="Manage category structure for the ordering menu." />
      <PageSection title="Category Catalog">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <Card key={category.id} className="bg-card border-border">
              <CardHeader>
                <CardTitle>{category.name}</CardTitle>
                <CardDescription>{category.description ?? 'No description available'}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <TableBadge label={`${category.itemCount ?? 0} items`} />
                  <TableBadge label={category.isActive ? 'Active' : 'Inactive'} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageSection>
    </div>
  );
}

function MenuItemsPage() {
  const { data: categories = [] } = useQuery<MenuCategory[]>({ queryKey: ['menu-categories'], queryFn: () => api.getMenuCategories() });
  const { data: items = [] } = useQuery<MenuItem[]>({ queryKey: ['menu-items'], queryFn: () => api.getMenuItems() });
  const [filter, setFilter] = useState('');
  const categoryMap = useMemo(() => Object.fromEntries(categories.map((category) => [category.id, category.name])), [categories]);
  const filtered = useMemo(
    () => items.filter((item) =>
      [item.name, item.description, categoryMap[item.categoryId] || '', item.status]
        .join(' ')
        .toLowerCase()
        .includes(filter.toLowerCase()),
    ),
    [items, filter, categoryMap],
  );

  return (
    <div className="space-y-6">
      <DashboardHeader title="Food Items" description="Review menu items, availability, and pricing." />
      <PageSection title="Menu Items">
        <div className="space-y-4">
          <SearchField label="Search food items" value={filter} onChange={setFilter} placeholder="Search by name, category or status" />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Prep Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{categoryMap[item.categoryId] ?? 'Unknown'}</TableCell>
                  <TableCell>${item.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusStyle(item.status)}`}>
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell>{`${item.preparationTime} min`}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </PageSection>
    </div>
  );
}

function ModifiersPage() {
  const { data: modifiers = [] } = useQuery<MenuModifier[]>({ queryKey: ['menu-modifiers'], queryFn: () => api.getModifiers() });

  return (
    <div className="space-y-6">
      <DashboardHeader title="Menu Modifiers" description="Configure optional add-ons, sizes and choices for menu items." />
      <PageSection title="Modifier Sets">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {modifiers.map((modifier) => (
            <Card key={modifier.id} className="bg-card border-border">
              <CardHeader>
                <CardTitle>{modifier.name}</CardTitle>
                <CardDescription>{modifier.required ? 'Required selection' : 'Optional selection'}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Max selections: {modifier.maxSelections}</p>
                <p className="text-sm text-muted-foreground">Options: {modifier.options.length}</p>
                <p className="text-sm text-muted-foreground">Linked items: {modifier.itemIds.length}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageSection>
    </div>
  );
}

function InventoryPage() {
  const { data: ingredients = [] } = useQuery<Ingredient[]>({ queryKey: ['ingredients'], queryFn: () => api.getIngredients() });
  const lowStock = ingredients.filter((item) => item.currentStock <= item.minimumStock).length;

  return (
    <div className="space-y-6">
      <DashboardHeader title="Inventory Overview" description="Track ingredient stock levels and reorder thresholds." />
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard title="Total ingredients" value={ingredients.length} />
        <MetricCard title="Low stock" value={lowStock} />
        <MetricCard title="Average stock" value={ingredients.length ? Math.round(ingredients.reduce((acc, item) => acc + item.currentStock, 0) / ingredients.length) : 0} />
      </div>
      <PageSection title="Ingredient Inventory">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ingredient</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Reorder Level</TableHead>
              <TableHead>Supplier</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ingredients.map((ingredient) => (
              <TableRow key={ingredient.id}>
                <TableCell>{ingredient.name}</TableCell>
                <TableCell>{ingredient.category}</TableCell>
                <TableCell>{ingredient.currentStock} {ingredient.unit}</TableCell>
                <TableCell>{ingredient.reorderLevel}</TableCell>
                <TableCell>{ingredient.supplierId ?? 'Unknown'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </PageSection>
    </div>
  );
}

function StockMovementPage() {
  const { data: movements = [] } = useQuery<StockMovement[]>({ queryKey: ['stock-movements'], queryFn: () => api.getStockMovements() });
  const [filter, setFilter] = useState('');
  const filtered = useMemo(
    () => movements.filter((movement) =>
      [movement.type, movement.reason, movement.referenceNumber, movement.user?.name]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(filter.toLowerCase()),
    ),
    [movements, filter],
  );

  return (
    <div className="space-y-6">
      <DashboardHeader title="Stock Movement" description="Audit inventory adjustments, transfers and waste entries." />
      <PageSection title="Movement Log">
        <div className="space-y-4">
          <SearchField label="Search movement" value={filter} onChange={setFilter} placeholder="Search by type, reason, or user" />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ingredient</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((movement) => (
                <TableRow key={movement.id}>
                  <TableCell>{movement.ingredient?.name ?? movement.ingredientId}</TableCell>
                  <TableCell>
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusStyle(movement.type)}`}>
                      {movement.type}
                    </span>
                  </TableCell>
                  <TableCell>{movement.quantity}</TableCell>
                  <TableCell>{movement.reason}</TableCell>
                  <TableCell>{movement.user?.name ?? movement.userId}</TableCell>
                  <TableCell>{formatDate(movement.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </PageSection>
    </div>
  );
}

function InventoryAlertsPage() {
  const { data: alerts = [] } = useQuery<Ingredient[]>({ queryKey: ['low-stock'], queryFn: () => api.getLowStockIngredients() });

  return (
    <div className="space-y-6">
      <DashboardHeader title="Low Stock Alerts" description="Catch ingredients that need immediate reorder." />
      <PageSection title="Alerts">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ingredient</TableHead>
              <TableHead>Current Stock</TableHead>
              <TableHead>Minimum Stock</TableHead>
              <TableHead>Reorder Level</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alerts.map((ingredient) => (
              <TableRow key={ingredient.id}>
                <TableCell>{ingredient.name}</TableCell>
                <TableCell>{ingredient.currentStock}</TableCell>
                <TableCell>{ingredient.minimumStock}</TableCell>
                <TableCell>{ingredient.reorderLevel}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </PageSection>
    </div>
  );
}

function SuppliersPage() {
  const { data: suppliers = [] } = useQuery<Supplier[]>({ queryKey: ['suppliers'], queryFn: () => api.getSuppliers() });

  return (
    <div className="space-y-6">
      <DashboardHeader title="Supplier Directory" description="Keep supplier contacts and purchasing partners organized." />
      <PageSection title="Suppliers">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suppliers.map((supplier) => (
              <TableRow key={supplier.id}>
                <TableCell>{supplier.name}</TableCell>
                <TableCell>{supplier.contactPerson}</TableCell>
                <TableCell>{supplier.phone}</TableCell>
                <TableCell>{supplier.email}</TableCell>
                <TableCell>
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusStyle(supplier.isActive ? 'active' : 'cancelled')}`}>
                    {supplier.isActive ? 'Active' : 'Inactive'}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </PageSection>
    </div>
  );
}

function PurchaseOrdersPage() {
  const { data: orders = [] } = useQuery<PurchaseOrder[]>({ queryKey: ['purchase-orders'], queryFn: () => api.getPurchaseOrders() });

  return (
    <div className="space-y-6">
      <DashboardHeader title="Purchase Orders" description="Review supply orders and expected delivery status." />
      <PageSection title="Order History">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>PO Number</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.orderNumber}</TableCell>
                <TableCell>{order.supplier?.name ?? order.supplierId}</TableCell>
                <TableCell>
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusStyle(order.status)}`}>
                    {order.status}
                  </span>
                </TableCell>
                <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                <TableCell>{formatDate(order.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </PageSection>
    </div>
  );
}

function activeOrders(orders: Order[]) {
  return orders.filter((order) => !['completed', 'cancelled'].includes(order.status));
}

function OrdersPage() {
  const { data: orders = [] } = useQuery<Order[]>({ queryKey: ['orders'], queryFn: () => api.getOrders() });

  return (
    <div className="space-y-6">
      <DashboardHeader title="Active Orders" description="Monitor orders currently in progress." />
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard title="Open orders" value={activeOrders(orders).length} />
        <MetricCard title="Completed" value={orders.filter((order) => order.status === 'completed').length} />
        <MetricCard title="Cancelled" value={orders.filter((order) => order.status === 'cancelled').length} />
      </div>
      <PageSection title="Order Queue">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Table</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Waiter</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activeOrders(orders).map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.orderNumber}</TableCell>
                <TableCell>{order.table.number}</TableCell>
                <TableCell>
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusStyle(order.status)}`}>
                    {order.status}
                  </span>
                </TableCell>
                <TableCell>{order.waiter.name}</TableCell>
                <TableCell>${order.total.toFixed(2)}</TableCell>
                <TableCell>{formatDate(order.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </PageSection>
    </div>
  );
}

function CompletedOrdersPage() {
  const { data: orders = [] } = useQuery<Order[]>({ queryKey: ['completed-orders'], queryFn: () => api.getCompletedOrders() });

  return (
    <div className="space-y-6">
      <DashboardHeader title="Completed Orders" description="Review finished orders and revenue contribution." />
      <PageSection title="Completed Order History">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Table</TableHead>
              <TableHead>Waiter</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Completed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.orderNumber}</TableCell>
                <TableCell>{order.table.number}</TableCell>
                <TableCell>{order.waiter.name}</TableCell>
                <TableCell>${order.total.toFixed(2)}</TableCell>
                <TableCell>{order.completedAt ? formatDate(order.completedAt) : formatDate(order.updatedAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </PageSection>
    </div>
  );
}

function CancelledOrdersPage() {
  const { data: orders = [] } = useQuery<Order[]>({ queryKey: ['orders'], queryFn: () => api.getOrders() });
  const cancelled = useMemo(() => orders.filter((order) => order.status === 'cancelled'), [orders]);

  return (
    <div className="space-y-6">
      <DashboardHeader title="Cancelled Orders" description="Track orders that were voided or cancelled." />
      <PageSection title="Cancelled Orders">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Table</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Waiter</TableHead>
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cancelled.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.orderNumber}</TableCell>
                <TableCell>{order.table.number}</TableCell>
                <TableCell>{order.notes ?? 'Cancelled by staff'}</TableCell>
                <TableCell>{order.waiter.name}</TableCell>
                <TableCell>${order.total.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </PageSection>
    </div>
  );
}

function FinanceRevenuePage() {
  const { data: revenueData = [] } = useQuery<RevenueData[]>({ queryKey: ['revenue-data'], queryFn: () => api.getRevenueData() });
  const { data: stats } = useQuery<AdminDashboardStats>({ queryKey: ['admin-dashboard-stats'], queryFn: () => api.getAdminDashboardStats() });

  return (
    <div className="space-y-6">
      <DashboardHeader title="Revenue" description="Monitor top-level revenue trends and daily performance." />
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard title="Today revenue" value={stats ? `$${stats.totalRevenue.toLocaleString()}` : '-'} />
        <MetricCard title="Orders today" value={stats?.todayOrders ?? '-'} />
        <MetricCard title="Reservations today" value={stats?.reservationsToday ?? '-'} />
      </div>
      <PageSection title="Revenue Trend">
        <RevenueChart data={revenueData} title="Revenue Trend" description="Last seven days of revenue." />
      </PageSection>
    </div>
  );
}

function FinanceExpensesPage() {
  const { data: expenses = [] } = useQuery<Expense[]>({ queryKey: ['expenses'], queryFn: () => api.getExpenses() });
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="space-y-6">
      <DashboardHeader title="Expense Management" description="Track costs and spending categories across operations." />
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard title="Total expenses" value={`$${total.toFixed(2)}`} />
        <MetricCard title="Entries" value={expenses.length} />
        <MetricCard title="Average spend" value={expenses.length ? `$${(total / expenses.length).toFixed(2)}` : '$0.00'} />
      </div>
      <PageSection title="Expense Ledger">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Vendor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>{expense.category}</TableCell>
                <TableCell>{expense.description}</TableCell>
                <TableCell>${expense.amount.toFixed(2)}</TableCell>
                <TableCell>{formatDate(expense.date)}</TableCell>
                <TableCell>{expense.vendorName ?? 'Internal'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </PageSection>
    </div>
  );
}

function FinanceProfitLossPage() {
  const { data: revenueData = [] } = useQuery<RevenueData[]>({ queryKey: ['revenue-data'], queryFn: () => api.getRevenueData() });
  const { data: expenses = [] } = useQuery<Expense[]>({ queryKey: ['expenses'], queryFn: () => api.getExpenses() });
  const revenueTotal = revenueData.reduce((sum, point) => sum + point.revenue, 0);
  const expenseTotal = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const profit = revenueTotal - expenseTotal;

  return (
    <div className="space-y-6">
      <DashboardHeader title="Profit & Loss" description="Compare income and costs across the business." />
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard title="Revenue" value={`$${revenueTotal.toFixed(2)}`} />
        <MetricCard title="Expenses" value={`$${expenseTotal.toFixed(2)}`} />
        <MetricCard title="Profit" value={`$${profit.toFixed(2)}`} />
      </div>
      <PageSection title="Revenue vs Expenses">
        <RevenueChart data={revenueData} title="Revenue Trend" description="Revenue data used to compare with expense spend." />
      </PageSection>
    </div>
  );
}

function SalesReportsPage() {
  const { data: items = [] } = useQuery<MenuItem[]>({ queryKey: ['menu-items'], queryFn: () => api.getMenuItems() });
  const { data: categories = [] } = useQuery<MenuCategory[]>({ queryKey: ['menu-categories'], queryFn: () => api.getMenuCategories() });
  const topCategories = useMemo(
    () => categories.slice(0, 3).map((category) => ({ name: category.name, count: category.itemCount ?? 0 })),
    [categories],
  );

  return (
    <div className="space-y-6">
      <DashboardHeader title="Sales Reports" description="Review top performing categories and item volumes." />
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard title="Menu items" value={items.length} />
        <MetricCard title="Categories" value={categories.length} />
        <MetricCard title="Top category" value={topCategories[0]?.name ?? 'N/A'} />
      </div>
      <PageSection title="Top Categories">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Item count</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topCategories.map((category) => (
              <TableRow key={category.name}>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </PageSection>
    </div>
  );
}

function InventoryReportsPage() {
  const { data: lowStock = [] } = useQuery<Ingredient[]>({ queryKey: ['low-stock'], queryFn: () => api.getLowStockIngredients() });
  const { data: movements = [] } = useQuery<StockMovement[]>({ queryKey: ['stock-movements'], queryFn: () => api.getStockMovements() });

  return (
    <div className="space-y-6">
      <DashboardHeader title="Inventory Reports" description="Monitor stock performance and inventory movements." />
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard title="Low stock items" value={lowStock.length} />
        <MetricCard title="Movement entries" value={movements.length} />
        <MetricCard title="Last updated" value={movements.length ? formatDate(movements[0].createdAt) : 'N/A'} />
      </div>
      <PageSection title="Low Stock Items">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Min stock</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lowStock.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.currentStock}</TableCell>
                <TableCell>{item.minimumStock}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </PageSection>
    </div>
  );
}

function StaffReportsPage() {
  const { data: staff = [] } = useQuery<StaffMember[]>({ queryKey: ['staff'], queryFn: () => api.getStaff() });

  return (
    <div className="space-y-6">
      <DashboardHeader title="Staff Reports" description="Analyze team activity, hires, and schedule coverage." />
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard title="Staff members" value={staff.length} />
        <MetricCard title="Active" value={staff.filter((member) => member.isActive).length} />
        <MetricCard title="Average salary" value={`$${Math.round(staff.reduce((sum, member) => sum + (member.salary || 0), 0) / Math.max(staff.length, 1)).toFixed(0)}`} />
      </div>
      <PageSection title="Staff Directory">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Hired</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staff.map((member) => (
              <TableRow key={member.id}>
                <TableCell>{member.name}</TableCell>
                <TableCell>{member.role}</TableCell>
                <TableCell>{member.phone ?? 'N/A'}</TableCell>
                <TableCell>
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusStyle(member.isActive ? 'active' : 'cancelled')}`}>
                    {member.isActive ? 'Active' : 'Inactive'}
                  </span>
                </TableCell>
                <TableCell>{formatDate(member.hireDate)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </PageSection>
    </div>
  );
}

function TaxReportsPage() {
  const { data: orders = [] } = useQuery<Order[]>({ queryKey: ['orders'], queryFn: () => api.getOrders() });
  const taxTotal = orders.reduce((sum, order) => sum + order.tax, 0);

  return (
    <div className="space-y-6">
      <DashboardHeader title="Tax Reports" description="Review collected sales tax and compliance summaries." />
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard title="Total tax" value={`$${taxTotal.toFixed(2)}`} />
        <MetricCard title="Tax entries" value={orders.length} />
        <MetricCard title="Average tax" value={orders.length ? `$${(taxTotal / orders.length).toFixed(2)}` : '$0.00'} />
      </div>
      <PageSection title="Orders by tax collected">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Tax</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.orderNumber}</TableCell>
                <TableCell>${order.total.toFixed(2)}</TableCell>
                <TableCell>${order.tax.toFixed(2)}</TableCell>
                <TableCell>
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusStyle(order.status)}`}>
                    {order.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </PageSection>
    </div>
  );
}

function SalesAnalyticsPage() {
  const { data: revenueData = [] } = useQuery<RevenueData[]>({ queryKey: ['revenue-data'], queryFn: () => api.getRevenueData() });
  const { data: salesByCategory = [] } = useQuery<SalesByCategory[]>({ queryKey: ['sales-by-category'], queryFn: () => api.getSalesByCategory() });

  return (
    <div className="space-y-6">
      <DashboardHeader title="Sales Analytics" description="Understand top performing days and category performance." />
      <div className="grid gap-4 lg:grid-cols-3">
        <MetricCard title="Revenue trend" value={`$${revenueData.reduce((sum, point) => sum + point.revenue, 0).toFixed(2)}`} />
        <MetricCard title="Categories" value={salesByCategory.length} />
        <MetricCard title="Top category" value={salesByCategory[0]?.category ?? 'N/A'} />
      </div>
      <PageSection title="Revenue Trend">
        <RevenueChart data={revenueData} description="Revenue performance over time." />
      </PageSection>
      <PageSection title="Category Performance">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Sales</TableHead>
              <TableHead>Share</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {salesByCategory.map((item) => (
              <TableRow key={item.category}>
                <TableCell>{item.category}</TableCell>
                <TableCell>${item.sales.toFixed(2)}</TableCell>
                <TableCell>{item.percentage.toFixed(0)}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </PageSection>
    </div>
  );
}

function FoodAnalyticsPage() {
  const { data: salesByCategory = [] } = useQuery<SalesByCategory[]>({ queryKey: ['sales-by-category'], queryFn: () => api.getSalesByCategory() });
  const { data: topItems = [] } = useQuery({ queryKey: ['top-selling-items'], queryFn: () => api.getTopSellingItems() });

  return (
    <div className="space-y-6">
      <DashboardHeader title="Food Analytics" description="Track menu category performance and top selling dishes." />
      <div className="grid gap-4 lg:grid-cols-3">
        <MetricCard title="Top item" value={topItems[0]?.name ?? 'N/A'} />
        <MetricCard title="Top revenue" value={`$${topItems[0]?.revenue.toFixed(2) ?? '0.00'}`} />
        <MetricCard title="Category count" value={salesByCategory.length} />
      </div>
      <PageSection title="Top Selling Items">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Revenue</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>${item.revenue.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </PageSection>
    </div>
  );
}

function CustomersAnalyticsPage() {
  const { data: reservations = [] } = useQuery<Reservation[]>({ queryKey: ['reservations'], queryFn: () => api.getReservations() });
  const { data: orders = [] } = useQuery<Order[]>({ queryKey: ['orders'], queryFn: () => api.getOrders() });

  return (
    <div className="space-y-6">
      <DashboardHeader title="Customer Analytics" description="Analyze customer visits, reservations and order volume." />
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard title="Reservations" value={reservations.length} />
        <MetricCard title="Total orders" value={orders.length} />
        <MetricCard title="Average spend" value={`$${(orders.reduce((acc, order) => acc + order.total, 0) / Math.max(orders.length, 1)).toFixed(2)}`} />
      </div>
      <PageSection title="Recent Customers">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Guest</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Reservation</TableHead>
              <TableHead>Order count</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reservations.slice(0, 8).map((reservation) => (
              <TableRow key={reservation.id}>
                <TableCell>{reservation.customerName}</TableCell>
                <TableCell>{reservation.customerPhone}</TableCell>
                <TableCell>{`${formatDate(reservation.date)} ${reservation.time}`}</TableCell>
                <TableCell>{orders.filter((order) => order.tableId === reservation.tableId).length}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </PageSection>
    </div>
  );
}

function NotificationsPage() {
  const { data: notifications = [] } = useQuery<Notification[]>({ queryKey: ['notifications'], queryFn: () => api.getNotifications() });

  return (
    <div className="space-y-6">
      <DashboardHeader title="Notifications" description="Monitor system alerts, inventory triggers and important updates." />
      <PageSection title="Recent notifications">
        <div className="space-y-3">
          {notifications.map((notification) => (
            <Card key={notification.id} className="bg-card border-border">
              <CardHeader>
                <CardTitle>{notification.title}</CardTitle>
                <CardDescription>{formatDate(notification.createdAt)}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{notification.message}</p>
              </CardContent>
              <CardFooter>
                <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusStyle(notification.type)}`}>
                  {notification.category}
                </span>
              </CardFooter>
            </Card>
          ))}
        </div>
      </PageSection>
    </div>
  );
}

function AuditLogsPage() {
  const { data: logs = [] } = useQuery<ActivityLog[]>({ queryKey: ['activity-log'], queryFn: () => api.getActivityLog() });

  return (
    <div className="space-y-6">
      <DashboardHeader title="Audit Logs" description="Review recent account activity and system events." />
      <PageSection title="Activity Timeline">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{formatDate(log.timestamp)}</TableCell>
                <TableCell>{log.user.name}</TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell>{log.details}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </PageSection>
    </div>
  );
}

function SettingsPage() {
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

function NotFoundPage({ path }: { path: string }) {
  return (
    <div className="space-y-6">
      <DashboardHeader title="Page not found" description={`The route /dashboard/admin/${path} does not exist yet.`} />
      <Card className="bg-card border-border">
        <CardContent>
          <p className="text-muted-foreground">Please choose a valid admin section from the sidebar.</p>
        </CardContent>
      </Card>
    </div>
  );
}

const pageMap: Record<string, React.ComponentType> = {
  users: UsersPage,
  roles: RolesPage,
  branches: BranchesPage,
  tables: TablesPage,
  sections: SectionsPage,
  reservations: ReservationsPage,
  'menu/categories': MenuCategoriesPage,
  'menu/items': MenuItemsPage,
  'menu/modifiers': ModifiersPage,
  inventory: InventoryPage,
  'inventory/movement': StockMovementPage,
  'inventory/alerts': InventoryAlertsPage,
  suppliers: SuppliersPage,
  'suppliers/orders': PurchaseOrdersPage,
  orders: OrdersPage,
  'orders/completed': CompletedOrdersPage,
  'orders/cancelled': CancelledOrdersPage,
  'finance/revenue': FinanceRevenuePage,
  'finance/expenses': FinanceExpensesPage,
  'finance/profit-loss': FinanceProfitLossPage,
  'reports/sales': SalesReportsPage,
  'reports/inventory': InventoryReportsPage,
  'reports/staff': StaffReportsPage,
  'reports/tax': TaxReportsPage,
  'analytics/sales': SalesAnalyticsPage,
  'analytics/food': FoodAnalyticsPage,
  'analytics/customers': CustomersAnalyticsPage,
  notifications: NotificationsPage,
  'audit-logs': AuditLogsPage,
  settings: SettingsPage,
};

export default function AdminSubPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = use(params);
  const route = slug?.join('/') ?? '';
  const PageComponent = pageMap[route] ?? (() => <NotFoundPage path={route} />);

  return (
    <div className="space-y-6">
      <PageComponent />
    </div>
  );
}
