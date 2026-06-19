import { initServer } from "@ts-rest/express";
import { expenseContract } from "../../contract/expenses/expenses.contract";
import { espensesQueryHandler } from "./expenses.query";
import { espensesMutationHandler } from "./espenses.mutation";

const s = initServer();

export const expenseRouter = s.router(expenseContract, {
  createExpense: espensesMutationHandler.createExpense,
  updateExpense: espensesMutationHandler.updateExpense,
  deleteExpense: espensesMutationHandler.deleteExpense,

  getAllExpenses: espensesQueryHandler.getAllExpenses,
  getExpenseById: espensesQueryHandler.getExpenseByID,
});
