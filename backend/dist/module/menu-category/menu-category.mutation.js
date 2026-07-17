"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.menuCategoryMutationHandler = exports.removeMenuCategory = exports.updateMenuCategory = exports.createMenuCategory = void 0;
const menu_category_repository_1 = __importDefault(require("../../repository/menu-category.repository"));
const socket_1 = require("../../utils/socket");
const createMenuCategory = async ({ req }) => {
    try {
        const existing = await menu_category_repository_1.default.getByName(req.body.name);
        if (existing) {
            return {
                status: 400,
                body: {
                    success: false,
                    error: "Category already exists",
                },
            };
        }
        const data = await menu_category_repository_1.default.create(req.body);
        try {
            const io = (0, socket_1.getIO)();
            io.emit("menu-category:updated", data);
        }
        catch (err) {
            console.error("Socket emit error in createMenuCategory:", err);
        }
        return {
            status: 201,
            body: {
                success: true,
                message: "Menu category created successfully",
            },
        };
    }
    catch (error) {
        return {
            status: 500,
            body: {
                success: false,
                error: error.message,
            },
        };
    }
};
exports.createMenuCategory = createMenuCategory;
const updateMenuCategory = async ({ req }) => {
    try {
        const { categoryID } = req.params;
        const category = await menu_category_repository_1.default.getByID(categoryID);
        if (!category) {
            return {
                status: 404,
                body: {
                    success: false,
                    error: "Category not found",
                },
            };
        }
        if (req.body.name && req.body.name !== category.name) {
            const exists = await menu_category_repository_1.default.getByName(req.body.name);
            if (exists) {
                return {
                    status: 400,
                    body: {
                        success: false,
                        error: "Category already exists",
                    },
                };
            }
        }
        const updated = await menu_category_repository_1.default.update(categoryID, req.body);
        try {
            const io = (0, socket_1.getIO)();
            io.emit("menu-category:updated", updated);
        }
        catch (err) {
            console.error("Socket emit error in updateMenuCategory:", err);
        }
        return {
            status: 200,
            body: {
                success: true,
                message: "Menu category updated successfully",
            },
        };
    }
    catch (error) {
        return {
            status: 500,
            body: {
                success: false,
                error: error.message,
            },
        };
    }
};
exports.updateMenuCategory = updateMenuCategory;
const removeMenuCategory = async ({ req }) => {
    try {
        const { categoryID } = req.params;
        const category = await menu_category_repository_1.default.getByID(categoryID);
        if (!category) {
            return {
                status: 404,
                body: {
                    success: false,
                    error: "Category not found",
                },
            };
        }
        await menu_category_repository_1.default.delete(categoryID);
        try {
            const io = (0, socket_1.getIO)();
            io.emit("menu-category:updated", { _id: categoryID, action: "delete" });
        }
        catch (err) {
            console.error("Socket emit error in removeMenuCategory:", err);
        }
        return {
            status: 200,
            body: {
                success: true,
                message: "Menu category deleted successfully",
            },
        };
    }
    catch (error) {
        return {
            status: 500,
            body: {
                success: false,
                error: error.message,
            },
        };
    }
};
exports.removeMenuCategory = removeMenuCategory;
exports.menuCategoryMutationHandler = {
    createMenuCategory: exports.createMenuCategory,
    updateMenuCategory: exports.updateMenuCategory,
    removeMenuCategory: exports.removeMenuCategory,
};
