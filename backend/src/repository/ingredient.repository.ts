import IngredientModel, { IIngredient } from "../model/ingredient.model";

class IngredientRepository {
  private model;

  constructor() {
    this.model = IngredientModel;
  }

  async create(data: Partial<IIngredient>) {
    try {
      return await this.model.create(data);
    } catch (error) {
      throw new Error(`Error creating ingredient: ${error}`);
    }
  }

  async getAll({
    skip,
    limit,
    search,
    isActive,
  }: {
    skip: number;
    limit: number;
    search?: string;
    isActive?: string;
  }) {
    try {
      const query: any = {};

      if (isActive && isActive !== "all") {
        query.isActive = isActive === "true";
      }

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { category: { $regex: search, $options: "i" } },
          { unit: { $regex: search, $options: "i" } },
        ];
      }

      const data = await this.model
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await this.model.countDocuments(query);

      return { data, total };
    } catch (error) {
      throw new Error(`Error fetching ingredients: ${error}`);
    }
  }

  async getByID(id: string) {
    try {
      return await this.model.findById(id);
    } catch (error) {
      throw new Error(`Error fetching ingredient: ${error}`);
    }
  }

  async getByName(name: string) {
    try {
      return await this.model.findOne({
        name: {
          $regex: `^${name}$`,
          $options: "i",
        },
      });
    } catch (error) {
      throw new Error(`Error fetching ingredient: ${error}`);
    }
  }

  async update(id: string, data: Partial<IIngredient>) {
    try {
      return await this.model.findByIdAndUpdate(id, data, {
        new: true,
      });
    } catch (error) {
      throw new Error(`Error updating ingredient: ${error}`);
    }
  }

  async delete(id: string) {
    try {
      return await this.model.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Error deleting ingredient: ${error}`);
    }
  }

  async count(filter: Record<string, any> = {}) {
    try {
      return await this.model.countDocuments(filter);
    } catch (error) {
      throw new Error(`Error counting ingredients: ${error}`);
    }
  }
}

export default new IngredientRepository();
