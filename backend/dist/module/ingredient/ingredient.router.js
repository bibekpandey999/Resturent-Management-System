"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ingredientRouter = void 0;
const express_1 = require("@ts-rest/express");
const ingredient_contract_1 = require("../../contract/ingredient/ingredient.contract");
const ingredient_mutation_1 = require("./ingredient.mutation");
const ingredient_query_1 = require("./ingredient.query");
const s = (0, express_1.initServer)();
exports.ingredientRouter = s.router(ingredient_contract_1.ingredientContract, {
    createIngredient: ingredient_mutation_1.ingredientMutationHandler.createIngredient,
    updateIngredient: ingredient_mutation_1.ingredientMutationHandler.updateIngredient,
    deleteIngredient: ingredient_mutation_1.ingredientMutationHandler.deleteIngredient,
    getAllIngredients: ingredient_query_1.ingredientQueryHandler.getAllIngredients,
    getIngredientByID: ingredient_query_1.ingredientQueryHandler.getIngredientByID,
});
