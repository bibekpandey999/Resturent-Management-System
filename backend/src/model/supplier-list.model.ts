import mongoose, { Document } from "mongoose";

export interface ISupplier extends Document {
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const supplierSchema = new mongoose.Schema<ISupplier>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    contactPerson: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    address: {
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

const SupplierModel = mongoose.model<ISupplier>("Supplier", supplierSchema);

export default SupplierModel;
