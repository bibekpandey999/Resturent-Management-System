import { initServer } from "@ts-rest/express";
import { supplierContract } from "../../contract/supplier/supplier.contract";
import { supplierMutationHandler } from "./supplier.mutation";
import { supplierQueryHandler } from "./supplier.query";

const s = initServer();

export const supplierRouter = s.router(supplierContract, {
  createSupplier: supplierMutationHandler.createSupplier,
  updateSupplier: supplierMutationHandler.updateSupplier,
  deleteSupplier: supplierMutationHandler.deleteSupplier,

  getAllSuppliers: supplierQueryHandler.getAllSuppliers,
  getSupplierByID: supplierQueryHandler.getSupplierByID,
});
