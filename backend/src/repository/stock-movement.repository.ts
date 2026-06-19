import StockMovementModel from "../model/stock-movement.model";

class StockMovementRepository {
  private model;

  constructor() {
    this.model = StockMovementModel;
  }

  async create(data: any) {
    return await StockMovementModel.create(data);
  }

  async getAll({ skip, limit }: any) {
    const data = await StockMovementModel.find()
      .populate("ingredientId")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await StockMovementModel.countDocuments();

    return { data, total };
  }

  async getByIngredient(ingredientId: string) {
    return await StockMovementModel.find({
      ingredientId,
    }).sort({ createdAt: -1 });
  }
}

export default new StockMovementRepository();
