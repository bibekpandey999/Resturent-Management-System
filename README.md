# POS Backend Implementation Guide

## Overview
This document defines a complete backend workflow for the POS system implied by the frontend application. It includes domain entities, MongoDB schema structure, TypeScript model definitions, enum values, default fields, and data relationships. Use this as the backend implementation plan without copying any code directly.

## Backend Architecture
The backend should be organized in these logical domains:
- Authentication & Authorization
- Users, Roles, Permissions
- Branch Management
- Table Management
- Menu Management
- Order Management
- Inventory & Stock Control
- Supplier & Purchase Orders
- Recipe Management
- Reservations
- Finance & Expenses
- Activity Logging
- Notifications
- Restaurant Settings
- Reporting / Dashboard Metrics

Each domain maps to one or more MongoDB collections and a set of TypeScript model definitions.

## Workflow Steps
1. Define collections and TypeScript models for each entity.
2. Design MongoDB document schemas using proper field types, required flags, defaults, enums, and boolean values.
3. Build service/repository layers for CRUD and domain-specific operations.
4. Create request validation rules for create/update actions.
5. Add authentication and role-based authorization.
6. Implement route controllers or handlers by domain.
7. Seed initial permissions, roles, branches, and admin users.
8. Add dashboard aggregation endpoints for reporting metrics.
9. Enable soft deletion or status flags rather than deleting critical records.
10. Maintain audit logs for user actions and key entity changes.

## Authentication & Authorization
Use a system that supports:
- email/password login
- role assignment per user
- token-based session authentication
- role-based access control on routes
- permission checks inside admin operations

TypeScript model: `AuthSession` / `JWT payload` should include user id, role, and issued timestamps.

## Collections and Entities

### Users
Collection: `users`
TypeScript fields:
- id: string
- name: string
- email: string
- role: `admin | waiter | kitchen | cashier`
- avatar?: string
- createdAt: Date
- phone?: string
- status: `active | inactive | suspended`
- branchId?: string
- lastLogin?: Date

MongoDB schema fields:
- `_id`: ObjectId
- `name`: string, required
- `email`: string, required, unique
- `role`: string, required, enum [admin, waiter, kitchen, cashier]
- `avatar`: string, optional
- `createdAt`: date, default current timestamp
- `phone`: string, optional
- `status`: string, required, default `active`, enum [active, inactive, suspended]
- `branchId`: ObjectId, optional, reference to `branches`
- `lastLogin`: date, optional

### Roles
Collection: `roles`
TypeScript fields:
- id: string
- name: string
- description: string
- permissions: string[]
- userCount: number
- createdAt: Date

MongoDB schema fields:
- `_id`: ObjectId
- `name`: string, required
- `description`: string, optional
- `permissions`: array of strings, required, default empty array
- `userCount`: number, required, default 0
- `createdAt`: date, default current timestamp

### Permissions
Collection: `permissions`
TypeScript fields:
- id: string
- name: string
- description: string
- module: string

MongoDB schema fields:
- `_id`: ObjectId
- `name`: string, required
- `description`: string, optional
- `module`: string, required

### Branches
Collection: `branches`
TypeScript fields:
- id: string
- name: string
- address: string
- phone: string
- email: string
- managerId?: string
- isActive: boolean
- createdAt: Date

MongoDB schema fields:
- `_id`: ObjectId
- `name`: string, required
- `address`: string, required
- `phone`: string, required
- `email`: string, optional
- `managerId`: ObjectId, optional, reference to `users`
- `isActive`: boolean, required, default true
- `createdAt`: date, default current timestamp

### Table Sections
Collection: `tableSections`
TypeScript fields:
- id: string
- name: string
- description?: string
- tableCount: number
- isActive: boolean

MongoDB schema fields:
- `_id`: ObjectId
- `name`: string, required
- `description`: string, optional
- `tableCount`: number, required, default 0
- `isActive`: boolean, required, default true

### Tables
Collection: `tables`
TypeScript fields:
- id: string
- number: number
- capacity: number
- status: `available | occupied | reserved | cleaning | out-of-service`
- currentOrderId?: string
- section: string
- sectionId?: string
- positionX?: number
- positionY?: number

