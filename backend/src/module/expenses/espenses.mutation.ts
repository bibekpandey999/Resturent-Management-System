import { AppRouteMutationImplementation } from "@ts-rest/express";
import { expenseContract } from "../../contract/expenses/expenses.contract";
import expensesRepository from "../../repository/expenses.repository";

export const createExpense: AppRouteMutationImplementation<
  typeof expenseContract.createExpense
> = async ({ body }) => {
  try {
    await expensesRepository.create({
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
  } catch (error) {
    return {
      status: 500,
      body: {
        success: false,
        error: (error as Error).message,
      },
    };
  }
};

export const updateExpense: AppRouteMutationImplementation<
  typeof expenseContract.updateExpense
> = async ({ req }) => {
  try {

    const { expenseId } = req.params;

    const updated = await expensesRepository.update(
      expenseId,
      req.body,
    );

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
  } catch (error) {
    return {
      status: 500,
      body: {
        success: false,
        error: (error as Error).message,
      },
    };
  }
};

export const deleteExpense: AppRouteMutationImplementation<
  typeof expenseContract.deleteExpense
> = async ({ req }) => {
  try {
    const deleted = await expensesRepository.delete(req.params.expenseId);

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
  } catch (error) {
    return {
      status: 500,
      body: {
        success: false,
        error: (error as Error).message,
      },
    };
  }
};

export const espensesMutationHandler = {
  createExpense,
  updateExpense,
  deleteExpense,
};
