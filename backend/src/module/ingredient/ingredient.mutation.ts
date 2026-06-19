import { AppRouteMutationImplementation } from "@ts-rest/express";
import ingredientRepository from "../../repository/ingredient.repository";
import { ingredientContract } from "../../contract/ingredient/ingredient.contract";
import stockMovementRepository from "../../repository/stock-movement.repository";

export const createIngredient: AppRouteMutationImplementation<
  typeof ingredientContract.createIngredient
> = async ({ req }) => {
  try {
    const existing = await ingredientRepository.getByName(req.body.name);

    if (existing) {
      return {
        status: 400,
        body: {
          success: false,
          error: "Ingredient already exists",
        },
      };
    }

    const ingredient = await ingredientRepository.create(req.body);

    if (req.body.currentStock > 0) {
      await stockMovementRepository.create({
        ingredientId: ingredient._id,
        type: "INITIAL_STOCK",
        quantity: req.body.currentStock,
        referenceType: "SYSTEM",
      });

      await ingredientRepository.update(ingredient._id.toString(), {
        lastStockInDate: new Date(),
      });
    }

    return {
      status: 201,
      body: {
        success: true,
        message: "Ingredient created successfully",
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

export const updateIngredient: AppRouteMutationImplementation<
  typeof ingredientContract.updateIngredient
> = async ({ req }) => {
  try {
    const { ingredientId } = req.params;

    const ingredient = await ingredientRepository.getByID(ingredientId);

    if (!ingredient) {
      return {
        status: 404,
        body: {
          success: false,
          error: "Ingredient not found",
        },
      };
    }

    await ingredientRepository.update(ingredientId, req.body);

    return {
      status: 200,
      body: {
        success: true,
        message: "Ingredient updated successfully",
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

export const deleteIngredient: AppRouteMutationImplementation<
  typeof ingredientContract.deleteIngredient
> = async ({ req }) => {
  try {
    const { ingredientId } = req.params;

    const ingredient = await ingredientRepository.getByID(ingredientId);

    if (!ingredient) {
      return {
        status: 404,
        body: {
          success: false,
          error: "Ingredient not found",
        },
      };
    }

    await ingredientRepository.delete(ingredientId);

    return {
      status: 200,
      body: {
        success: true,
        message: "Ingredient deleted successfully",
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

export const ingredientMutationHandler = {
  createIngredient,
  updateIngredient,
  deleteIngredient,
};
