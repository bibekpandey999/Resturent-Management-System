export interface TCreateReservation {
  customerName: string;
  customerPhone: string;
  date: string;
  time: string;
  partySize: number;
  tableId: string;
  status: "confirmed" | "pending" | "cancelled";
}

export type TReservationStatus = "confirmed" | "pending" | "cancelled";

export interface TReservationTable {
  _id: string;
  name: string;
  capacity: number;
  status: "available" | "occupied" | "reserved" | "cleaning" | "out-of-service";
}

export interface TReservation {
  _id: string;

  customerName: string;
  customerPhone: string;
  date: string;
  time: string;
  partySize: number;

  status: TReservationStatus;

  table: TReservationTable | null;

  createdAt: string;
  updatedAt: string;
}