MongoDB schema fields:
- `_id`: ObjectId
- `number`: number, required
- `capacity`: number, required
- `status`: string, required, enum [available, occupied, reserved, cleaning, out-of-service]
- `currentOrderId`: ObjectId, optional, reference to `orders`
- `section`: string, required
- `sectionId`: ObjectId, optional, reference to `tableSections`
- `positionX`: number, optional
- `positionY`: number, optional

### Menu Categories
Collection: `menuCategories`
TypeScript fields:
- id: string
- name: string
- description?: string
- image?: string
- sortOrder: number
- isActive: boolean
- itemCount?: number

MongoDB schema fields:
- `_id`: ObjectId
- `name`: string, required
- `description`: string, optional
- `image`: string, optional
- `sortOrder`: number, required, default 0
- `isActive`: boolean, required, default true
- `itemCount`: number, optional, default 0

### Menu Items
Collection: `menuItems`
TypeScript fields:
- id: string
- name: string
- description: string
- price: number
- categoryId: string
- category?: MenuCategory
- image?: string
- isAvailable: boolean
- status: `available | out-of-stock | hidden`
- preparationTime: number
- allergens?: string[]
- tags?: string[]
- tax?: number
- costPrice?: number

MongoDB schema fields:
- `_id`: ObjectId
- `name`: string, required
- `description`: string, required
- `price`: number, required
- `categoryId`: ObjectId, required, reference to `menuCategories`
- `image`: string, optional
- `isAvailable`: boolean, required, default true
- `status`: string, required, default `available`, enum [available, out-of-stock, hidden]
- `preparationTime`: number, required, default 0
- `allergens`: array of strings, optional
- `tags`: array of strings, optional
- `tax`: number, optional
- `costPrice`: number, optional

### Menu Modifiers
Collection: `menuModifiers`
TypeScript fields:
- id: string
- name: string
- options: ModifierOption[]
- required: boolean
- maxSelections: number
- itemIds: string[]

MongoDB schema fields:
- `_id`: ObjectId
- `name`: string, required
- `options`: array of objects with id, name, price, required
- `required`: boolean, required, default false
- `maxSelections`: number, required, default 1
- `itemIds`: array of ObjectId references to `menuItems`, required, default empty array

### Order Items
Subdocument of `orders`
TypeScript fields:
- id: string
- menuItemId: string
- menuItem: MenuItem
- quantity: number
- notes?: string
- status: OrderStatus
- price: number
- modifiers?: ModifierOption[]

MongoDB schema fields:
- `id`: string or ObjectId
- `menuItemId`: ObjectId, required, reference to `menuItems`
- `quantity`: number, required
- `notes`: string, optional
- `status`: string, required, enum [pending, preparing, ready, served, completed, cancelled]
- `price`: number, required
- `modifiers`: array of objects, optional

### Orders
Collection: `orders`
TypeScript fields:
- id: string
- orderNumber: string
- tableId: string
- table: Table
- items: OrderItem[]
- status: `pending | preparing | ready | served | completed | cancelled`
- customerName: string
- paymentStatus: `pending | paid | refunded`
- paymentMethod?: `cash | card | mobile | split`
- subtotal: number
- tax: number
- discount?: number
- serviceCharge?: number
- total: number
- notes?: string
- createdAt: Date
- updatedAt: Date
- completedAt?: Date
- waiterId: string
- waiter: User

MongoDB schema fields:
- `_id`: ObjectId
- `orderNumber`: string, required, unique
- `tableId`: ObjectId, required, reference to `tables`
- `items`: array of order item subdocuments, required
- `status`: string, required, default `pending`, enum [pending, preparing, ready, served, completed, cancelled]
- `customerName`: string, required
- `paymentStatus`: string, required, default `pending`, enum [pending, paid, refunded]
- `paymentMethod`: string, optional, enum [cash, card, mobile, split]
- `subtotal`: number, required
- `tax`: number, required
- `discount`: number, optional, default 0
- `serviceCharge`: number, optional, default 0
- `total`: number, required
- `notes`: string, optional
- `createdAt`: date, default current timestamp
- `updatedAt`: date, default current timestamp
- `completedAt`: date, optional
- `waiterId`: ObjectId, required, reference to `users`

