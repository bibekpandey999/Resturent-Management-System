"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.purchaseMutationHandler = exports.deletePurchase = exports.createPurchase = void 0;
const purchase_repository_1 = __importDefault(require("../../repository/purchase.repository"));
const purchase_item_repository_1 = __importDefault(require("../../repository/purchase-item.repository"));
const ingredient_repository_1 = __importDefault(require("../../repository/ingredient.repository"));
const stock_movement_repository_1 = __importDefault(require("../../repository/stock-movement.repository"));
const expenses_repository_1 = __importDefault(require("../../repository/expenses.repository"));
const supplier_repository_1 = __importDefault(require("../../repository/supplier.repository"));
const createPurchase = async ({ req }) => {
    try {
        const { supplierId, invoiceNumber, purchaseDate, notes, items } = req.body;
        let totalAmount = 0;
        const enrichedItems = items.map((item) => {
            const totalPrice = item.quantity * item.unitPrice;
            totalAmount += totalPrice;
            return {
                ...item,
                totalPrice,
            };
        });
        // 1. Create purchase
        const purchase = await purchase_repository_1.default.create({
            supplierId,
            invoiceNumber,
            purchaseDate,
            notes,
            totalAmount,
        });
        // 2. Create purchase items
        const purchaseItems = enrichedItems.map((item) => ({
            purchaseId: purchase._id,
            ingredientId: item.ingredientId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
        }));
        await purchase_item_repository_1.default.createMany(purchaseItems);
        // 3. Process stock updates + stock movements
        for (const item of enrichedItems) {
            const ingredient = await ingredient_repository_1.default.getByID(item.ingredientId);
            if (!ingredient)
                continue;
            const newStock = ingredient.currentStock + item.quantity;
            await ingredient_repository_1.default.update(item.ingredientId, {
                currentStock: newStock,
                lastStockInDate: new Date(),
            });
            await stock_movement_repository_1.default.create({
                ingredientId: item.ingredientId,
                type: "PURCHASE",
                quantity: item.quantity,
                referenceId: purchase._id.toString(),
                referenceType: "PURCHASE",
                note: `Purchase ${invoiceNumber}`,
            });
        }
        const supplier = await supplier_repository_1.default.getByID(supplierId);
        // 4. Create EXPENSE (ONE record per purchase)
        await expenses_repository_1.default.create({
            category: "STOCK",
            description: `Purchase Invoice ${invoiceNumber}`,
            amount: totalAmount,
            date: new Date(purchaseDate),
            vendorName: supplier?.name, // optionally replace with supplier name if populated
        });
        return {
            status: 201,
            body: {
                success: true,
                message: "Purchase created successfully",
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
exports.createPurchase = createPurchase;
const deletePurchase = async ({ req }) => {
    try {
        const { purchaseId } = req.params;
        const purchase = await purchase_repository_1.default.getByID(purchaseId);
        if (!purchase) {
            return {
                status: 404,
                body: {
                    success: false,
                    error: "Purchase not found",
                },
            };
        }
        await purchase_item_repository_1.default.deleteByPurchaseId(purchaseId);
        await purchase_repository_1.default.delete(purchaseId);
        return {
            status: 200,
            body: {
                success: true,
                message: "Purchase deleted successfully",
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
exports.deletePurchase = deletePurchase;
exports.purchaseMutationHandler = {
    createPurchase: exports.createPurchase,
    deletePurchase: exports.deletePurchase,
};
