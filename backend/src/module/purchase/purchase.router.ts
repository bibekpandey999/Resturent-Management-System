import { initServer } from "@ts-rest/express";
import { purchaseContract } from "../../contract/purchase/purchase.contract";
import { purchaseMutationHandler } from "./purchase.mutation";
import { purchaseQueryHandler } from "./purchase.query";

const s = initServer();

export const purchaseRouter = s.router(purchaseContract, {
  createPurchase: purchaseMutationHandler.createPurchase,
  deletePurchase: purchaseMutationHandler.deletePurchase,

  getAllPurchases: purchaseQueryHandler.getAllPurchases,
  getPurchaseByID: purchaseQueryHandler.getPurchaseByID,
});
