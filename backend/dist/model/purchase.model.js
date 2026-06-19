"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const purchaseSchema = new mongoose_1.default.Schema({
    supplierId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Supplier",
        required: true,
    },
    invoiceNumber: {
        type: String,
        required: true,
        trim: true,
    },
    purchaseDate: {
        type: Date,
        default: Date.now,
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0,
    },
    notes: {
        type: String,
        default: "",
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});
const PurchaseModel = mongoose_1.default.model("Purchase", purchaseSchema);
exports.default = PurchaseModel;
