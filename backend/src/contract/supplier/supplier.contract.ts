import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { errorSchema, successSchema } from "../commonSchema";
import { getSupplierByIdSchema } from "./supplier.schema";

const c = initContract();

const supplierBaseSchema = z.object({
  _id: z.string(),
  name: z.string(),
  contactPerson: z.string(),
  phone: z.string(),
  email: z.string(),
  address: z.string().optional(),
  isActive: z.boolean(),
});

export const supplierContract = c.router({
  createSupplier: {
    method: "POST",
    path: "/supplier",
    summary: "Create a new supplier",
    body: z.object({
      name: z.string(),
      contactPerson: z.string(),
      phone: z.string(),
      email: z.string(),
      address: z.string().optional(),
      isActive: z.boolean().default(true),
    }),
    responses: {
      201: successSchema,
      400: errorSchema,
      500: errorSchema,
    },
  },

  getAllSuppliers: {
    method: "GET",
    path: "/supplier",
    summary: "Get all suppliers with pagination and filters",
    query: z.object({
      page: z.coerce.number().optional(),
      limit: z.coerce.number().optional(),
      search: z.string().optional(),
      isActive: z.string().optional(),
    }),
    responses: {
      200: z.object({
        data: z.array(supplierBaseSchema),
        pagination: z.object({
          page: z.number(),
          limit: z.number(),
          total: z.number(),
          totalPages: z.number(),
        }),
      }),
    },
  },

  getSupplierByID: {
    method: "GET",
    path: "/supplier/:supplierId",
    summary: "Get supplier details by ID",
    pathParams: z.object({
      supplierId: z.string(),
    }),
    responses: {
      200: getSupplierByIdSchema,
      404: errorSchema,
    },
  },

  updateSupplier: {
    method: "PUT",
    path: "/supplier/:supplierId",
    summary: "Update supplier information",
    pathParams: z.object({
      supplierId: z.string(),
    }),
    body: z.any(),
    responses: {
      200: successSchema,
      400: errorSchema,
      404: errorSchema,
    },
  },

  deleteSupplier: {
    method: "DELETE",
    path: "/supplier/:supplierId",
    summary: "Delete a supplier",
    pathParams: z.object({
      supplierId: z.string(),
    }),
    body: z.object({}),
    responses: {
      200: successSchema,
      404: errorSchema,
    },
  },
});
