"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ingredient_model_1 = __importDefault(require("../model/ingredient.model"));
class IngredientRepository {
    constructor() {
        this.model = ingredient_model_1.default;
    }
    async create(data) {
        try {
            return await this.model.create(data);
        }
        catch (error) {
            throw new Error(`Error creating ingredient: ${error}`);
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
                    { category: { $regex: search, $options: "i" } },
                    { unit: { $regex: search, $options: "i" } },
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
            throw new Error(`Error fetching ingredients: ${error}`);
        }
    }
    async getByID(id) {
        try {
            return await this.model.findById(id);
        }
        catch (error) {
            throw new Error(`Error fetching ingredient: ${error}`);
        }
    }
    async getByName(name) {
        try {
            return await this.model.findOne({
                name: {
                    $regex: `^${name}$`,
                    $options: "i",
                },
            });
        }
        catch (error) {
            throw new Error(`Error fetching ingredient: ${error}`);
        }
    }
    async update(id, data) {
        try {
            return await this.model.findByIdAndUpdate(id, data, {
                new: true,
            });
        }
        catch (error) {
            throw new Error(`Error updating ingredient: ${error}`);
        }
    }
    async delete(id) {
        try {
            return await this.model.findByIdAndDelete(id);
        }
        catch (error) {
            throw new Error(`Error deleting ingredient: ${error}`);
        }
    }
    async count(filter = {}) {
        try {
            return await this.model.countDocuments(filter);
        }
        catch (error) {
            throw new Error(`Error counting ingredients: ${error}`);
        }
    }
}
exports.default = new IngredientRepository();
