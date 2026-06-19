"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.purchaseRouter = void 0;
const express_1 = require("@ts-rest/express");
const purchase_contract_1 = require("../../contract/purchase/purchase.contract");
const purchase_mutation_1 = require("./purchase.mutation");
const purchase_query_1 = require("./purchase.query");
const s = (0, express_1.initServer)();
exports.purchaseRouter = s.router(purchase_contract_1.purchaseContract, {
    createPurchase: purchase_mutation_1.purchaseMutationHandler.createPurchase,
    deletePurchase: purchase_mutation_1.purchaseMutationHandler.deletePurchase,
    getAllPurchases: purchase_query_1.purchaseQueryHandler.getAllPurchases,
    getPurchaseByID: purchase_query_1.purchaseQueryHandler.getPurchaseByID,
});
