"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ingredientQueryHandler = exports.getIngredientByID = exports.getAllIngredients = void 0;
const ingredient_repository_1 = __importDefault(require("../../repository/ingredient.repository"));
const getAllIngredients = async ({ req }) => {
    try {
        const page = Number(req.query.page ?? 1);
        const limit = Number(req.query.limit);
        const { data, total } = await ingredient_repository_1.default.getAll({
            skip: (page - 1) * limit,
            limit,
            search: req.query.search,
            isActive: req.query.isActive,
        });
        const formatted = data.map((ingredient) => ({
            _id: ingredient._id.toString(),
            name: ingredient.name,
            unit: ingredient.unit,
            currentStock: ingredient.currentStock,
            minimumStock: ingredient.minimumStock,
            lastStockInDate: ingredient.lastStockInDate,
            category: ingredient.category,
            isActive: ingredient.isActive,
            createdAt: ingredient.createdAt,
            updatedAt: ingredient.updatedAt,
        }));
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
                error: "Failed to fetch ingredients",
            },
        };
    }
};
exports.getAllIngredients = getAllIngredients;
const getIngredientByID = async ({ req }) => {
    try {
        const ingredient = await ingredient_repository_1.default.getByID(req.params.ingredientId);
        if (!ingredient) {
            return {
                status: 404,
                body: {
                    success: false,
                    error: "Ingredient not found",
                },
            };
        }
        return {
            status: 200,
            body: {
                _id: ingredient._id.toString(),
                name: ingredient.name,
                unit: ingredient.unit,
                currentStock: ingredient.currentStock,
                minimumStock: ingredient.minimumStock,
                lastStockInDate: ingredient.lastStockInDate,
                category: ingredient.category,
                isActive: ingredient.isActive,
                createdAt: ingredient.createdAt,
                updatedAt: ingredient.updatedAt,
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
exports.getIngredientByID = getIngredientByID;
exports.ingredientQueryHandler = {
    getAllIngredients: exports.getAllIngredients,
    getIngredientByID: exports.getIngredientByID,
};
