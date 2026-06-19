"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.supplierQueryHandler = exports.getSupplierByID = exports.getAllSuppliers = void 0;
const supplier_repository_1 = __importDefault(require("../../repository/supplier.repository"));
const getAllSuppliers = async ({ req }) => {
    try {
        const page = Number(req.query.page ?? 1);
        const limit = Number(req.query.limit ?? 10);
        const { data, total } = await supplier_repository_1.default.getAll({
            skip: (page - 1) * limit,
            limit,
            search: req.query.search,
            isActive: req.query.isActive,
        });
        const formatted = data.map((s) => ({
            _id: s._id.toString(),
            name: s.name,
            contactPerson: s.contactPerson,
            phone: s.phone,
            email: s.email,
            address: s.address,
            isActive: s.isActive,
            createdAt: s.createdAt,
            updatedAt: s.updatedAt,
        }));
        return {
            status: 200,
            body: {
                data: formatted,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            },
        };
    }
    catch {
        return {
            status: 500,
            body: {
                success: false,
                error: "Failed to fetch suppliers",
            },
        };
    }
};
exports.getAllSuppliers = getAllSuppliers;
const getSupplierByID = async ({ req }) => {
    try {
        const supplier = await supplier_repository_1.default.getByID(req.params.supplierId);
        if (!supplier) {
            return {
                status: 404,
                body: {
                    success: false,
                    error: "Supplier not found",
                },
            };
        }
        return {
            status: 200,
            body: {
                _id: supplier._id.toString(),
                name: supplier.name,
                contactPerson: supplier.contactPerson,
                phone: supplier.phone,
                email: supplier.email,
                address: supplier.address || "",
                isActive: supplier.isActive,
                createdAt: supplier.createdAt,
                updatedAt: supplier.updatedAt,
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
exports.getSupplierByID = getSupplierByID;
exports.supplierQueryHandler = {
    getAllSuppliers: exports.getAllSuppliers,
    getSupplierByID: exports.getSupplierByID,
};
