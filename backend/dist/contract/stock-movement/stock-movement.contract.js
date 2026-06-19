"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stockMovementContract = void 0;
const core_1 = require("@ts-rest/core");
const zod_1 = require("zod");
const commonSchema_1 = require("../commonSchema");
const c = (0, core_1.initContract)();
const stockMovementSchema = zod_1.z.object({
    _id: zod_1.z.string(),
    ingredient: zod_1.z.object({
        _id: zod_1.z.string(),
        name: zod_1.z.string(),
        minimumStock: zod_1.z.number(),
        currentStock: zod_1.z.number(),
    }),
    type: zod_1.z.enum([
        "PURCHASE",
        "SALE",
        "WASTAGE",
        "ADJUSTMENT",
        "TRANSFER",
        "INITIAL_STOCK",
    ]),
    quantity: zod_1.z.number(),
    referenceType: zod_1.z.enum(["PURCHASE", "SALE", "MANUAL", "SYSTEM"]),
    createdAt: zod_1.z.string(),
});
exports.stockMovementContract = c.router({
    getAllStockMovements: {
        method: "GET",
        path: "/stock-movement",
        summary: "Get all stock movement history with pagination",
        query: zod_1.z.object({
            page: zod_1.z.coerce.number().optional(),
            limit: zod_1.z.coerce.number().optional(),
        }),
        responses: {
            200: zod_1.z.object({
                data: zod_1.z.array(stockMovementSchema),
                pagination: zod_1.z.object({
                    page: zod_1.z.number(),
                    limit: zod_1.z.number(),
                    total: zod_1.z.number(),
                    totalPages: zod_1.z.number(),
                }),
            }),
            500: commonSchema_1.errorSchema,
        },
    },
    getByIngredient: {
        method: "GET",
        path: "/stock-movement/:ingredientId",
        summary: "Get stock movement history for a specific ingredient",
        responses: {
            200: zod_1.z.array(stockMovementSchema),
            404: commonSchema_1.errorSchema,
        },
    },
});
