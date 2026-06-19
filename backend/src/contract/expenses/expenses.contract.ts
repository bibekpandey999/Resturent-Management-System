import { initContract } from "@ts-rest/core";
import { z } from "zod";

import { errorSchema, successSchema } from "../commonSchema";
import {
  createExpenseSchema,
  getAllExpensesSchema,
  getExpenseByIdSchema,
  updateExpenseSchema,
} from "./expenses.schema";

const c = initContract();

export const expenseContract = c.router({
  createExpense: {
    method: "POST",
    path: "/expense",
    summary: "Create a new expense entry",
    body: createExpenseSchema,
    responses: {
      201: successSchema,
      400: errorSchema,
      500: errorSchema,
    },
  },

  getAllExpenses: {
    method: "GET",
    path: "/expense",
    summary: "Get all expenses",
    query: z.object({
      page: z.coerce.number().optional(),
      limit: z.coerce.number().optional(),
      search: z.string().optional(),
    }),
    responses: {
      200: z.object({
        data: getAllExpensesSchema,
      }),
    },
  },

  getExpenseById: {
    method: "GET",
    path: "/expense/:expenseId",
    summary: "Get expense by ID",
    responses: {
      200: getExpenseByIdSchema,
      404: errorSchema,
    },
  },

  updateExpense: {
    method: "PATCH",
    path: "/expense/:expenseId",
    summary: "Update an existing expense",
    body: updateExpenseSchema,
    responses: {
      200: successSchema,
      404: errorSchema,
    },
  },

  deleteExpense: {
    method: "DELETE",
    path: "/expense/:expenseId",
    summary: "Delete an expense",
    body: z.object({}).optional(),
    responses: {
      200: successSchema,
      404: errorSchema,
    },
  },
});
