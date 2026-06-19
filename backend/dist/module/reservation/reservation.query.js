"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reservationQueryHandler = exports.getReservationStats = exports.getReservationByID = exports.getAllReservation = exports.mapReservation = void 0;
const reservation_repository_1 = __importDefault(require("../../repository/reservation.repository"));
const mapReservation = (reservation) => {
    return {
        _id: reservation._id.toString(),
        customerName: reservation.customerName,
        customerPhone: reservation.customerPhone,
        date: reservation.date,
        time: reservation.time,
        partySize: reservation.partySize,
        tableId: reservation.tableId?._id?.toString() ?? null,
        table: reservation.tableId
            ? {
                _id: reservation.tableId._id?.toString(),
                name: reservation.tableId.name,
                capacity: reservation.tableId.capacity,
                status: reservation.tableId.status,
            }
            : null,
        status: reservation.status,
        createdAt: reservation.createdAt,
        updatedAt: reservation.updatedAt,
    };
};
exports.mapReservation = mapReservation;
const getAllReservation = async ({ req }) => {
    try {
        const page = Number(req.query.page ?? 1);
        const limit = Number(req.query.limit);
        const { data, total } = await reservation_repository_1.default.getAll({
            skip: (page - 1) * limit,
            limit,
            search: req.query.search,
            status: req.query.status,
            date: req.query.date,
        });
        const formattedData = data.map(exports.mapReservation);
        return {
            status: 200,
            body: {
                data: formattedData,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            },
        };
    }
    catch {
        return {
            status: 500,
            body: {
                success: false,
                error: "Failed to fetch reservations",
            },
        };
    }
};
exports.getAllReservation = getAllReservation;
const getReservationByID = async ({ req }) => {
    try {
        const reservation = await reservation_repository_1.default.getByID(req.params.reservationId);
        if (!reservation) {
            return {
                status: 404,
                body: {
                    success: false,
                    error: "Reservation not found",
                },
            };
        }
        return {
            status: 200,
            body: (0, exports.mapReservation)(reservation),
        };
    }
    catch (error) {
        return {
            status: 500,
            body: {
                success: false,
                error: error.message,
            },
        };
    }
};
exports.getReservationByID = getReservationByID;
const getReservationStats = async () => {
    const stats = await reservation_repository_1.default.getStats();
    return {
        status: 200,
        body: stats,
    };
};
exports.getReservationStats = getReservationStats;
exports.reservationQueryHandler = {
    getAllReservation: exports.getAllReservation,
    getReservationByID: exports.getReservationByID,
    getReservationStats: exports.getReservationStats,
};
