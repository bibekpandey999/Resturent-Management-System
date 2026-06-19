"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.purchaseContract = void 0;
const core_1 = require("@ts-rest/core");
const zod_1 = require("zod");
const commonSchema_1 = require("../commonSchema");
const purchase_schema_1 = require("./purchase.schema");
const c = (0, core_1.initContract)();
exports.purchaseContract = c.router({
    createPurchase: {
        method: "POST",
        path: "/purchase",
        summary: "Create a new purchase order",
        body: purchase_schema_1.createPurchaseSchema,
        responses: {
            201: commonSchema_1.successSchema,
            400: commonSchema_1.errorSchema,
            500: commonSchema_1.errorSchema,
        },
    },
    getAllPurchases: {
        method: "GET",
        path: "/purchase",
        summary: "Get all purchase records with pagination",
        query: zod_1.z.object({
            page: zod_1.z.coerce.number().optional(),
            limit: zod_1.z.coerce.number().optional(),
            search: zod_1.z.string().optional(),
        }),
        responses: {
            200: zod_1.z.object({
                data: zod_1.z.array(zod_1.z.object({
                    _id: zod_1.z.string(),
                    invoiceNumber: zod_1.z.string(),
                    supplier: zod_1.z.object({
                        _id: zod_1.z.string(),
                        name: zod_1.z.string(),
                    }),
                    totalAmount: zod_1.z.number(),
                    purchaseDate: zod_1.z.string(),
                    createdAt: zod_1.z.string(),
                })),
                pagination: zod_1.z.object({
                    page: zod_1.z.number(),
                    limit: zod_1.z.number(),
                    total: zod_1.z.number(),
                    totalPages: zod_1.z.number(),
                }),
            }),
        },
    },
    getPurchaseByID: {
        method: "GET",
        path: "/purchase/:purchaseId",
        summary: "Get purchase details by ID",
        pathParams: zod_1.z.object({
            purchaseId: zod_1.z.string(),
        }),
        responses: {
            200: purchase_schema_1.getPurchaseByIdSchema,
            404: commonSchema_1.errorSchema,
        },
    },
    deletePurchase: {
        method: "DELETE",
        path: "/purchase/:purchaseId",
        summary: "Delete a purchase record",
        pathParams: zod_1.z.object({
            purchaseId: zod_1.z.string(),
        }),
        body: zod_1.z.object({}),
        responses: {
            200: commonSchema_1.successSchema,
            404: commonSchema_1.errorSchema,
        },
    },
});
