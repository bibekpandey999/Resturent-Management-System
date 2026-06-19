"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const expenses_model_1 = __importDefault(require("../model/expenses.model"));
class ExpenseRepository {
    constructor() {
        this.model = expenses_model_1.default;
    }
    async create(data) {
        return await this.model.create(data);
    }
    async getAll({ skip, limit, search, category, supplier, }) {
        const query = {};
        if (category) {
            query.category = category;
        }
        if (supplier) {
            query.vendorName = supplier;
        }
        if (search) {
            query.$or = [
                { category: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { vendorName: { $regex: search, $options: "i" } },
            ];
        }
        const data = await expenses_model_1.default.find(query)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
        const total = await expenses_model_1.default.countDocuments(query);
        return { data, total };
    }
    async getById(id) {
        return await this.model.findById(id);
    }
    async update(id, data) {
        return await this.model.findByIdAndUpdate(id, data, { new: true });
    }
    async delete(id) {
        return await this.model.findByIdAndDelete(id);
    }
}
exports.default = new ExpenseRepository();
