# from pathlib import Path
# import re

# root = Path('lib')
# source = root / 'admin-pages.tsx'
# text = source.read_text(encoding='utf-8')

# mapping = {
#     'users': ('UsersPage','users.tsx'),
#     'roles-and-permission': ('RolesPage','roles-and-permission.tsx'),
#     'branches': ('BranchesPage','branches.tsx'),
#     'tables': ('TablesPage','tables.tsx'),
#     'sections': ('SectionsPage','sections.tsx'),
#     'reservations': ('ReservationsPage','reservations.tsx'),
#     'menu/categories': ('MenuCategoriesPage','menu-categories.tsx'),
#     'menu/items': ('MenuItemsPage','menu-items.tsx'),
#     'menu/modifiers': ('ModifiersPage','menu-modifiers.tsx'),
#     'inventory': ('InventoryPage','inventory.tsx'),
#     'inventory/movement': ('StockMovementPage','inventory-movement.tsx'),
#     'inventory/alerts': ('InventoryAlertsPage','inventory-alerts.tsx'),
#     'suppliers': ('SuppliersPage','suppliers.tsx'),
#     'suppliers/orders': ('PurchaseOrdersPage','suppliers-orders.tsx'),
#     'orders': ('OrdersPage','orders.tsx'),
#     'orders/completed': ('CompletedOrdersPage','orders-completed.tsx'),
#     'orders/cancelled': ('CancelledOrdersPage','orders-cancelled.tsx'),
#     'finance/revenue': ('FinanceRevenuePage','finance-revenue.tsx'),
#     'finance/expenses': ('FinanceExpensesPage','finance-expenses.tsx'),
#     'finance/profit-loss': ('FinanceProfitLossPage','finance-profit-loss.tsx'),
#     'reports/sales': ('SalesReportsPage','reports-sales.tsx'),
#     'reports/inventory': ('InventoryReportsPage','reports-inventory.tsx'),
#     'reports/staff': ('StaffReportsPage','reports-staff.tsx'),
#     'reports/tax': ('TaxReportsPage','reports-tax.tsx'),
#     'analytics/sales': ('SalesAnalyticsPage','analytics-sales.tsx'),
#     'analytics/food': ('FoodAnalyticsPage','analytics-food.tsx'),
#     'analytics/customers': ('CustomersAnalyticsPage','analytics-customers.tsx'),
#     'notifications': ('NotificationsPage','notifications.tsx'),
#     'audit-logs': ('AuditLogsPage','audit-logs.tsx'),
#     'settings': ('SettingsPage','settings.tsx'),
# }

# # Extract function blocks from admin-pages.tsx
# lines = text.splitlines()
# functions = {}
# pattern = re.compile(r'^function\s+(\w+)\s*\(')
# start = None
# current_name = None
# brace_count = 0
# for i, line in enumerate(lines):
#     if start is None:
#         m = pattern.match(line)
#         if m:
#             name = m.group(1)
#             if name in {fn for fn, _ in mapping.values()} or name == 'NotFoundPage':
#                 start = i
#                 current_name = name
#                 brace_count = line.count('{') - line.count('}')
#                 if brace_count == 0:
#                     functions[current_name] = '\n'.join(lines[i:i+1])
#                     start = None
#                 continue
#     else:
#         brace_count += line.count('{') - line.count('}')
#         if brace_count == 0:
#             functions[current_name] = '\n'.join(lines[start:i+1])
#             start = None
#             current_name = None

# missing = [name for name, _ in mapping.values() if name not in functions]
# if missing:
#     raise SystemExit(f'missing functions: {missing}')

# shared_dir = Path('components/dashboard/admin')
# shared_dir.mkdir(parents=True, exist_ok=True)
# shared = shared_dir / 'shared.tsx'
# shared_content = '''"use client";

# import { Button } from "@/components/ui/button";
# import { Input } from "@/components/ui/input";
# import { Label } from "@/components/ui/label";
# import {
#   Card,
#   CardContent,
#   CardDescription,
#   CardFooter,
#   CardHeader,
#   CardTitle,
# } from "@/components/ui/card";
# import {
#   Table,
#   TableBody,
#   TableCell,
#   TableHead,
#   TableHeader,
#   TableRow,
# } from "@/components/ui/table";

