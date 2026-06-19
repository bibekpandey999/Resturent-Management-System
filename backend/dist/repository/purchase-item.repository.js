"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const purchase_item_model_1 = __importDefault(require("../model/purchase-item.model"));
class PurchaseItemRepository {
    async createMany(items) {
        return await purchase_item_model_1.default.insertMany(items);
    }
    async getByPurchaseId(purchaseId) {
        return await purchase_item_model_1.default.find({ purchaseId }).populate("ingredientId");
    }
    async deleteByPurchaseId(purchaseId) {
        return await purchase_item_model_1.default.deleteMany({
            purchaseId,
        });
    }
}
exports.default = new PurchaseItemRepository();
