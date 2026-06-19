"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stock_movement_model_1 = __importDefault(require("../model/stock-movement.model"));
class StockMovementRepository {
    constructor() {
        this.model = stock_movement_model_1.default;
    }
    async create(data) {
        return await stock_movement_model_1.default.create(data);
    }
    async getAll({ skip, limit }) {
        const data = await stock_movement_model_1.default.find()
            .populate("ingredientId")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        const total = await stock_movement_model_1.default.countDocuments();
        return { data, total };
    }
    async getByIngredient(ingredientId) {
        return await stock_movement_model_1.default.find({
            ingredientId,
        }).sort({ createdAt: -1 });
    }
}
exports.default = new StockMovementRepository();
