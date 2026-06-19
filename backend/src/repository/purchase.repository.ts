import PurchaseModel from "../model/purchase.model";

class PurchaseRepository {
  async create(data: any) {
    return await PurchaseModel.create(data);
  }

  async getAll({ skip, limit }: any) {
    const data = await PurchaseModel.find()
      .populate("supplierId")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await PurchaseModel.countDocuments();

    return { data, total };
  }

  async getByID(id: string) {
    return await PurchaseModel.findById(id).populate(
      "supplierId",
    );
  }

  async delete(id: string) {
    return await PurchaseModel.findByIdAndDelete(id);
  }
}

export default new PurchaseRepository();