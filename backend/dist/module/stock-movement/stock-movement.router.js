"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stockMovementRouter = void 0;
const express_1 = require("@ts-rest/express");
const stock_movement_contract_1 = require("../../contract/stock-movement/stock-movement.contract");
const stock_moment_query_1 = require("./stock-moment.query");
const s = (0, express_1.initServer)();
exports.stockMovementRouter = s.router(stock_movement_contract_1.stockMovementContract, {
    getAllStockMovements: stock_moment_query_1.stockMovementQueryHandler.getAllStockMovements,
    getByIngredient: stock_moment_query_1.stockMovementQueryHandler.getByIngredient,
});
