import { initServer } from "@ts-rest/express";

import { orderContract } from "../../contract/order/order.contract";

import { orderMutationHandler } from "./order.mutation";
import { orderQueryHandler } from "./order.query";

const s = initServer();

export const orderRouter = s.router(orderContract, {
  createOrder: orderMutationHandler.createOrder,
  // updateOrder: orderMutationHandler.updateOrder,
  updatePaymentStatus: orderMutationHandler.updatePaymentStatus,
  removeOrder: orderMutationHandler.removeOrder,

  getAllOrders: orderQueryHandler.getAllOrders,
  getOrderByID: orderQueryHandler.getOrderByID,
  getActiveOrderByTable: orderQueryHandler.getActiveOrderByTable,
});

export default orderRouter;