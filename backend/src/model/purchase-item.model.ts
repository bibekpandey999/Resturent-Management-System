import mongoose, { Document } from "mongoose";

export interface IPurchaseItem extends Document {
  purchaseId: mongoose.Types.ObjectId;
  ingredientId: mongoose.Types.ObjectId;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

const purchaseItemSchema = new mongoose.Schema<IPurchaseItem>(
  {
    purchaseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Purchase",
      required: true,
    },

    ingredientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ingredient",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },

    unitPrice: {
      type: Number,
      required: true,
    },

    totalPrice: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const PurchaseItemModel = mongoose.model<IPurchaseItem>(
  "PurchaseItem",
  purchaseItemSchema,
);

export default PurchaseItemModel;
