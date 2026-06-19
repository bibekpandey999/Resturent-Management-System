"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expenseContract = void 0;
const core_1 = require("@ts-rest/core");
const zod_1 = require("zod");
const commonSchema_1 = require("../commonSchema");
const expenses_schema_1 = require("./expenses.schema");
const c = (0, core_1.initContract)();
exports.expenseContract = c.router({
    createExpense: {
        method: "POST",
        path: "/expense",
        summary: "Create a new expense entry",
        body: expenses_schema_1.createExpenseSchema,
        responses: {
            201: commonSchema_1.successSchema,
            400: commonSchema_1.errorSchema,
            500: commonSchema_1.errorSchema,
        },
    },
    getAllExpenses: {
        method: "GET",
        path: "/expense",
        summary: "Get all expenses",
        query: zod_1.z.object({
            page: zod_1.z.coerce.number().optional(),
            limit: zod_1.z.coerce.number().optional(),
            search: zod_1.z.string().optional(),
            category: zod_1.z.string().optional(),
            supplier: zod_1.z.string().optional(),
        }),
        responses: {
            200: zod_1.z.object({
                data: expenses_schema_1.getAllExpensesSchema,
            }),
        },
    },
    getExpenseById: {
        method: "GET",
        path: "/expense/:expenseId",
        summary: "Get expense by ID",
        responses: {
            200: expenses_schema_1.getExpenseByIdSchema,
            404: commonSchema_1.errorSchema,
        },
    },
    updateExpense: {
        method: "PATCH",
        path: "/expense/:expenseId",
        summary: "Update an existing expense",
        body: expenses_schema_1.updateExpenseSchema,
        responses: {
            200: commonSchema_1.successSchema,
            404: commonSchema_1.errorSchema,
        },
    },
    deleteExpense: {
        method: "DELETE",
        path: "/expense/:expenseId",
        summary: "Delete an expense",
        body: zod_1.z.object({}).optional(),
        responses: {
            200: commonSchema_1.successSchema,
            404: commonSchema_1.errorSchema,
        },
    },
});
