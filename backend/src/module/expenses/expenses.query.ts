import { AppRouteQueryImplementation } from "@ts-rest/express";
import { expenseContract } from "../../contract/expenses/expenses.contract";
import expensesRepository from "../../repository/expenses.repository";


export const getAllExpenses: AppRouteQueryImplementation<
  typeof expenseContract.getAllExpenses
> = async ({ req }) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);

    const { data, total } = await expensesRepository.getAll({
      skip: (page - 1) * limit,
      limit,
      search: req.query.search as string,
      category: req.query.category as string,
      supplier: req.query.supplier as string,
    });

    const formatted = data.map((expense: any) => ({
      _id: expense._id.toString(),
      category: expense.category,
      description: expense.description,
      amount: expense.amount,
      date: expense.date,
      vendorName: expense.vendorName,
      createdAt: expense.createdAt,
      updatedAt: expense.updatedAt,
    }));

    return {
      status: 200,
      body: {
        data: formatted,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  } catch {
    return {
      status: 500,
      body: {
        success: false,
        error: "Failed to fetch expenses",
      },
    };
  }
};

export const getExpenseByID: AppRouteQueryImplementation<
  typeof expenseContract.getExpenseById
> = async ({ req }) => {
  try {
    const expense = await expensesRepository.getById(req.params.expenseId);

    if (!expense) {
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
        _id: expense._id.toString(),
        category: expense.category,
        description: expense.description,
        amount: expense.amount,
        date: expense.date,
        vendorName: expense.vendorName,
        createdAt: expense.createdAt,
        updatedAt: expense.updatedAt,
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

export const espensesQueryHandler = {
  getAllExpenses,
  getExpenseByID,
};
