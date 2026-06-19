import mongoose, { Schema, Document } from "mongoose";

export interface IReservation extends Document {
  customerName: string;
  customerPhone: string;
  date: string;
  time: string;
  partySize: number;
  tableId: mongoose.Types.ObjectId;
  status: "confirmed" | "pending" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

const reservationSchema = new mongoose.Schema<IReservation>(
  {
    customerName: {
      type: String,
      required: true,
      trim: true,
    },

    customerPhone: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
      type: String,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

    partySize: {
      type: Number,
      required: true,
      min: 1,
    },

    tableId: {
      type: Schema.Types.ObjectId,
      ref: "Table",
      required: true,
    },

    status: {
      type: String,
      enum: ["confirmed", "pending", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

reservationSchema.index({ date: 1, time: 1 });
reservationSchema.index({ status: 1 });
reservationSchema.index({ customerPhone: 1 });

const ReservationModel = mongoose.model<IReservation>(
  "Reservation",
  reservationSchema,
);

export default ReservationModel;
