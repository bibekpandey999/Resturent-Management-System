export type TStockMovementType =
  | "PURCHASE"
  | "SALE"
  | "WASTAGE"
  | "ADJUSTMENT"
  | "TRANSFER";

export interface TStockMovementIngredient {
  _id: string;
  name: string;
  minimumStock: number;
  currentStock: number;
  lastStockInDate: Date;
}

export interface TStockMovement {
  _id: string;
  ingredient: TStockMovementIngredient;
  type: TStockMovementType;
  quantity: number;
  referenceType: "PURCHASE" | "SALE" | "MANUAL" | "SYSTEM";
  createdAt: string;
}

export interface TStockMovementListItem {
  _id: string;
  ingredientName: string;
  type: TStockMovementType;
  quantity: number;
  referenceType: string;
  createdAt: string;
}
