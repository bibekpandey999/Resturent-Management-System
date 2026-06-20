import KitchenTicketModel, { IKitchenTicket } from "../model/ticket.model";

class KitchenTicketRepository {
  private model;

  constructor() {
    this.model = KitchenTicketModel;
  }

  async create(data: Partial<IKitchenTicket>) {
    try {
      return await this.model.create(data);
    } catch (error) {
      throw new Error(`Error creating kitchen ticket: ${error}`);
    }
  }

  async getAll({
    skip,
    limit,
    status,
    search,
  }: {
    skip: number;
    limit: number;
    status?: string;
    search?: string;
  }) {
    try {

      const query: any = {};

      if (status && status !== "all") {
        query.status = status;
      }
      
      if (search) {
        query.$or = [
          {
            orderNumber: {
              $regex: search,
              $options: "i",
            },
          },
          {
            customerName: {
              $regex: search,
              $options: "i",
            },
          },
          {
            items: {
              $elemMatch: {
                name: {
                  $regex: search,
                  $options: "i",
                },
              },
            },
          },
        ];
      }

      const data = await this.model
        .find(query)
        .populate("orderId")
        .populate("tableId")
        .populate({
          path: "orderId",
          populate: {
            path: "waiterId",
          },
        })
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit);

      const total = await this.model.countDocuments(query);

      return {
        data,
        total,
      };
    } catch (error) {
      throw new Error(`Error fetching kitchen tickets: ${error}`);
    }
  }

  async getByID(id: string) {
    try {
      return this.model
        .findById(id)
        .populate("orderId")
        .populate("tableId")
        .populate("items.menuItemId");
    } catch (error) {
      throw new Error(`Error fetching kitchen ticket: ${error}`);
    }
  }

  async getByOrderID(orderId: string) {
    try {
      return await this.model
        .find({
          orderId,
        })
        .populate("tableId")
        .sort({
          ticketNumber: 1,
        });
    } catch (error) {
      throw new Error(`Error fetching order tickets: ${error}`);
    }
  }

  async getByTableID(tableId: string) {
    try {
      return await this.model
        .find({ tableId })
        .populate("tableId")
        .sort({ ticketNumber: 1 });
    } catch (error) {
      throw new Error(`Error fetching order tickets: ${error}`);
    }
  }

  async getLatestTicket(orderId: string) {
    try {
      return await this.model
        .findOne({
          orderId,
        })
        .populate("orderId")
        .populate("tableId")
        .sort({
          ticketNumber: -1,
        });
    } catch (error) {
      throw new Error(`Error fetching latest ticket: ${error}`);
    }
  }

  async update(id: string, data: Partial<IKitchenTicket>) {
    try {
      return await this.model.findByIdAndUpdate(id, data, {
        new: true,
      });
    } catch (error) {
      throw new Error(`Error updating ticket: ${error}`);
    }
  }

  async delete(id: string) {
    try {
      return await this.model.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Error deleting ticket: ${error}`);
    }
  }

  async updateStatus(
    ticketId: string,
    status: "pending" | "served" | "cancelled" | "completed" | undefined,
  ) {
    try {
      return await this.model.findByIdAndUpdate(
        ticketId,
        {
          status,
        },
        {
          new: true,
        },
      );
    } catch (error) {
      throw new Error(`Error updating ticket status: ${error}`);
    }
  }

  async count(filter: Record<string, any> = {}) {
    try {
      return await this.model.countDocuments(filter);
    } catch (error) {
      throw new Error(`Error counting tickets: ${error}`);
    }
  }
}

export default new KitchenTicketRepository();
