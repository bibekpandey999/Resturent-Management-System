"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supplier_list_model_1 = __importDefault(require("../model/supplier-list.model"));
class SupplierRepository {
    constructor() {
        this.model = supplier_list_model_1.default;
    }
    async create(data) {
        try {
            return await this.model.create(data);
        }
        catch (error) {
            throw new Error(`Error creating supplier: ${error}`);
        }
    }
    async getAll({ skip, limit, search, isActive, }) {
        try {
            const query = {};
            if (isActive && isActive !== "all") {
                query.isActive = isActive === "true";
            }
            if (search) {
                query.$or = [
                    { name: { $regex: search, $options: "i" } },
                    { contactPerson: { $regex: search, $options: "i" } },
                    { phone: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } },
                ];
            }
            const data = await this.model
                .find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);
            const total = await this.model.countDocuments(query);
            return { data, total };
        }
        catch (error) {
            throw new Error(`Error fetching suppliers: ${error}`);
        }
    }
    async getByID(id) {
        try {
            return await this.model.findById(id);
        }
        catch (error) {
            throw new Error(`Error fetching supplier: ${error}`);
        }
    }
    async update(id, data) {
        try {
            return await this.model.findByIdAndUpdate(id, data, {
                new: true,
            });
        }
        catch (error) {
            throw new Error(`Error updating supplier: ${error}`);
        }
    }
    async delete(id) {
        try {
            return await this.model.findByIdAndDelete(id);
        }
        catch (error) {
            throw new Error(`Error deleting supplier: ${error}`);
        }
    }
    async count(filter = {}) {
        try {
            return await this.model.countDocuments(filter);
        }
        catch (error) {
            throw new Error(`Error counting suppliers: ${error}`);
        }
    }
}
exports.default = new SupplierRepository();
