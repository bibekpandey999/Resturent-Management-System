"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const expenseSchema = new mongoose_1.default.Schema({
    category: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    vendorName: { type: String, default: "" },
}, { timestamps: true });
const ExpenseModel = mongoose_1.default.model("Expense", expenseSchema);
exports.default = ExpenseModel;
