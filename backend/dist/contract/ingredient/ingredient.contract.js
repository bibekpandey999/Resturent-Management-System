"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ingredientContract = void 0;
const core_1 = require("@ts-rest/core");
const zod_1 = require("zod");
const commonSchema_1 = require("../commonSchema");
const ingredient_schema_1 = require("./ingredient.schema");
const c = (0, core_1.initContract)();
exports.ingredientContract = c.router({
    createIngredient: {
        method: "POST",
        path: "/ingredient",
        body: ingredient_schema_1.createIngredientSchema,
        responses: {
            201: commonSchema_1.successSchema,
            400: commonSchema_1.errorSchema,
            500: commonSchema_1.errorSchema,
        },
    },
    getAllIngredients: {
        method: "GET",
        path: "/ingredient",
        query: zod_1.z.object({
            page: zod_1.z.coerce.number().optional(),
            limit: zod_1.z.coerce.number().optional(),
            search: zod_1.z.string().optional(),
            isActive: zod_1.z.string().optional(),
        }),
        responses: {
            200: zod_1.z.object({
                data: ingredient_schema_1.getAllIngredients,
                pagination: zod_1.z.object({
                    page: zod_1.z.number(),
                    limit: zod_1.z.number(),
                    total: zod_1.z.number(),
                    totalPages: zod_1.z.number(),
                }),
            }),
        },
    },
    getIngredientByID: {
        method: "GET",
        path: "/ingredient/:ingredientId",
        responses: {
            200: zod_1.z.any(),
            404: commonSchema_1.errorSchema,
        },
    },
    updateIngredient: {
        method: "PUT",
        path: "/ingredient/:ingredientId",
        body: zod_1.z.any(),
        responses: {
            200: commonSchema_1.successSchema,
            400: commonSchema_1.errorSchema,
            404: commonSchema_1.errorSchema,
        },
    },
    deleteIngredient: {
        method: "DELETE",
        path: "/ingredient/:ingredientId",
        body: zod_1.z.object({}),
        responses: {
            200: commonSchema_1.successSchema,
            404: commonSchema_1.errorSchema,
        },
    },
});