# export function statusStyle(status: string) {
#   switch (status) {
#     case "active":
#     case "paid":
#     case "approved":
#     case "received":
#     case "confirmed":
#       return "bg-emerald-100 text-emerald-700";
#     case "pending":
#     case "out-of-stock":
#     case "draft":
#       return "bg-amber-100 text-amber-700";
#     case "cancelled":
#     case "refunded":
#     case "hidden":
#       return "bg-rose-100 text-rose-700";
#     case "completed":
#     case "served":
#       return "bg-sky-100 text-sky-700";
#     case "preparing":
#     case "in":
#       return "bg-blue-100 text-blue-700";
#     case "out":
#     case "adjustment":
#     case "waste":
#       return "bg-violet-100 text-violet-700";
#     default:
#       return "bg-muted/20 text-muted-foreground";
#   }
# }

# export function MetricCard({ title, value, description }: { title: string; value: string | number; description?: string }) {
#   return (
#     <Card className="bg-card border-border">
#       <CardHeader>
#         <CardTitle>{title}</CardTitle>
#         {description && <CardDescription>{description}</CardDescription>}
#       </CardHeader>
#       <CardContent>
#         <p className="text-3xl font-semibold text-foreground">{value}</p>
#       </CardContent>
#     </Card>
#   );
# }

# export function PageSection({ title, children }: { title: string; children: React.ReactNode }) {
#   return (
#     <Card className="bg-card border-border">
#       <CardHeader>
#         <CardTitle>{title}</CardTitle>
#       </CardHeader>
#       <CardContent>{children}</CardContent>
#     </Card>
#   );
# }

# export function SearchField({ id, label, value, onChange, placeholder }: { id: string; label: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
#   return (
#     <div className="grid gap-2 sm:grid-cols-[1fr_auto] sm:items-end">
#       <div>
#         <Label htmlFor={id}>{label}</Label>
#         <Input id={id} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder ?? 'Search...'} />
#       </div>
#     </div>
#   );
# }

# export function TableBadge({ label }: { label: string }) {
#   return (
#     <span className="inline-flex rounded-full bg-muted px-2 py-1 text-xs font-medium text-foreground/80">{label}</span>
#   );
# }

# export function formatDate(value?: string | Date) {
#   if (!value) return '-';
#   const date = typeof value === 'string' ? new Date(value) : value;
#   return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
# }
# '''
# shared.write_text(shared_content, encoding='utf-8')

# pages_dir = shared_dir / 'pages'
# pages_dir.mkdir(parents=True, exist_ok=True)
# for route, (func_name, fname) in mapping.items():
#     block = functions[func_name]
#     block = re.sub(r'^function\s+' + re.escape(func_name) + r'\s*\(', 'export default function ' + func_name + '(', block, count=1, flags=re.M)
#     header = '''"use client";

# import { useMemo, useState } from "react";
# import { useQuery } from "@tanstack/react-query";
# import { DashboardHeader } from "@/components/layout/dashboard-header";
# import { RevenueChart } from "@/components/dashboard/revenue-chart";
# import { api } from "@/lib/api/mock-data";
# import { Button } from "@/components/ui/button";
# import { Input } from "@/components/ui/input";
# import { Label } from "@/components/ui/label";
# import {
#   Table,
#   TableBody,
#   TableCell,
#   TableHead,
#   TableHeader,
#   TableRow,
# } from "@/components/ui/table";
# import {
#   Card,
#   CardContent,
#   CardDescription,
#   CardFooter,
#   CardHeader,
#   CardTitle,
# } from "@/components/ui/card";
# import { statusStyle, MetricCard, PageSection, SearchField, TableBadge, formatDate } from "@/components/dashboard/admin/shared";
# '''
#     type_line = 'import type { AdminDashboardStats, Branch, Expense, Ingredient, MenuCategory, MenuItem, MenuModifier, Notification, Order, PurchaseOrder, Reservation, Role, SalesByCategory, StaffMember, StockMovement, Supplier, Table as DiningTable, TableSection, ManagedUser, RevenueData } from "@/lib/types";\n\n'
#     content = header + type_line + block + '\n'
#     (pages_dir / fname).write_text(content, encoding='utf-8')

# app_dir = Path('app/dashboard/admin')
# for route, (_, fname) in mapping.items():
#     page_dir = app_dir / Path(route)
#     page_file = page_dir / 'page.tsx'
#     if not page_file.exists():
#         raise SystemExit(f'missing route file {page_file}')
#     component_name = fname.replace('.tsx', '')
#     route_file_content = f'"use client";\n\nimport Page from "@/components/dashboard/admin/pages/{component_name}";\n\nexport default Page;\n'
#     page_file.write_text(route_file_content, encoding='utf-8')

# print('done')
