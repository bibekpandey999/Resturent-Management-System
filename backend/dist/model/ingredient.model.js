"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const measuringUnits_1 = require("../utils/measuringUnits");
const ingredientSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    unit: {
        type: String,
        required: true,
        enum: measuringUnits_1.INGREDIENT_UNITS,
    },
    currentStock: {
        type: Number,
        default: 0,
    },
    minimumStock: {
        type: Number,
        default: 10,
    },
    category: {
        type: String,
        default: "",
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    lastStockInDate: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true,
});
const IngredientModel = mongoose_1.default.model("Ingredient", ingredientSchema);
exports.default = IngredientModel;
