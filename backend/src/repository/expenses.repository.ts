import ExpenseModel, { IExpense } from "../model/expenses.model";

class ExpenseRepository {
  private model;

  constructor() {
    this.model = ExpenseModel;
  }

  async create(data: Partial<IExpense>) {
    return await this.model.create(data);
  }

  async getAll({
    skip,
    limit,
    search,
    category,
    supplier,
  }: {
    skip: number;
    limit: number;
    search?: string;
    category?: string;
    supplier?: string;
  }) {
    const query: any = {};

    if (category) {
      query.category = category;
    }
    if (supplier) {
      query.vendorName = supplier;
    }

    if (search) {
      query.$or = [
        { category: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { vendorName: { $regex: search, $options: "i" } },
      ];
    }

    const data = await ExpenseModel.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await ExpenseModel.countDocuments(query);

    return { data, total };
  }

  async getById(id: string) {
    return await this.model.findById(id);
  }

  async update(id: string, data: Partial<IExpense>) {
    return await this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string) {
    return await this.model.findByIdAndDelete(id);
  }
}

export default new ExpenseRepository();
