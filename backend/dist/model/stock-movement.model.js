"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const stockMovementSchema = new mongoose_1.default.Schema({
    ingredientId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Ingredient",
        required: true,
    },
    type: {
        type: String,
        enum: ["PURCHASE", "SALE", "WASTAGE", "ADJUSTMENT", "RETURN", "INITIAL_STOCK"],
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    referenceId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        default: null,
    },
    referenceType: {
        type: String,
        default: "",
    },
    note: {
        type: String,
        default: "",
    },
}, { timestamps: true });
const StockMovementModel = mongoose_1.default.model("StockMovement", stockMovementSchema);
exports.default = StockMovementModel;
