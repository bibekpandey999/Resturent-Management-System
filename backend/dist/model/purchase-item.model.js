"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const purchaseItemSchema = new mongoose_1.default.Schema({
    purchaseId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Purchase",
        required: true,
    },
    ingredientId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Ingredient",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    unitPrice: {
        type: Number,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true,
});
const PurchaseItemModel = mongoose_1.default.model("PurchaseItem", purchaseItemSchema);
exports.default = PurchaseItemModel;
