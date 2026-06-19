export interface TCreateExpense {
  category: string;
  description: string;
  amount: number;
  date: string;
  vendorName?: string;
}

export interface TExpense {
  _id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  vendorName?: string;
  createdAt: Date;
  updatedAt: Date;
}