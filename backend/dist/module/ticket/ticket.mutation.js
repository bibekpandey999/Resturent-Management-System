"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ticketMutationHandler = exports.removeTicket = exports.updateTicketStatus = void 0;
const ticket_repository_1 = __importDefault(require("../../repository/ticket.repository"));
const socket_1 = require("../../utils/socket");
const updateTicketStatus = async ({ req }) => {
    try {
        const { ticketID } = req.params;
        const { status } = req.body;
        const ticket = await ticket_repository_1.default.getByID(ticketID);
        if (!ticket) {
            return {
                status: 404,
                body: {
                    success: false,
                    error: "Ticket not found",
                },
            };
        }
        const updated = await ticket_repository_1.default.updateStatus(ticketID, status);
        try {
            const io = (0, socket_1.getIO)();
            io.emit("ticket:updated", updated);
        }
        catch (err) {
            console.error("Socket emit error in updateTicketStatus:", err);
        }
        return {
            status: 200,
            body: {
                success: true,
                message: "Ticket updated",
                data: updated,
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
exports.updateTicketStatus = updateTicketStatus;
const removeTicket = async ({ req }) => {
    try {
        const { ticketID } = req.params;
        const ticket = await ticket_repository_1.default.getByID(ticketID);
        if (!ticket) {
            return {
                status: 404,
                body: {
                    success: false,
                    error: "Ticket not found",
                },
            };
        }
        await ticket_repository_1.default.updateStatus(ticketID, "cancelled");
        try {
            const io = (0, socket_1.getIO)();
            io.emit("ticket:updated", { _id: ticketID, status: "cancelled" });
        }
        catch (err) {
            console.error("Socket emit error in removeTicket:", err);
        }
        return {
            status: 200,
            body: {
                success: true,
                message: "Ticket cancelled",
            },
        };
    }
    catch (error) {
        return {
            status: 500,
            body: {
                success: false,
                error: "Failed to delete ticket",
            },
        };
    }
};
exports.removeTicket = removeTicket;
exports.ticketMutationHandler = {
    updateTicketStatus: exports.updateTicketStatus,
    removeTicket: exports.removeTicket,
};
