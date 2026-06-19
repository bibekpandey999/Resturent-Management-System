import mongoose, { Document } from "mongoose";

export type StockMovementType =
  | "PURCHASE"
  | "SALE"
  | "WASTAGE"
  | "ADJUSTMENT"
  | "RETURN"
  | "INITIAL_STOCK";

export interface IStockMovement extends Document {
  ingredientId: mongoose.Types.ObjectId;
  type: StockMovementType;
  quantity: number;
  referenceId?: mongoose.Types.ObjectId;
  referenceType?: string;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

const stockMovementSchema = new mongoose.Schema<IStockMovement>(
  {
    ingredientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ingredient",
      required: true,
    },

    type: {
      type: String,
      enum: ["PURCHASE", "SALE", "WASTAGE", "ADJUSTMENT", "RETURN", "INITIAL_STOCK"],
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },

    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    referenceType: {
      type: String,
      default: "",
    },

    note: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

const StockMovementModel = mongoose.model<IStockMovement>(
  "StockMovement",
  stockMovementSchema,
);

export default StockMovementModel;
