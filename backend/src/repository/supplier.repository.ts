import SupplierModel, { ISupplier } from "../model/supplier-list.model";

class SupplierRepository {
  private model;

  constructor() {
    this.model = SupplierModel;
  }

  async create(data: Partial<ISupplier>) {
    try {
      return await this.model.create(data);
    } catch (error) {
      throw new Error(`Error creating supplier: ${error}`);
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
          { contactPerson: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
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
      throw new Error(`Error fetching suppliers: ${error}`);
    }
  }

  async getByID(id: string) {
    try {
      return await this.model.findById(id);
    } catch (error) {
      throw new Error(`Error fetching supplier: ${error}`);
    }
  }

  async update(id: string, data: Partial<ISupplier>) {
    try {
      return await this.model.findByIdAndUpdate(id, data, {
        new: true,
      });
    } catch (error) {
      throw new Error(`Error updating supplier: ${error}`);
    }
  }

  async delete(id: string) {
    try {
      return await this.model.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Error deleting supplier: ${error}`);
    }
  }

  async count(filter: Record<string, any> = {}) {
    try {
      return await this.model.countDocuments(filter);
    } catch (error) {
      throw new Error(`Error counting suppliers: ${error}`);
    }
  }
}

export default new SupplierRepository();