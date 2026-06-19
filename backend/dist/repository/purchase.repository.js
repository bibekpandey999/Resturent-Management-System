"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const purchase_model_1 = __importDefault(require("../model/purchase.model"));
class PurchaseRepository {
    async create(data) {
        return await purchase_model_1.default.create(data);
    }
    async getAll({ skip, limit }) {
        const data = await purchase_model_1.default.find()
            .populate("supplierId")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        const total = await purchase_model_1.default.countDocuments();
        return { data, total };
    }
    async getByID(id) {
        return await purchase_model_1.default.findById(id).populate("supplierId");
    }
    async delete(id) {
        return await purchase_model_1.default.findByIdAndDelete(id);
    }
}
exports.default = new PurchaseRepository();
