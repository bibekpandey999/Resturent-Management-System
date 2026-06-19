import { AppRouteQueryImplementation } from "@ts-rest/express";
import purchaseRepository from "../../repository/purchase.repository";
import purchaseItemRepository from "../../repository/purchase-item.repository";
import { purchaseContract } from "../../contract/purchase/purchase.contract";

export const getAllPurchases: AppRouteQueryImplementation<
  typeof purchaseContract.getAllPurchases
> = async ({ req }) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);

    const { data, total } = await purchaseRepository.getAll({
      skip: (page - 1) * limit,
      limit,
    });

    const formatted = data.map((p: any) => ({
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
  } catch (error) {
    return {
      status: 500,
      body: {
        success: false,
        error: "Failed to fetch purchases",
      },
    };
  }
};

export const getPurchaseByID: AppRouteQueryImplementation<
  typeof purchaseContract.getPurchaseByID
> = async ({ req }) => {
  try {
    const purchase = await purchaseRepository.getByID(
      req.params.purchaseId,
    );

    if (!purchase) {
      return {
        status: 404,
        body: {
          success: false,
          error: "Purchase not found",
        },
      };
    }

    const items =
      await purchaseItemRepository.getByPurchaseId(
        purchase._id.toString(),
      );

    return {
      status: 200,
      body: {
        _id: purchase._id.toString(),
        invoiceNumber: purchase.invoiceNumber,

        supplierId: purchase.supplierId.toString(),

        purchaseDate: purchase.purchaseDate,
        totalAmount: purchase.totalAmount,
        notes: purchase.notes,

        items: items.map((i: any) => ({
          ingredientId: i.ingredientId,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          totalPrice: i.totalPrice,
        })),
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

export const purchaseQueryHandler = {
  getAllPurchases,
  getPurchaseByID,
};
