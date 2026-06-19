import { initServer } from "@ts-rest/express";

import { ingredientContract } from "../../contract/ingredient/ingredient.contract";

import { ingredientMutationHandler } from "./ingredient.mutation";
import { ingredientQueryHandler } from "./ingredient.query";

const s = initServer();

export const ingredientRouter = s.router(ingredientContract, {
  createIngredient: ingredientMutationHandler.createIngredient,
  updateIngredient: ingredientMutationHandler.updateIngredient,
  deleteIngredient: ingredientMutationHandler.deleteIngredient,

  getAllIngredients: ingredientQueryHandler.getAllIngredients,
  getIngredientByID: ingredientQueryHandler.getIngredientByID,
});
