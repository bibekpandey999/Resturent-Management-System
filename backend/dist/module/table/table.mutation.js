"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tableMutationHandler = exports.removeTable = exports.updateTableStatus = exports.updateTable = exports.createTable = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const table_repository_1 = __importDefault(require("../../repository/table.repository"));
const ticket_repository_1 = __importDefault(require("../../repository/ticket.repository"));
const socket_1 = require("../../utils/socket");
const createTable = async ({ req }) => {
    try {
        const existing = await table_repository_1.default.getByName(req.body.name);
        if (existing) {
            return {
                status: 400,
                body: {
                    success: false,
                    error: "Table name already exists",
                },
            };
        }

        const payload = { ...req.body };

        if (req.body.sectionId && mongoose_1.default.Types.ObjectId.isValid(req.body.sectionId)) {
            payload.sectionId = new mongoose_1.default.Types.ObjectId(req.body.sectionId);
        } else {
            delete payload.sectionId;
        }

        const data = await table_repository_1.default.create(payload);

        try {
            const io = (0, socket_1.getIO)();
            io.emit("table:updated", data);
        } catch (err) {
            console.error("Socket emit error in createTable:", err);
        }

        return {
            status: 201,
            body: {
                success: true,
                message: "Table created successfully",
            },
        };
    } catch (error) {
        return {
            status: 500,
            body: {
                success: false,
                error: error.message,
            },
        };
    }
};

exports.createTable = createTable;
const updateTable = async ({ req }) => {
    try {
        const { tableID } = req.params;
        const table = await table_repository_1.default.getByID(tableID);
        if (!table) {
            return {
                status: 404,
                body: {
                    success: false,
                    error: "Table not found",
                },
            };
        }
        if (req.body.name && req.body.name !== table.name) {
            const exists = await table_repository_1.default.getByName(req.body.name);
            if (exists) {
                return {
                    status: 400,
                    body: {
                        success: false,
                        error: "Table name already exists",
                    },
                };
            }
        }
        const updated = await table_repository_1.default.update(tableID, {
            ...req.body,
            sectionId: req.body.sectionId
                ? new mongoose_1.default.Types.ObjectId(req.body.sectionId)
                : undefined,
        });
        try {
            const io = (0, socket_1.getIO)();
            io.emit("table:updated", updated);
        }
        catch (err) {
            console.error("Socket emit error in updateTable:", err);
        }
        return {
            status: 200,
            body: {
                success: true,
                message: "Table updated successfully",
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
exports.updateTable = updateTable;
const updateTableStatus = async ({ req }) => {
    try {
        const { tableID } = req.params;
        const { status } = req.body;
        const table = await table_repository_1.default.getByID(tableID);
        if (!table) {
            return {
                status: 404,
                body: {
                    success: false,
                    error: "Table not found",
                },
            };
        }
        const tickets = await ticket_repository_1.default.getByTableID(tableID);
        const hasUnservedTickets = tickets.some((ticket) => ticket.status !== "served");
        if (hasUnservedTickets) {
            return {
                status: 400,
                body: {
                    success: false,
                    error: "Cannot change table status while there are pending kitchen tickets.",
                },
            };
        }
        const updated = await table_repository_1.default.updateStatus(tableID, status);
        try {
            const io = (0, socket_1.getIO)();
            io.emit("table:updated", updated);
        }
        catch (err) {
            console.error("Socket emit error in updateTableStatus:", err);
        }
        return {
            status: 200,
            body: {
                success: true,
                message: "Table updated",
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
exports.updateTableStatus = updateTableStatus;
const removeTable = async ({ req }) => {
    const { tableID } = req.params;
    const table = await table_repository_1.default.getByID(tableID);
    if (!table) {
        return {
            status: 404,
            body: {
                success: false,
                error: "Table not found",
            },
        };
    }
    await table_repository_1.default.delete(tableID);
    try {
        const io = (0, socket_1.getIO)();
        io.emit("table:updated", { _id: tableID, action: "delete" });
    }
    catch (err) {
        console.error("Socket emit error in removeTable:", err);
    }
    return {
        status: 200,
        body: {
            success: true,
            message: "Table deleted successfully",
        },
    };
};
exports.removeTable = removeTable;
exports.tableMutationHandler = {
    createTable: exports.createTable,
    updateTable: exports.updateTable,
    updateTableStatus: exports.updateTableStatus,
    removeTable: exports.removeTable,
};