### Reservations
Collection: `reservations`
TypeScript fields:
- id: string
- customerName: string
- customerPhone: string
- customerEmail?: string
- date: Date
- time: string
- partySize: number
- tableId?: string
- status: `pending | confirmed | cancelled | completed | no-show`
- notes?: string
- createdAt: Date

MongoDB schema fields:
- `_id`: ObjectId
- `customerName`: string, required
- `customerPhone`: string, required
- `customerEmail`: string, optional
- `date`: date, required
- `time`: string, required
- `partySize`: number, required
- `tableId`: ObjectId, optional, reference to `tables`
- `status`: string, required, default `pending`, enum [pending, confirmed, cancelled, completed, no-show]
- `notes`: string, optional
- `createdAt`: date, default current timestamp

### Ingredients
Collection: `ingredients`
TypeScript fields:
- id: string
- sku: string
- name: string
- unit: string
- currentStock: number
- minimumStock: number
- reorderLevel: number
- costPerUnit: number
- supplierId?: string
- expiryDate?: Date
- lastRestocked?: Date
- category: string

MongoDB schema fields:
- `_id`: ObjectId
- `sku`: string, required
- `name`: string, required
- `unit`: string, required
- `currentStock`: number, required, default 0
- `minimumStock`: number, required, default 0
- `reorderLevel`: number, required, default 0
- `costPerUnit`: number, required
- `supplierId`: ObjectId, optional, reference to `suppliers`
- `expiryDate`: date, optional
- `lastRestocked`: date, optional
- `category`: string, required

### Stock Movements
Collection: `stockMovements`
TypeScript fields:
- id: string
- ingredientId: string
- ingredient?: Ingredient
- type: `in | out | adjustment | waste`
- quantity: number
- reason: string
- userId: string
- user?: User
- createdAt: Date
- referenceNumber?: string

MongoDB schema fields:
- `_id`: ObjectId
- `ingredientId`: ObjectId, required, reference to `ingredients`
- `type`: string, required, enum [in, out, adjustment, waste]
- `quantity`: number, required
- `reason`: string, required
- `userId`: ObjectId, required, reference to `users`
- `createdAt`: date, default current timestamp
- `referenceNumber`: string, optional

### Suppliers
Collection: `suppliers`
TypeScript fields:
- id: string
- name: string
- contactPerson: string
- email: string
- phone: string
- address: string
- isActive: boolean
- createdAt: Date

MongoDB schema fields:
- `_id`: ObjectId
- `name`: string, required
- `contactPerson`: string, required
- `email`: string, optional
- `phone`: string, required
- `address`: string, required
- `isActive`: boolean, required, default true
- `createdAt`: date, default current timestamp

### Purchase Orders
Collection: `purchaseOrders`
TypeScript fields:
- id: string
- orderNumber: string
- supplierId: string
- supplier?: Supplier
- items: PurchaseOrderItem[]
- status: `draft | pending | approved | received | cancelled`
- totalAmount: number
- expectedDate?: Date
- receivedDate?: Date
- notes?: string
- createdAt: Date
- createdBy: string

MongoDB schema fields:
- `_id`: ObjectId
- `orderNumber`: string, required, unique
- `supplierId`: ObjectId, required, reference to `suppliers`
- `items`: array of purchase order item subdocuments, required
- `status`: string, required, default `draft`, enum [draft, pending, approved, received, cancelled]
- `totalAmount`: number, required
- `expectedDate`: date, optional
- `receivedDate`: date, optional
- `notes`: string, optional
- `createdAt`: date, default current timestamp
- `createdBy`: ObjectId, required, reference to `users`

### Purchase Order Items
Subdocument of `purchaseOrders`
TypeScript fields:
- id: string
- ingredientId: string
- ingredient?: Ingredient
- quantity: number
- unitPrice: number
- totalPrice: number
- receivedQuantity?: number

