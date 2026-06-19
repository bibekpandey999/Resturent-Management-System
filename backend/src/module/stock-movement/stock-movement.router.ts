import { initServer } from "@ts-rest/express";

import { stockMovementContract } from "../../contract/stock-movement/stock-movement.contract";
import { stockMovementQueryHandler } from "./stock-moment.query";

const s = initServer();

export const stockMovementRouter = s.router(stockMovementContract, {
  getAllStockMovements: stockMovementQueryHandler.getAllStockMovements,
  getByIngredient: stockMovementQueryHandler.getByIngredient,
});
