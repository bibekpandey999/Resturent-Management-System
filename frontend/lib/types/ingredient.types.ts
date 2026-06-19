export interface TCreateIngredient {
  name: string;
  unit: "kg" | "g" | "ltr" | "ml" | "pcs";
  currentStock: number;
  minimumStock: number;
  lastStockInDate: Date;
  category?: string;
  isActive: boolean;
}

export interface TIngredient {
  _id: string;
  name: string;
  unit: "kg" | "g" | "ltr" | "ml" | "pcs";
  currentStock: number;
  minimumStock: number;
  lastStockInDate: Date;
  category?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