MongoDB schema fields:
- `id`: string or ObjectId
- `ingredientId`: ObjectId, required, reference to `ingredients`
- `quantity`: number, required
- `unitPrice`: number, required
- `totalPrice`: number, required
- `receivedQuantity`: number, optional

### Recipes
Collection: `recipes`
TypeScript fields:
- id: string
- menuItemId: string
- menuItem?: MenuItem
- ingredients: RecipeIngredient[]
- instructions?: string
- yield: number
- yieldUnit: string

MongoDB schema fields:
- `_id`: ObjectId
- `menuItemId`: ObjectId, required, reference to `menuItems`
- `ingredients`: array of recipe ingredient subdocuments, required
- `instructions`: string, optional
- `yield`: number, required
- `yieldUnit`: string, required

### Recipe Ingredients
Subdocument of `recipes`
TypeScript fields:
- ingredientId: string
- ingredient?: Ingredient
- quantity: number
- unit: string

MongoDB schema fields:
- `ingredientId`: ObjectId, required, reference to `ingredients`
- `quantity`: number, required
- `unit`: string, required

### Expenses
Collection: `expenses`
TypeScript fields:
- id: string
- category: `purchases | salary | utilities | rent | maintenance | marketing | other`
- description: string
- amount: number
- date: Date
- paymentMethod: `cash | card | mobile | split`
- vendorName?: string
- receiptUrl?: string
- createdBy: string
- createdAt: Date

MongoDB schema fields:
- `_id`: ObjectId
- `category`: string, required, enum [purchases, salary, utilities, rent, maintenance, marketing, other]
- `description`: string, required
- `amount`: number, required
- `date`: date, required
- `paymentMethod`: string, required, enum [cash, card, mobile, split]
- `vendorName`: string, optional
- `receiptUrl`: string, optional
- `createdBy`: ObjectId, required, reference to `users`
- `createdAt`: date, default current timestamp

### Activity Logs
Collection: `activityLogs`
TypeScript fields:
- id: string
- userId: string
- user: User
- action: string
- details: string
- timestamp: Date
- module?: string
- entityId?: string
- entityType?: string
- ipAddress?: string

MongoDB schema fields:
- `_id`: ObjectId
- `userId`: ObjectId, required, reference to `users`
- `action`: string, required
- `details`: string, required
- `timestamp`: date, default current timestamp
- `module`: string, optional
- `entityId`: string, optional
- `entityType`: string, optional
- `ipAddress`: string, optional

### Notifications
Collection: `notifications`
TypeScript fields:
- id: string
- title: string
- message: string
- type: `info | warning | success | error`
- category: `system | inventory | orders | finance`
- read: boolean
- archived: boolean
- createdAt: Date

MongoDB schema fields:
- `_id`: ObjectId
- `title`: string, required
- `message`: string, required
- `type`: string, required, enum [info, warning, success, error]
- `category`: string, required, enum [system, inventory, orders, finance]
- `read`: boolean, required, default false
- `archived`: boolean, required, default false
- `createdAt`: date, default current timestamp

### Restaurant Settings
Collection: `settings`
TypeScript fields:
- name: string
- logo?: string
- address: string
- phone: string
- email: string
- vatNumber?: string
- currency: string
- taxRate: number
- serviceChargeRate: number
- timezone: string

MongoDB schema fields:
- `_id`: ObjectId
- `name`: string, required
- `logo`: string, optional
- `address`: string, required
- `phone`: string, required
- `email`: string, required
- `vatNumber`: string, optional
- `currency`: string, required
- `taxRate`: number, required, default 0
- `serviceChargeRate`: number, required, default 0
- `timezone`: string, required

### Dashboard Metrics
These values are typically computed on demand from existing collections rather than stored permanently.
Possible reports:
- total revenue
- total orders
- average order value
- active orders
- occupied tables
- low stock alerts
- pending bills
- today revenue
- today orders
- reservations today
- sales by category
- top selling items
- peak hour order counts

## API / Domain Operations
Suggested backend flows by domain:

