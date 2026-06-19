import { AppRouteQueryImplementation } from "@ts-rest/express";
import { ingredientContract } from "../../contract/ingredient/ingredient.contract";
import ingredientRepository from "../../repository/ingredient.repository";

export const getAllIngredients: AppRouteQueryImplementation<
  typeof ingredientContract.getAllIngredients
> = async ({ req }) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit);

    const { data, total } = await ingredientRepository.getAll({
      skip: (page - 1) * limit,
      limit,
      search: req.query.search as string,
      isActive: req.query.isActive as string,
    });

    const formatted = data.map((ingredient: any) => ({
      _id: ingredient._id.toString(),
      name: ingredient.name,
      unit: ingredient.unit,
      currentStock: ingredient.currentStock,
      minimumStock: ingredient.minimumStock,
      lastStockInDate: ingredient.lastStockInDate,
      category: ingredient.category,
      isActive: ingredient.isActive,
      createdAt: ingredient.createdAt,
      updatedAt: ingredient.updatedAt,
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
        error: "Failed to fetch ingredients",
      },
    };
  }
};

export const getIngredientByID: AppRouteQueryImplementation<
  typeof ingredientContract.getIngredientByID
> = async ({ req }) => {
  try {
    const ingredient = await ingredientRepository.getByID(
      req.params.ingredientId,
    );

    if (!ingredient) {
      return {
        status: 404,
        body: {
          success: false,
          error: "Ingredient not found",
        },
      };
    }

    return {
      status: 200,
      body: {
        _id: ingredient._id.toString(),
        name: ingredient.name,
        unit: ingredient.unit,
        currentStock: ingredient.currentStock,
        minimumStock: ingredient.minimumStock,
        lastStockInDate: ingredient.lastStockInDate,
        category: ingredient.category,
        isActive: ingredient.isActive,
        createdAt: ingredient.createdAt,
        updatedAt: ingredient.updatedAt,
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

export const ingredientQueryHandler = {
  getAllIngredients,
  getIngredientByID,
};
