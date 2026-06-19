import PurchaseItemModel from "../model/purchase-item.model";

class PurchaseItemRepository {
  async createMany(items: any[]) {
    return await PurchaseItemModel.insertMany(items);
  }

  async getByPurchaseId(purchaseId: string) {
    return await PurchaseItemModel.find({ purchaseId }).populate(
      "ingredientId",
    );
  }

  async deleteByPurchaseId(purchaseId: string) {
    return await PurchaseItemModel.deleteMany({
      purchaseId,
    });
  }
}

export default new PurchaseItemRepository();