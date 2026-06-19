import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { errorSchema, successSchema } from "../commonSchema";
import {
  createPurchaseSchema,
  getAllPurchaseSchema,
  getPurchaseByIdSchema,
} from "./purchase.schema";

const c = initContract();

export const purchaseContract = c.router({
  createPurchase: {
    method: "POST",
    path: "/purchase",
    summary: "Create a new purchase order",
    body: createPurchaseSchema,
    responses: {
      201: successSchema,
      400: errorSchema,
      500: errorSchema,
    },
  },

  getAllPurchases: {
    method: "GET",
    path: "/purchase",
    summary: "Get all purchase records with pagination",
    query: z.object({
      page: z.coerce.number().optional(),
      limit: z.coerce.number().optional(),
      search: z.string().optional(),
    }),
    responses: {
      200: z.object({
        data: z.array(
          z.object({
            _id: z.string(),
            invoiceNumber: z.string(),

            supplier: z.object({
              _id: z.string(),
              name: z.string(),
            }),

            totalAmount: z.number(),
            purchaseDate: z.string(),

            createdAt: z.string(),
          }),
        ),
        pagination: z.object({
          page: z.number(),
          limit: z.number(),
          total: z.number(),
          totalPages: z.number(),
        }),
      }),
    },
  },

  getPurchaseByID: {
    method: "GET",
    path: "/purchase/:purchaseId",
    summary: "Get purchase details by ID",
    pathParams: z.object({
      purchaseId: z.string(),
    }),
    responses: {
      200: getPurchaseByIdSchema,
      404: errorSchema,
    },
  },

  deletePurchase: {
    method: "DELETE",
    path: "/purchase/:purchaseId",
    summary: "Delete a purchase record",
    pathParams: z.object({
      purchaseId: z.string(),
    }),
    body: z.object({}),
    responses: {
      200: successSchema,
      404: errorSchema,
    },
  },
});
