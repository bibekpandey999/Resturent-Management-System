import mongoose, { Schema, Document } from "mongoose";

export interface IKitchenTicketItem {
  menuItemId: mongoose.Types.ObjectId;
  name: string;
  quantity: number;
  price: number;
}

export interface IKitchenTicket extends Document {
  orderId: mongoose.Types.ObjectId;
  tableId: mongoose.Types.ObjectId;
  ticketNumber: number;
  items: IKitchenTicketItem[];
  printed: boolean;
  status: "pending" | "preparing" | "ready" | "served" | "cancelled" | "completed";
  discount: number;
   discountPercent: number;  
}

const KitchenTicketItemSchema = new Schema<IKitchenTicketItem>(
  {
    menuItemId: {
      type: Schema.Types.ObjectId,
      ref: "MenuItem",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    _id: false,
  },
);

const KitchenTicketSchema = new Schema<IKitchenTicket>(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    tableId: {
      type: Schema.Types.ObjectId,
      ref: "Table",
      required: true,
    },
    ticketNumber: {
      type: Number,
      required: true,
    },
    items: {
      type: [KitchenTicketItemSchema],
      default: [],
    },
    printed: {
      type: Boolean,
      default: false,
    },
   status: {
  type: String,
  enum: ["pending", "preparing", "ready", "served", "cancelled", "completed"],
  default: "pending",
},
    discount: {
      type: Number,
      default: 0,
    },
    discountPercent: {         
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  },
);

const KitchenTicketModel = mongoose.model<IKitchenTicket>(
  "KitchenTicket",
  KitchenTicketSchema,
);

export default KitchenTicketModel;