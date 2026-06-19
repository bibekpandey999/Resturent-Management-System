"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stockMovementQueryHandler = exports.getByIngredient = exports.getAllStockMovements = exports.mapStockMovement = void 0;
const stock_movement_repository_1 = __importDefault(require("../../repository/stock-movement.repository"));
const mapStockMovement = (m) => ({
    _id: m._id.toString(),
    ingredient: {
        _id: m.ingredientId?._id?.toString() ?? "",
        name: m.ingredientId?.name ?? "",
        minimumStock: m.ingredientId?.minimumStock ?? 0,
        currentStock: m.ingredientId?.currentStock ?? 0,
        lastStockInDate: m.ingredientId?.lastStockInDate ?? "",
    },
    type: m.type,
    quantity: m.quantity,
    referenceType: m.referenceType,
    createdAt: m.createdAt.toISOString(),
});
exports.mapStockMovement = mapStockMovement;
const getAllStockMovements = async ({ req }) => {
    try {
        const page = Number(req.query.page ?? 1);
        const limit = Number(req.query.limit ?? 10);
        const { data, total } = await stock_movement_repository_1.default.getAll({
            skip: (page - 1) * limit,
            limit,
        });
        const formatted = data.map(exports.mapStockMovement);
        return {
            status: 200,
            body: {
                data: formatted,
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
                error: "Failed to fetch stock movements",
            },
        };
    }
};
exports.getAllStockMovements = getAllStockMovements;
const getByIngredient = async ({ req }) => {
    try {
        const data = await stock_movement_repository_1.default.getByIngredient(req.params.ingredientId);
        return {
            status: 200,
            body: data.map(exports.mapStockMovement),
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
exports.getByIngredient = getByIngredient;
exports.stockMovementQueryHandler = {
    getAllStockMovements: exports.getAllStockMovements,
    getByIngredient: exports.getByIngredient,
};
