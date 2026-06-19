import mongoose, { Document } from "mongoose";

export interface IExpense extends Document {
  category: string;
  description: string;
  amount: number;
  date: Date;
  vendorName?: string;
  createdAt: Date;
  updatedAt: Date;
}

const expenseSchema = new mongoose.Schema<IExpense>(
  {
    category: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    vendorName: { type: String, default: "" },
  },
  { timestamps: true },
);

const ExpenseModel = mongoose.model<IExpense>("Expense", expenseSchema);
export default ExpenseModel;
