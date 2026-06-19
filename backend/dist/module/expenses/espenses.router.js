"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expenseRouter = void 0;
const express_1 = require("@ts-rest/express");
const expenses_contract_1 = require("../../contract/expenses/expenses.contract");
const expenses_query_1 = require("./expenses.query");
const espenses_mutation_1 = require("./espenses.mutation");
const s = (0, express_1.initServer)();
exports.expenseRouter = s.router(expenses_contract_1.expenseContract, {
    createExpense: espenses_mutation_1.espensesMutationHandler.createExpense,
    updateExpense: espenses_mutation_1.espensesMutationHandler.updateExpense,
    deleteExpense: espenses_mutation_1.espensesMutationHandler.deleteExpense,
    getAllExpenses: expenses_query_1.espensesQueryHandler.getAllExpenses,
    getExpenseById: expenses_query_1.espensesQueryHandler.getExpenseByID,
});
