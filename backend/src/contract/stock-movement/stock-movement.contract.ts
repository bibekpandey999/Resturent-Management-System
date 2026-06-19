import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { errorSchema } from "../commonSchema";

const c = initContract();

const stockMovementSchema = z.object({
  _id: z.string(),

  ingredient: z.object({
    _id: z.string(),
    name: z.string(),
    minimumStock: z.number(),
    currentStock: z.number(),
  }),

  type: z.enum([
    "PURCHASE",
    "SALE",
    "WASTAGE",
    "ADJUSTMENT",
    "TRANSFER",
    "INITIAL_STOCK",
  ]),

  quantity: z.number(),

  referenceType: z.enum(["PURCHASE", "SALE", "MANUAL", "SYSTEM"]),

  createdAt: z.string(),
});

export const stockMovementContract = c.router({
  getAllStockMovements: {
    method: "GET",
    path: "/stock-movement",
    summary: "Get all stock movement history with pagination",
    query: z.object({
      page: z.coerce.number().optional(),
      limit: z.coerce.number().optional(),
    }),
    responses: {
      200: z.object({
        data: z.array(stockMovementSchema),
        pagination: z.object({
          page: z.number(),
          limit: z.number(),
          total: z.number(),
          totalPages: z.number(),
        }),
      }),
      500: errorSchema,
    },
  },

  getByIngredient: {
    method: "GET",
    path: "/stock-movement/:ingredientId",
    summary: "Get stock movement history for a specific ingredient",
    responses: {
      200: z.array(stockMovementSchema),
      404: errorSchema,
    },
  },
});
