"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supplierContract = void 0;
const core_1 = require("@ts-rest/core");
const zod_1 = require("zod");
const commonSchema_1 = require("../commonSchema");
const supplier_schema_1 = require("./supplier.schema");
const c = (0, core_1.initContract)();
const supplierBaseSchema = zod_1.z.object({
    _id: zod_1.z.string(),
    name: zod_1.z.string(),
    contactPerson: zod_1.z.string(),
    phone: zod_1.z.string(),
    email: zod_1.z.string(),
    address: zod_1.z.string().optional(),
    isActive: zod_1.z.boolean(),
});
exports.supplierContract = c.router({
    createSupplier: {
        method: "POST",
        path: "/supplier",
        summary: "Create a new supplier",
        body: zod_1.z.object({
            name: zod_1.z.string(),
            contactPerson: zod_1.z.string(),
            phone: zod_1.z.string(),
            email: zod_1.z.string(),
            address: zod_1.z.string().optional(),
            isActive: zod_1.z.boolean().default(true),
        }),
        responses: {
            201: commonSchema_1.successSchema,
            400: commonSchema_1.errorSchema,
            500: commonSchema_1.errorSchema,
        },
    },
    getAllSuppliers: {
        method: "GET",
        path: "/supplier",
        summary: "Get all suppliers with pagination and filters",
        query: zod_1.z.object({
            page: zod_1.z.coerce.number().optional(),
            limit: zod_1.z.coerce.number().optional(),
            search: zod_1.z.string().optional(),
            isActive: zod_1.z.string().optional(),
        }),
        responses: {
            200: zod_1.z.object({
                data: zod_1.z.array(supplierBaseSchema),
                pagination: zod_1.z.object({
                    page: zod_1.z.number(),
                    limit: zod_1.z.number(),
                    total: zod_1.z.number(),
                    totalPages: zod_1.z.number(),
                }),
            }),
        },
    },
    getSupplierByID: {
        method: "GET",
        path: "/supplier/:supplierId",
        summary: "Get supplier details by ID",
        pathParams: zod_1.z.object({
            supplierId: zod_1.z.string(),
        }),
        responses: {
            200: supplier_schema_1.getSupplierByIdSchema,
            404: commonSchema_1.errorSchema,
        },
    },
    updateSupplier: {
        method: "PUT",
        path: "/supplier/:supplierId",
        summary: "Update supplier information",
        pathParams: zod_1.z.object({
            supplierId: zod_1.z.string(),
        }),
        body: zod_1.z.any(),
        responses: {
            200: commonSchema_1.successSchema,
            400: commonSchema_1.errorSchema,
            404: commonSchema_1.errorSchema,
        },
    },
    deleteSupplier: {
        method: "DELETE",
        path: "/supplier/:supplierId",
        summary: "Delete a supplier",
        pathParams: zod_1.z.object({
            supplierId: zod_1.z.string(),
        }),
        body: zod_1.z.object({}),
        responses: {
            200: commonSchema_1.successSchema,
            404: commonSchema_1.errorSchema,
        },
    },
});
