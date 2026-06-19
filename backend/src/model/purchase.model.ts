import mongoose, { Document } from "mongoose";

export interface IPurchase extends Document {
  supplierId: mongoose.Types.ObjectId;
  invoiceNumber: string;
  purchaseDate: Date;
  totalAmount: number;
  notes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const purchaseSchema = new mongoose.Schema<IPurchase>(
  {
    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },

    invoiceNumber: {
      type: String,
      required: true,
      trim: true,
    },

    purchaseDate: {
      type: Date,
      default: Date.now,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    notes: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const PurchaseModel = mongoose.model<IPurchase>("Purchase", purchaseSchema);

export default PurchaseModel;
