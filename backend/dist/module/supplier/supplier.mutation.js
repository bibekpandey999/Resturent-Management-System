"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.supplierMutationHandler = exports.deleteSupplier = exports.updateSupplier = exports.createSupplier = void 0;
const supplier_repository_1 = __importDefault(require("../../repository/supplier.repository"));
const createSupplier = async ({ req }) => {
    try {
        const existing = await supplier_repository_1.default.getAll({
            skip: 0,
            limit: 1,
            search: req.body.email,
        });
        const emailExists = existing.data.find((s) => s.email === req.body.email);
        if (emailExists) {
            return {
                status: 400,
                body: {
                    success: false,
                    error: "Supplier already exists",
                },
            };
        }
        await supplier_repository_1.default.create(req.body);
        return {
            status: 201,
            body: {
                success: true,
                message: "Supplier created successfully",
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
exports.createSupplier = createSupplier;
const updateSupplier = async ({ req }) => {
    try {
        const { supplierId } = req.params;
        const supplier = await supplier_repository_1.default.getByID(supplierId);
        if (!supplier) {
            return {
                status: 404,
                body: {
                    success: false,
                    error: "Supplier not found",
                },
            };
        }
        await supplier_repository_1.default.update(supplierId, req.body);
        return {
            status: 200,
            body: {
                success: true,
                message: "Supplier updated successfully",
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
exports.updateSupplier = updateSupplier;
const deleteSupplier = async ({ req }) => {
    try {
        const { supplierId } = req.params;
        const supplier = await supplier_repository_1.default.getByID(supplierId);
        if (!supplier) {
            return {
                status: 404,
                body: {
                    success: false,
                    error: "Supplier not found",
                },
            };
        }
        await supplier_repository_1.default.delete(supplierId);
        return {
            status: 200,
            body: {
                success: true,
                message: "Supplier deleted successfully",
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
exports.deleteSupplier = deleteSupplier;
exports.supplierMutationHandler = {
    createSupplier: exports.createSupplier,
    updateSupplier: exports.updateSupplier,
    deleteSupplier: exports.deleteSupplier,
};
