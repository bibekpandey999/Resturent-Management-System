"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reservationContract = void 0;
const core_1 = require("@ts-rest/core");
const zod_1 = require("zod");
const reservation_schema_1 = require("./reservation.schema");
const commonSchema_1 = require("../commonSchema");
const c = (0, core_1.initContract)();
exports.reservationContract = c.router({
    createReservation: {
        method: "POST",
        path: "/reservation",
        summary: "Create a new table reservation",
        body: reservation_schema_1.createReservationSchema,
        responses: {
            201: commonSchema_1.successSchema,
            400: commonSchema_1.errorSchema,
            500: commonSchema_1.errorSchema,
        },
    },
    getAllReservation: {
        method: "GET",
        path: "/reservation",
        summary: "Get all reservations with pagination, search and filters",
        query: zod_1.z.object({
            page: zod_1.z.coerce.number().optional(),
            limit: zod_1.z.coerce.number().optional(),
            search: zod_1.z.string().optional(),
            status: zod_1.z.string().optional(),
            date: zod_1.z.string().optional(),
        }),
        responses: {
            200: zod_1.z.object({
                data: reservation_schema_1.getAllReservationSchema,
                pagination: zod_1.z.object({
                    page: zod_1.z.number(),
                    limit: zod_1.z.number(),
                    total: zod_1.z.number(),
                    totalPages: zod_1.z.number(),
                }),
            }),
        },
    },
    getReservationByID: {
        method: "GET",
        path: "/reservation/:reservationId",
        summary: "Get detailed reservation information by reservation ID",
        responses: {
            200: reservation_schema_1.getReservationByIdSchema,
            404: commonSchema_1.errorSchema,
        },
    },
    getReservationStats: {
        method: "GET",
        path: "/reservation/stats",
        summary: "Get reservation statistics (total, confirmed, pending, cancelled)",
        responses: {
            200: zod_1.z.object({
                total: zod_1.z.number(),
                confirmed: zod_1.z.number(),
                pending: zod_1.z.number(),
                cancelled: zod_1.z.number(),
            }),
        },
    },
    updateReservation: {
        method: "PUT",
        path: "/reservation/:reservationId",
        summary: "Update reservation details by ID",
        pathParams: zod_1.z.object({
            reservationId: zod_1.z.string(),
        }),
        body: reservation_schema_1.updateReservationSchema,
        responses: {
            200: commonSchema_1.successSchema,
            400: commonSchema_1.errorSchema,
            404: commonSchema_1.errorSchema,
            500: commonSchema_1.errorSchema,
        },
    },
    deleteReservation: {
        method: "DELETE",
        path: "/reservation/:reservationId",
        summary: "Delete a reservation permanently by ID",
        responses: {
            200: zod_1.z.object({
                success: zod_1.z.boolean(),
            }),
        },
        body: zod_1.z.object({}),
    },
});
