"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.purchaseQueryHandler = exports.getPurchaseByID = exports.getAllPurchases = void 0;
const purchase_repository_1 = __importDefault(require("../../repository/purchase.repository"));
const purchase_item_repository_1 = __importDefault(require("../../repository/purchase-item.repository"));
const getAllPurchases = async ({ req }) => {
    try {
        const page = Number(req.query.page ?? 1);
        const limit = Number(req.query.limit ?? 10);
        const { data, total } = await purchase_repository_1.default.getAll({
            skip: (page - 1) * limit,
            limit,
        });
        const formatted = data.map((p) => ({
            _id: p._id.toString(),
            invoiceNumber: p.invoiceNumber,
            supplier: {
                _id: p.supplierId?._id?.toString() ?? "",
                name: p.supplierId?.name ?? "",
            },
            totalAmount: p.totalAmount,
            purchaseDate: p.purchaseDate,
            createdAt: p.createdAt,
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
    catch (error) {
        return {
            status: 500,
            body: {
                success: false,
                error: "Failed to fetch purchases",
            },
        };
    }
};
exports.getAllPurchases = getAllPurchases;
const getPurchaseByID = async ({ req }) => {
    try {
        const purchase = await purchase_repository_1.default.getByID(req.params.purchaseId);
        if (!purchase) {
            return {
                status: 404,
                body: {
                    success: false,
                    error: "Purchase not found",
                },
            };
        }
        const items = await purchase_item_repository_1.default.getByPurchaseId(purchase._id.toString());
        return {
            status: 200,
            body: {
                _id: purchase._id.toString(),
                invoiceNumber: purchase.invoiceNumber,
                supplierId: purchase.supplierId.toString(),
                purchaseDate: purchase.purchaseDate,
                totalAmount: purchase.totalAmount,
                notes: purchase.notes,
                items: items.map((i) => ({
                    ingredientId: i.ingredientId,
                    quantity: i.quantity,
                    unitPrice: i.unitPrice,
                    totalPrice: i.totalPrice,
                })),
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
exports.getPurchaseByID = getPurchaseByID;
exports.purchaseQueryHandler = {
    getAllPurchases: exports.getAllPurchases,
    getPurchaseByID: exports.getPurchaseByID,
};