### User Management
- Create user with role and branch assignment
- Update profile, phone, status, branch
- List users with role / status filters
- Search by name or email
- Soft delete by setting status inactive

### Role & Permission Management
- Define permissions per module
- Create roles with assigned permission keys
- Update role description and permissions
- Count users per role
- Restrict admin pages by role and permission

### Branch Management
- Create and maintain branch metadata
- Activate / deactivate branch
- Assign branch manager
- Query branches with isActive filter

### Menu Management
- Create categories and sort order
- Create menu items with availability and pricing
- Manage menu modifiers and required selections
- Mark items out-of-stock or hidden
- Assign item-to-category relationships

### Order Processing
- Create new order from table and items
- Update order item status and order status
- Record payment status and payment method
- Update table occupancy and current order assignment
- Complete orders with timestamp
- Query orders by status and date range

### Inventory Control
- Create ingredient catalog with SKU
- Track stock movements by type
- Adjust inventory levels after orders or deliveries
- Alert on reorder level threshold
- Generate inventory reports and low stock lists

### Supplier & Purchasing
- Manage supplier contact details
- Create purchase orders with item lines
- Track PO status from draft to received
- Update stock when purchase orders are received
- Reference suppliers from ingredient records

### Recipe & Production
- Define recipe ingredients for menu items
- Store preparation instructions and yield units
- Use recipes for kitchen production or cost analysis

### Reservations
- Create reservation requests and confirm them
- Attach table assignments when available
- Manage reservation status lifecycle
- Search reservations by date and customer

### Finance & Expenses
- Create expense records by category
- Track payment method for each spend
- Generate expense summaries for reports
- Associate expense creation with a user

### Activity Logging
- Log user actions for admin events
- Capture module, entity type, entity id, and IP address
- Store timestamped action details
- Use logs for audit and troubleshooting

### Notifications
- Create system notifications for new orders, inventory alerts, finance events
- Mark notifications as read/archived
- Filter by category and unread state

### Settings
- Store restaurant and printer configuration in a single settings collection
- Allow update of currency, tax rate, service charge, and timezone
- Keep system defaults in the settings document

## Relationship and Reference Guidelines
- Reference `users` from `orders`, `branches`, `stockMovements`, `purchaseOrders`, and `activityLogs`
- Reference `branches` from `users` and `reservations`
- Reference `tables` from `orders` and `reservations`
- Reference `menuCategories` from `menuItems`
- Reference `menuItems` from `orderItems`, `recipes`, and `menuModifiers`
- Reference `ingredients` from `stockMovements`, `purchaseOrders`, and `recipeIngredients`
- Reference `suppliers` from `ingredients` and `purchaseOrders`

## TypeScript Model Notes
Use the same entity names in TypeScript interfaces as MongoDB collections for consistency.
- Use `string` for `ObjectId` references in TypeScript models
- Use `Date` for timestamp fields
- Use union string types for enum-controlled fields
- Use `boolean` for enabled/active/read flags
- Optional fields should be marked as optional in TypeScript models

## Implementation Checklist
1. Create MongoDB collection definitions for each entity with required and optional fields.
2. Define TypeScript interfaces for the same entities.
3. Implement services that translate incoming DTOs into database models.
4. Add validation for enums and required values at the API boundary.
5. Build route-level authorization checks using user role and permissions.
6. Seed initial data for permissions, roles, default branches, and admin users.
7. Add dashboard aggregation services and reporting endpoints.
8. Keep activity and notification records updated with significant backend events.

## Recommended Entity Naming
- `users`
- `roles`
- `permissions`
- `branches`
- `tables`
- `tableSections`
- `menuCategories`
- `menuItems`
- `menuModifiers`
- `orders`
- `reservations`
- `ingredients`
- `stockMovements`
- `suppliers`
- `purchaseOrders`
- `recipes`
- `expenses`
- `activityLogs`
- `notifications`
- `settings`

## Final Notes
This guide maps the POS frontend domain into a self-contained backend model design. Implement the schemas and TypeScript models first, then layer the business logic and permissions on top. The collections and fields above match the application domains used in the frontend admin workflows.
