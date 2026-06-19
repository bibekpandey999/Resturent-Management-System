import { AppRouteMutationImplementation } from "@ts-rest/express";
import purchaseRepository from "../../repository/purchase.repository";
import purchaseItemRepository from "../../repository/purchase-item.repository";
import ingredientRepository from "../../repository/ingredient.repository";
import { purchaseContract } from "../../contract/purchase/purchase.contract";
import stockMovementRepository from "../../repository/stock-movement.repository";
import expensesRepository from "../../repository/expenses.repository";
import supplierRepository from "../../repository/supplier.repository";

export const createPurchase: AppRouteMutationImplementation<
  typeof purchaseContract.createPurchase
> = async ({ req }) => {
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
    const purchase = await purchaseRepository.create({
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

    await purchaseItemRepository.createMany(purchaseItems);

    // 3. Process stock updates + stock movements
    for (const item of enrichedItems) {
      const ingredient = await ingredientRepository.getByID(item.ingredientId);

      if (!ingredient) continue;

      const newStock = ingredient.currentStock + item.quantity;

      await ingredientRepository.update(item.ingredientId, {
        currentStock: newStock,
        lastStockInDate: new Date(),
      });

      await stockMovementRepository.create({
        ingredientId: item.ingredientId,
        type: "PURCHASE",
        quantity: item.quantity,
        referenceId: purchase._id.toString(),
        referenceType: "PURCHASE",
        note: `Purchase ${invoiceNumber}`,
      });
    }

    const supplier = await supplierRepository.getByID(supplierId);

    // 4. Create EXPENSE (ONE record per purchase)
    await expensesRepository.create({
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
  } catch (error) {
    return {
      status: 500,
      body: {
        success: false,
        error: (error as Error).message,
      },
    };
  }
};

export const deletePurchase: AppRouteMutationImplementation<
  typeof purchaseContract.deletePurchase
> = async ({ req }) => {
  try {
    const { purchaseId } = req.params;

    const purchase = await purchaseRepository.getByID(purchaseId);

    if (!purchase) {
      return {
        status: 404,
        body: {
          success: false,
          error: "Purchase not found",
        },
      };
    }

    await purchaseItemRepository.deleteByPurchaseId(purchaseId);

    await purchaseRepository.delete(purchaseId);

    return {
      status: 200,
      body: {
        success: true,
        message: "Purchase deleted successfully",
      },
    };
  } catch (error) {
    return {
      status: 500,
      body: {
        success: false,
        error: (error as Error).message,
      },
    };
  }
};

export const purchaseMutationHandler = {
  createPurchase,
  deletePurchase,
};
