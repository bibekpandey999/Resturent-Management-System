"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reservationMutationHandler = exports.deleteReservation = exports.updateReservation = exports.createReservation = void 0;
const reservation_repository_1 = __importDefault(require("../../repository/reservation.repository"));
const mongoose_1 = __importDefault(require("mongoose"));
const socket_1 = require("../../utils/socket");
const createReservation = async ({ req }) => {
    try {
        const data = await reservation_repository_1.default.create({
            ...req.body,
            tableId: new mongoose_1.default.Types.ObjectId(req.body.tableId),
        });
        try {
            const io = (0, socket_1.getIO)();
            io.emit("reservation:created", data);
        }
        catch (err) {
            console.error("Socket emit error in createReservation:", err);
        }
        return {
            status: 201,
            body: {
                success: true,
                message: "Reservation created successfully",
                data,
            },
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
exports.createReservation = createReservation;
const updateReservation = async ({ req }) => {
    try {
        const data = await reservation_repository_1.default.update(req.params.reservationId, {
            ...req.body,
            tableId: new mongoose_1.default.Types.ObjectId(req.body.tableId),
        });
        if (data) {
            try {
                const io = (0, socket_1.getIO)();
                io.emit("reservation:updated", data);
            }
            catch (err) {
                console.error("Socket emit error in updateReservation:", err);
            }
            return {
                status: 200,
                body: {
                    success: true,
                    message: "Reservation updated successfully",
                    data,
                },
            };
        }
        return {
            status: 401,
            body: {
                success: false,
                message: "Reservation updated failed",
            },
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
exports.updateReservation = updateReservation;
const deleteReservation = async ({ req }) => {
    await reservation_repository_1.default.delete(req.params.reservationId);
    try {
        const io = (0, socket_1.getIO)();
        io.emit("reservation:deleted", { _id: req.params.reservationId });
    }
    catch (err) {
        console.error("Socket emit error in deleteReservation:", err);
    }
    return {
        status: 200,
        body: {
            success: true,
        },
    };
};
exports.deleteReservation = deleteReservation;
exports.reservationMutationHandler = {
    createReservation: exports.createReservation,
    updateReservation: exports.updateReservation,
    deleteReservation: exports.deleteReservation,
};
