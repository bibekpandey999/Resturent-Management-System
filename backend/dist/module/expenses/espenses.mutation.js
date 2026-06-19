"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.espensesMutationHandler = exports.deleteExpense = exports.updateExpense = exports.createExpense = void 0;
const expenses_repository_1 = __importDefault(require("../../repository/expenses.repository"));
const createExpense = async ({ body }) => {
    try {
        await expenses_repository_1.default.create({
            ...body,
            date: new Date(body.date),
        });
        return {
            status: 201,
            body: {
                success: true,
                message: "Expense created successfully",
            },
        };
    }
    catch (error) {
        return {
            status: 500,
            body: {
                success: false,
                error: error.message,
            },
        };
    }
};
exports.createExpense = createExpense;
const updateExpense = async ({ req }) => {
    try {
        const { expenseId } = req.params;
        const updated = await expenses_repository_1.default.update(expenseId, req.body);
        if (!updated) {
            return {
                status: 404,
                body: {
                    success: false,
                    error: "Expense not found",
                },
            };
        }
        return {
            status: 200,
            body: {
                success: true,
                message: "Expense updated successfully",
            },
        };
    }
    catch (error) {
        return {
            status: 500,
            body: {
                success: false,
                error: error.message,
            },
        };
    }
};
exports.updateExpense = updateExpense;
const deleteExpense = async ({ req }) => {
    try {
        const deleted = await expenses_repository_1.default.delete(req.params.expenseId);
        if (!deleted) {
            return {
                status: 404,
                body: {
                    success: false,
                    error: "Expense not found",
                },
            };
        }
        return {
            status: 200,
            body: {
                success: true,
                message: "Expense deleted successfully",
            },
        };
    }
    catch (error) {
        return {
            status: 500,
            body: {
                success: false,
                error: error.message,
            },
        };
    }
};
exports.deleteExpense = deleteExpense;
exports.espensesMutationHandler = {
    createExpense: exports.createExpense,
    updateExpense: exports.updateExpense,
    deleteExpense: exports.deleteExpense,
};
