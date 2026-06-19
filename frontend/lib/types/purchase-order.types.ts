export interface TPurchaseItem {
  ingredientId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface TCreatePurchase {
  supplierId: string;
  invoiceNumber: string;
  purchaseDate: string;
  notes?: string;
  items: Omit<TPurchaseItem, "totalPrice">[];
}

export interface TUpdatePurchase {
  supplierId?: string;
  invoiceNumber?: string;
  purchaseDate?: string;
  notes?: string;
  items?: Omit<TPurchaseItem, "totalPrice">[];
}

export type TPurchaseStatus = "PENDING" | "RECEIVED" | "PARTIAL" | "CANCELLED";

export interface TPurchase {
  _id: string;
  supplier?: {
    _id: string;
    name: string;
  } | null;
  invoiceNumber: string;
  purchaseDate: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface TPurchaseListItem {
  _id: string;
  orderNumber: string;
  supplierId: string;
  supplier?: {
    name: string;
  } | null;
  status: TPurchaseStatus;
  totalAmount: number;
  createdAt: string;
}
