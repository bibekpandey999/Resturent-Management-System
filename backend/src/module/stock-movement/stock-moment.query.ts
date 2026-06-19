import { AppRouteQueryImplementation } from "@ts-rest/express";
import { stockMovementContract } from "../../contract/stock-movement/stock-movement.contract";
import stockMovementRepository from "../../repository/stock-movement.repository";

export const mapStockMovement = (m: any) => ({
  _id: m._id.toString(),

  ingredient: {
    _id: m.ingredientId?._id?.toString() ?? "",
    name: m.ingredientId?.name ?? "",
    minimumStock: m.ingredientId?.minimumStock ?? 0,
    currentStock: m.ingredientId?.currentStock ?? 0,
    lastStockInDate: m.ingredientId?.lastStockInDate ?? "",
  },

  type: m.type,
  quantity: m.quantity,
  referenceType: m.referenceType,

  createdAt: m.createdAt.toISOString(),
});

export const getAllStockMovements: AppRouteQueryImplementation<
  typeof stockMovementContract.getAllStockMovements
> = async ({ req }) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);

    const { data, total } = await stockMovementRepository.getAll({
      skip: (page - 1) * limit,
      limit,
    });

    const formatted = data.map(mapStockMovement);

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
        error: "Failed to fetch stock movements",
      },
    };
  }
};

export const getByIngredient: AppRouteQueryImplementation<
  typeof stockMovementContract.getByIngredient
> = async ({ req }) => {
  try {
    const data = await stockMovementRepository.getByIngredient(
      req.params.ingredientId,
    );

    return {
      status: 200,
      body: data.map(mapStockMovement),
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

export const stockMovementQueryHandler = {
  getAllStockMovements,
  getByIngredient,
};
