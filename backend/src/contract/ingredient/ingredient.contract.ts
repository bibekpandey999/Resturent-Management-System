import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { errorSchema, successSchema } from "../commonSchema";
import { createIngredientSchema, getAllIngredients } from "./ingredient.schema";

const c = initContract();

export const ingredientContract = c.router({
  createIngredient: {
    method: "POST",
    path: "/ingredient",
    body: createIngredientSchema,
    responses: {
      201: successSchema,
      400: errorSchema,
      500: errorSchema,
    },
  },

  getAllIngredients: {
    method: "GET",
    path: "/ingredient",
    query: z.object({
      page: z.coerce.number().optional(),
      limit: z.coerce.number().optional(),
      search: z.string().optional(),
      isActive: z.string().optional(),
    }),
    responses: {
      200: z.object({
        data: getAllIngredients,
        pagination: z.object({
          page: z.number(),
          limit: z.number(),
          total: z.number(),
          totalPages: z.number(),
        }),
      }),
    },
  },

  getIngredientByID: {
    method: "GET",
    path: "/ingredient/:ingredientId",
    responses: {
      200: z.any(),
      404: errorSchema,
    },
  },

  updateIngredient: {
    method: "PUT",
    path: "/ingredient/:ingredientId",
    body: z.any(),
    responses: {
      200: successSchema,
      400: errorSchema,
      404: errorSchema,
    },
  },

  deleteIngredient: {
    method: "DELETE",
    path: "/ingredient/:ingredientId",
    body: z.object({}),
    responses: {
      200: successSchema,
      404: errorSchema,
    },
  },
});
